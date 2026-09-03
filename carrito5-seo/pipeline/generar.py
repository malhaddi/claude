#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generador de paginas de carrito5.com.

Uso: python3 generar.py <dir-salida> <modulo> [<modulo> ...]

Cada modulo de contenido/ expone un dict cuyo nombre esta en MODULOS. El filtro
de similitud del motor comun decide que se publica: lo que se parezca demasiado
a otra pagina no llega al disco.
"""
import importlib, os, sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__)))), "motor"))

import plantilla as P            # noqa: E402
import gate                      # noqa: E402


def construir(fichero, d):
    return P.pagina(
        fichero=fichero,
        title=d["title"], description=d["desc"], keywords=d["kw"],
        h1=d["h1"], sub=d["sub"], badge=d["badge"], trail=d["trail"],
        bloques=d["bloques"], faqs=d["faqs"],
        faq_titulo=d.get("faq_titulo", f"Preguntas frecuentes sobre {d['crumb'].lower()}"),
        aside=d["aside"], satelites=d.get("satelites", []), cta=d["cta"],
        extra_ld=d.get("extra_ld"))


def main():
    if len(sys.argv) < 3:
        print("uso: generar.py <dir-salida> <modulo>...")
        return 2
    out, mods = sys.argv[1], sys.argv[2:]

    todo = {}
    for m in mods:
        mod = importlib.import_module(f"contenido.{m}")
        for attr in dir(mod):
            v = getattr(mod, attr)
            if attr.isupper() and isinstance(v, dict) and not attr.startswith("_"):
                todo.update(v)

    # Paginas que YA existen en carrito5.com. No se sobrescriben: se generan
    # aparte, en _propuestas/, para que el cliente compare antes de decidir.
    YA_EXISTEN = {"descargar-tpv-gratis.html", "sectores-y-negocios.html",
                  "software-tpv-comercio-local.html", "verifactu-gratis.html",
                  "index.html", "tpv-tienda-ropa.html", "tpv-zapateria.html"}

    paginas = {f: construir(f, d) for f, d in todo.items()}
    propuestas = {f: h for f, h in paginas.items() if f in YA_EXISTEN}
    paginas = {f: h for f, h in paginas.items() if f not in YA_EXISTEN}
    if propuestas:
        pdir = os.path.join(out, "_propuestas")
        os.makedirs(pdir, exist_ok=True)
        for f, h in propuestas.items():
            open(os.path.join(pdir, f), "w", encoding="utf-8").write(h)
        print(f"  {len(propuestas)} propuestas en _propuestas/ (esas paginas ya existen en la web viva)")

    import glob
    previas = [p for p in glob.glob(os.path.join(out, "*.html"))
               if os.path.basename(p) not in paginas]
    malos = gate.filtrar(paginas, previas)

    n = 0
    for f, html in paginas.items():
        if f in malos:
            continue
        open(os.path.join(out, f), "w", encoding="utf-8").write(html)
        n += 1
    print(f"  publicadas {n} / {len(paginas)}   rechazadas {len(malos)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
