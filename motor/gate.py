#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Filtro anti-plantilla, compartido por todos los sitios.

Mide la similitud de Jaccard sobre el texto visible. Sirve para cualquier web:
solo necesita saber que extensiones son paginas y cuales ignorar.

Aprendizaje que justifica que esto exista: generar paginas desde una base de
hechos con andamiaje comun da 0,75-0,91 de similitud, porque el texto propio
del tema apenas pesa un 23 %. Escritas a mano se quedan en 0,24-0,41.
"""
import glob, itertools, os, re

UMBRAL = 0.45


def texto_visible(html):
    """Texto que ve el usuario: sin ASP, sin script, sin style, sin etiquetas."""
    t = re.sub(r"<%.*?%>", "", html, flags=re.S)
    t = re.sub(r"<script.*?</script>", "", t, flags=re.S | re.I)
    t = re.sub(r"<style.*?</style>", "", t, flags=re.S | re.I)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)).lower()


def paginas(base, exts=("*.asp", "*.html"), excluir=()):
    fs = []
    for e in exts:
        fs += glob.glob(os.path.join(base, e))
    return sorted(f for f in fs if os.path.basename(f) not in excluir)


def comparar(ficheros):
    """Devuelve [(similitud, a, b)] ordenado de mas a menos parecido."""
    d = {}
    for f in ficheros:
        try:
            d[f] = set(texto_visible(open(f, encoding="utf-8", errors="replace").read()).split())
        except OSError:
            continue
    return sorted(((len(d[x] & d[y]) / len(d[x] | d[y]), x, y)
                   for x, y in itertools.combinations(sorted(d), 2)
                   if d[x] and d[y]), reverse=True)


def informe(ficheros, umbral=UMBRAL, muestra=5):
    """Imprime el resultado y devuelve el numero de pares que superan el umbral."""
    sims = comparar(ficheros)
    if not sims:
        print("  nada que comparar")
        return 0
    malos = [s for s in sims if s[0] > umbral]
    media = sum(s[0] for s in sims) / len(sims)
    print(f"  paginas comparadas: {len(ficheros)}")
    print(f"  similitud media {media:.2f}   maxima {sims[0][0]:.2f}   umbral {umbral}")
    print(f"  pares por encima del umbral: {len(malos)}")
    for j, x, y in sims[:muestra]:
        marca = "!!" if j > umbral else "  "
        print(f"   {marca} {j:.2f}  {os.path.basename(x)} <-> {os.path.basename(y)}")
    return len(malos)


def filtrar(candidatas, previas=(), umbral=UMBRAL):
    """Dado {fichero: html} nuevo y una lista de rutas ya publicadas, devuelve
    el conjunto de ficheros nuevos que NO deben publicarse por parecerse demasiado."""
    vis = {f: set(texto_visible(h).split()) for f, h in candidatas.items()}
    for p in previas:
        b = os.path.basename(p)
        if b not in vis:
            try:
                vis[b] = set(texto_visible(open(p, encoding="utf-8", errors="replace").read()).split())
            except OSError:
                pass
    malos = set()
    for a, b in itertools.combinations(sorted(vis), 2):
        if a not in candidatas and b not in candidatas:
            continue
        if not vis[a] or not vis[b]:
            continue
        j = len(vis[a] & vis[b]) / len(vis[a] | vis[b])
        if j > umbral:
            malo = b if b in candidatas else a
            malos.add(malo)
            print(f"   !! {j:.2f}  {a} <-> {b}  -> no se publica {malo}")
    return malos


def cruzado(base_a, base_b, umbral=UMBRAL, muestra=8):
    """Compara dos sitios distintos entre si.

    Cuando dos dominios pertenecen al mismo dueño (aqui abacosoftware.com y
    carrito5.com), reutilizar texto entre ellos crea contenido duplicado que
    perjudica a los dos. Esta comprobacion lo detecta antes de publicar.
    """
    A, B = paginas(base_a), paginas(base_b)
    da = {f: set(texto_visible(open(f, encoding="utf-8", errors="replace").read()).split()) for f in A}
    db = {f: set(texto_visible(open(f, encoding="utf-8", errors="replace").read()).split()) for f in B}
    sims = []
    for x, sx in da.items():
        for y, sy in db.items():
            if not sx or not sy:
                continue
            sims.append((len(sx & sy) / len(sx | sy), x, y))
    sims.sort(reverse=True)
    malos = [s for s in sims if s[0] > umbral]
    print(f"  {len(A)} paginas x {len(B)} paginas = {len(sims)} comparaciones")
    print(f"  similitud maxima entre sitios: {sims[0][0]:.2f}" if sims else "  sin datos")
    print(f"  pares por encima de {umbral}: {len(malos)}")
    for j, x, y in sims[:muestra]:
        marca = "!!" if j > umbral else "  "
        print(f"   {marca} {j:.2f}  {os.path.basename(x)}  <->  {os.path.basename(y)}")
    return len(malos)
