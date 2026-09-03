#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Malla de enlazado interno, sitemap y redirecciones 301."""
import re, os, sys, glob, datetime, json

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"
BASE = "https://www.abacosoftware.com"
HOY = datetime.date.today().isoformat()

NUEVOS_HUBS = [
    ("/funciones-tpv.asp", "Funciones del TPV", "fa-list-check",
     "Matriz de tallas, stock, fidelización, vales y rebajas"),
    ("/comparativas-tpv.asp", "Comparativas de TPV", "fa-scale-balanced",
     "Caja 5 frente a Stockagile, Glop, SimplyGest, Square…"),
    ("/hardware-tpv-compatible.asp", "Hardware compatible", "fa-plug",
     "Impresora, lector, cajón y equipo: qué comprar"),
    ("/preguntas-frecuentes-tpv.asp", "Preguntas frecuentes", "fa-circle-question",
     "Precio, VeriFactu, migración y soporte sin marketing"),
]

# Enlaces contextuales: sector -> paginas de funcion relevantes
POR_SECTOR = {
    "moda": ["matriz-tallas-y-colores", "rebajas-y-promociones-tpv", "vales-y-tarjetas-regalo-tpv"],
    "calzado": ["matriz-tallas-y-colores", "control-de-stock-multialmacen"],
    "joyeria": ["etiquetas-codigo-de-barras-tpv", "inventario-con-pda-lector-codigo-barras"],
    "perfumeria": ["programa-fidelizacion-puntos", "gestion-de-proveedores-y-pedidos"],
    "cosmetica": ["gestion-de-proveedores-y-pedidos", "control-de-stock-multialmacen"],
    "telefonia": ["arqueo-de-caja-cierre-diario", "control-de-stock-multialmacen"],
    "reparaciones": ["arqueo-de-caja-cierre-diario", "gestion-de-proveedores-y-pedidos"],
    "muebles": ["gestion-de-proveedores-y-pedidos", "control-de-stock-multialmacen"],
    "colchoneria": ["gestion-de-proveedores-y-pedidos", "arqueo-de-caja-cierre-diario"],
    "decoracion": ["rebajas-y-promociones-tpv", "vales-y-tarjetas-regalo-tpv"],
    "complementos": ["etiquetas-codigo-de-barras-tpv", "rebajas-y-promociones-tpv"],
}
GENERICO = ["matriz-tallas-y-colores", "control-de-stock-multialmacen",
            "etiquetas-codigo-de-barras-tpv", "tpv-sin-internet-modo-offline"]

TITULOS = {
    "matriz-tallas-y-colores": "Matriz de tallas y colores",
    "control-de-stock-multialmacen": "Control de stock multialmacén",
    "programa-fidelizacion-puntos": "Programa de puntos y fidelización",
    "tpv-sin-internet-modo-offline": "TPV que funciona sin internet",
    "etiquetas-codigo-de-barras-tpv": "Etiquetas con código de barras",
    "inventario-con-pda-lector-codigo-barras": "Inventario con PDA o lector",
    "vales-y-tarjetas-regalo-tpv": "Vales y tarjetas regalo",
    "rebajas-y-promociones-tpv": "Rebajas y promociones",
    "arqueo-de-caja-cierre-diario": "Arqueo de caja y cierre diario",
    "gestion-de-proveedores-y-pedidos": "Proveedores y pedidos de compra",
}

NO_INDEX = {
    "conexion.asp", "conexion_visitas.asp", "menu_nav.asp", "footer_comun.asp",
    "tpv_consultas_desde_web_med.asp", "tpv_consultas_desde_web_medNO.asp",
    "tpv_consultas_desde_web_med -09-10-2023.asp", "vercarrito.asp", "carrito5.asp",
    "descargar.asp", "comprar_tpv.asp", "recuento5.asp", "negocio_antiguedad.asp",
    "resolucion_litigios.asp", "index.html", "Condiciones.htm",
}
PRIORIDAD = {
    "index.asp": ("1.0", "daily"), "caja5_pc.asp": ("0.9", "weekly"),
    "caja5_nube.asp": ("0.9", "weekly"), "tpv_negocios.asp": ("0.9", "weekly"),
    "verifactu-tpv.asp": ("0.9", "weekly"), "comparativas-tpv.asp": ("0.9", "weekly"),
    "funciones-tpv.asp": ("0.9", "weekly"), "preguntas-frecuentes-tpv.asp": ("0.8", "weekly"),
    "hardware-tpv-compatible.asp": ("0.8", "weekly"),
}


def leer(p):
    return open(p, encoding="utf-8").read()


def escribir(p, s):
    open(p, "w", encoding="utf-8").write(s)


# ------------------------------------------------- 1. menu: nuevos hubs
def menu():
    p = os.path.join(OUT, "menu_nav.asp")
    s = leer(p)
    if "funciones-tpv.asp" in s:
        return 0
    items = "".join(f"""
								<a href="{u}" class="mega-item">
									<div class="mega-item-icon"><i class="fa-solid {ic}"></i></div>
									<div class="mega-item-text">
										<strong>{t}</strong>
										<small>{d}</small>
									</div>
								</a>""" for u, t, ic, d in NUEVOS_HUBS)
    bloque = f"""
							<div class="dropdown-header">RECURSOS Y COMPARATIVAS</div>{items}
"""
    # insertar en la segunda columna del mega-menu de guias
    m = re.search(r'(<div class="dropdown-header">EQUIPAMIENTO Y GUÍAS RETAIL</div>)', s)
    if not m:
        return 0
    s = s[:m.start()] + bloque + "\n\t\t\t\t\t\t\t" + s[m.start():]
    escribir(p, s)
    return 1


# --------------------------------- 2. hub de sectores: recuperar huerfanas
def hub_sectores():
    p = os.path.join(OUT, "tpv_negocios.asp")
    s = leer(p)
    todas = {os.path.basename(f) for f in glob.glob(os.path.join(OUT, "negocio_*.asp"))}
    todas.discard("negocio_antiguedad.asp")          # duplicado canonicalizado
    enlazadas = set(re.findall(r"negocio_[a-z_]+\.asp", s))
    faltan = sorted(todas - enlazadas)
    if not faltan:
        return 0

    def bonito(fn):
        t = fn.replace("negocio_", "").replace(".asp", "").replace("_", " ")
        return t[:1].upper() + t[1:]

    cards = "".join(f"""
					<a href="/{fn}" class="card-sector-editorial" data-keywords="{bonito(fn).lower()}">
						<div>
							<div class="card-header-sector">
								<div class="card-icon-box"><i class="fa-solid fa-store"></i></div>
								<div><h4 class="card-title-sector">{bonito(fn)}</h4></div>
							</div>
						</div>
					</a>""" for fn in faltan)

    bloque = f"""
			<!-- GRUPO: OTROS SECTORES ESPECIALIZADOS -->
			<div class="categoria-bloque" data-category="cat-otros">
				<div class="categoria-titulo-editorial">
					<span>Otros sectores y especialidades</span>
					<small>[ {len(faltan)} ESPECIALIDADES ]</small>
				</div>
				<div class="grid-sectores-editorial">{cards}
				</div>
			</div>
"""
    m = None
    for m in re.finditer(r'</div>\s*</div>\s*</section>', s):
        pass  # nos quedamos con la ultima
    if not m:
        return 0
    s = s[:m.start()] + bloque + "\n\t\t" + s[m.start():]
    escribir(p, s)
    return len(faltan)


# ----------------------------- 3. enlaces contextuales sector -> funciones
def enlaces_contextuales():
    n = 0
    for f in sorted(glob.glob(os.path.join(OUT, "negocio_*.asp"))):
        s = leer(f)
        if "bloque-funciones-rel" in s:
            continue
        base = os.path.basename(f)
        clave = next((k for k in POR_SECTOR if k in base), None)
        slugs = POR_SECTOR.get(clave, GENERICO)[:3]
        if len(slugs) < 3:
            slugs = slugs + [g for g in GENERICO if g not in slugs][:3 - len(slugs)]
        lis = "".join(
            f'\n\t\t\t\t\t<li style="padding:9px 0; border-bottom:1px solid #e9e4db;">'
            f'<a href="/{sl}.asp" style="color:#8c2d19; font-weight:600; text-decoration:none;">'
            f'<i class="fa-solid fa-angle-right" style="margin-right:7px;"></i>{TITULOS[sl]}</a></li>'
            for sl in slugs)
        bloque = f"""
	<section class="bloque-funciones-rel" style="padding:40px 0; background:#faf8f4; border-top:1px solid #e9e4db;">
		<div class="container">
			<h2 style="font-size:22px; font-weight:800; color:#1e293b; margin-top:0; margin-bottom:12px;">Funciones del TPV que más se usan en este sector</h2>
			<ul style="list-style:none; padding:0; margin:0; column-count:2; column-gap:34px;">{lis}
				<li style="padding:9px 0; border-bottom:1px solid #e9e4db;"><a href="/comparativas-tpv.asp" style="color:#8c2d19; font-weight:600; text-decoration:none;"><i class="fa-solid fa-angle-right" style="margin-right:7px;"></i>Comparativas con otros TPV</a></li>
				<li style="padding:9px 0; border-bottom:1px solid #e9e4db;"><a href="/preguntas-frecuentes-tpv.asp" style="color:#8c2d19; font-weight:600; text-decoration:none;"><i class="fa-solid fa-angle-right" style="margin-right:7px;"></i>Preguntas frecuentes sobre TPV</a></li>
			</ul>
		</div>
	</section>
"""
        i = s.find('<section class="cta-final-abaco"')
        if i < 0:
            i = s.find("<footer")
        if i < 0:
            continue
        escribir(f, s[:i] + bloque + "\n\t" + s[i:])
        n += 1
    return n


# ------------------------------------------------------------- 4. sitemap
def sitemap():
    urls = []
    for f in sorted(glob.glob(os.path.join(OUT, "*.asp"))):
        b = os.path.basename(f)
        if b in NO_INDEX or b.startswith(("conexion", "index__")):
            continue
        s = leer(f)
        if re.search(r'<meta[^>]+name="robots"[^>]+noindex', s, re.I):
            continue
        # respetar canonical hacia otra pagina
        m = re.search(r'<link rel="canonical" href="([^"]+)"', s)
        if m and not m.group(1).rstrip("/").endswith(b) and m.group(1).rstrip("/") != BASE:
            continue
        pri, chg = PRIORIDAD.get(b, ("0.7", "monthly"))
        loc = BASE + "/" if b == "index.asp" else BASE + "/" + b
        urls.append((loc, pri, chg))

    cuerpo = "".join(
        f"\n  <url>\n    <loc>{u}</loc>\n    <lastmod>{HOY}</lastmod>"
        f"\n    <changefreq>{c}</changefreq>\n    <priority>{p}</priority>\n  </url>"
        for u, p, c in urls)
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
           + cuerpo + "\n</urlset>\n")
    escribir(os.path.join(OUT, "sitemap.xml"), xml)
    for extra in ("sitemap2.xml", "sitemapMALO.xml"):
        q = os.path.join(OUT, extra)
        if os.path.exists(q):
            os.remove(q)
    return len(urls)


# --------------------------------------------------------- 5. web.config 301
def redirecciones():
    p = os.path.join(OUT, "web.config")
    s = leer(p)
    if "Redirect index.html" in s:
        return 0
    reglas = """
                <rule name="Redirect index.html a raiz" stopProcessing="true">
                    <match url="^index\\.html$" />
                    <action type="Redirect" url="/" redirectType="Permanent" />
                </rule>
                <rule name="Redirect negocio_antiguedad duplicado" stopProcessing="true">
                    <match url="^negocio_antiguedad\\.asp$" />
                    <action type="Redirect" url="/negocio_antiguedades.asp" redirectType="Permanent" />
                </rule>"""
    s = s.replace("            <rules>", "            <rules>" + reglas, 1)
    escribir(p, s)
    return 2


if __name__ == "__main__":
    print("menu (hubs nuevos)      :", menu())
    print("huerfanas recuperadas   :", hub_sectores())
    print("paginas con enlaces ctx :", enlaces_contextuales())
    print("URLs en sitemap         :", sitemap())
    print("redirecciones 301       :", redirecciones())
