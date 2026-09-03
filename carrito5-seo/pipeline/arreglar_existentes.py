#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arregla los defectos estructurales de las paginas que ya existen en carrito5.com.

Uso: python3 arreglar_existentes.py <dir-web>

Dos defectos confirmados midiendo los ficheros reales:

1. index.html tiene DOS <h1> con el mismo texto. No es que la pagina se
   renderice entera dos veces (el bloque movil es solo el 13 % del fichero):
   es que el hero existe en la version de escritorio y en la de movil, y las
   dos llevan H1. Google ve dos.
   Arreglo: el H1 del bloque movil pasa a <p> con la misma clase y estilo, asi
   que la maqueta no cambia y solo queda un H1.

2. tpv-tienda-ropa.html y tpv-zapateria.html llevan el MISMO bloque
   application/ld+json de SoftwareApplication dos veces, byte a byte.
   Arreglo: se elimina la segunda copia.

Lo que NO toca este script, a proposito:
   El aggregateRating de 4,9 sobre 318 valoraciones se declara sin resenas
   visibles en la pagina. Es riesgo de accion manual de Google, pero retirarlo
   o publicar las resenas es decision del cliente.
"""
import glob, hashlib, json, os, re, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "."


def sin_css(s):
    """Copia del HTML con los <style> en blanco, para no confundir CSS con marcado."""
    return re.sub(r"<style.*?</style>", lambda m: " " * len(m.group(0)), s, flags=re.S | re.I)


def h1_sobrantes(s):
    """Degrada a <p> los H1 que estan dentro del bloque .c5-mobile-view."""
    plano = sin_css(s)
    mob = re.search(r'<div[^>]*class="[^"]*c5-mobile-view', plano)
    if not mob or len(re.findall(r"<h1[ >]", plano)) < 2:
        return s, 0
    # solo los H1 que aparecen despues del inicio del bloque movil
    n = 0
    out, pos = [], 0
    for m in re.finditer(r"<h1([^>]*)>(.*?)</h1>", s, re.S):
        if m.start() < mob.start():
            continue
        attrs = m.group(1)
        # conserva class y style para que la maqueta no cambie
        out.append(s[pos:m.start()])
        out.append(f"<p{attrs}>{m.group(2)}</p>")
        pos = m.end()
        n += 1
    if not n:
        return s, 0
    out.append(s[pos:])
    return "".join(out), n


def ld_duplicado(s):
    """Elimina bloques application/ld+json byte-identicos repetidos."""
    vistos, quitar = set(), []
    for m in re.finditer(r'\s*<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            huella = hashlib.md5(
                json.dumps(json.loads(m.group(1)), sort_keys=True).encode()).hexdigest()
        except Exception:
            continue
        if huella in vistos:
            quitar.append((m.start(), m.end()))
        else:
            vistos.add(huella)
    for a, b in reversed(quitar):
        s = s[:a] + s[b:]
    return s, len(quitar)


def main():
    total_h1 = total_ld = 0
    for f in sorted(glob.glob(os.path.join(OUT, "*.html"))):
        s = open(f, encoding="utf-8").read()
        orig = s
        s, n1 = h1_sobrantes(s)
        s, n2 = ld_duplicado(s)
        if s != orig:
            open(f, "w", encoding="utf-8").write(s)
            print(f"  {os.path.basename(f):28} H1 degradados: {n1}  ld+json duplicados quitados: {n2}")
        total_h1 += n1
        total_ld += n2

    # verificacion
    print("\n  verificacion:")
    for f in sorted(glob.glob(os.path.join(OUT, "*.html"))):
        s = sin_css(open(f, encoding="utf-8").read())
        h = len(re.findall(r"<h1[ >]", s))
        ld = len(re.findall(r'<script type="application/ld\+json">', s))
        marca = "ok" if h == 1 else "!!"
        print(f"   {marca} {os.path.basename(f):28} H1={h}  bloques ld+json={ld}")
    print(f"\n  total: {total_h1} H1 degradados, {total_ld} bloques duplicados eliminados")


if __name__ == "__main__":
    main()
