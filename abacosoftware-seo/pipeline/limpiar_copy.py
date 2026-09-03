#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pasada anti-slop sobre el copy generado (skill stop-slop + dossier del cliente).

Quita rayas em, adverbios de relleno en -mente y contrastes binarios "no es X, es Y".
Solo toca texto visible: nunca atributos HTML, JSON-LD, rutas ni codigo.
"""
import re, glob, os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"

# adverbios que no aportan informacion (los que si aportan se conservan:
# normalmente, habitualmente, automaticamente, parcialmente, periodicamente...)
RELLENO = [
    "exactamente ", "Exactamente ", "perfectamente ", "Perfectamente ",
    "justamente ", "Justamente ", "realmente ", "Realmente ",
    "claramente ", "Claramente ", "simplemente ", "Simplemente ",
    "sencillamente ", "Sencillamente ", "plenamente ", "Plenamente ",
    "Extremadamente ", "extremadamente ",
]

# sustituciones literales de frases con estructura de cliche
FRASES = [
    ("Es la opinión de usuarios, no un juicio nuestro",
     "Son opiniones de usuarios, no un juicio nuestro"),
    ("no es un ingreso nuevo, es un compromiso",
     "no genera un ingreso nuevo: es un compromiso"),
    ("no es una hipótesis remota", "no resulta improbable"),
    ("No es cuestión de desconfiar, es poder reconstruir",
     "No va de desconfiar: sirve para reconstruir"),
    ("no es un juicio nuestro", "no es valoración nuestra"),
    ("Aquí tienes", "Tienes"),
    ("Esto es lo que", "Lo que"),
    ("no es cuestión de desconfianza, es poder",
     "no va de desconfianza: sirve para poder"),
    ("No es un TPV:", "No funciona como TPV:"),
    ("no es la mejor opción", "no encaja bien"),
    ("Es la diferencia práctica más importante",
     "Ahí está la diferencia práctica más importante"),
]


def visible_spans(s):
    """Devuelve los tramos de texto visible (fuera de etiquetas, script y ASP)."""
    bloqueado = []
    for m in re.finditer(r"<%.*?%>|<script.*?</script>|<style.*?</style>", s, re.S | re.I):
        bloqueado.append((m.start(), m.end()))
    for m in re.finditer(r"<[^>]+>", s):
        bloqueado.append((m.start(), m.end()))
    bloqueado.sort()
    fusion, spans, pos = [], [], 0
    for a, b in bloqueado:
        if fusion and a <= fusion[-1][1]:
            fusion[-1] = (fusion[-1][0], max(fusion[-1][1], b))
        else:
            fusion.append((a, b))
    for a, b in fusion:
        if pos < a:
            spans.append((pos, a))
        pos = b
    if pos < len(s):
        spans.append((pos, len(s)))
    return spans


def transforma(txt):
    for a, b in FRASES:
        txt = txt.replace(a, b)
    # raya em -> dos puntos cuando separa etiqueta de explicacion, si no coma
    txt = re.sub(r"\s+—\s+", ": ", txt)
    txt = txt.replace("—", ",")
    for adv in RELLENO:
        txt = txt.replace(adv, "" if adv[0].islower() else "")
    # dobles espacios y ": :" resultantes
    txt = re.sub(r"[ \t]{2,}", " ", txt)
    txt = txt.replace(": :", ":").replace(" ,", ",").replace(" .", ".")
    return txt


def limpia_jsonld(s):
    """El texto del schema debe coincidir con el visible: se limpia igual."""
    import json

    def repl(m):
        try:
            d = json.loads(m.group(1))
        except Exception:
            return m.group(0)

        def rec(x):
            if isinstance(x, str):
                return transforma(x)
            if isinstance(x, list):
                return [rec(i) for i in x]
            if isinstance(x, dict):
                return {k: (v if k in ("@context", "@type", "@id", "url", "item", "logo")
                            else rec(v)) for k, v in x.items()}
            return x

        cuerpo = json.dumps(rec(d), ensure_ascii=False, indent=2).replace("\n", "\n\t")
        return '<script type="application/ld+json">\n\t' + cuerpo + "\n\t</script>"

    return re.sub(r'<script type="application/ld\+json">(.*?)</script>', repl, s, flags=re.S)


def main():
    tocados = 0
    for f in sorted(glob.glob(os.path.join(OUT, "*.asp"))):
        s = open(f, encoding="utf-8").read()
        s = limpia_jsonld(s)
        spans = visible_spans(s)
        out, pos = [], 0
        cambiado = False
        for a, b in spans:
            out.append(s[pos:a])
            frag = s[a:b]
            nuevo = transforma(frag)
            if nuevo != frag:
                cambiado = True
            out.append(nuevo)
            pos = b
        out.append(s[pos:])
        if cambiado:
            open(f, "w", encoding="utf-8").write("".join(out))
            tocados += 1
    print("ficheros limpiados:", tocados)


if __name__ == "__main__":
    main()
