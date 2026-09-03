#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Capa tecnica SEO para abacosoftware.com (ASP clasico).
Idempotente: puede ejecutarse varias veces sin duplicar etiquetas.
"""
import re, os, glob, json, sys

WEB = sys.argv[1] if len(sys.argv) > 1 else "site"
BASE = "https://www.abacosoftware.com"
OG_IMAGE = BASE + "/img/og-caja5-tpv.png"

NOT_PAGES = {
    "conexion.asp", "conexion_visitas.asp", "menu_nav.asp", "footer_comun.asp",
    "tpv_consultas_desde_web_med.asp", "tpv_consultas_desde_web_medNO.asp",
    "tpv_consultas_desde_web_med -09-10-2023.asp",
    "contenido_copyr-footer.html", "info_asp.aspx", "ventas.aspx",
}
MARK = "<!-- SEO-TECH -->"

stats = {k: 0 for k in ("files", "charset", "og", "breadcrumb", "org", "lazy",
                        "indexhtml", "h2fix", "faqtitle", "bom")}


def is_page(fn):
    b = os.path.basename(fn)
    return b not in NOT_PAGES and not b.endswith("_")


def read(p):
    raw = open(p, "rb").read()
    bom = raw.startswith(b"\xef\xbb\xbf")
    if bom:
        raw = raw[3:]
    return raw.decode("utf-8"), bom


def write(p, s):
    open(p, "wb").write(s.encode("utf-8"))


def first(pat, s, g=1, flags=re.S | re.I):
    m = re.search(pat, s, flags)
    return re.sub(r"\s+", " ", m.group(g)).strip() if m else ""


def esc(t):
    return (t.replace("&", "&amp;").replace('"', "&quot;")
             .replace("<", "&lt;").replace(">", "&gt;"))


# ------------------------------------------------------------------ 1. CHARSET
def fix_charset(s):
    """Solo fijamos la cabecera HTTP Content-Type charset.

    NO tocamos Response.CodePage ni @CODEPAGE: los .asp estan guardados en UTF-8
    pero ASP los lee con la codepage ANSI del servidor (1252). Ese round-trip es
    hoy byte-a-byte lossless, asi que los bytes que salen ya son UTF-8 validos.
    Poner Response.CodePage=65001 sin @CODEPAGE=65001 provocaria DOBLE
    codificacion y rompería todos los acentos. Etiquetar la cabecera es seguro.
    """
    if "Response.CharSet" in s:
        return s, False
    m = re.search(r"<!--#include|<!DOCTYPE", s, re.I)
    if not m:
        return s, False
    block = '<%\r\nResponse.CharSet = "utf-8"\r\n%>\r\n'
    return s[:m.start()] + block + s[m.start():], True


# --------------------------------------------------------- 2. OPENGRAPH/TWITTER
def add_og(s, title, desc, canon):
    if "og:title" in s:
        return s, False
    m = re.search(r"</head>", s, re.I)
    if not m or not title:
        return s, False
    og = f"""
	{MARK}
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="Ábaco Software">
	<meta property="og:locale" content="es_ES">
	<meta property="og:title" content="{esc(title)}">
	<meta property="og:description" content="{esc(desc)}">
	<meta property="og:url" content="{esc(canon)}">
	<meta property="og:image" content="{OG_IMAGE}">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:image:alt" content="Caja 5, software TPV homologado VeriFactu de Ábaco Software">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="{esc(title)}">
	<meta name="twitter:description" content="{esc(desc)}">
	<meta name="twitter:image" content="{OG_IMAGE}">
	<meta name="author" content="Ábaco Software">
	<meta name="geo.region" content="ES-J">
	<meta name="geo.placename" content="Jaén">
"""
    return s[:m.start()] + og + s[m.start():], True


# ----------------------------------------------------------- 3. BREADCRUMBLIST
def build_breadcrumb(s, fn, title):
    if "BreadcrumbList" in s:
        return s, False
    base_name = os.path.basename(fn)
    if base_name in ("index.asp", "index.html"):
        return s, False

    items = [("Inicio", BASE + "/")]
    leaf = ""
    m = re.search(r'class="sector-breadcrumb">(.*?)</div>', s, re.S)
    if m:
        frag = m.group(1)
        for a in re.finditer(r'<a href="([^"]+)"[^>]*>(.*?)</a>', frag, re.S):
            href = a.group(1)
            txt = re.sub(r"<[^>]+>", "", a.group(2)).strip()
            if not txt or txt.lower() == "inicio":
                continue
            items.append((txt, BASE + "/" + href.lstrip("/")))
        last = re.search(r"<span>(.*?)</span>", frag, re.S)
        if last:
            leaf = re.sub(r"<[^>]+>", "", last.group(1)).strip()
    elif base_name.startswith("negocio_"):
        items.append(("Sectores y negocios", BASE + "/tpv_negocios.asp"))

    if not leaf:
        leaf = re.split(r"\s*\|\s*", title)[0].strip() or base_name
    items.append((leaf, BASE + "/" + base_name))

    ld = {"@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [{"@type": "ListItem", "position": i + 1,
                               "name": n, "item": u}
                              for i, (n, u) in enumerate(items)]}
    blob = ('\n\t<!-- Breadcrumb estructurado -->\n\t<script type="application/ld+json">\n\t'
            + json.dumps(ld, ensure_ascii=False, indent=2).replace("\n", "\n\t")
            + "\n\t</script>\n")
    h = re.search(r"</head>", s, re.I)
    return (s[:h.start()] + blob + s[h.start():], True) if h else (s, False)


# ------------------------------------------------------------- 4. ORGANIZATION
ORG_LD = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": BASE + "/#organization",
    "name": "Ábaco Software",
    "alternateName": "Caja 5 TPV",
    "url": BASE + "/",
    "logo": {"@type": "ImageObject", "url": BASE + "/Logos/Logo_6-2015TransPeque.png"},
    "image": OG_IMAGE,
    "description": ("Fabricante español de software TPV para comercio minorista. Caja 5, "
                    "programa de punto de venta homologado VeriFactu, en licencia de pago "
                    "único para PC o en modalidad nube."),
    "telephone": "+34953050112",
    "email": "info@abacosoftware.com",
    "address": {"@type": "PostalAddress", "addressCountry": "ES",
                "addressRegion": "Jaén", "addressLocality": "Jaén"},
    "areaServed": {"@type": "Country", "name": "España"},
    "knowsLanguage": "es-ES",
}


def add_org(s, fn):
    if "#organization" in s:
        return s, False
    if os.path.basename(fn) not in ("index.asp", "index.html", "que_nos_diferencia.asp"):
        return s, False
    blob = ('\n\t<script type="application/ld+json">\n\t'
            + json.dumps(ORG_LD, ensure_ascii=False, indent=2).replace("\n", "\n\t")
            + "\n\t</script>\n")
    h = re.search(r"</head>", s, re.I)
    return (s[:h.start()] + blob + s[h.start():], True) if h else (s, False)


# --------------------------------------------------------------- 5. LAZY IMAGES
def add_lazy(s):
    """Lazy-load salvo logo y primeras imagenes (candidatas a LCP)."""
    n = 0
    out, last, seen = [], 0, 0
    for m in re.finditer(r"<img\b[^>]*>", s, re.I):
        tag = m.group(0)
        out.append(s[last:m.start()])
        last = m.end()
        seen += 1
        skip = ("loading=" in tag.lower() or "logo" in tag.lower()
                or "cabecera" in tag.lower() or seen <= 2)
        if skip:
            out.append(tag)
        else:
            new = tag[:-1].rstrip()
            if new.endswith("/"):
                new = new[:-1].rstrip()
            out.append(new + ' loading="lazy" decoding="async">')
            n += 1
    out.append(s[last:])
    return "".join(out), n


# ------------------------------------------------ 6. /index.html -> / (canonico)
def fix_index_links(s):
    n = s.count('href="/index.html"') + s.count('href="index.html"')
    s = s.replace('href="/index.html"', 'href="/"').replace('href="index.html"', 'href="/"')
    return s, n


# --------------------------------------------- 7. JERARQUIA ENCABEZADOS h3 -> h2
def fix_headings(s):
    """En las paginas 'editorial' el primer bloque salta de H1 a H3."""
    if 'class="seccion-editorial"' not in s:
        return s, 0
    i = s.find('class="seccion-editorial"')
    m = re.compile(r"<h3(\s[^>]*)?>(.*?)</h3>", re.S).search(s, i)
    if not m:
        return s, 0
    attrs = m.group(1) or ""
    if "style" in attrs:
        return s, 0
    return s[:m.start()] + f"<h2{attrs}>{m.group(2)}</h2>" + s[m.end():], 1


# ---------------------------------------- 8. TITULO FAQ DUPLICADO (bug de texto)
def fix_faq_title(s):
    before = s
    s = s.replace("Software TPV para Software TPV para ", "Software TPV para ")
    s = s.replace("Software TPV para el Software TPV para ", "Software TPV para ")
    return s, int(before != s)


def main():
    files = sorted(glob.glob(os.path.join(WEB, "*.asp"))
                   + glob.glob(os.path.join(WEB, "*.html")))
    for fn in files:
        if not is_page(fn):
            continue
        try:
            s, bom = read(fn)
        except UnicodeDecodeError:
            print("  !! no UTF-8:", fn)
            continue
        orig = s
        stats["bom"] += bom

        title = first(r"<title>(.*?)</title>", s)
        desc = first(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', s)
        canon = first(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', s) \
            or BASE + "/" + os.path.basename(fn)

        if fn.endswith(".asp"):
            s, ok = fix_charset(s); stats["charset"] += ok
        s, ok = add_og(s, title, desc, canon);      stats["og"] += ok
        s, ok = build_breadcrumb(s, fn, title);     stats["breadcrumb"] += ok
        s, ok = add_org(s, fn);                     stats["org"] += ok
        s, n = add_lazy(s);                         stats["lazy"] += n
        s, n = fix_index_links(s);                  stats["indexhtml"] += n
        s, n = fix_headings(s);                     stats["h2fix"] += n
        s, n = fix_faq_title(s);                    stats["faqtitle"] += n

        if s != orig or bom:
            write(fn, s)
            stats["files"] += 1

    print(json.dumps(stats, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
