#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recorta los <title> que Google cortaria en la SERP (>65 caracteres).

Se ejecuta al final del pipeline, despues de que todos los generadores hayan
escrito sus paginas. Mantiene og:title y twitter:title sincronizados.

El recorte por palabras deja a veces la frase colgando de una preposicion o un
articulo ("... sin Cerrar al"). Esa comprobacion es la parte que de verdad
importa: un titulo cortado a mitad se ve peor que uno largo.
"""
import glob, os, re, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"
MAX = 65
MIN = 22

SUFIJOS = (" | Caja 5", " | Ábaco Software", " | Abaco Software", " - Caja 5", " | Caja5")
COLGANTE = re.compile(r"\b(al|el|la|lo|los|las|de|del|en|con|sin|por|para|y|o|a|un|una|"
                      r"que|su|sus|es|se|te|le|mi|tu|más|mas|como|desde|hasta|entre)$", re.I)

# titulos que el recorte automatico deja mal y se resuelven a mano
MANUALES = {
    "como-hacer-un-inventario-tienda.asp": "Cómo Hacer el Inventario de una Tienda sin Cerrar",
    "guia-abrir-tienda-de-ropa.asp": "Cómo Abrir una Tienda de Ropa en España: Guía y TPV",
    "impresoras-tickets-y-lectores-compatibles.asp": "Impresoras y Lectores Compatibles con Caja 5",
    "ley-antifraude-tpv.asp": "Ley Antifraude 11/2021 en el Software TPV",
    "alternativa-tpv-suscripcion.asp": "Alternativa Española al TPV por Suscripción",
    "app_etiquetas_ql5.asp": "Etiquetas con Código de Barras: App QL5",
}


def acortar(t):
    """Devuelve un titulo <=65 car. sin cortar a mitad de idea."""
    if len(t) <= MAX:
        return t
    # 1) quitar el sufijo de marca
    for s in SUFIJOS:
        if len(t) > MAX and t.endswith(s):
            t = t[: -len(s)].rstrip(" |-·")
    # 2) quedarse con la primera parte antes de un separador fuerte
    if len(t) > MAX:
        for sep in (" | ", " · ", " - "):
            if sep in t:
                cand = t.split(sep)[0].strip()
                if MIN < len(cand) <= MAX:
                    return cand
    # 3) podar enumeraciones "A, B y C" -> "A"
    if len(t) > MAX:
        m = re.match(r"^(.*?),\s*[^,]+\s+y\s+[^,]+$", t)
        if m and MIN < len(m.group(1)) <= MAX:
            t = m.group(1)
    # 4) cortar por palabra y limpiar finales colgantes
    while len(t) > MAX and " " in t:
        t = t[: t.rfind(" ")].rstrip(" ,;:|-·")
    while COLGANTE.search(t) and " " in t:
        t = t[: t.rfind(" ")].rstrip(" ,;:|-·")
    return t


def main():
    n = colgantes = 0
    for f in sorted(glob.glob(os.path.join(OUT, "*.asp"))):
        b = os.path.basename(f)
        s = open(f, encoding="utf-8").read()
        m = re.search(r"<title>(.*?)</title>", s, re.S)
        if not m:
            continue
        t = re.sub(r"\s+", " ", m.group(1)).strip()
        nuevo = MANUALES.get(b) or (acortar(t) if len(t) > MAX else t)
        if nuevo == t or not (MIN <= len(nuevo) <= MAX):
            continue
        s = s[: m.start(1)] + nuevo + s[m.end(1):]
        for prop in ("og:title", "twitter:title"):
            s = re.sub(rf'((?:property|name)="{prop}" content=")[^"]*(")',
                       lambda x: x.group(1) + nuevo + x.group(2), s)
        open(f, "w", encoding="utf-8").write(s)
        n += 1

    # verificacion final
    largos = []
    for f in glob.glob(os.path.join(OUT, "*.asp")):
        m = re.search(r"<title>(.*?)</title>", open(f, encoding="utf-8").read(), re.S)
        if m:
            t = re.sub(r"\s+", " ", m.group(1)).strip()
            if len(t) > MAX:
                largos.append(os.path.basename(f))
            if COLGANTE.search(t):
                colgantes += 1
    print(f"titulos recortados: {n} | quedan >65: {len(largos)} | finales colgantes: {colgantes}")
    if largos:
        print("  revisar a mano:", ", ".join(largos[:6]))


if __name__ == "__main__":
    main()
