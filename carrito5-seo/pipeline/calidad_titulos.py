#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Revisa la calidad de los <title> vivos de carrito5.com.

Uso: python3 calidad_titulos.py <fichero.tsv>   (url<TAB>titulo)

El titulo es lo unico que el usuario lee en Google antes de decidir si entra.
Este chequeo busca tres defectos que se ven a simple vista en el resultado de
busqueda y que delatan una pagina generada en serie:

  ACENTOS   palabras castellanas escritas sin tilde ("Iluminacion", "Musica").
  ACRONIMO  "Tpv" en vez de "TPV". TPV son siglas; en minusculas parece un
            error de maquina, porque lo es: sale de aplicar title-case al slug.
  PLANTILLA titulos con la forma "<slug con espacios> | Carrito5 TPV", es decir
            el nombre del fichero repetido, sin ninguna promesa para el lector.

Tambien mide la longitud: por encima de 60 caracteres Google suele cortar.
"""
import collections, os, re, sys

# Palabras del sector que llevan tilde en castellano. Si aparecen sin ella en
# un titulo, es que el titulo se genero desde el slug (los slugs no llevan tildes).
CON_TILDE = {
    "iluminacion": "iluminación", "artesania": "artesanía",
    "antiguedades": "antigüedades", "electrodomesticos": "electrodomésticos",
    "musica": "música", "optica": "óptica", "floristeria": "floristería",
    "lavanderia": "lavandería", "tintoreria": "tintorería",
    "cosmetica": "cosmética",
    "informatica": "informática", "informaticas": "informáticas",
    "electronica": "electrónica", "jugueteria": "juguetería",
    "papeleria": "papelería", "drogueria": "droguería", "joyeria": "joyería",
    "relojeria": "relojería", "zapateria": "zapatería",
    "herboristeria": "herboristería", "merceria": "mercería",
    "lenceria": "lencería", "telefonia": "telefonía", "comics": "cómics",
    "decoracion": "decoración", "facturacion": "facturación",
    "gestion": "gestión", "malaga": "Málaga", "verifactu": None,
}

LIMITE = 60


def defectos(url, titulo, completo=True):
    fallos = []
    palabras = re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+", titulo)

    sin_tilde = []
    for p in palabras:
        b = p.lower()
        if b in CON_TILDE and CON_TILDE[b] and b == p.lower():
            # solo cuenta si la version escrita no lleva ninguna tilde
            if not re.search(r"[áéíóúüñ]", p, re.I):
                sin_tilde.append((p, CON_TILDE[b]))
    if sin_tilde:
        fallos.append(("ACENTOS", ", ".join(f"{a} -> {b}" for a, b in sin_tilde)))

    if re.search(r"\bTpv\b", titulo):
        fallos.append(("ACRONIMO", "'Tpv' deberia ser 'TPV'"))

    if titulo.rstrip().endswith("| Carrito5 TPV"):
        slug = re.sub(r"^https?://(www\.)?carrito5\.com/", "", url)
        slug = re.sub(r"\.html$", "", slug).replace("-", " ")
        cabeza = titulo.split("|")[0].strip().lower()
        if cabeza == slug.lower():
            fallos.append(("PLANTILLA", f"el titulo es el nombre del fichero: '{slug}'"))

    # Solo se mide lo que llego entero. Un titulo que el buscador ya recorto
    # daria una cuenta falsa, y ademas por debajo de la real.
    if completo and len(titulo) > LIMITE:
        fallos.append(("LARGO", f"{len(titulo)} caracteres, Google corta sobre {LIMITE}"))

    return fallos


def main():
    f = sys.argv[1] if len(sys.argv) > 1 else "inventario/titulos_observados.tsv"
    filas = []
    for l in open(f, encoding="utf-8"):
        if "\t" not in l:
            continue
        partes = l.rstrip("\n").split("\t")
        u, t = partes[0], partes[1]
        completo = len(partes) < 3 or partes[2] != "cortado"
        filas.append((u, t, completo))

    cuenta = collections.Counter()
    afectadas = collections.defaultdict(list)
    for u, t, completo in filas:
        for tipo, det in defectos(u, t, completo):
            cuenta[tipo] += 1
            afectadas[tipo].append((u, t, det))

    cortados = sum(1 for _, _, c in filas if not c)
    print(f"  titulos revisados: {len(filas)}  ({cortados} llegaron cortados "
          f"del buscador: no se mide su longitud)\n")
    orden = ["PLANTILLA", "ACRONIMO", "ACENTOS", "LARGO"]
    for tipo in orden:
        if not cuenta[tipo]:
            continue
        print(f"  {tipo}  ({cuenta[tipo]} paginas)")
        for u, t, det in afectadas[tipo]:
            print(f"   - {os.path.basename(u) or '/'}")
            print(f"       titulo: {t}")
            print(f"       motivo: {det}")
        print()

    limpias = [u for u, t, c in filas if not defectos(u, t, c)]
    print(f"  titulos sin ningun defecto: {len(limpias)} / {len(filas)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
