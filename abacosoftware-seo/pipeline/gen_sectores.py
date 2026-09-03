#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera las paginas de sector a partir de la base de hechos.

La maqueta es comun (como en cualquier web); el contenido de cada pagina viene
escrito para su sector y no se comparte entre paginas.
"""
import os, sys, importlib
import plantilla as P

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"
MODULOS = sys.argv[2:] or ["sectores_1"]


def bloque_html(titulo, parrafos, lista=None):
    ps = "".join(f'\n\t\t\t\t\t<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">{p}</p>'
                 for p in parrafos)
    li = ""
    if lista:
        li = ('\n\t\t\t\t\t<ul style="list-style:none; padding:0; margin:18px 0;">' + "".join(
            f'\n\t\t\t\t\t\t<li style="padding:10px 0; border-bottom:1px solid #f0ebe2; font-size:14.6px; line-height:1.65;">'
            f'<i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i>{x}</li>'
            for x in lista) + "\n\t\t\t\t\t</ul>")
    return (f'\n\t\t\t\t\t<h2 style="font-size:25px; font-weight:800; color:#1e293b; '
            f'margin-top:34px;">{titulo}</h2>{ps}{li}')


def cuerpo(d):
    bl = "".join(bloque_html(t, ps, (extra[0] if extra else None))
                 for t, ps, *extra in d["bloques"])
    return f"""
	<section style="padding:48px 0 40px; background:#ffffff;">
		<div class="container">
			<div class="row">
				<div class="col-md-8">{bl}
				</div>
				<div class="col-md-4">
					<div style="background:#faf8f4; border:1.5px solid #e4dfd5; border-radius:10px; padding:24px; position:sticky; top:20px;">
						<h3 style="font-size:18px; font-weight:800; color:#1e293b; margin-top:0;">Pruébalo con tu catálogo</h3>
						<p style="font-size:14px; line-height:1.7; color:#52525b;">La demo es completa y no pide tarjeta. Mete veinte referencias reales de tu tienda y comprueba si te encaja antes de pagar nada.</p>
						<a href="descargar.asp?origen=descargas&amp;link=www.abacosoftware.com/eutpv.exe" class="btn-hero-primary" style="display:block; text-align:center; margin-bottom:10px;"><i class="fa-solid fa-download"></i> Descargar demo</a>
						<a href="https://wa.me/34611500052?text=Hola,%20pregunto%20por%20el%20TPV%20para%20mi%20tienda" style="display:block; text-align:center; background:#ffffff; color:#8c2d19; border:2px solid #8c2d19; border-radius:6px; font-weight:700; font-size:15px; padding:11px 18px; text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> Preguntar por WhatsApp</a>
						<hr style="border-color:#e4dfd5; margin:18px 0;">
						<p style="font-size:13px; color:#71717a; margin:0;"><strong>333 € pago único</strong> para PC, sin cuota obligatoria ni comisión por venta. O llámanos al <strong>953 050 112</strong>.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
"""


def main():
    total = 0
    for mod in MODULOS:
        m = importlib.import_module(mod)
        data = None
        for attr in dir(m):
            if attr.startswith("SECTORES"):
                data = getattr(m, attr)
                break
        if not data:
            print("  !! sin datos en", mod); continue
        for fichero, d in data.items():
            html_ = P.pagina(
                fichero=fichero, title=d["title"], description=d["desc"], keywords=d["kw"],
                h1=d["h1"], subtitulo=d["sub"],
                badge=f'<i class="fa-solid {d["icono"]}"></i> ESPECIALIZADO EN {d["nombre"].upper()}',
                trail=[("Inicio", "/"), ("Sectores y negocios", "/tpv_negocios.asp"),
                       (d["crumb"], "/" + fichero)],
                cuerpo=cuerpo(d), faqs=d["faqs"],
                faq_titulo=f"Preguntas frecuentes sobre el TPV para {d['nombre'].lower()}",
                cta=(f"¿Te encaja para tu {d['crumb'].lower().rstrip('s')}?",
                     "Descarga la demo y pruébala con tus propias referencias. Si vemos que no te sirve, te lo diremos."),
                links=d["rel"])
            open(os.path.join(OUT, fichero), "w", encoding="utf-8").write(html_)
            total += 1
        print(f"  {mod}: {len(data)} paginas")
    print("total generadas:", total)


if __name__ == "__main__":
    main()
