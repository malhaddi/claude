#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compara las ciudades que carrito5.com dice cubrir con las que tienen pagina.

Uso: python3 cobertura_geografica.py <fichero-urls>

La propia web enumera en su menu las plazas donde vende. Si una de esas plazas
no tiene pagina propia, la web esta diciendo que cubre un mercado en el que no
puede posicionar: nadie busca "TPV Madrid" y encuentra un menu.

La lista CIUDADES sale del texto del menu recogido del sitio vivo, no de una
suposicion sobre que ciudades deberian estar.
"""
import os, re, sys

# Plazas que el propio sitio enumera en su menu.
CIUDADES = ["madrid", "barcelona", "valencia", "sevilla", "malaga", "bilbao",
            "zaragoza", "mallorca", "alicante", "murcia", "vigo"]

# Variantes de escritura por ciudad en la URL.
ALIAS = {"mallorca": ["mallorca", "palma"]}

# Paginas de sector cruzado con ciudad: no sirven como pagina de ciudad, porque
# solo captan la busqueda del sector, no la generica "TPV <ciudad>".
SECTORIAL = re.compile(r"tpv-[a-z-]+-(?:musica|instrumentos)[a-z-]*-")


def paginas_de(ciudad, urls):
    claves = ALIAS.get(ciudad, [ciudad])
    generales, sectoriales = [], []
    for u in urls:
        base = os.path.basename(u)
        if not any(k in base for k in claves):
            continue
        (sectoriales if SECTORIAL.search(base) or "musica" in base
         else generales).append(base)
    return generales, sectoriales


def main():
    f = sys.argv[1] if len(sys.argv) > 1 else "inventario/urls_descubiertas.txt"
    urls = [l.strip() for l in open(f, encoding="utf-8") if l.strip()]

    sin_pagina = []
    print(f"  plazas que el menu del sitio enumera: {len(CIUDADES)}\n")
    for c in CIUDADES:
        gen, sec = paginas_de(c, urls)
        if gen:
            extra = f"   (+{len(sec)} sectorial)" if sec else ""
            print(f"   ok  {c:12} {gen[0]}{extra}")
            for g in gen[1:]:
                print(f"       {'':12} {g}   <- segunda pagina, compiten")
        else:
            sin_pagina.append(c)
            nota = f"solo sectorial: {sec[0]}" if sec else "ninguna pagina"
            print(f"   !!  {c:12} {nota}")

    print(f"\n  plazas anunciadas sin pagina general: {len(sin_pagina)}")
    for c in sin_pagina:
        print(f"   -> {c}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
