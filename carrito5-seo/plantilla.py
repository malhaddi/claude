#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Plantilla HTML de carrito5.com.

Sitio estatico (no ASP, al contrario que abacosoftware). Se reconstruyen aqui
la cabecera, la barra de anuncios y el pie a partir de las tres paginas reales
del cliente, porque styles.css e index.css no venian en la auditoria: el CSS va
embebido para que las paginas se vean bien aunque falte la hoja externa.

Paleta tomada del CSS inline de sus paginas:
  #bd5883 rosa de marca   #a8436c rosa oscuro   #0f172a slate
  #38bdf8 azul acento     #25d366 verde WhatsApp
Tipografias: Outfit (titulares) e Inter (texto).
"""
import json

DOMINIO = "https://www.carrito5.com"
MARCA = "Carrito5"
TEL = "611 500 052"
WA = "https://wa.me/34611500052"
OG = DOMINIO + "/og_image_carrito5.jpg"


def esc(t):
    return (t.replace("&", "&amp;").replace('"', "&quot;")
             .replace("<", "&lt;").replace(">", "&gt;"))


def ld(obj):
    return ('<script type="application/ld+json">\n'
            + json.dumps(obj, ensure_ascii=False, indent=2) + "\n</script>\n")


def faq_ld(faqs):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}}
                           for q, a in faqs]}


def breadcrumb_ld(trail):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n,
                                 "item": DOMINIO + "/" + u.lstrip("/")}
                                for i, (n, u) in enumerate(trail)]}


CSS = """
:root{
  --c5-rosa:#bd5883; --c5-rosa-osc:#a8436c; --c5-slate:#0f172a; --c5-azul:#38bdf8;
  --c5-wa:#25d366; --c5-borde:#e2e8f0; --c5-fondo:#f8fafc; --c5-texto:#334155;
  --c5-suave:#64748b;
}
*{box-sizing:border-box}
body{margin:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
     color:var(--c5-texto);background:#fff;line-height:1.65;font-size:16px}
h1,h2,h3,h4{font-family:'Outfit','Inter',sans-serif;color:var(--c5-slate);margin:0;text-wrap:balance}
a{color:var(--c5-rosa-osc)}
img{max-width:100%;height:auto}
.c5-wrap{max-width:1200px;margin:0 auto;padding:0 20px}
.c5-prosa{max-width:760px}

.announcement-bar{background:var(--c5-rosa);color:#fff;height:40px;display:flex;align-items:center;
  overflow:hidden;font-size:.88rem;font-weight:600}
.announcement-bar .c5-wrap{display:flex;gap:14px;align-items:center;white-space:nowrap;overflow:hidden}
.ticker-separator{opacity:.6}

.main-header{position:sticky;top:0;z-index:900;background:#fff;border-bottom:1px solid var(--c5-borde);
  box-shadow:0 1px 3px rgba(15,23,42,.05)}
.header-container{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:12px 0}
.logo{font-family:'Outfit',sans-serif;font-weight:800;font-size:1.35rem;color:var(--c5-slate);
  text-decoration:none;letter-spacing:-.02em}
.logo span{color:var(--c5-rosa)}
.main-nav{display:flex;gap:20px;flex-wrap:wrap}
.main-nav a{color:var(--c5-slate);text-decoration:none;font-weight:600;font-size:.92rem}
.main-nav a:hover{color:var(--c5-rosa)}
.nav-download-btn{background:var(--c5-rosa);color:#fff !important;padding:10px 18px;border-radius:8px;
  text-decoration:none;font-weight:700;font-size:.9rem;white-space:nowrap}
.nav-download-btn:hover{background:var(--c5-rosa-osc)}

.c5-hero{background:linear-gradient(160deg,#1e1b4b 0%,var(--c5-slate) 60%);color:#e2e8f0;
  padding:46px 0 52px}
.c5-hero h1{color:#fff;font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.15;font-weight:800;margin-bottom:14px}
.c5-hero h1 em{font-style:normal;color:var(--c5-azul)}
.c5-hero p.sub{font-size:1.06rem;color:#cbd5e1;max-width:62ch;margin:0 0 22px}
.c5-migas{font-size:.82rem;color:#94a3b8;margin-bottom:16px}
.c5-migas a{color:#cbd5e1;text-decoration:none}
.c5-badge{display:inline-block;background:rgba(189,88,131,.18);border:1px solid rgba(189,88,131,.5);
  color:#f5d0e0;font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  padding:5px 12px;border-radius:20px;margin-bottom:14px}
.c5-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.c5-btn-main{background:var(--c5-rosa);color:#fff !important;padding:13px 24px;border-radius:9px;
  text-decoration:none;font-weight:700;font-size:1rem;display:inline-block}
.c5-btn-main:hover{background:var(--c5-rosa-osc)}
.c5-btn-wa{background:var(--c5-wa);color:#fff !important;padding:13px 22px;border-radius:9px;
  text-decoration:none;font-weight:700;font-size:1rem;display:inline-block}
.c5-puntos{display:flex;gap:20px;flex-wrap:wrap;font-size:.88rem;color:#cbd5e1}
.c5-puntos span::before{content:"\\2713";color:var(--c5-azul);font-weight:800;margin-right:6px}

.c5-seccion{padding:44px 0}
.c5-seccion.gris{background:var(--c5-fondo);border-top:1px solid var(--c5-borde);
  border-bottom:1px solid var(--c5-borde)}
.c5-seccion h2{font-size:1.55rem;font-weight:800;margin:30px 0 12px}
.c5-seccion h2:first-child{margin-top:0}
.c5-seccion p{margin:0 0 14px}
.c5-lista{list-style:none;padding:0;margin:16px 0}
.c5-lista li{padding:10px 0;border-bottom:1px solid var(--c5-borde);font-size:.96rem}
.c5-lista li::before{content:"\\2713";color:var(--c5-rosa);font-weight:800;margin-right:9px}

.c5-cols{display:grid;grid-template-columns:2fr 1fr;gap:34px;align-items:start}
@media(max-width:880px){.c5-cols{grid-template-columns:1fr}}
.c5-aside{background:var(--c5-fondo);border:1px solid var(--c5-borde);border-radius:12px;
  padding:22px;position:sticky;top:78px}
.c5-aside h3{font-size:1.05rem;font-weight:800;margin-bottom:8px}
.c5-aside p{font-size:.9rem;color:var(--c5-suave)}
.c5-aside .c5-btn-main,.c5-aside .c5-btn-wa{display:block;text-align:center;margin-bottom:9px;font-size:.95rem}

.c5-satellites-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}
.c5-satellite-card{display:block;padding:14px 16px;background:#fff;border:1px solid #cbd5e1;
  border-radius:9px;text-decoration:none;color:var(--c5-slate);font-weight:600;font-size:.9rem}
.c5-satellite-card:hover{border-color:var(--c5-rosa);box-shadow:0 2px 8px rgba(189,88,131,.12)}
.c5-satellite-card small{display:block;font-weight:400;color:var(--c5-suave);font-size:.8rem;margin-top:4px}

.c5-faq{border-bottom:1px solid var(--c5-borde);padding:16px 0}
.c5-faq h3{font-size:1.02rem;font-weight:700;margin-bottom:6px}
.c5-faq p{font-size:.95rem;margin:0;color:var(--c5-texto)}

.c5-cta-final{background:var(--c5-slate);color:#cbd5e1;padding:46px 0;text-align:center}
.c5-cta-final h2{color:#fff;font-size:1.5rem;margin-bottom:10px}
.c5-cta-final p{max-width:60ch;margin:0 auto 20px;color:#94a3b8}

footer{background:#fff;border-top:1px solid var(--c5-borde);padding:34px 0 28px;font-size:.87rem;
  color:var(--c5-suave)}
.c5-pie{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:22px}
.c5-pie h4{font-size:.82rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:9px;
  color:var(--c5-slate)}
.c5-pie ul{list-style:none;padding:0;margin:0;line-height:2}
.c5-pie a{color:var(--c5-suave);text-decoration:none}
.c5-pie a:hover{color:var(--c5-rosa)}
.c5-legal{border-top:1px solid var(--c5-borde);margin-top:22px;padding-top:16px;
  display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:.82rem}
"""

NAV = f"""<div class="announcement-bar">
  <div class="c5-wrap">
    <span><strong>Descarga gratis para Windows</strong></span>
    <span class="ticker-separator">&bull;</span>
    <span>Sin tarjeta y sin caducidad</span>
    <span class="ticker-separator">&bull;</span>
    <span>Adaptado a VeriFactu</span>
    <span class="ticker-separator">&bull;</span>
    <span>Atención: <strong>{TEL}</strong></span>
  </div>
</div>
<header class="main-header">
  <div class="c5-wrap header-container">
    <a href="index.html" class="logo">Carrito<span>5</span></a>
    <nav class="main-nav">
      <a href="sectores-y-negocios.html">Sectores</a>
      <a href="tallas-y-colores.html">Funciones</a>
      <a href="verifactu-gratis.html">VeriFactu</a>
      <a href="software-tpv-comercio-local.html">Comercio local</a>
    </nav>
    <a href="descargar-tpv-gratis.html" class="nav-download-btn">Descargar gratis</a>
  </div>
</header>
"""

PIE = f"""<footer>
  <div class="c5-wrap">
    <div class="c5-pie">
      <div>
        <h4>Carrito5 TPV</h4>
        <p>Software TPV gratuito para Windows. Descarga directa, sin tarjeta y con soporte en español.</p>
        <p><strong>{TEL}</strong></p>
      </div>
      <div>
        <h4>Producto</h4>
        <ul>
          <li><a href="descargar-tpv-gratis.html">Descargar gratis</a></li>
          <li><a href="tallas-y-colores.html">Tallas y colores</a></li>
          <li><a href="software-tpv-comercio-local.html">Para comercio local</a></li>
        </ul>
      </div>
      <div>
        <h4>Sectores</h4>
        <ul>
          <li><a href="sectores-y-negocios.html">Todos los sectores</a></li>
          <li><a href="tpv-tienda-ropa.html">Tiendas de ropa</a></li>
          <li><a href="tpv-zapateria.html">Zapaterías</a></li>
        </ul>
      </div>
      <div>
        <h4>VeriFactu</h4>
        <ul>
          <li><a href="verifactu-gratis.html">VeriFactu gratis</a></li>
          <li><a href="verifactu-entrada-en-vigor.html">Cuándo entra en vigor</a></li>
          <li><a href="verifactu-autonomos.html">Para autónomos</a></li>
        </ul>
      </div>
    </div>
    <div class="c5-legal">
      <div>&copy; 2026 Carrito5 &middot; Ábaco Infoelectrónica S.L.</div>
      <div>
        <a href="aviso-legal.html">Aviso legal</a> &middot;
        <a href="politica-de-privacidad.html">Privacidad</a> &middot;
        <a href="cookies.html">Cookies</a> &middot;
        <a href="condiciones-de-contratacion.html">Condiciones</a> &middot;
        <a href="terminos-de-uso.html">Términos</a>
      </div>
    </div>
  </div>
</footer>
"""


def bloques_html(bloques):
    out = []
    for t, ps, *extra in bloques:
        out.append(f"<h2>{t}</h2>")
        out += [f"<p>{p}</p>" for p in ps]
        if extra and extra[0]:
            out.append('<ul class="c5-lista">'
                       + "".join(f"<li>{x}</li>" for x in extra[0]) + "</ul>")
    return "\n".join(out)


def satelites_html(links, titulo="Sigue por aquí"):
    """links: [(texto, url)] o [(texto, url, descripcion)]."""
    if not links:
        return ""
    cards = []
    for entrada in links:
        t, u = entrada[0], entrada[1]
        d = entrada[2] if len(entrada) > 2 else ""
        cards.append(f'<a href="{u.lstrip("/")}" class="c5-satellite-card">{t}'
                     + (f"<small>{d}</small>" if d else "") + "</a>")
    return (f'<section class="c5-seccion gris"><div class="c5-wrap">'
            f'<h2>{titulo}</h2><div class="c5-satellites-grid">{"".join(cards)}</div>'
            f"</div></section>")


def faq_html(faqs, titulo):
    if not faqs:
        return ""
    items = "".join(f'<div class="c5-faq"><h3>{q}</h3><p>{a}</p></div>' for q, a in faqs)
    return (f'<section class="c5-seccion"><div class="c5-wrap c5-prosa">'
            f'<h2>{titulo}</h2>{items}</div></section>')


def pagina(fichero, title, description, keywords, h1, sub, badge, trail,
           bloques, faqs, faq_titulo, aside, satelites, cta, extra_ld=None):
    """Genera el HTML completo de una pagina de carrito5.com."""
    canon = f"{DOMINIO}/{fichero}"
    migas = " &rsaquo; ".join(
        [f'<a href="{u.lstrip("/") or "index.html"}">{n}</a>' for n, u in trail[:-1]]
        + [f"<span>{trail[-1][0]}</span>"])

    lds = ld(breadcrumb_ld(trail))
    if faqs:
        lds += ld(faq_ld(faqs))
    if extra_ld:
        lds += ld(extra_ld)

    aside_t, aside_p = aside
    cta_t, cta_p = cta

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
<meta name="keywords" content="{esc(keywords)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="{canon}">
<meta property="og:site_name" content="{MARCA} TPV">
<meta property="og:type" content="article">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{OG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(description)}">
<meta name="twitter:image" content="{OG}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<style>{CSS}</style>
{lds}</head>
<body>
{NAV}
<main>
<section class="c5-hero">
  <div class="c5-wrap">
    <div class="c5-migas">{migas}</div>
    <div class="c5-badge">{badge}</div>
    <h1>{h1}</h1>
    <p class="sub">{sub}</p>
    <div class="c5-ctas">
      <a href="descargar-tpv-gratis.html" class="c5-btn-main">Descargar gratis para Windows</a>
      <a href="{WA}" class="c5-btn-wa">WhatsApp {TEL}</a>
    </div>
    <div class="c5-puntos">
      <span>Sin tarjeta</span><span>Sin caducidad</span><span>Adaptado a VeriFactu</span>
    </div>
  </div>
</section>

<section class="c5-seccion">
  <div class="c5-wrap c5-cols">
    <div class="c5-prosa">
{bloques_html(bloques)}
    </div>
    <aside class="c5-aside">
      <h3>{aside_t}</h3>
      <p>{aside_p}</p>
      <a href="descargar-tpv-gratis.html" class="c5-btn-main">Descargar gratis</a>
      <a href="{WA}" class="c5-btn-wa">Preguntar por WhatsApp</a>
      <p style="margin:12px 0 0;font-size:.82rem">O llama al <strong>{TEL}</strong>. Te atiende una persona en España.</p>
    </aside>
  </div>
</section>

{satelites_html(satelites)}
{faq_html(faqs, faq_titulo)}

<section class="c5-cta-final">
  <div class="c5-wrap">
    <h2>{cta_t}</h2>
    <p>{cta_p}</p>
    <a href="descargar-tpv-gratis.html" class="c5-btn-main">Descargar Carrito5 gratis</a>
  </div>
</section>
</main>
{PIE}
</body>
</html>
"""
