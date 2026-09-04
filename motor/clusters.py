#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Agrupador de intenciones de busqueda, compartido por todos los sitios.

Agrupa keywords (o slugs de paginas) por lo que la gente esta buscando de
verdad, y las cruza con las paginas que existen. Devuelve tres estados:

  CUBIERTO      una sola pagina responde a ese grupo. Es lo que se quiere.
  CANIBALIZADO  dos o mas paginas responden al mismo grupo. Google elige una y
                las demas se quedan sin posicion. Si ademas son de dominios
                distintos del mismo dueño, la empresa compite consigo misma.
  HUECO         nadie responde a ese grupo. Es la lista de lo que hay escribir.

Por que no usa embeddings: aqui no hacen falta y estorban. El castellano
comercial de este sector es muy regular ("software tpv para X gratis"), asi que
quitando el andamiaje generico lo que queda es el sector, y eso ya agrupa bien.
Ademas el resultado es explicable: se puede ver POR QUE dos keywords cayeron
juntas, que con un vector no se puede.
"""
import itertools, re, unicodedata

UMBRAL = 0.50

# Palabras que no distinguen una intencion de otra en este sector. Si la
# keyword entera se queda vacia al quitarlas, es una busqueda generica de
# cabecera y se trata aparte.
STOP = {
    "tpv", "software", "programa", "aplicacion", "app", "sistema", "gratis",
    "gratuito", "free", "de", "del", "la", "el", "los", "las", "un", "una",
    "para", "por", "con", "sin", "y", "o", "en", "a", "al", "mi", "su", "que",
    "es", "como", "cual", "donde", "mejor", "mejores", "bueno", "buenos",
    "online", "web", "pc", "ordenador", "windows", "descargar", "descarga",
    "comprar", "precio", "precios", "espana", "2025", "2026", "html", "asp",
    "negocio", "tienda", "tiendas", "comercio", "com", "www",
}

# Las marcas no distinguen una intencion de otra: "| Carrito5" sale en todos
# los titulos de ese dominio, asi que sin quitarlas el agrupador une paginas
# que no tienen nada que ver solo porque comparten el nombre de la empresa.
MARCAS = {"carrito5", "carrito", "abaco", "abacosoftware", "caja5", "abacos"}
STOP |= MARCAS

# Sinonimos reales del sector. Conservador a proposito: fruteria y carniceria
# NO se fusionan aunque las dos sean alimentacion, porque son paginas distintas
# con clientes distintos. Solo entra aqui lo que un comerciante llamaria igual.
#
# El PRIMER elemento de cada lista es el nombre del grupo. Se elige a mano y no
# por orden alfabetico, porque la etiqueta la va a leer una persona: el grupo
# fiscal se llama "verifactu", que es como lo llama todo el mundo, y no "aeat",
# que es lo que saldria ordenando.
FAMILIAS = [
    ["zapateria", "calzado", "zapatos", "zapato", "zapaterias"],
    ["herboristeria", "herbolario", "herbodietetica", "dietetica"],
    ["colchoneria", "colchon", "colchones", "descanso"],
    ["mascotas", "mascota", "petshop", "animales", "animal"],
    ["bicicletas", "bicicleta", "bici", "bicis", "ciclismo"],
    ["telefonia", "movil", "moviles", "telefono", "telefonos"],
    ["jugueteria", "juguetes", "juguete"],
    ["papeleria", "libreria", "librerias"],
    ["floristeria", "floristerias", "flores", "flor"],
    ["optica", "opticas", "gafas", "lentes", "monturas"],
    ["joyeria", "joyerias", "relojeria", "relojerias", "joyas"],
    ["perfumeria", "perfumerias", "drogueria", "droguerias", "perfumes"],
    ["lavanderia", "tintoreria", "lavanderias", "tintorerias"],
    ["ferreteria", "ferreterias", "bricolaje"],
    ["instrumentos", "instrumento", "musica", "musicales"],
    ["estanco", "estancos", "tabaco"],
    ["vapeo", "vapeador", "cigarrillo", "cigarrillos", "vaper"],
    ["segundamano", "segunda", "vintage", "antiguedades", "anticuario"],
    ["merceria", "mercerias", "lenceria", "lencerias"],
    ["informatica", "electronica", "ordenadores"],
    ["verifactu", "antifraude", "aeat", "hacienda"],
]
# indice palabra -> representante de su familia
_REP = {}
for fam in FAMILIAS:
    for p in fam:
        _REP[p] = fam[0]


def sin_corte(titulo):
    """Quita el tramo final de un titulo que llego cortado.

    El indice de busqueda devuelve titulos truncados a mitad de palabra:
    "...Instrumentos Musica | Carr…". Ese "carr" es un trozo de "Carrito5", no
    una palabra, y como es rarisimo el peso por rareza se lo come todo: bastaba
    para que el par singular/plural de instrumentos, que es duplicado seguro,
    se quedara en 0,466 y no llegara al umbral.

    Los titulos cortados vienen marcados con "…" al final.
    """
    if not titulo.endswith("…"):
        return titulo
    t = titulo[:-1].rstrip()
    for sep in ("|", " - ", " — ", " – "):
        if sep in t:
            return t.rpartition(sep)[0].strip()
    # sin separador, el cortado es la ultima palabra
    return t.rsplit(" ", 1)[0].strip() if " " in t else t


def sin_marca(titulo):
    """Quita el cierre de marca del titulo, que no es contenido.

    "TPV Floristeria Gratis | Carrito5 Software VeriFactu" habla de
    floristerias; el "Software VeriFactu" del final es la coletilla del sitio y
    sale igual en la pagina de mascotas y en la de deportes. Sin quitarla, esas
    tres paginas parecen tratar de VeriFactu y acaban en el mismo grupo.

    Solo se corta el ultimo tramo, y solo si lleva el nombre de la marca: hay
    titulos donde lo que va detras de la barra SI es contenido, como
    "...Tiendas de Ropa y Moda | Gestion de Tallas y Colores".
    """
    titulo = sin_corte(titulo)
    for sep in ("|", " - ", " — ", " – "):
        if sep in titulo:
            cabeza, _, cola = titulo.rpartition(sep)
            if any(m in normalizar(cola).split() for m in MARCAS):
                return sin_marca(cabeza.strip())
    return titulo.strip()


def normalizar(s):
    """Minusculas, sin tildes, sin puntuacion."""
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ ]+", " ", s.replace("_", " ").replace("-", " "))


def singular(p):
    if len(p) > 4 and p.endswith("es") and not p.endswith("ses"):
        return p[:-2]
    if len(p) > 3 and p.endswith("s") and not p.endswith("ss"):
        return p[:-1]
    return p


def crudo(texto):
    """Tokens utiles SIN aplicar familias de sinonimos.

    La frecuencia hay que medirla aqui, no despues de agrupar sinonimos:
    colapsar {verifactu, antifraude, aeat, hacienda} en un solo representante
    multiplica por cuatro su frecuencia aparente, el filtro de genericas lo
    tira por frecuente, y el sitio se queda sin el tema fiscal entero. Paso.
    """
    out = []
    for p in normalizar(texto).split():
        if p in STOP:
            continue
        p = singular(p)
        if p not in STOP and len(p) > 2:
            out.append(p)
    return frozenset(out)


def nucleo(texto, extra=frozenset()):
    """Las palabras que de verdad distinguen esta busqueda de otra."""
    piezas = []
    for p in crudo(texto):
        if p in extra:
            continue
        piezas.append(_REP.get(p, p))
    return frozenset(piezas)


TECHO = 0.30


def genericas(textos, techo=TECHO):
    """Palabras que salen en tantos sitios que ya no distinguen nada.

    La lista STOP de arriba cubre el andamiaje que se sabe de antemano, pero
    cada corpus trae el suyo: en este sector "caja" aparece en casi todos los
    titulos ("programa de caja", "caja registradora", "arqueo de caja") y acaba
    uniendo paginas que no tienen que ver. En vez de ir ampliando la lista a
    mano, se mide.

    El corte es alto (30 %) a proposito: solo tiene que atrapar la coletilla
    que sale en casi todo. La gradacion fina la hace el peso por rareza de
    parecido(). Con un corte bajo el filtro se comia temas reales: con 12 %,
    un corpus donde VeriFactu fuera el 12,3 % de las paginas perdia la palabra
    "verifactu" entera, y con ella el cluster fiscal.

    Se calcula sobre el corpus que se le pase, asi que se adapta solo cuando
    entra un fichero de keywords distinto.
    """
    if not textos:
        return frozenset()
    df = {}
    for t in textos:
        for p in crudo(t):          # crudo, no nucleo: ver la nota en crudo()
            df[p] = df.get(p, 0) + 1
    corte = max(2, int(len(textos) * techo))
    return frozenset(p for p, n in df.items() if n > corte)


def parecido(a, b, peso=None):
    """Jaccard, opcionalmente ponderado por rareza de cada palabra.

    Sin pesos, "catinfog alternativa comparativa" y "gesio alternativa
    comparativa" salen a 0,50 y se agrupan, aunque Catinfog y Gesio sean dos
    competidores distintos: dos de las tres palabras son del marco de la
    comparativa. Pesando por rareza, "catinfog" vale mucho mas que
    "comparativa" y los dos grupos se separan, que es lo correcto.

    El peso es log(N/df): lo que sale en todas partes no informa, y lo que sale
    una sola vez identifica. Es la misma idea que el filtro de genericas, pero
    graduada en vez de un corte binario.
    """
    if not a or not b:
        return 0.0
    if peso is None:
        return len(a & b) / len(a | b)
    arriba = sum(peso.get(t, 1.0) for t in a & b)
    abajo = sum(peso.get(t, 1.0) for t in a | b)
    return arriba / abajo if abajo else 0.0


def cubre(kw, pagina, peso=None, umbral=UMBRAL):
    """¿Responde esta pagina a esta busqueda? La relacion NO es simetrica.

    Una pagina mas especifica no responde a una busqueda mas general. La pagina
    "TPV instrumentos de musica Madrid" no cubre "software tpv madrid": quien
    busca eso no quiere una tienda de guitarras. Al reves si funciona: la
    pagina general de zapaterias sirve para "tpv zapateria tallas anchas".

    Esto importaba de verdad: sin la asimetria, "software tpv madrid" con 2.800
    impresiones salia CUBIERTO por la pagina de instrumentos, y el hueco mas
    grande del sitio quedaba escondido justo en el informe que existe para
    encontrarlo.
    """
    if not kw or not pagina:
        return False
    if pagina <= kw:                 # pagina igual o mas general: cubre
        return True
    if kw < pagina:                  # pagina mas especifica: no cubre
        return False
    return parecido(kw, pagina, peso) >= umbral


def pesos(nucleos, n=None):
    """log(N/df) por palabra, sobre los nucleos ya calculados."""
    import math
    n = n or len(nucleos)
    df = {}
    for s in nucleos:
        for t in s:
            df[t] = df.get(t, 0) + 1
    return {t: math.log(n / c) + 1.0 for t, c in df.items()}


def agrupar(items, umbral=UMBRAL):
    """items: {clave: texto}. Devuelve [[claves...]] por componentes conexas.

    Componentes conexas y no centroides: si A se parece a B y B a C, los tres
    hablan del mismo negocio aunque A y C no se toquen ("zapateria stock",
    "stock calzado", "calzado tallas").
    """
    # La limpieza va aqui dentro y no en quien llama: cuando vivia fuera, este
    # mismo agrupador daba resultados distintos segun el consumidor, y el par
    # singular/plural de instrumentos se agrupaba desde el analizador pero no
    # desde las pruebas.
    limpio = {k: sin_marca(t) for k, t in items.items()}
    extra = genericas(list(limpio.values()))
    nuc = {k: nucleo(t, extra) for k, t in limpio.items()}
    w = pesos(list(nuc.values()))
    padre = {k: k for k in items}

    def raiz(x):
        while padre[x] != x:
            padre[x] = padre[padre[x]]
            x = padre[x]
        return x

    for a, b in itertools.combinations(sorted(items), 2):
        if parecido(nuc[a], nuc[b], w) >= umbral:
            ra, rb = raiz(a), raiz(b)
            if ra != rb:
                padre[ra] = rb

    grupos = {}
    for k in items:
        grupos.setdefault(raiz(k), []).append(k)
    return sorted(grupos.values(), key=lambda g: (-len(g), sorted(g)[0])), nuc


def etiqueta(claves, nuc):
    """Nombre legible del grupo: las palabras que comparte la mayoria."""
    if not claves:
        return ""
    cuenta = {}
    for k in claves:
        for p in nuc[k]:
            cuenta[p] = cuenta.get(p, 0) + 1
    mitad = max(1, len(claves) // 2)
    comunes = sorted((p for p, n in cuenta.items() if n >= mitad),
                     key=lambda p: (-cuenta[p], p))
    return " ".join(comunes[:3]) or sorted(nuc[claves[0]])[0] if nuc[claves[0]] else "generico"
