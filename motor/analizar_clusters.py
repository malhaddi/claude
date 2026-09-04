#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cruza inventarios de paginas (y opcionalmente keywords) contra los clusters.

Uso:
  python3 analizar_clusters.py paginas  <inv.tsv> [<inv.tsv> ...]
  python3 analizar_clusters.py keywords <kw.csv|tsv> -- <inv.tsv> [...]

Modo 'paginas': agrupa las paginas que ya existen. Un grupo con dos o mas
paginas es canibalizacion; si las paginas son de dominios distintos, la empresa
compite contra si misma y las dos pierden.

Modo 'keywords': agrupa las busquedas y le asigna a cada grupo las paginas que
podrian responderlo. Sin pagina = hueco de contenido, que es la lista de lo que
hay que escribir y en que orden.

El fichero de keywords puede ser una exportacion de Search Console, Semrush o
Ahrefs, o una lista a pelo. Se detecta la columna de la busqueda por el nombre
de cabecera; si no hay cabecera reconocible, se usa la primera columna.
"""
import csv, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import clusters as C                                    # noqa: E402

CAB_KW = ["query", "consulta", "keyword", "palabra clave", "palabras clave",
          "termino", "búsqueda", "busqueda", "search term"]
CAB_NUM = {"impressions": "impresiones", "impresiones": "impresiones",
           "clicks": "clics", "clics": "clics", "volume": "volumen",
           "volumen": "volumen", "search volume": "volumen",
           "position": "posicion", "posicion": "posicion",
           "posición media": "posicion", "kd": "dificultad",
           "difficulty": "dificultad"}


def leer_inventarios(rutas):
    """[(sitio, slug, titulo)]"""
    out = []
    for r in rutas:
        with open(r, encoding="utf-8") as fh:
            cab = fh.readline()
            for l in fh:
                p = l.rstrip("\n").split("\t")
                if len(p) >= 3:
                    out.append((p[0], p[1], p[2]))
    return out


def leer_keywords(ruta):
    """[(keyword, {metricas})] desde CSV/TSV de GSC, Semrush, Ahrefs o lista."""
    with open(ruta, encoding="utf-8-sig", errors="replace") as fh:
        muestra = fh.read(4096)
        fh.seek(0)
        try:
            d = csv.Sniffer().sniff(muestra, delimiters=",;\t").delimiter
        except csv.Error:
            d = "\t" if "\t" in muestra else ","
        filas = list(csv.reader(fh, delimiter=d))
    if not filas:
        return []

    cab = [c.strip().lower() for c in filas[0]]
    i_kw = next((i for i, c in enumerate(cab) if c in CAB_KW), None)
    if i_kw is None:
        # sin cabecera reconocible: primera columna, y la cabecera es un dato mas
        return [(f[0].strip(), {}) for f in filas if f and f[0].strip()]

    nums = {i: CAB_NUM[c] for i, c in enumerate(cab) if c in CAB_NUM}
    out = []
    for f in filas[1:]:
        if len(f) <= i_kw or not f[i_kw].strip():
            continue
        m = {}
        for i, nombre in nums.items():
            if i < len(f):
                try:
                    m[nombre] = float(f[i].replace(".", "").replace(",", ".").strip("% "))
                except ValueError:
                    pass
        out.append((f[i_kw].strip(), m))
    return out


def modo_paginas(rutas):
    paginas = leer_inventarios(rutas)
    items = {f"{s}|{sl}": f"{sl} {C.sin_marca(ti)}" for s, sl, ti in paginas}
    grupos, nuc = C.agrupar(items)

    multi = [g for g in grupos if len(g) > 1]
    cruzados = [g for g in multi if len({k.split("|")[0] for k in g}) > 1]

    print(f"  paginas analizadas: {len(items)}  de {len({p[0] for p in paginas})} dominios")
    print(f"  intenciones distintas: {len(grupos)}")
    print(f"  intenciones con mas de una pagina: {len(multi)}")
    print(f"  de esas, repartidas entre dominios distintos: {len(cruzados)}\n")

    if cruzados:
        print("  A. LA MISMA INTENCION EN LOS DOS DOMINIOS")
        print("     (compites contra ti mismo: una de las dos no va a posicionar)\n")
        for g in cruzados:
            print(f"   !! [{C.etiqueta(g, nuc)}]")
            for k in sorted(g):
                s, sl = k.split("|", 1)
                print(f"        {s:15} {sl}")
            print()

    internos = [g for g in multi if g not in cruzados]
    print(f"  B. VARIAS PAGINAS DEL MISMO DOMINIO -> {len(internos)} grupos\n")
    for g in internos:
        s = sorted(g)[0].split("|")[0]
        print(f"   ?  [{C.etiqueta(g, nuc)}]  ({s})")
        for k in sorted(g):
            print(f"        {k.split('|', 1)[1]}")
    return 0


def modo_keywords(ruta_kw, rutas_inv):
    kws = leer_keywords(ruta_kw)
    if not kws:
        print("  no se han leido keywords")
        return 1
    paginas = leer_inventarios(rutas_inv)
    # El tema de una pagina se decide por su SLUG, no por su titulo. El slug lo
    # eligio alguien a proposito y dice de que va; el titulo añade detalle
    # comercial ("Gestion de Tallas y Colores") que, tratado como si acotara,
    # hacia que tpv-tienda-ropa.html dejara de cubrir "tpv tienda de ropa".
    # El titulo entra solo como respaldo cuando el slug no aporta nada.
    nuc_pag = {}
    for s_, sl, ti in paginas:
        n = C.nucleo(sl)
        if not n:
            n = C.nucleo(C.sin_marca(ti))
        nuc_pag[f"{s_}|{sl}"] = n

    items = {k: k for k, _ in kws}
    metricas = {k: m for k, m in kws}
    grupos, nuc = C.agrupar(items)
    w = C.pesos(list(nuc_pag.values()))

    filas = []
    for g in grupos:
        n = C.nucleo(" ".join(g))
        casan = [p for p, np_ in nuc_pag.items() if C.cubre(n, np_, w)]
        vol = sum(metricas[k].get("volumen", metricas[k].get("impresiones", 0)) for k in g)
        filas.append((C.etiqueta(g, nuc), g, casan, vol))

    huecos = [f for f in filas if not f[2]]
    canib = [f for f in filas if len(f[2]) > 1]
    ok = [f for f in filas if len(f[2]) == 1]

    print(f"  keywords: {len(items)}   grupos: {len(grupos)}   paginas: {len(nuc_pag)}")
    print(f"  CUBIERTO {len(ok)}   CANIBALIZADO {len(canib)}   HUECO {len(huecos)}\n")

    orden = lambda f: (-f[3], -len(f[1]))
    print("  HUECOS (nadie responde a esto), por volumen:\n")
    for et, g, _, vol in sorted(huecos, key=orden)[:40]:
        v = f"{vol:>9,.0f}" if vol else "        -"
        print(f"   {v}  [{et}]   {len(g)} kw   ej: {sorted(g)[0][:60]}")

    print(f"\n  CANIBALIZADO (varias paginas para el mismo grupo):\n")
    for et, g, casan, vol in sorted(canib, key=orden)[:25]:
        v = f"{vol:>9,.0f}" if vol else "        -"
        print(f"   {v}  [{et}]")
        for p in sorted(casan):
            print(f"              {p.replace('|', '  ')}")
    return 0


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    modo = sys.argv[1]
    if modo == "paginas":
        return modo_paginas(sys.argv[2:])
    if modo == "keywords":
        args = sys.argv[2:]
        if "--" not in args:
            print("  falta '--' antes de los inventarios")
            return 2
        i = args.index("--")
        return modo_keywords(args[0], args[i + 1:])
    print(f"  modo desconocido: {modo}")
    return 2


if __name__ == "__main__":
    sys.exit(main())
