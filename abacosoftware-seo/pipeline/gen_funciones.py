#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera el cluster de funciones, el de hardware y las tres paginas hub."""
import os, sys, glob, re, html
import plantilla as P
from contenido_funciones import FUNCIONES, HARDWARE

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"


def cuerpo(d):
    intro = "".join(f'\n\t\t\t\t\t<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">{p}</p>'
                    for p in d["intro"])
    bull = "".join(
        f'\n\t\t\t\t\t\t<li style="padding:11px 0; border-bottom:1px solid #f0ebe2; font-size:14.5px; line-height:1.6;">'
        f'<i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i>'
        f'<strong>{t}.</strong> {x}</li>' for t, x in d["bullets"])
    pasos = "".join(
        f'\n\t\t\t\t\t\t<li style="padding:10px 0 10px 4px; font-size:14.5px; line-height:1.7; color:#3f3f46;">{p}</li>'
        for p in d["como"])
    return f"""
	<section style="padding:50px 0 40px; background:#ffffff;">
		<div class="container">
			<div class="row">
				<div class="col-md-8">{intro}

					<h2 style="font-size:25px; font-weight:800; color:#1e293b; margin-top:34px;">Qué resuelve exactamente</h2>
					<ul style="list-style:none; padding:0; margin:16px 0;">{bull}
					</ul>

					<h2 style="font-size:25px; font-weight:800; color:#1e293b; margin-top:34px;">Cómo se hace paso a paso en Caja 5</h2>
					<ol style="padding-left:20px; margin:16px 0;">{pasos}
					</ol>
				</div>
				<div class="col-md-4">
					<div style="background:#faf8f4; border:1.5px solid #e4dfd5; border-radius:10px; padding:24px; position:sticky; top:20px;">
						<h3 style="font-size:18px; font-weight:800; color:#1e293b; margin-top:0;">Pruébalo con tus datos</h3>
						<p style="font-size:14px; line-height:1.7; color:#52525b;">La demo es completa y no pide tarjeta. La forma honesta de saber si te sirve es instalarla y meter tus propios artículos.</p>
						<a href="descargar.asp?origen=descargas&amp;link=www.abacosoftware.com/eutpv.exe" class="btn-hero-primary" style="display:block; text-align:center; margin-bottom:10px;"><i class="fa-solid fa-download"></i> Descargar demo</a>
						<a href="tel:953050112" style="display:block; text-align:center; background:#ffffff; color:#8c2d19; border:2px solid #8c2d19; border-radius:6px; font-weight:700; font-size:15px; padding:11px 18px; text-decoration:none;"><i class="fa-solid fa-phone"></i> 953 050 112</a>
						<hr style="border-color:#e4dfd5; margin:18px 0;">
						<p style="font-size:13px; color:#71717a; margin:0;"><strong>Licencia 333 €</strong> en pago único para PC. Sin cuota obligatoria ni comisión por venta.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
"""


def genera(slug, d, seccion, hub_nom, hub_url, badge_pre):
    fichero = f"{slug}.asp"
    html_ = P.pagina(
        fichero=fichero, title=d["titulo"], description=d["desc"], keywords=d["kw"],
        h1=d["h1"], subtitulo=d["sub"],
        badge=f'<i class="fa-solid fa-gear"></i> {d["badge"]}',
        trail=[("Inicio", "/"), (hub_nom, hub_url), (d["badge"].title(), "/" + fichero)],
        cuerpo=cuerpo(d), faqs=d["faqs"],
        faq_titulo=f"Preguntas frecuentes sobre {d['badge'].lower()}",
        cta=("¿Lo ves claro? Pruébalo con tu propio catálogo",
             "Descarga la demo completa de Caja 5, monta veinte artículos reales y comprueba si encaja con tu forma de trabajar."),
        links=d["rel"])
    open(os.path.join(OUT, fichero), "w", encoding="utf-8").write(html_)


# ------------------------------------------------------------------ HUB PAGES
def tarjetas(items):
    out = []
    for titulo, url, texto in items:
        out.append(f"""
					<div class="col-md-4 col-sm-6" style="margin-bottom:22px;">
						<div style="background:#ffffff; border:1.5px solid #e4dfd5; border-radius:9px; padding:22px; height:100%;">
							<h3 style="font-size:17px; font-weight:800; margin-top:0; margin-bottom:9px; line-height:1.35;">
								<a href="{url}" style="color:#8c2d19; text-decoration:none;">{titulo}</a></h3>
							<p style="font-size:13.8px; line-height:1.65; color:#52525b; margin:0;">{texto}</p>
						</div>
					</div>""")
    return "".join(out)


def hub(fichero, title, desc, kw, h1, sub, badge, bloques, faqs, faq_tit, links, intro_txt):
    secciones = ""
    for nombre, items in bloques:
        secciones += f"""
	<section style="padding:44px 0; background:#faf8f4; border-top:1px solid #e9e4db;">
		<div class="container">
			<h2 style="font-size:26px; font-weight:800; color:#1e293b; margin-top:0; margin-bottom:20px;">{nombre}</h2>
			<div class="row">{tarjetas(items)}
			</div>
		</div>
	</section>
"""
    cuerpo_ = f"""
	<section style="padding:46px 0 30px; background:#ffffff;">
		<div class="container">
			<div style="max-width:860px;">{"".join(f'<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">{p}</p>' for p in intro_txt)}</div>
		</div>
	</section>
{secciones}"""
    html_ = P.pagina(fichero=fichero, title=title, description=desc, keywords=kw,
                     h1=h1, subtitulo=sub, badge=badge,
                     trail=[("Inicio", "/"), (h1.split(":")[0], "/" + fichero)],
                     cuerpo=cuerpo_, faqs=faqs, faq_titulo=faq_tit,
                     cta=("Habla con alguien que conoce el pequeño comercio",
                          "Te decimos si Caja 5 encaja en tu tienda o si te conviene otra cosa. Sin insistir después."),
                     links=links)
    open(os.path.join(OUT, fichero), "w", encoding="utf-8").write(html_)


def main():
    for slug, d in FUNCIONES.items():
        genera(slug, d, "funciones", "Funciones del TPV", "/funciones-tpv.asp", "FUNCIÓN")
    for slug, d in HARDWARE.items():
        genera(slug, d, "hardware", "Hardware compatible", "/hardware-tpv-compatible.asp", "HARDWARE")
    print(f"Funciones: {len(FUNCIONES)}  Hardware: {len(HARDWARE)}")

    # ---------------------------------------------------------- hub funciones
    hub("funciones-tpv.asp",
        "Funciones del Software TPV Caja 5: todo lo que hace | Ábaco Software",
        "Todas las funciones del TPV Caja 5 explicadas una a una: matriz de tallas y colores, stock multialmacén, fidelización, vales, etiquetas, rebajas y arqueo de caja.",
        "funciones software tpv, que hace un tpv, caracteristicas programa tpv, funcionalidades tpv comercio, software gestion tienda funciones",
        "Funciones del TPV: qué hace Caja 5, explicado una a una",
        "Cada función con su página, con el detalle práctico de cómo se usa en el mostrador y qué problema concreto resuelve en una tienda de verdad.",
        '<i class="fa-solid fa-list-check"></i> FUNCIONES DEL TPV',
        [("Gestión de tienda y catálogo",
          [(FUNCIONES[k]["h1"].split(":")[0], f"/{k}.asp", FUNCIONES[k]["sub"])
           for k in ("matriz-tallas-y-colores", "control-de-stock-multialmacen",
                     "etiquetas-codigo-de-barras-tpv", "inventario-con-pda-lector-codigo-barras",
                     "gestion-de-proveedores-y-pedidos")]),
         ("Venta, clientes y caja",
          [(FUNCIONES[k]["h1"].split(":")[0], f"/{k}.asp", FUNCIONES[k]["sub"])
           for k in ("programa-fidelizacion-puntos", "vales-y-tarjetas-regalo-tpv",
                     "rebajas-y-promociones-tpv", "arqueo-de-caja-cierre-diario",
                     "tpv-sin-internet-modo-offline")])],
        [("¿Todas estas funciones están incluidas en la licencia de 333 €?",
          "Las funciones de gestión de tienda que se describen aquí forman parte de Caja 5 para PC. Hay módulos y servicios adicionales (por ejemplo, sincronización con tienda online o la modalidad en nube) que tienen su propio precio. Antes de comprar, lo mejor es que nos cuentes qué necesitas y te confirmemos por teléfono qué entra en tu caso concreto."),
         ("¿Puedo usar solo la parte de caja y dejar el stock para más adelante?",
          "Sí, y es lo que recomendamos si vienes de trabajar sin programa. Empieza cobrando y emitiendo tickets correctamente, y ve incorporando el catálogo con calma. Intentar montar todo el inventario el primer día es la forma más habitual de abandonar el proyecto."),
         ("¿Hay formación incluida?",
          "El soporte telefónico está incluido y es donde se resuelve la mayor parte de las dudas de puesta en marcha. Para configuraciones más complejas ofrecemos acompañamiento; pregúntanos por tu caso."),
         ("¿Qué diferencia hay entre Caja 5 para PC y Caja 5 Nube?",
          "La versión de PC guarda los datos en tu ordenador, funciona sin internet y es una licencia de pago único. La versión Nube trabaja desde el navegador, sincroniza varias tiendas y la tienda online en tiempo real, y es de cuota mensual. Lo tienes comparado en detalle en la comparativa PC frente a nube.")],
        "Preguntas frecuentes sobre las funciones del TPV",
        [("Comparativas con otros TPV", "/comparativas-tpv.asp"),
         ("Hardware compatible", "/hardware-tpv-compatible.asp"),
         ("TPV por sector de negocio", "/tpv_negocios.asp"),
         ("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp"),
         ("Caja 5 para PC", "/caja5_pc.asp"), ("Caja 5 Nube", "/caja5_nube.asp")],
        ["Un TPV no es solo una pantalla para cobrar. Lo que diferencia a un programa útil de uno que acabas abandonando son las funciones que usas todos los días sin pensar: que la talla correcta salga sola al leer la etiqueta, que el vale del cliente no se pueda canjear dos veces, que las rebajas se apliquen sin tocar ochocientos precios a mano.",
         "En esta página tienes cada función con su explicación propia. No es un listado de características para rellenar una tabla comparativa: cada una cuenta qué problema real resuelve en el mostrador y cómo se hace paso a paso."])

    # -------------------------------------------------------- hub comparativas
    from gen_competidores import COMP
    hub("comparativas-tpv.asp",
        "Comparativas de Software TPV 2026: Caja 5 frente a otros | Ábaco",
        "Comparativas honestas entre Caja 5 y los principales TPV del mercado español: precio real a 5 años, funciones, VeriFactu y comisiones. Con lo bueno de cada uno.",
        "comparativa software tpv, mejor tpv para tienda, comparar programas tpv, alternativas tpv españa, tpv moda comparativa, que tpv elegir",
        "Comparativas de TPV: Caja 5 frente a las alternativas del mercado",
        "Comparativas con datos, no con adjetivos. Qué hace bien cada competidor, qué le critican sus usuarios y en qué escenario concreto conviene cada uno.",
        '<i class="fa-solid fa-scale-balanced"></i> COMPARATIVAS DE TPV',
        [("Comparativas una a una",
          [(f"{v['nom']} frente a Caja 5", f"/{k}-vs-caja5.asp", v["perfil"])
           for k, v in COMP.items()]),
         ("Comparativas de modelo y precio",
          [("TPV en la nube o en tu PC", "/comparativa_tpv_nube.asp",
            "Las dos formas de montar el TPV, con las ventajas y los inconvenientes reales de cada una."),
           ("Pago único frente a cuotas mensuales", "/tpv-pago-unico-vs-cuotas-mensuales.asp",
            "Cuánto acaba costando cada modelo a cinco años y qué pasa el día que dejas de pagar."),
           ("Alternativa al TPV por suscripción", "/alternativa-tpv-suscripcion.asp",
            "Para quien está cansado de pagar todos los meses por un programa que nunca llega a ser suyo.")])],
        [("¿Cuál es el mejor TPV para una tienda de ropa en España?",
          "No hay un mejor absoluto, y desconfía de quien te lo diga. Si vendes en varias tiendas más un e-commerce con mucho volumen, un SaaS con sincronización en tiempo real te compensa. Si tienes una o dos tiendas de calle y te molesta pagar una cuota indefinida, una licencia en propiedad como Caja 5 sale mucho más barata a partir del segundo año."),
         ("¿Estas comparativas son objetivas si las publica un fabricante?",
          "Somos parte interesada y conviene que lo tengas presente. Por eso los datos objetivos salen de información pública de cada fabricante, las críticas se atribuyen a opiniones de usuarios en foros y portales de reseñas, y en cada comparativa decimos en qué escenario el competidor es mejor opción que nosotros. Contrasta siempre los precios en la web oficial de cada uno, porque cambian."),
         ("¿Qué debo mirar de verdad al comparar precios de TPV?",
          "Cuatro partidas, y solo la primera suele aparecer en la portada: la licencia o cuota, el mantenimiento anual, el coste de las actualizaciones legales (VeriFactu, cambios normativos) y la comisión por cobro con tarjeta. Un 1,5 % de comisión sobre 200.000 € de facturación son 3.000 € al año."),
         ("¿Me ayudáis a migrar desde mi TPV actual?",
          "Sí. Si tu programa actual permite exportar artículos, stock y clientes a Excel o CSV, los importamos en Caja 5. Es lo habitual y te acompañamos por teléfono durante el proceso.")],
        "Preguntas frecuentes sobre comparativas de TPV",
        [("Funciones del TPV", "/funciones-tpv.asp"),
         ("TPV por sector de negocio", "/tpv_negocios.asp"),
         ("Qué es VeriFactu", "/verifactu-tpv.asp"),
         ("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp"),
         ("Caja 5 para PC", "/caja5_pc.asp"), ("Qué nos diferencia", "/que_nos_diferencia.asp")],
        ["Elegir TPV es una decisión que arrastras años, porque migrar de programa cuesta trabajo. Y sin embargo casi todas las comparativas que hay por internet están escritas por afiliados que cobran comisión por cada alta, con lo que el orden del ranking no lo decide el producto.",
         "Estas comparativas las publica un fabricante, o sea nosotros, y eso también es un sesgo que debes tener en cuenta. Lo que sí podemos ofrecerte es que los datos sean verificables, que las críticas a cada competidor estén atribuidas a lo que dicen sus usuarios y no inventadas, y que en cada página digamos claramente en qué caso el otro programa es mejor opción que el nuestro."])

    # ------------------------------------------------------------- hub hardware
    hub("hardware-tpv-compatible.asp",
        "Hardware Compatible con el TPV: impresora, lector y cajón | Caja 5",
        "Qué hardware necesitas para montar un TPV y cuál es compatible: impresora de tickets, lector de código de barras, cajón portamonedas y equipo táctil o normal.",
        "hardware tpv compatible, que necesito para montar un tpv, impresora lector cajon tpv, equipo punto de venta, periféricos tpv comercio",
        "Hardware para TPV: qué necesitas de verdad y qué es compatible",
        "Caja 5 no obliga a comprar hardware propietario. Si Windows reconoce el aparato, el programa trabaja con él: aprovecha lo que ya tienes en el mostrador.",
        '<i class="fa-solid fa-plug"></i> HARDWARE COMPATIBLE',
        [("Periféricos del mostrador",
          [(HARDWARE[k]["h1"].split(":")[0], f"/{k}.asp", HARDWARE[k]["sub"])
           for k in HARDWARE])],
        [("¿Tengo que comprar el hardware con vosotros?",
          "No. Puedes comprar el equipo donde quieras y usar el que ya tengas. Si prefieres no complicarte, tenemos packs con todo montado y probado, pero no es obligatorio ni condiciona la licencia."),
         ("¿Qué necesito como mínimo para empezar?",
          "Un ordenador con Windows y una impresora de tickets. Con eso ya cobras y emites tickets. El lector de código de barras es la siguiente inversión y la que más se nota; el cajón portamonedas, si trabajas mucho con efectivo."),
         ("¿Funciona con el datáfono de mi banco?",
          "Sí, y es una diferencia importante frente a las plataformas que obligan a usar su propio hardware de cobro. Con Caja 5 cobras con el datáfono que hayas contratado con tu banco, a la comisión que tengas negociada con él, y nosotros no participamos en esa operación ni cobramos nada por venta."),
         ("¿Cuánto cuesta montar un puesto de TPV completo?",
          "Depende mucho de si reaprovechas el ordenador. Con equipo ya disponible, el desembolso se reduce a la licencia y los periféricos. Llámanos y te damos una cifra realista para tu caso en lugar de un precio de escaparate.")],
        "Preguntas frecuentes sobre hardware para TPV",
        [("Impresoras y lectores compatibles", "/impresoras-tickets-y-lectores-compatibles.asp"),
         ("Pack TPV completo para comercio", "/pack-tpv-completo-comercio.asp"),
         ("Funciones del TPV", "/funciones-tpv.asp"),
         ("Caja 5 para PC", "/caja5_pc.asp"),
         ("Comparativas de TPV", "/comparativas-tpv.asp"),
         ("Preguntas frecuentes", "/preguntas-frecuentes-tpv.asp")],
        ["Una de las cosas que más encarece montar un TPV es el hardware cerrado. Hay plataformas que solo funcionan con su propia impresora, su propio datáfono y su propio terminal, de forma que la inversión inicial se dispara y quedas atado al fabricante también para las reparaciones.",
         "Caja 5 funciona sobre Windows con hardware estándar. La regla práctica es sencilla: si Windows reconoce el aparato y puede imprimir o leer con él, el programa también. Aquí tienes las guías de cada periférico con lo que conviene mirar antes de comprar."])
    print("Hubs generados: funciones-tpv, comparativas-tpv, hardware-tpv-compatible")


if __name__ == "__main__":
    main()
