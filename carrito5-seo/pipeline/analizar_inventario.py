#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Agrupa las URLs vivas de carrito5.com para encontrar paginas que compiten entre si.

Uso: python3 analizar_inventario.py <fichero-urls>

Por que existe: no se puede descargar carrito5.com desde aqui (el proxy de salida
lo bloquea), asi que el inventario se ha reconstruido desde el indice de busqueda.
Con solo las URLs ya se detecta el problema mas caro del sitio: varias paginas
distintas apuntando a la misma intencion de busqueda. Google elige una y las
demas se quedan sin posicion, ademas de repartir el enlazado interno.

La normalizacion quita el prefijo comercial (tpv-, software-tpv-, programa-),
pasa a singular las palabras que solo cambian en la -s final, y ordena lo que
queda. Dos URLs con la misma huella compiten.
"""
import collections, os, re, sys

# Palabras que no distinguen una pagina de otra en este sitio.
RUIDO = {"tpv", "software", "programa", "gratis", "de", "del", "la", "el",
         "para", "y", "en", "com", "html", "www", "carrito5", "https"}

# Prefijos de ruta que marcan una seccion distinta, no una duplicada.
SECCIONES = ("blog/", "pg/")


def singular(p):
    """tiendas -> tienda. Solo el plural simple: es el que genera los pares."""
    if len(p) > 4 and p.endswith("s") and not p.endswith("ss"):
        return p[:-1]
    return p


def huella(url):
    ruta = re.sub(r"^https?://(www\.)?carrito5\.com/", "", url)
    if ruta.startswith(SECCIONES):
        return None
    slug = re.sub(r"\.(html|asp)$", "", ruta)
    slug = slug.replace("_", "-")
    piezas = [singular(p) for p in slug.split("-") if p and p not in RUIDO]
    return " ".join(sorted(piezas))


def main():
    f = sys.argv[1] if len(sys.argv) > 1 else "inventario/urls_descubiertas.txt"
    urls = [l.strip() for l in open(f, encoding="utf-8") if l.strip()]

    grupos = collections.defaultdict(list)
    for u in urls:
        h = huella(u)
        if h is None:
            continue
        grupos[h].append(u)

    # 1. Huella identica = la misma pagina publicada dos veces.
    exactos = {h: v for h, v in grupos.items() if len(v) > 1}

    # 2. Solapamiento parcial: comparten todas las palabras menos las de sitio.
    parciales = []
    claves = sorted(grupos)
    for i, a in enumerate(claves):
        sa = set(a.split())
        if not sa:
            continue
        for b in claves[i + 1:]:
            sb = set(b.split())
            if not sb or a == b:
                continue
            comun = sa & sb
            # uno contiene al otro entero, y el otro aporta poco
            if comun == sa or comun == sb:
                parciales.append((a, b, grupos[a], grupos[b]))

    print(f"  URLs analizadas: {len(urls)}  (fuera: blog/ y pg/)")
    print(f"  intenciones distintas: {len(grupos)}")

    print(f"\n  A. MISMA INTENCION, VARIAS URLS  -> {len(exactos)} grupos")
    for h, v in sorted(exactos.items()):
        print(f"   !! [{h}]")
        for u in v:
            print(f"        {u}")

    print(f"\n  B. UNA CONTIENE A LA OTRA  -> {len(parciales)} pares")
    for a, b, ua, ub in parciales:
        print(f"   ?  [{a}]  <  [{b}]")
        print(f"        {ua[0]}")
        print(f"        {ub[0]}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
