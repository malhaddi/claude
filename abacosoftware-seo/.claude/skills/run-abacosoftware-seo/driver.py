#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Driver del pipeline SEO de abacosoftware.com.

Un solo punto de entrada para construir, verificar y previsualizar el sitio.
No hace falta IIS: `preview` resuelve los includes ASP y sirve el HTML resultante
para poder abrirlo en Chromium y hacerle una captura.

    python3 driver.py build    --base <dir-web>      genera todas las paginas
    python3 driver.py gate     --base <dir-web>      filtro de similitud
    python3 driver.py validate --base <dir-web>      auditoria SEO
    python3 driver.py preview  --base <dir-web> --page negocio_ferreteria.asp
    python3 driver.py stats    --base <dir-web>
    python3 driver.py package  --base <dir-web> --out sitio.zip

`--base` es el directorio con la web (el ZIP del cliente descomprimido).
El pipeline modifica ese directorio in situ: trabaja siempre sobre una copia.
"""
import argparse, glob, itertools, json, os, re, shutil, signal, subprocess, sys, tempfile, http.server, socketserver, threading, functools

# Permitir canalizar la salida a `head` sin BrokenPipeError.
try:
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
except (AttributeError, ValueError):
    pass

RAIZ = os.path.dirname(os.path.abspath(__file__))
UNIT = os.path.abspath(os.path.join(RAIZ, "..", "..", ".."))
PIPE = os.path.join(UNIT, "pipeline")
CONT = os.path.join(UNIT, "contenido")

UMBRAL = 0.45
CHROME_GLOB = "/opt/pw-browsers/chromium*/chrome-linux/chrome"

NO_PAGINA = {
    "conexion.asp", "conexion_visitas.asp", "menu_nav.asp", "footer_comun.asp",
    "tpv_consultas_desde_web_med.asp", "tpv_consultas_desde_web_medNO.asp",
    "tpv_consultas_desde_web_med -09-10-2023.asp",
}


# ----------------------------------------------------------------- utilidades
def paginas(base):
    return [f for f in sorted(glob.glob(os.path.join(base, "*.asp")))
            if os.path.basename(f) not in NO_PAGINA]


def texto_visible(html):
    t = re.sub(r"<%.*?%>", "", html, flags=re.S)
    t = re.sub(r"<script.*?</script>", "", t, flags=re.S | re.I)
    t = re.sub(r"<style.*?</style>", "", t, flags=re.S | re.I)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)).lower()


def correr(script, *args, cwd=None):
    """Ejecuta un script del pipeline con el cwd que espera.

    Los modulos del directorio de trabajo son enlaces simbolicos, y Python
    resuelve el enlace para fijar sys.path[0], que acaba apuntando al destino
    real en lugar de al temporal. Por eso hay que forzar PYTHONPATH.
    """
    env = dict(os.environ, PYTHONPATH=cwd or "")
    r = subprocess.run([sys.executable, script, *args], cwd=cwd,
                       capture_output=True, text=True, env=env)
    if r.returncode != 0:
        print(f"  !! fallo {os.path.basename(script)}:\n{r.stderr[-1200:]}")
    return r.stdout.strip()


def entorno(base):
    """Los scripts del pipeline esperan './site' como directorio de salida.

    Se monta un directorio de trabajo temporal con enlaces simbolicos a los
    modulos y un 'site' que apunta al directorio base real.
    """
    tmp = tempfile.mkdtemp(prefix="abaco-pipe-")
    for d in (PIPE, CONT):
        for f in glob.glob(os.path.join(d, "*.py")):
            os.symlink(f, os.path.join(tmp, os.path.basename(f)))
    os.symlink(os.path.join(UNIT, "plantilla.py"), os.path.join(tmp, "plantilla.py"))
    os.symlink(os.path.abspath(base), os.path.join(tmp, "site"))
    return tmp


# --------------------------------------------------------------------- build
GENERADORES = [
    ("gen_sectores.py", ["site", "sectores_1", "sectores_2", "sectores_3"]),
    ("gen_funciones.py", ["site"]),
    ("gen_verifactu.py", ["site"]),
    ("gen_faq_hub.py", ["site"]),
    ("gen_generico.py", ["abrir_1", "abrir_2", "operativa_1", "operativa_2", "vs_1", "vs_2", "normativa_1"]),
    ("gen_hubs2.py", []),
]


def cmd_build(a):
    tmp = entorno(a.base)
    try:
        print("== capa tecnica ==")
        print(" ", correr(os.path.join(tmp, "seo_tech.py"), "site", cwd=tmp)[:200])
        print("== generadores de contenido ==")
        for script, args in GENERADORES:
            out = correr(os.path.join(tmp, script), *args, cwd=tmp)
            ult = [l for l in out.splitlines() if l.strip()][-1:] or [""]
            print(f"  {script:22} {ult[0][:90]}")
        print("== limpieza y metadatos ==")
        correr(os.path.join(tmp, "limpiar_copy.py"), "site", cwd=tmp)
        print(" ", correr(os.path.join(tmp, "fix_metadatos.py"), "site", cwd=tmp)[:160])
        print(" ", correr(os.path.join(tmp, "recortar_titulos.py"), "site", cwd=tmp)[:200])
        print("== enlazado y sitemap ==")
        print(" ", correr(os.path.join(tmp, "enlazado_y_sitemap.py"), "site", cwd=tmp)[:300])
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    cmd_stats(a)


# ---------------------------------------------------------------------- gate
def cmd_gate(a):
    fs = paginas(a.base)
    orig = set()
    if a.original:
        orig = {os.path.basename(x) for x in glob.glob(os.path.join(a.original, "*.asp"))}
    objetivo = [f for f in fs if os.path.basename(f) not in orig] if orig else fs
    d = {f: set(texto_visible(open(f, encoding="utf-8").read()).split()) for f in objetivo}
    sims = sorted(((len(d[x] & d[y]) / len(d[x] | d[y]), x, y)
                   for x, y in itertools.combinations(objetivo, 2)), reverse=True)
    if not sims:
        print("  nada que comparar"); return 0
    malos = [s for s in sims if s[0] > UMBRAL]
    media = sum(s[0] for s in sims) / len(sims)
    print(f"  paginas comparadas: {len(objetivo)}")
    print(f"  similitud media {media:.2f}   maxima {sims[0][0]:.2f}   umbral {UMBRAL}")
    print(f"  pares por encima del umbral: {len(malos)}")
    for j, x, y in sims[:5]:
        marca = "!!" if j > UMBRAL else "  "
        print(f"   {marca} {j:.2f}  {os.path.basename(x)} <-> {os.path.basename(y)}")
    return 1 if malos else 0


# ------------------------------------------------------------------ validate
def cmd_validate(a):
    fs = paginas(a.base)
    p = {k: [] for k in ("sin title", "sin description", "sin canonical", "sin og",
                         "sin breadcrumb", "H1 != 1", "title > 65", "desc > 165", "LD roto")}
    faqs = 0
    for f in fs:
        s = open(f, encoding="utf-8").read()
        b = os.path.basename(f)
        t = re.search(r"<title>(.*?)</title>", s, re.S)
        d = re.search(r'<meta name="description" content="(.*?)"', s, re.S)
        if not t: p["sin title"].append(b)
        elif len(re.sub(r"\s+", " ", t.group(1)).strip()) > 65: p["title > 65"].append(b)
        if not d: p["sin description"].append(b)
        elif len(re.sub(r"\s+", " ", d.group(1)).strip()) > 165: p["desc > 165"].append(b)
        if 'rel="canonical"' not in s: p["sin canonical"].append(b)
        if "og:title" not in s: p["sin og"].append(b)
        if "BreadcrumbList" not in s and b != "index.asp": p["sin breadcrumb"].append(b)
        if len(re.findall(r"<h1[\s>]", s)) != 1: p["H1 != 1"].append(b)
        for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
            try:
                ld = json.loads(m.group(1))
                if ld.get("@type") == "FAQPage":
                    faqs += len(ld.get("mainEntity", []))
            except Exception:
                p["LD roto"].append(b)
    print(f"  paginas: {len(fs)}   preguntas con schema FAQ: {faqs}")
    fallos = 0
    for k, v in p.items():
        fallos += len(v)
        marca = "!!" if v else "ok"
        print(f"   {marca} {k:16} {len(v):4}  {', '.join(v[:4])}")
    # sitemap contra robots
    sm = os.path.join(a.base, "sitemap.xml")
    if os.path.exists(sm):
        urls = re.findall(r"<loc>https://www\.abacosoftware\.com/([^<]*)</loc>", open(sm, encoding="utf-8").read())
        faltan = [u for u in urls if u and not os.path.exists(os.path.join(a.base, u))]
        print(f"   {'!!' if faltan else 'ok'} sitemap: {len(urls)} URLs, {len(faltan)} apuntan a ficheros inexistentes")
        fallos += len(faltan)
    return 1 if fallos else 0


# ------------------------------------------------------------------- preview
INC = re.compile(r'<!--#include\s+virtual="([^"]+)"\s*-->')


def resolver_asp(base, fichero, profundidad=0):
    """Resuelve includes ASP y elimina el codigo <% %> para poder ver el HTML."""
    ruta = os.path.join(base, fichero.lstrip("/"))
    if not os.path.exists(ruta) or profundidad > 4:
        return ""
    s = open(ruta, encoding="utf-8", errors="replace").read()
    s = INC.sub(lambda m: resolver_asp(base, m.group(1), profundidad + 1), s)
    return re.sub(r"<%.*?%>", "", s, flags=re.S)


def cmd_preview(a):
    chrome = sorted(glob.glob(CHROME_GLOB))
    if not chrome:
        print("  !! no encuentro chromium en", CHROME_GLOB); return 1
    chrome = chrome[-1]

    salida = os.path.abspath(a.out or "preview.png")
    tmp = tempfile.mkdtemp(prefix="abaco-preview-")
    try:
        # el HTML resuelto se escribe DENTRO de la web para que css/js/img resuelvan
        destino = os.path.join(a.base, "__preview__.html")
        open(destino, "w", encoding="utf-8").write(resolver_asp(a.base, a.page))

        os.chdir(a.base)
        Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=a.base)
        socketserver.TCPServer.allow_reuse_address = True
        srv = socketserver.TCPServer(("127.0.0.1", 0), Handler)
        puerto = srv.server_address[1]
        hilo = threading.Thread(target=srv.serve_forever, daemon=True)
        hilo.start()
        url = f"http://127.0.0.1:{puerto}/__preview__.html"
        print(f"  sirviendo {a.page} en {url}")

        r = subprocess.run([
            chrome, "--headless", "--disable-gpu", "--no-sandbox",
            "--hide-scrollbars", f"--window-size={a.width},{a.height}",
            f"--screenshot={salida}", "--virtual-time-budget=6000", url],
            capture_output=True, text=True, timeout=120)
        srv.shutdown()
        if not os.path.exists(salida):
            print("  !! chromium no genero captura:\n", r.stderr[-800:]); return 1
        print(f"  captura: {salida}  ({os.path.getsize(salida)//1024} KB)")
        return 0
    finally:
        for p in (os.path.join(a.base, "__preview__.html"),):
            if os.path.exists(p):
                os.remove(p)
        shutil.rmtree(tmp, ignore_errors=True)


# --------------------------------------------------------------------- stats
def cmd_stats(a):
    fs = paginas(a.base)
    total = 0
    for f in fs:
        total += len(texto_visible(open(f, encoding="utf-8").read()).split())
    sm = os.path.join(a.base, "sitemap.xml")
    urls = len(re.findall(r"<loc>", open(sm, encoding="utf-8").read())) if os.path.exists(sm) else 0
    print(f"  paginas indexables : {len(fs)}")
    print(f"  palabras visibles  : {total:,}".replace(",", "."))
    print(f"  URLs en sitemap    : {urls}")
    return 0


# ------------------------------------------------------------------- package
def cmd_package(a):
    out = os.path.abspath(a.out or "sitio.zip")
    if os.path.exists(out):
        os.remove(out)
    r = subprocess.run(["zip", "-q", "-r", "-X", out, ".",
                        "-x", "*.DS_Store", "Thumbs.db", "*/Thumbs.db", "__preview__.html"],
                       cwd=a.base, capture_output=True, text=True)
    if r.returncode != 0:
        print("  !! zip fallo:", r.stderr[-400:]); return 1
    subprocess.run(["unzip", "-t", out], capture_output=True)
    print(f"  {out}  ({os.path.getsize(out)//1024//1024} MB)")
    return 0


CMDS = {"build": cmd_build, "gate": cmd_gate, "validate": cmd_validate,
        "preview": cmd_preview, "stats": cmd_stats, "package": cmd_package}


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=CMDS)
    ap.add_argument("--base", required=True, help="directorio de la web")
    ap.add_argument("--original", help="directorio de la web sin tocar (para gate)")
    ap.add_argument("--page", default="index.asp", help="pagina a previsualizar")
    ap.add_argument("--out", help="fichero de salida (captura o zip)")
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--height", type=int, default=1600)
    a = ap.parse_args()
    if not os.path.isdir(a.base):
        print("  !! --base no es un directorio:", a.base); return 2
    return CMDS[a.cmd](a) or 0


if __name__ == "__main__":
    sys.exit(main())
