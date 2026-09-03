#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Plantilla ASP nativa para las nuevas paginas SEO de abacosoftware.com.

Reutiliza el CSS y los includes existentes (menu_nav.asp, css/abaco-moderno.css)
para que las paginas nuevas sean indistinguibles de las actuales.
"""
import json, re

BASE = "https://www.abacosoftware.com"
OG_IMAGE = BASE + "/img/og-caja5-tpv.png"


def esc(t):
    return (t.replace("&", "&amp;").replace('"', "&quot;")
             .replace("<", "&lt;").replace(">", "&gt;"))


def ld(obj):
    return ('\t<script type="application/ld+json">\n\t'
            + json.dumps(obj, ensure_ascii=False, indent=2).replace("\n", "\n\t")
            + "\n\t</script>\n")


def faq_ld(faqs):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}}
                           for q, a in faqs]}


def breadcrumb_ld(trail):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1,
                                 "name": n, "item": BASE + u}
                                for i, (n, u) in enumerate(trail)]}


FOOTER = """	<footer>
		<div class="container" style="padding: 40px 0 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
			<div class="row">
				<div class="col-md-4 col-sm-6" style="margin-bottom: 20px;">
					<img src="/Logos/Logo_6-2015TransPeque.png" alt="Ábaco Software" style="max-height: 40px; margin-bottom: 12px;" loading="lazy" decoding="async">
					<p>Soluciones de software TPV y comercio electrónico para el pequeño comercio en España desde hace más de 28 años.</p>
					<p><i class="fa-solid fa-phone" style="color: #8c2d19;"></i> <strong>953 050 112 (Ventas)</strong></p>
				</div>
				<div class="col-md-3 col-sm-6" style="margin-bottom: 20px;">
					<h5 style="font-weight: 800; color: #1e293b; margin-bottom: 12px;">Producto</h5>
					<ul style="list-style: none; padding: 0; line-height: 2;">
						<li><a href="/caja5_pc.asp" style="color: #64748b;">Caja 5 para PC</a></li>
						<li><a href="/caja5_nube.asp" style="color: #64748b;">Caja 5 Nube</a></li>
						<li><a href="/comparativa_tpv_nube.asp" style="color: #64748b;">Comparativa PC vs Nube</a></li>
						<li><a href="/pack-tpv-completo-comercio.asp" style="color: #64748b;">Pack TPV completo</a></li>
					</ul>
				</div>
				<div class="col-md-3 col-sm-6" style="margin-bottom: 20px;">
					<h5 style="font-weight: 800; color: #1e293b; margin-bottom: 12px;">Recursos</h5>
					<ul style="list-style: none; padding: 0; line-height: 2;">
						<li><a href="/tpv_negocios.asp" style="color: #64748b;">TPV por sector</a></li>
						<li><a href="/funciones-tpv.asp" style="color: #64748b;">Funciones del TPV</a></li>
						<li><a href="/comparativas-tpv.asp" style="color: #64748b;">Comparativas</a></li>
						<li><a href="/preguntas-frecuentes-tpv.asp" style="color: #64748b;">Preguntas frecuentes</a></li>
						<li><a href="/verifactu-tpv.asp" style="color: #64748b;">VeriFactu</a></li>
					</ul>
				</div>
				<div class="col-md-2 col-sm-6" style="margin-bottom: 20px;">
					<h5 style="font-weight: 800; color: #1e293b; margin-bottom: 12px;">Empresa</h5>
					<ul style="list-style: none; padding: 0; line-height: 2;">
						<li><a href="/que_nos_diferencia.asp" style="color: #64748b;">Qué nos diferencia</a></li>
						<li><a href="/descargar.asp" style="color: #64748b;">Contacto</a></li>
					</ul>
				</div>
			</div>
			<div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
				<div>&copy; 2026 Ábaco Software / Ábaco Infoelectrónica S.L. Todos los derechos reservados.</div>
				<div>
					<a href="/terminos_uso.asp" style="color: #64748b; margin-right: 15px;">Términos de uso</a>
					<a href="/condiciones.asp" style="color: #64748b; margin-right: 15px;">Condiciones</a>
					<a href="/aviso_legal.asp" style="color: #64748b; margin-right: 15px;">Aviso legal</a>
					<a href="/politica_privacidad.asp" style="color: #64748b; margin-right: 15px;">Privacidad</a>
					<a href="/politica_cookies.asp" style="color: #64748b;">Cookies</a>
				</div>
			</div>
		</div>
	</footer>
"""


def faq_block(faqs, titulo):
    """Acordeon FAQ visible (el schema va aparte en el head)."""
    items = []
    for i, (q, a) in enumerate(faqs):
        items.append(f"""
				<div class="panel panel-default" style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:10px; box-shadow:none;">
					<div class="panel-heading" role="tab" style="background:#f8fafc; border-radius:8px;">
						<h3 class="panel-title" style="font-size:16px; font-weight:700; margin:0;">
							<a role="button" data-toggle="collapse" data-parent="#faqAcc" href="#faq{i}" aria-expanded="{'true' if i == 0 else 'false'}" style="color:#1e293b; text-decoration:none; display:block; padding:6px 0;">
								<i class="fa-solid fa-circle-question" style="color:#8c2d19; margin-right:8px;"></i>{q}
							</a>
						</h3>
					</div>
					<div id="faq{i}" class="panel-collapse collapse{' in' if i == 0 else ''}" role="tabpanel">
						<div class="panel-body" style="font-size:14.5px; line-height:1.75; color:#3f3f46; border-top:1px solid #e2e8f0;">{a}</div>
					</div>
				</div>""")
    return f"""
	<section style="padding:55px 0 65px; background:#f4efe6; border-top:2px solid #e4dfd5; border-bottom:2px solid #e4dfd5;">
		<div class="container">
			<h2 style="font-size:28px; font-weight:800; color:#1e293b; margin-top:0; margin-bottom:26px;">{titulo}</h2>
			<div class="panel-group" id="faqAcc" role="tablist">{''.join(items)}
			</div>
		</div>
	</section>
"""


def cta_block(titulo, texto):
    return f"""
	<section class="cta-final-abaco" style="padding:55px 0; background:#18181b; color:#e4e4e7;">
		<div class="container text-center">
			<h2 style="color:#ffffff; font-size:27px; font-weight:800; margin-top:0;">{titulo}</h2>
			<p style="font-size:16px; max-width:720px; margin:14px auto 26px; color:#a1a1aa;">{texto}</p>
			<a href="descargar.asp?origen=descargas&amp;link=www.abacosoftware.com/eutpv.exe" class="btn-hero-primary" style="margin-right:10px;"><i class="fa-solid fa-download"></i> Descargar demo gratis</a>
			<a href="/caja5_pc.asp" class="btn-hero-secondary"><i class="fa-solid fa-cart-shopping"></i> Ver licencia 333 €</a>
			<p style="margin-top:18px; font-size:13.5px; color:#71717a;">O llámanos al <strong style="color:#e4e4e7;">953 050 112</strong> — te atiende una persona, no un bot.</p>
		</div>
	</section>
"""


def relacionados(links, titulo="Sigue leyendo"):
    lis = "".join(
        f'\n\t\t\t\t<li style="padding:9px 0; border-bottom:1px solid #e9e4db;">'
        f'<a href="{u}" style="color:#8c2d19; font-weight:600; text-decoration:none;">'
        f'<i class="fa-solid fa-angle-right" style="margin-right:7px;"></i>{t}</a></li>'
        for t, u in links)
    return f"""
	<section style="padding:45px 0; background:#ffffff;">
		<div class="container">
			<h2 style="font-size:22px; font-weight:800; color:#1e293b; margin-top:0; margin-bottom:14px;">{titulo}</h2>
			<ul style="list-style:none; padding:0; margin:0; column-count:2; column-gap:36px;">{lis}
			</ul>
		</div>
	</section>
"""


def pagina(fichero, title, description, keywords, h1, subtitulo, badge,
           trail, cuerpo, faqs, faq_titulo, cta, links, extra_ld=None):
    """Genera el .asp completo."""
    canon = f"{BASE}/{fichero}"
    crumb_html = " &gt; ".join(
        [f'<a href="{u}">{n}</a>' for n, u in trail[:-1]] + [f"<span>{trail[-1][0]}</span>"])

    lds = ld(breadcrumb_ld(trail))
    if faqs:
        lds += ld(faq_ld(faqs))
    if extra_ld:
        lds += ld(extra_ld)

    return f"""<%
Response.CharSet = "utf-8"
%>
<!--#include virtual="/conexion_visitas.asp"-->
<%
On Error Resume Next
IPx=Request.ServerVariables("REMOTE_ADDR")
NombrePagina="{fichero}"
FechaFiltro=Month(Date()) & "/" & Day(Date()) & "/" & Year(Date())
Set RowV=Cnx2.Execute("Select * From Visitas Where IP='"&IPx&"' And Fecha=#"& FechaFiltro &"# And Pagina='"& NombrePagina &"'")
If RowV.Eof=True Then
	Set SQLAdd=Cnx2.Execute("Insert INTO Visitas (IP, Pagina) Values ('"& IPx &"','"& NombrePagina & "')")
End If
%>
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="canonical" href="{canon}">
	<title>{esc(title)}</title>
	<meta name="description" content="{esc(description)}">
	<meta name="keywords" content="{esc(keywords)}">

{lds}
	<!-- CSS Core Bootstrap & Icons & Fonts -->
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
	<link href="css/abaco-moderno.css" rel="stylesheet">

	<!-- jQuery & Bootstrap Scripts -->
	<script src="js/jquery-1.11.3.min.js"></script>
	<script src="js/bootstrap.min.js"></script>

	<meta property="og:type" content="article">
	<meta property="og:site_name" content="Ábaco Software">
	<meta property="og:locale" content="es_ES">
	<meta property="og:title" content="{esc(title)}">
	<meta property="og:description" content="{esc(description)}">
	<meta property="og:url" content="{canon}">
	<meta property="og:image" content="{OG_IMAGE}">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="{esc(title)}">
	<meta name="twitter:description" content="{esc(description)}">
	<meta name="twitter:image" content="{OG_IMAGE}">
	<meta name="author" content="Ábaco Software">
	<meta name="geo.region" content="ES-J">
	<meta name="geo.placename" content="Jaén">
</head>
<body lang="es">

	<!-- CABECERA Y NAVEGACION -->
	<div id="menu-contenedor">
		<!--#include virtual="/menu_nav.asp"-->
	</div>
	<script>
		if ($("#menu-contenedor").children().length === 0) {{ $("#menu-contenedor").load("menu_nav.asp"); }}
	</script>

	<main>
		<section class="sector-hero-banner">
			<div class="container">
				<div class="sector-breadcrumb">{crumb_html}</div>
				<div class="row align-items-center" style="margin-top:18px;">
					<div class="col-md-9">
						<div class="sector-badge">{badge}</div>
						<h1 class="hero-titulo">{h1}</h1>
						<p class="hero-subtitulo">{subtitulo}</p>
						<div class="hero-ctas">
							<a href="descargar.asp?origen=descargas&amp;link=www.abacosoftware.com/eutpv.exe" class="btn-hero-primary"><i class="fa-solid fa-download"></i> Descargar demo gratis</a>
							<a href="/caja5_pc.asp" class="btn-hero-secondary"><i class="fa-solid fa-cart-shopping"></i> Licencia 333 €</a>
							<a href="tel:953050112" class="btn-hero-secondary hidden-xs"><i class="fa-solid fa-phone"></i> 953 050 112</a>
						</div>
						<div class="hero-puntos-clave">
							<span><i class="fa-solid fa-check"></i> Pago único, sin cuotas obligatorias</span>
							<span><i class="fa-solid fa-check"></i> Homologado VeriFactu</span>
							<span><i class="fa-solid fa-check"></i> Soporte telefónico en español</span>
						</div>
					</div>
				</div>
			</div>
		</section>

{cuerpo}
{faq_block(faqs, faq_titulo) if faqs else ""}
{relacionados(links)}
{cta_block(*cta)}
	</main>

{FOOTER}
</body>
</html>
"""
