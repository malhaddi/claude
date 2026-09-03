#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Hub de preguntas frecuentes: una entrada de longtail informacional por pregunta.

Ademas de la FAQPage, cada bloque tematico es una seccion con su H2, de forma que
la pagina puede posicionar por consultas de cola larga formuladas como pregunta.
"""
import os, sys, json
import plantilla as P

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"

BLOQUES = [
("Precio y modelo de licencia", [
  ("¿Cuánto cuesta un software TPV para una tienda pequeña?",
   "Depende del modelo. En licencia de pago único, Caja 5 para PC cuesta 333 € una sola vez y el programa es tuyo. En modelo de suscripción, las tarifas del mercado español se mueven habitualmente entre 25 y 80 € al mes por caja, lo que a cinco años supone entre 1.500 y 4.800 €. A eso hay que sumarle, en ambos casos, el mantenimiento si lo contratas y la comisión de tu datáfono."),
  ("¿Es mejor pagar una licencia o una cuota mensual?",
   "La cuota tiene sentido si valoras no tener desembolso inicial, quieres las actualizaciones incluidas siempre y necesitas trabajar desde varios sitios. La licencia sale mejor si tu tienda es estable, quieres controlar el gasto y te molesta que el programa deje de funcionar el día que dejes de pagar. En una tienda de calle con uno o dos puestos, la licencia suele amortizarse en el primer año."),
  ("¿Hay costes ocultos al comprar un TPV?",
   "Los cuatro que más sorprenden: el mantenimiento anual obligatorio para tener soporte, el cobro por adaptar el programa a cambios normativos, la comisión por transacción cuando el TPV va ligado a una pasarela de pago, y el coste del hardware propietario cuando el fabricante te obliga a usar el suyo. Pregunta por los cuatro por escrito antes de firmar nada."),
  ("¿La licencia de Caja 5 caduca?",
   "No. La licencia de Caja 5 para PC es en propiedad: el programa sigue funcionando aunque no contrates nada más. El soporte telefónico y las actualizaciones se prestan según las condiciones vigentes; consúltanoslas para tu caso concreto."),
]),
("VeriFactu, Ley Antifraude y facturación", [
  ("¿Qué es VeriFactu y a quién obliga?",
   "VeriFactu es el sistema de la Agencia Tributaria que exige que los programas de facturación generen registros de facturación inalterables, encadenados y con un código QR en la factura. Nace de la Ley Antifraude 11/2021 y su reglamento. Afecta a empresarios y profesionales que emiten facturas con software. Los plazos de entrada en vigor han sufrido cambios: confirma con tu asesor fiscal la fecha exacta que te aplica a ti."),
  ("¿Mi TPV actual me sirve o tengo que cambiarlo?",
   "Solo si el fabricante lo ha adaptado y puede darte la declaración responsable que acredita que el software cumple. Pídesela por escrito. Un programa antiguo sin mantenimiento activo lo normal es que no cumpla, y ahí la opción es actualizar o cambiar."),
  ("¿Qué diferencia hay entre VeriFactu y ticketBAI?",
   "ticketBAI es el sistema propio de la Hacienda foral del País Vasco, con sus tres diputaciones, y lleva más tiempo en vigor. VeriFactu es el sistema estatal. Si tu tienda está en Álava, Bizkaia o Gipuzkoa, lo que te aplica es ticketBAI. Caja 5 está adaptado a ambos."),
  ("¿Un ticket de compra es una factura?",
   "Un ticket normal no; lo que se emite es una factura simplificada, que es un documento válido con requisitos concretos de contenido. Cuando el cliente pide factura completa con sus datos fiscales, el programa la emite a partir del ticket sin tener que rehacer la venta."),
  ("¿Necesito estar conectado a internet para cumplir con VeriFactu?",
   "El sistema contempla tanto el envío de los registros como el modo de factura verificable con QR, y un corte puntual de conexión no te impide emitir. La casuística concreta depende de tu situación, así que confírmala con tu asesoría."),
]),
("Puesta en marcha y migración", [
  ("¿Cuánto se tarda en poner en marcha un TPV en una tienda?",
   "Cobrar el primer día es realista: instalar el programa, configurar los datos fiscales y la impresora lleva un rato. Lo que lleva tiempo de verdad es cargar el catálogo. La recomendación práctica es empezar a cobrar cuanto antes e ir metiendo artículos por familias, en lugar de esperar a tenerlo todo perfecto."),
  ("¿Puedo pasar mis datos desde el programa que uso ahora?",
   "Sí, si tu programa actual permite exportar a Excel o CSV. Se importan artículos, stock, precios, clientes y proveedores. Lo que no suele poder trasladarse es el histórico de tickets, que se queda en el sistema antiguo. Guarda ese histórico según te indique tu asesor por los plazos de conservación que te apliquen."),
  ("¿Tengo que dar de alta mi catálogo a mano?",
   "No necesariamente. Si tienes un Excel del proveedor o del programa anterior, se importa. Si empiezas de cero, lo habitual es dar de alta según entra la mercancía, que reparte el trabajo y evita el atasco inicial."),
  ("¿Qué pasa si me equivoco al configurar algo?",
   "Para eso está el soporte telefónico incluido. La mayor parte de las llamadas de las primeras semanas son de configuración, y se resuelven en la misma llamada."),
]),
("Funcionamiento diario en la tienda", [
  ("¿Qué pasa si se cae internet en mitad de la mañana?",
   "Con Caja 5 para PC, nada: la base de datos está en tu ordenador y sigues cobrando, imprimiendo tickets y cerrando caja. Con un TPV que funciona solo en la nube, dejas de facturar hasta que vuelva la línea. Es la diferencia práctica más importante entre los dos modelos."),
  ("¿Se puede usar el TPV con varios dependientes y controlar quién hace qué?",
   "Sí, con usuarios identificados. Cada venta, cada devolución, cada apertura de cajón y cada cierre queda asociado a quien lo hizo. No es cuestión de desconfiar, es poder reconstruir qué pasó un día concreto cuando la caja no cuadra."),
  ("¿Cómo se gestiona una devolución o un cambio?",
   "Se localiza el ticket original y se hace la devolución sobre él, de forma que el stock vuelve a entrar y el importe queda registrado. Lo habitual en moda es entregar un vale en lugar de efectivo, y ese vale queda controlado con número, saldo y caducidad."),
  ("¿Puedo llevar dos tiendas con el mismo programa?",
   "Sí. Si necesitas ver el stock de ambas en tiempo real, la opción es Caja 5 Nube. Si te vale con consolidar los datos periódicamente, dos licencias de PC funcionan bien y salen bastante más económicas."),
  ("¿El programa funciona en Mac o en tablet?",
   "Caja 5 para PC es una aplicación de Windows. Si trabajas con Mac, iPad o tablets Android, la vía es Caja 5 Nube, que se usa desde el navegador."),
]),
("Hardware y equipo", [
  ("¿Qué necesito para montar un puesto de TPV?",
   "Como mínimo, un ordenador con Windows y una impresora de tickets. Después, por orden de utilidad: lector de código de barras, cajón portamonedas y, si etiquetas mucho, una impresora de etiquetas. El datáfono lo pones tú con tu banco."),
  ("¿Tengo que comprar el hardware con vosotros?",
   "No. Puedes usar el equipo que ya tengas y comprar los periféricos donde quieras. La regla práctica es que si Windows reconoce el aparato, Caja 5 trabaja con él. Tenemos packs montados para quien prefiere no complicarse, pero no son obligatorios."),
  ("¿Sirve mi ordenador antiguo?",
   "A menudo sí, sobre todo si tiene disco SSD. La forma fiable de saberlo es descargar la demo e instalarla en ese equipo antes de comprar nada."),
  ("¿Puedo cobrar con Bizum o con el datáfono de mi banco?",
   "Con Caja 5 registras el medio de pago que uses, incluido el datáfono de tu banco, y el arqueo cuadra por medio de pago. No cobramos comisión por venta ni participamos en el cobro."),
]),
("Soporte y garantías", [
  ("¿El soporte técnico está incluido o se paga aparte?",
   "El soporte telefónico está incluido y te atiende una persona. Es una de las diferencias que más se notan frente a modelos donde el soporte es un contrato anual aparte o un formulario web con respuesta en días."),
  ("¿Qué horario tiene el soporte?",
   "Horario comercial en días laborables. Para dudas de configuración y de uso diario, es cuando se necesita. Llámanos al 953 050 112 y te confirmamos el horario vigente."),
  ("¿Y si mañana desaparece la empresa? ¿Me quedo sin programa?",
   "Con una licencia en propiedad instalada en tu equipo, el programa sigue funcionando y tus datos son tuyos y están en tu ordenador. Es una diferencia real frente al modelo de suscripción, donde el acceso depende de que el servicio siga activo. Ábaco Software lleva más de 28 años trabajando con el pequeño comercio español."),
  ("¿Puedo probarlo antes de comprar?",
   "Sí, la demo es completa y no pide tarjeta. La recomendación es que la instales y metas veinte artículos reales tuyos, con sus tallas y colores si los tienes. En media hora sabes si te encaja mucho mejor que leyendo cualquier folleto."),
]),
]


def main():
    faqs = [qa for _, bloque in BLOQUES for qa in bloque]

    secciones = ""
    for nombre, bloque in BLOQUES:
        preguntas = "".join(f"""
					<div style="border-bottom:1px solid #e9e4db; padding:18px 0;">
						<h3 style="font-size:17px; font-weight:800; color:#1e293b; margin:0 0 8px;">{q}</h3>
						<p style="font-size:14.8px; line-height:1.8; color:#3f3f46; margin:0;">{a}</p>
					</div>""" for q, a in bloque)
        secciones += f"""
	<section style="padding:42px 0; background:#ffffff; border-top:1px solid #e9e4db;">
		<div class="container">
			<div style="max-width:880px;">
				<h2 style="font-size:26px; font-weight:800; color:#1e293b; margin-top:0;">{nombre}</h2>{preguntas}
			</div>
		</div>
	</section>
"""

    intro = """
	<section style="padding:46px 0 24px; background:#ffffff;">
		<div class="container">
			<div style="max-width:880px;">
				<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">Estas son las preguntas que más nos hacen por teléfono comerciantes que están eligiendo TPV. Están respondidas como se responden en una llamada: sin rodeos y diciendo también cuándo la respuesta correcta es «depende» o «pregúntaselo a tu asesor».</p>
				<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">Si no encuentras la tuya, llámanos al <strong>953 050 112</strong>. Te atiende alguien que conoce el pequeño comercio, no un formulario.</p>
			</div>
		</div>
	</section>
"""

    html_ = P.pagina(
        fichero="preguntas-frecuentes-tpv.asp",
        title="Preguntas Frecuentes sobre Software TPV | Ábaco Software",
        description="Respuestas claras sobre software TPV: precio real, licencia o cuota, VeriFactu, migración de datos, hardware, funcionamiento sin internet y soporte técnico.",
        keywords="preguntas frecuentes tpv, dudas software tpv, cuanto cuesta un tpv, tpv verifactu preguntas, migrar datos tpv, que necesito para un tpv",
        h1="Preguntas frecuentes sobre software TPV",
        subtitulo="Precio real, licencia o cuota, VeriFactu, migración, hardware y soporte. Las dudas que llegan por teléfono, respondidas sin marketing.",
        badge='<i class="fa-solid fa-circle-question"></i> PREGUNTAS FRECUENTES',
        trail=[("Inicio", "/"), ("Preguntas frecuentes", "/preguntas-frecuentes-tpv.asp")],
        cuerpo=intro + secciones,
        faqs=faqs, faq_titulo="",
        cta=("¿Te queda alguna duda por resolver?",
             "Llámanos y te decimos con franqueza si Caja 5 encaja en tu tienda. Si no encaja, te lo diremos igual."),
        links=[("Funciones del TPV", "/funciones-tpv.asp"),
               ("Comparativas con otros TPV", "/comparativas-tpv.asp"),
               ("Hardware compatible", "/hardware-tpv-compatible.asp"),
               ("Qué es VeriFactu", "/verifactu-tpv.asp"),
               ("Ley Antifraude y TPV", "/ley-antifraude-tpv.asp"),
               ("TPV por sector de negocio", "/tpv_negocios.asp"),
               ("Pago único frente a cuotas", "/tpv-pago-unico-vs-cuotas-mensuales.asp"),
               ("Caja 5 para PC", "/caja5_pc.asp")])

    # la FAQ visible ya esta maquetada arriba; quitamos el acordeon duplicado
    html_ = html_.replace(P.faq_block(faqs, ""), "")
    open(os.path.join(OUT, "preguntas-frecuentes-tpv.asp"), "w", encoding="utf-8").write(html_)
    print(f"FAQ hub generado con {len(faqs)} preguntas.")


if __name__ == "__main__":
    main()
