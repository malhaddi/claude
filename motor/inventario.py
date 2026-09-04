#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrae el inventario de un sitio a un TSV: slug, titulo, H1, palabras.

Uso: python3 inventario.py <dir-web> <etiqueta-sitio> > inventario.tsv

Existe porque el arbol construido de abacosoftware vive en un directorio
temporal que desaparece al cerrar la sesion. El TSV que genera esto si se
guarda en el repositorio, y es lo que consume el agrupador de keywords.
"""
import glob, html, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gate                                             # noqa: E402


def campo(s, pat):
    m = re.search(pat, s, re.S | re.I)
    if not m:
        return ""
    t = re.sub(r"<[^>]+>", " ", m.group(1))
    t = re.sub(r"<%.*?%>", "", t, flags=re.S)
    return html.unescape(re.sub(r"\s+", " ", t)).strip()


def main():
    base = sys.argv[1]
    sitio = sys.argv[2] if len(sys.argv) > 2 else os.path.basename(base.rstrip("/"))

    print("sitio\tslug\ttitulo\th1\tpalabras")
    for f in gate.paginas(base):
        try:
            s = open(f, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        slug = os.path.basename(f)
        titulo = campo(s, r"<title[^>]*>(.*?)</title>")
        h1 = campo(s, r"<h1[^>]*>(.*?)</h1>")
        n = len(gate.texto_visible(s).split())
        # el tabulador rompe el TSV; el titulo puede llevar cualquier cosa
        limpio = lambda x: x.replace("\t", " ").replace("\n", " ")
        print(f"{sitio}\t{slug}\t{limpio(titulo)}\t{limpio(h1)}\t{n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
