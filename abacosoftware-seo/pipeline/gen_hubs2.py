#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Hubs de los clusters nuevos: abrir un negocio y operativa diaria."""
import os, re, glob
import plantilla as P

OUT = "site"


def titulo_de(f):
    s = open(os.path.join(OUT, f), encoding="utf-8").read()
    h1 = re.search(r'<h1 class="hero-titulo">(.*?)</h1>', s, re.S)
    sub = re.search(r'<p class="hero-subtitulo">(.*?)</p>', s, re.S)
    lim = lambda t: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", t)).strip()
    return lim(h1.group(1)) if h1 else f, (lim(sub.group(1))[:150] if sub else "")


def tarjetas(items):
    return "".join(f"""
					<div class="col-md-4 col-sm-6" style="margin-bottom:22px;">
						<div style="background:#ffffff; border:1.5px solid #e4dfd5; border-radius:9px; padding:22px; height:100%;">
							<h3 style="font-size:16.5px; font-weight:800; margin-top:0; margin-bottom:9px; line-height:1.35;">
								<a href="/{f}" style="color:#8c2d19; text-decoration:none;">{t}</a></h3>
							<p style="font-size:13.6px; line-height:1.65; color:#52525b; margin:0;">{d}</p>
						</div>
					</div>""" for f, t, d in items)


def hub(fichero, title, desc, kw, h1, sub, badge, intro, secciones, faqs, links):
    cuerpo = f"""
	<section style="padding:46px 0 26px; background:#ffffff;">
		<div class="container"><div style="max-width:880px;">
			{"".join(f'<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">{p}</p>' for p in intro)}
		</div></div>
	</section>
"""
    for nombre, items in secciones:
        cuerpo += f"""
	<section style="padding:42px 0; background:#faf8f4; border-top:1px solid #e9e4db;">
		<div class="container">
			<h2 style="font-size:25px; font-weight:800; color:#1e293b; margin-top:0; margin-bottom:20px;">{nombre}</h2>
			<div class="row">{tarjetas(items)}
			</div>
		</div>
	</section>
"""
    html = P.pagina(fichero=fichero, title=title[:65], description=desc[:165], keywords=kw,
                    h1=h1, subtitulo=sub, badge=badge,
                    trail=[("Inicio", "/"), (h1.split(":")[0][:40], "/" + fichero)],
                    cuerpo=cuerpo, faqs=faqs, faq_titulo="Preguntas frecuentes",
                    cta=("¿Te echamos una mano con tu caso?",
                         "Llámanos al 953 050 112 o escríbenos por WhatsApp. Te atiende alguien que conoce el pequeño comercio."),
                    links=links)
    open(os.path.join(OUT, fichero), "w", encoding="utf-8").write(html)


# --------------------------------------------------------------- abrir
abrir = sorted(os.path.basename(f) for f in glob.glob(os.path.join(OUT, "abrir-*.asp")))
items_abrir = [(f, *titulo_de(f)) for f in abrir if f != "abrir-un-negocio.asp"]

hub("abrir-un-negocio.asp",
    "Cómo Abrir un Negocio: guías por sector | Caja 5",
    "Guías para abrir un comercio en España por sector: inversión realista, trámites y licencias, errores habituales y qué tener montado antes del primer día.",
    "abrir un negocio, montar una tienda, tramites abrir comercio, cuanto cuesta abrir una tienda, guia abrir negocio españa",
    "Cómo abrir un negocio: guías por sector",
    "Cada oficio tiene su propia trampa. Estas guías cuentan la de cada uno, con cifras de inversión realistas y los trámites en el orden que hay que hacerlos.",
    '<i class="fa-solid fa-store"></i> ABRIR UN NEGOCIO',
    ["Casi todas las guías de emprendimiento que circulan sirven igual para una zapatería que para una panadería, y por eso no sirven para ninguna. Los trámites genéricos se resuelven en media tarde con un asesor; lo que hunde negocios es lo específico del oficio.",
     "En una juguetería es que compras en julio y cobras en diciembre. En una zapatería, que necesitas la curva de números completa. En una peluquería, que la fontanería del local decide tu presupuesto. Estas guías van de eso, no de rellenar el modelo 036.",
     "Todas incluyen una horquilla de inversión realista y los trámites en orden. Ninguna sustituye a tu asesor: llévale la lista y que te confirme la tuya, porque los requisitos cambian por municipio y comunidad."],
    [("Guías por sector", items_abrir)],
    [("¿Cuánto dinero necesito para abrir una tienda?",
      "Depende mucho del sector: una frutería puede arrancar con 15.000 euros y una tienda de electrodomésticos necesitar 150.000. Lo que casi nadie presupuesta, y hunde a quien lo olvida, es el colchón de seis meses de gastos fijos para el periodo en que la tienda aún no factura lo que debería."),
     ("¿Qué trámites son comunes a cualquier comercio?",
      "Alta censal con el epígrafe de tu actividad, alta en autónomos o constitución de sociedad, licencia de actividad o declaración responsable municipal, seguro del local y cartelería obligatoria. A partir de ahí, cada sector añade los suyos. Confírmalos con tu asesor."),
     ("¿Cuándo compruebo si el local sirve para mi actividad?",
      "Antes de firmar el alquiler, siempre. Firmar y descubrir después que el local no puede obtener licencia para tu actividad, o que necesita una obra que no habías previsto, es el error caro más frecuente y el más evitable."),
     ("¿Necesito ya un TPV adaptado a VeriFactu?",
      "En 2026 la adaptación es voluntaria; la obligación llega en enero de 2027 para sociedades y julio de 2027 para autónomos. Si abres ahora, empezar directamente con un programa adaptado te evita migrar dos veces."),
     ("¿Merece la pena montar el catálogo antes de abrir?",
      "Sí, y es lo que más se salta la gente. Abrir con una libreta y la idea de meterlo todo en el ordenador «cuando arranque esto» acaba en seis meses de ventas sin datos y un catálogo que hay que crear a la carrera.")],
    [("Software TPV por sector", "/tpv_negocios.asp"),
     ("Operativa diaria del TPV", "/operativa-tpv.asp"),
     ("Pack TPV completo para comercio", "/pack-tpv-completo-comercio.asp"),
     ("Qué es VeriFactu", "/que-es-verifactu.asp"),
     ("Hardware compatible", "/hardware-tpv-compatible.asp"),
     ("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp")])

# ------------------------------------------------------------ operativa
OPER = ["como-hacer-una-devolucion-tpv.asp", "cambiar-precios-masivamente-tpv.asp",
        "dar-de-alta-articulos-tpv.asp", "cerrar-temporada-liquidar-stock.asp",
        "copia-seguridad-tpv.asp", "controlar-empleados-tpv.asp",
        "migrar-de-tpv-cambiar-programa.asp", "vender-online-y-tienda-fisica-stock.asp",
        "cuentas-de-cliente-cobrar-fin-de-mes.asp", "informes-tpv-que-mirar.asp"]
items_oper = [(f, *titulo_de(f)) for f in OPER if os.path.exists(os.path.join(OUT, f))]

hub("operativa-tpv.asp",
    "Operativa diaria del TPV: cómo se hace cada cosa",
    "Guías prácticas de la operativa diaria de una tienda: devoluciones, cambios de precio, alta de catálogo, cierres, copias de seguridad, migración e informes.",
    "operativa tpv, como usar un tpv, guias tpv tienda, gestion diaria comercio, procedimientos caja tienda",
    "Operativa diaria: cómo se hace cada cosa en el TPV",
    "Las tareas que se repiten cada semana en una tienda, explicadas como se explican por teléfono: qué pasos dar, qué evitar y por qué.",
    '<i class="fa-solid fa-list-check"></i> OPERATIVA DIARIA',
    ["Un TPV se aprende haciendo, y las dudas que llegan por teléfono son casi siempre las mismas: cómo se devuelve algo sin liarla, cómo subo los precios de un proveedor entero, cómo monto el catálogo sin morir en el intento, qué miro cuando la caja no cuadra.",
     "Estas páginas responden a eso. No son manuales de botones: son la forma correcta de hacer cada cosa y los errores que se pagan caros, que suelen ser atajos que funcionan hoy y rompen algo dentro de tres meses."],
    [("Guías de operativa", items_oper)],
    [("¿Por dónde empiezo si acabo de instalar el programa?",
      "Por dar de alta las cincuenta referencias que más vendes y ponerte a cobrar. Intentar meter todo el catálogo antes de empezar es el motivo número uno por el que se abandona un programa nuevo."),
     ("La caja me descuadra casi todos los días. ¿Qué reviso?",
      "Por orden: salidas de efectivo sin registrar, ventas en efectivo marcadas como tarjeta, cambios mal dados y devoluciones sin registrar. Esas cuatro causas explican casi todos los descuadres pequeños y constantes."),
     ("¿Cada cuánto hago copia de seguridad?",
      "Diaria y automática, con al menos una copia fuera del local. Y restaura la copia una vez al año en otro equipo para comprobar que sirve: la copia que nunca se ha probado no es una copia."),
     ("¿Puedo cambiar de programa sin perder los datos?",
      "El catálogo, el stock y los clientes se migran si tu programa actual permite exportar a Excel o CSV. El histórico de tickets rara vez se migra, y tienes obligaciones de conservación: no borres el sistema antiguo sin consultarlo con tu asesor."),
     ("¿Qué informes merece la pena mirar?",
      "Rotación con la cola ordenada por capital inmovilizado, margen por familia y ventas por hora para decidir horarios. El resto suele ser entretenimiento: si no cambia una decisión, no es información.")],
    [("Funciones del TPV", "/funciones-tpv.asp"),
     ("Abrir un negocio", "/abrir-un-negocio.asp"),
     ("Software TPV por sector", "/tpv_negocios.asp"),
     ("Hardware compatible", "/hardware-tpv-compatible.asp"),
     ("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp"),
     ("Comparativas de TPV", "/comparativas-tpv.asp")])


# ------------------------------------------------------------ normativa
NORM=["que-es-verifactu.asp","verifactu-cuando-entra-en-vigor.asp","verifactu-autonomos.asp",
      "verifactu-gratis.asp","sanciones-ley-antifraude.asp","ticketbai-pais-vasco.asp",
      "factura-electronica-obligatoria-crea-y-crece.asp","obligaciones-legales-abrir-tienda.asp",
      "declaracion-responsable-software-facturacion.asp","ley-antifraude-tpv.asp","verifactu-tpv.asp"]
items_norm=[(f,*titulo_de(f)) for f in NORM if os.path.exists(os.path.join(OUT,f))]

hub("normativa-comercio.asp",
    "Normativa del comercio: VeriFactu, ticketBAI y obligaciones",
    "Guías sobre la normativa que afecta a un comercio en España: VeriFactu y sus fechas, ticketBAI, factura electrónica, sanciones y obligaciones de cartelería.",
    "normativa comercio españa, obligaciones legales tienda, verifactu ticketbai factura electronica, ley antifraude comercio",
    "Normativa del comercio, explicada sin alarmismo",
    "VeriFactu, ticketBAI, factura electrónica y las obligaciones del día a día. Con las fechas vigentes y remitiendo a tu asesor donde toca.",
    '<i class="fa-solid fa-scale-balanced"></i> NORMATIVA Y OBLIGACIONES',
    ["Hay tres normas distintas circulando a la vez y se confunden constantemente: VeriFactu, que regula cómo se comporta tu programa; la factura electrónica entre empresas, que viene de otra ley; y ticketBAI, que es el sistema foral vasco y sustituye al estatal en su territorio.",
     "Estas páginas separan las tres, dan las fechas que están vigentes ahora mismo y dicen con claridad dónde la respuesta correcta es «pregúntaselo a tu asesor». Ninguna sustituye a un asesoramiento fiscal: son información general para que llegues a esa conversación sabiendo qué preguntar."],
    [("Guías de normativa", items_norm)],
    [("¿VeriFactu y la factura electrónica obligatoria son lo mismo?",
      "No. VeriFactu regula cómo genera y conserva los registros tu programa de facturación, y viene de la Ley Antifraude 11/2021. La factura electrónica entre empresas viene de la Ley Crea y Crece y regula el formato de intercambio. Puedes estar afectado por las dos, por una o por ninguna."),
     ("¿Cuándo es obligatorio VeriFactu?",
      "Con el calendario vigente tras el Real Decreto-ley 15/2025, el 1 de enero de 2027 para sociedades y el 1 de julio de 2027 para autónomos. Durante 2026 la adaptación es voluntaria. El calendario ya se ha aplazado dos veces: confirma tu fecha con tu asesor."),
     ("Tengo la tienda en el País Vasco. ¿Qué me aplica?",
      "En Álava, Bizkaia y Gipuzkoa lo aplicable es ticketBAI, el sistema de las haciendas forales, no VeriFactu. Cada territorio tiene su propia normativa y su calendario, y el software debe estar registrado en el tuyo."),
     ("¿Qué documento demuestra que mi programa cumple?",
      "La declaración responsable que emite el fabricante del software, con la versión y la fecha. Pídesela por escrito y guárdala con tu documentación fiscal: es tu respaldo, porque la norma contempla infracciones también para quien usa sistemas que no cumplen."),
     ("¿Me pueden multar ya en 2026?",
      "La obligación empieza en 2027. Durante 2026 la adaptación es voluntaria y no hay sanción por no haberla hecho. Desconfía de quien te venda con prisa y con cifras de multas tajantes: quien puede valorar tu exposición real es tu asesor.")],
    [("Software TPV homologado VeriFactu", "/verifactu-tpv.asp"),
     ("Abrir un negocio", "/abrir-un-negocio.asp"),
     ("Operativa diaria del TPV", "/operativa-tpv.asp"),
     ("Software TPV por sector", "/tpv_negocios.asp"),
     ("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp"),
     ("Comparativas de TPV", "/comparativas-tpv.asp")])
print(f"  guias de normativa enlazadas: {len(items_norm)}")

print("hubs generados: abrir-un-negocio.asp, operativa-tpv.asp, normativa-comercio.asp")
print(f"  guias de apertura enlazadas: {len(items_abrir)}")
print(f"  guias de operativa enlazadas: {len(items_oper)}")
