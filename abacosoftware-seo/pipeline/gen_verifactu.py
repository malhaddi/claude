#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cluster VeriFactu + desambiguacion datafono + TPV gratis.

Prioridad tomada de datos reales del cliente (Semrush gap):
  verifactu que es 5.400 | verifactu entrada en vigor 2.400 | verifactu gratis 2.900
  verifactu autonomos 3.200 (dos variantes) | verifactu 2027 1.300 | tpv verifactu 590 (KD 8)

Fechas verificadas contra el RD-ley 15/2025 (2-dic-2025), que aplaza la obligacion a
1-ene-2027 (sociedades) y 1-jul-2027 (autonomos y resto). 2026 es voluntario.
Todo el contenido remite al asesor fiscal para el caso concreto.
"""
import os, sys
import plantilla as P

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"

AVISO = ('<div style="background:#fffbeb; border-left:4px solid #b45309; padding:15px 18px; margin:22px 0; '
         'border-radius:0 7px 7px 0;"><p style="margin:0; font-size:14px; line-height:1.7; color:#78350f;">'
         '<strong>Aviso.</strong> Esta página es información general, no asesoramiento fiscal. Los plazos de '
         'VeriFactu se han modificado varias veces y pueden volver a cambiar. Antes de tomar decisiones, '
         'confirma tu situación concreta con tu asesor fiscal o en la sede electrónica de la Agencia Tributaria.</p></div>')


def bloque(titulo, parrafos, lista=None):
    ps = "".join(f'\n\t\t\t\t\t<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">{p}</p>'
                 for p in parrafos)
    li = ""
    if lista:
        li = '\n\t\t\t\t\t<ul style="list-style:none; padding:0; margin:16px 0;">' + "".join(
            f'\n\t\t\t\t\t\t<li style="padding:10px 0; border-bottom:1px solid #f0ebe2; font-size:14.6px; line-height:1.65;">'
            f'<i class="fa-solid fa-angle-right" style="color:#8c2d19; margin-right:9px;"></i>{x}</li>'
            for x in lista) + "\n\t\t\t\t\t</ul>"
    return f'\n\t\t\t\t\t<h2 style="font-size:25px; font-weight:800; color:#1e293b; margin-top:34px;">{titulo}</h2>{ps}{li}'


def envolver(bloques, aviso=True):
    return f"""
	<section style="padding:48px 0 40px; background:#ffffff;">
		<div class="container">
			<div class="row">
				<div class="col-md-8">{AVISO if aviso else ''}{''.join(bloques)}
				</div>
				<div class="col-md-4">
					<div style="background:#faf8f4; border:1.5px solid #e4dfd5; border-radius:10px; padding:24px; position:sticky; top:20px;">
						<h3 style="font-size:18px; font-weight:800; color:#1e293b; margin-top:0;">Caja 5 ya está adaptado</h3>
						<p style="font-size:14px; line-height:1.7; color:#52525b;">Emite facturas simplificadas con QR reglamentario y registro encadenado e inalterable. Licencia en propiedad de 333 €, sin cuota obligatoria.</p>
						<a href="descargar.asp?origen=descargas&amp;link=www.abacosoftware.com/eutpv.exe" class="btn-hero-primary" style="display:block; text-align:center; margin-bottom:10px;"><i class="fa-solid fa-download"></i> Descargar demo</a>
						<a href="https://wa.me/34611500052?text=Hola,%20tengo%20dudas%20sobre%20VeriFactu" style="display:block; text-align:center; background:#ffffff; color:#8c2d19; border:2px solid #8c2d19; border-radius:6px; font-weight:700; font-size:15px; padding:11px 18px; text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> Preguntar por WhatsApp</a>
						<hr style="border-color:#e4dfd5; margin:18px 0;">
						<p style="font-size:13px; color:#71717a; margin:0;">O llama al <strong>953 050 112</strong>. Te atiende una persona que lleva 28 años tratando con comercios.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
"""


PAGINAS = {
# =========================================================== cuando entra en vigor
"verifactu-cuando-entra-en-vigor.asp": dict(
  title="VeriFactu: cuándo entra en vigor. Fechas 2027 actualizadas | Caja 5",
  desc="Calendario VeriFactu actualizado: 1 de enero de 2027 para sociedades y 1 de julio de 2027 para autónomos, tras el aplazamiento del RD-ley 15/2025. Qué hacer en 2026.",
  kw="verifactu entrada en vigor, verifactu cuando entra en vigor, verifactu 2027, cuando entra en vigor verifactu, verifactu aplazamiento, calendario verifactu",
  h1="VeriFactu: cuándo entra en vigor y qué cambia en 2027",
  sub="El calendario se ha aplazado dos veces. Estas son las fechas que están vigentes ahora mismo y lo que conviene hacer durante 2026, que es un año voluntario.",
  badge='<i class="fa-solid fa-calendar-days"></i> CALENDARIO VERIFACTU',
  crumb="Cuándo entra en vigor VeriFactu",
  bloques=[
    ("Las fechas vigentes ahora mismo",
     ["El Real Decreto-ley 15/2025, aprobado el 2 de diciembre de 2025, retrasó un año más la obligación de VeriFactu. Con el calendario actual, las fechas son estas:",
      "Durante 2026 la adaptación es <strong>voluntaria</strong>. Puedes usar un programa ya adaptado, y de hecho es lo recomendable, pero no hay obligación ni sanción por no haberlo hecho todavía."],
     ["<strong>1 de enero de 2027</strong> — obligatorio para sociedades y demás contribuyentes del Impuesto sobre Sociedades.",
      "<strong>1 de julio de 2027</strong> — obligatorio para autónomos y el resto de contribuyentes.",
      "<strong>Durante 2026</strong> — adaptación voluntaria. Ni obligación ni sanción por esperar."]),
    ("Por qué se ha aplazado dos veces",
     ["El reglamento original (Real Decreto 1007/2023) fijaba fechas mucho más tempranas. Tras las alegaciones del sector y de las asociaciones de autónomos, Hacienda movió el calendario a 2026 y después, con el RD-ley 15/2025, a 2027.",
      "La lectura práctica es que el aplazamiento da margen, no elimina la obligación. El marco antifraude (Ley 11/2021) y el reglamento VeriFactu siguen plenamente vigentes; lo que se ha movido es la fecha desde la que se exige."]),
    ("Qué conviene hacer durante 2026",
     ["Lo peor que puede pasar es llegar a diciembre de 2026 con todo el sector cambiando de programa a la vez: los plazos de instalación se alargan y el soporte de todos los fabricantes se satura. Adelantarse tiene una ventaja práctica muy concreta, que es hacer la migración con calma.",
      "Un orden razonable de tareas para este año:"],
     ["Pregunta a tu proveedor actual, por escrito, si su programa está adaptado y si te dará la declaración responsable.",
      "Si la respuesta es que sí, pide fecha concreta de la actualización y si tiene coste añadido.",
      "Si la respuesta es ambigua o hay que pagar aparte, empieza a mirar alternativas ahora y no en 2027.",
      "Aprovecha para limpiar el catálogo y los datos fiscales de la ficha de empresa, que es lo que acaba retrasando cualquier migración."]),
    ("Qué pasa si no me adapto a tiempo",
     ["A partir de la fecha que te aplique, emitir facturas con un programa no conforme deja de ser válido. La Ley 11/2021 contempla además un régimen sancionador tanto para quien fabrica o comercializa software que no cumple como para quien lo utiliza.",
      "El importe y la casuística concreta de las sanciones dependen de la infracción y no es algo que debas deducir de una página web: si tienes dudas sobre tu exposición, consúltalo con tu asesor fiscal."]),
  ],
  faqs=[
    ("¿Cuándo entra en vigor VeriFactu exactamente?",
     "Con el calendario vigente tras el Real Decreto-ley 15/2025, el 1 de enero de 2027 para sociedades y demás contribuyentes del Impuesto sobre Sociedades, y el 1 de julio de 2027 para autónomos y el resto. Durante 2026 la adaptación es voluntaria. Como el calendario ya se ha movido dos veces, confirma la fecha vigente con tu asesor antes de planificar."),
    ("¿VeriFactu es obligatorio en 2026?",
     "No. 2026 es un año de adaptación voluntaria. Puedes usar ya un programa adaptado, y es recomendable para no depender de las prisas del último trimestre, pero no hay obligación ni sanción por no haberlo hecho todavía."),
    ("¿Qué diferencia hay entre VeriFactu y la factura electrónica obligatoria?",
     "Son dos cosas distintas que suelen confundirse. VeriFactu regula cómo debe comportarse tu programa de facturación (registros encadenados, inalterables y con QR). La factura electrónica obligatoria entre empresas y profesionales viene de la Ley Crea y Crece y tiene su propio calendario, aún pendiente de desarrollo reglamentario completo. Puedes estar afectado por ambas."),
    ("¿Tengo que enviar todas mis facturas a Hacienda en tiempo real?",
     "Depende del modo. En modo VeriFactu, los registros se remiten a la AEAT. Existe también la alternativa de sistemas no VeriFactu con requisitos más exigentes de conservación y huella. Para una tienda pequeña, lo habitual y más sencillo es el modo VeriFactu. Tu asesor te dirá cuál encaja en tu caso."),
    ("¿Me sirve el programa que uso ahora?",
     "Solo si el fabricante lo ha adaptado y puede entregarte la declaración responsable que acredita que el software cumple. Pídesela por escrito: es el documento que demuestra que tu programa es conforme."),
  ],
  rel=[("Qué es VeriFactu, explicado sin tecnicismos", "/que-es-verifactu.asp"),
       ("VeriFactu para autónomos", "/verifactu-autonomos.asp"),
       ("Programas VeriFactu gratis: lo que hay de verdad", "/verifactu-gratis.asp"),
       ("Software TPV homologado VeriFactu", "/verifactu-tpv.asp"),
       ("Ley Antifraude 11/2021 y TPV", "/ley-antifraude-tpv.asp"),
       ("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp")]),

# ======================================================================= que es
"que-es-verifactu.asp": dict(
  title="Qué es VeriFactu y a quién afecta, explicado claro | Caja 5",
  desc="Qué es VeriFactu, qué obliga a hacer a tu programa de facturación, qué es el QR del ticket y a quién afecta. Explicado sin tecnicismos, con las fechas de 2027.",
  kw="que es verifactu, verifactu que es, que es el verifactu, sistema verifactu, verifactu explicado, verifactu aeat",
  h1="Qué es VeriFactu, explicado como se lo explicaríamos a un comerciante",
  sub="Ni es un programa que tengas que comprar a Hacienda, ni te vigila en tiempo real. Es un conjunto de requisitos que debe cumplir tu software de facturación.",
  badge='<i class="fa-solid fa-qrcode"></i> QUÉ ES VERIFACTU',
  crumb="Qué es VeriFactu",
  bloques=[
    ("VeriFactu no es un programa: es una forma de comportarse",
     ["La confusión más habitual es pensar que VeriFactu es una aplicación que hay que descargar. No lo es. VeriFactu es el conjunto de reglas que debe cumplir el programa con el que facturas, sea cual sea.",
      "La idea de fondo es sencilla. Hasta ahora, un programa de caja podía permitir borrar o modificar una venta ya cobrada sin dejar rastro. Eso es lo que la norma quiere impedir. A partir de VeriFactu, cada factura o ticket que emites genera un registro que queda encadenado con el anterior, como los eslabones de una cadena: si alguien manipula uno, la cadena se rompe y se nota."],
     ["<strong>Registro por cada factura.</strong> Cada venta genera su registro de facturación, no se puede emitir sin él.",
      "<strong>Encadenamiento.</strong> Cada registro incorpora la huella del anterior, de forma que la secuencia es verificable.",
      "<strong>Inalterabilidad.</strong> No se puede modificar ni borrar un registro; las correcciones se hacen con facturas rectificativas.",
      "<strong>Código QR en la factura.</strong> El ticket lleva un QR que permite verificar el documento.",
      "<strong>Declaración responsable.</strong> El fabricante del software declara formalmente que su programa cumple."]),
    ("Qué cambia en tu mostrador, en la práctica",
     ["Para el comerciante, el cambio del día a día es menor de lo que parece. Sigues cobrando igual, el ticket sale igual de rápido y el cliente no nota nada salvo un QR impreso en el papel.",
      "Lo que sí cambia son dos cosas. La primera, que ya no se puede «arreglar» una venta borrándola: si te equivocas, se hace una rectificativa, que es como debería haberse hecho siempre. La segunda, que necesitas que tu programa esté adaptado, y eso depende de tu proveedor, no de ti."]),
    ("A quién afecta",
     ["Con carácter general, a empresarios y profesionales que emiten facturas mediante sistemas informáticos. Eso incluye a la inmensa mayoría del comercio minorista, porque la factura simplificada (el ticket de toda la vida) entra dentro del ámbito de la norma.",
      "Hay particularidades: quienes ya están en el Suministro Inmediato de Información (SII) tienen su propio régimen, y en el País Vasco lo que aplica es ticketBAI, que es el sistema foral equivalente y lleva más tiempo en marcha. Si tu tienda está en Álava, Bizkaia o Gipuzkoa, tu referencia es ticketBAI."]),
    ("Cuándo empieza a ser obligatorio",
     ["Tras el aplazamiento aprobado por el Real Decreto-ley 15/2025, las fechas vigentes son el 1 de enero de 2027 para sociedades y el 1 de julio de 2027 para autónomos y el resto de contribuyentes. Durante 2026 la adaptación es voluntaria.",
      "Tienes el calendario completo y qué conviene hacer este año en la página sobre cuándo entra en vigor VeriFactu."]),
  ],
  faqs=[
    ("¿VeriFactu es un programa que tengo que descargar?",
     "No. VeriFactu es un conjunto de requisitos que debe cumplir tu programa de facturación. Lo que tienes que hacer es asegurarte de que el software que usas está adaptado y de que el fabricante puede darte la declaración responsable correspondiente."),
    ("¿Hacienda va a ver todas mis ventas en tiempo real?",
     "En modo VeriFactu, los registros de facturación se remiten a la Agencia Tributaria. Eso no significa vigilancia en directo de tu caja ni acceso a tu contabilidad: es el envío de los registros de las facturas emitidas, con la información que la norma establece. Conviene no dejarse llevar por el alarmismo que circula sobre este punto."),
    ("¿Qué es el QR que aparece en el ticket?",
     "Es un código que permite verificar ese documento concreto. Lo genera tu programa al emitir la factura o el ticket, y va impreso en el papel. Si usas papel térmico de 58 mm el QR queda muy justo; con 80 mm se lee sin problemas."),
    ("¿Y si me equivoco en una venta? ¿No puedo borrarla?",
     "No puedes borrar el registro, pero sí corregir la operación mediante una factura rectificativa. Es el procedimiento correcto y el que la norma exige. En la práctica, el programa lo hace por ti desde la propia venta."),
    ("¿Esto vale también para el País Vasco?",
     "En Álava, Bizkaia y Gipuzkoa el sistema aplicable es ticketBAI, el equivalente foral, que lleva más tiempo en vigor y tiene su propio calendario. Caja 5 está adaptado tanto a VeriFactu como a ticketBAI."),
  ],
  rel=[("Cuándo entra en vigor VeriFactu", "/verifactu-cuando-entra-en-vigor.asp"),
       ("VeriFactu para autónomos", "/verifactu-autonomos.asp"),
       ("Programas VeriFactu gratis", "/verifactu-gratis.asp"),
       ("Software TPV homologado VeriFactu", "/verifactu-tpv.asp"),
       ("Ley Antifraude 11/2021", "/ley-antifraude-tpv.asp"),
       ("Arqueo de caja y cierre diario", "/arqueo-de-caja-cierre-diario.asp")]),

# ==================================================================== autonomos
"verifactu-autonomos.asp": dict(
  title="VeriFactu para Autónomos: fechas, obligaciones y coste | Caja 5",
  desc="VeriFactu para autónomos: obligatorio desde el 1 de julio de 2027, qué necesitas, cuánto cuesta adaptarse y qué hacer si facturas poco. Sin alarmismo.",
  kw="verifactu autonomos, verifactu para autonomos, autonomos verifactu obligatorio, verifactu trabajadores autonomos, factura autonomo verifactu",
  h1="VeriFactu para autónomos: qué te obliga y desde cuándo",
  sub="Si eres autónomo con una tienda o un despacho, la fecha que te afecta es el 1 de julio de 2027. Esto es lo que cambia y lo que no.",
  badge='<i class="fa-solid fa-user-tie"></i> VERIFACTU PARA AUTÓNOMOS',
  crumb="VeriFactu para autónomos",
  bloques=[
    ("Tu fecha es el 1 de julio de 2027",
     ["El calendario de VeriFactu distingue dos grupos. Las sociedades y demás contribuyentes del Impuesto sobre Sociedades entran el 1 de enero de 2027. Los autónomos y el resto de contribuyentes, el 1 de julio de 2027.",
      "Esa separación viene del Real Decreto-ley 15/2025, que aplazó un año todo el calendario. Durante 2026 la adaptación es voluntaria para todos."]),
    ("Qué necesitas exactamente",
     ["Menos de lo que la mayoría teme. No necesitas contratar un servicio nuevo con Hacienda, ni cambiar de banco, ni comprar hardware. Lo que necesitas es que el programa con el que emites tus facturas o tickets esté adaptado.",
      "Si facturas con una hoja de cálculo o con un documento de texto, eso sí tendrá que cambiar: la norma exige un sistema informático de facturación que genere los registros. Si ya usas un programa, la pregunta es simplemente si su fabricante lo ha adaptado."],
     ["Un programa de facturación o TPV adaptado, con su declaración responsable.",
      "Los datos fiscales de tu actividad correctamente configurados en el programa.",
      "Si emites tickets en papel, una impresora que imprima el QR con calidad suficiente para leerse.",
      "Nada más. Ni gestor obligatorio, ni certificado adicional para el caso general."]),
    ("Cuánto cuesta adaptarse siendo autónomo",
     ["Depende del modelo que elijas y conviene mirarlo a varios años, no solo el primer recibo. Los programas por suscripción del mercado español se mueven habitualmente entre 10 y 40 € al mes para un autónomo, lo que a cinco años supone entre 600 y 2.400 €.",
      "Una licencia en propiedad es un desembolso único. Caja 5 para PC cuesta 333 € una sola vez y el programa sigue siendo tuyo, sin cuota obligatoria para poder seguir facturando. Para un autónomo con una tienda de calle, esa diferencia suele ser el argumento decisivo.",
      "Dicho con honestidad: si facturas muy poco y no necesitas control de stock, hay opciones más ligeras que un TPV completo, y probablemente te sobre con eso. No tiene sentido comprar un programa de tienda si lo que haces son seis facturas al mes."]),
    ("Lo que no es cierto y circula mucho",
     ["Conviene desmontar tres cosas que se repiten en foros y en anuncios. Primero, que Hacienda va a ver tu caja en directo: lo que se remiten son los registros de las facturas emitidas, no un acceso a tu negocio. Segundo, que hay que pagar una cuota a la AEAT por VeriFactu: no la hay. Y tercero, que si no te adaptas mañana te multan: hasta la fecha que te aplique, no hay obligación.",
      "El alarmismo vende software, pero toma la decisión con datos y con tu asesor, no con el miedo que genere un anuncio."]),
  ],
  faqs=[
    ("¿Desde cuándo es obligatorio VeriFactu para un autónomo?",
     "Desde el 1 de julio de 2027, según el calendario vigente tras el Real Decreto-ley 15/2025. Durante 2026 y el primer semestre de 2027 la adaptación es voluntaria para autónomos. Confirma la fecha con tu asesor, porque el calendario ya se ha aplazado dos veces."),
    ("¿Puedo seguir facturando con Excel?",
     "A partir de la fecha que te aplique, no: la norma exige un sistema informático de facturación que genere los registros con los requisitos establecidos, y una hoja de cálculo no los cumple. Hasta entonces puedes seguir como estés, pero es el cambio que sí o sí tendrás que hacer."),
    ("¿Tengo que pagar algo a Hacienda por VeriFactu?",
     "No. No existe ninguna tasa ni cuota a la Agencia Tributaria por VeriFactu. Lo que puede costarte dinero es adaptar o cambiar tu programa de facturación, que es una decisión comercial entre tú y tu proveedor de software."),
    ("¿Necesito un gestor para cumplir con VeriFactu?",
     "No es obligatorio para el hecho de facturar con un programa adaptado. Otra cosa es que, si tienes dudas sobre tu régimen fiscal o tu situación concreta, un asesor te ahorre disgustos. Para la parte puramente técnica, con un programa conforme es suficiente."),
    ("Facturo muy poco al mes, ¿me compensa un TPV completo?",
     "Probablemente no. Si haces unas pocas facturas y no llevas stock, un programa de facturación sencillo te basta. Un TPV como Caja 5 tiene sentido cuando hay mostrador, catálogo, inventario y cobros diarios. Te lo decimos aunque suponga no venderte una licencia."),
  ],
  rel=[("Cuándo entra en vigor VeriFactu", "/verifactu-cuando-entra-en-vigor.asp"),
       ("Qué es VeriFactu", "/que-es-verifactu.asp"),
       ("Programas VeriFactu gratis", "/verifactu-gratis.asp"),
       ("TPV gratis para comercio: qué hay de verdad", "/tpv-gratis-para-comercio.asp"),
       ("Software TPV homologado VeriFactu", "/verifactu-tpv.asp"),
       ("Pago único frente a cuotas mensuales", "/tpv-pago-unico-vs-cuotas-mensuales.asp")]),

# ======================================================================= gratis
"verifactu-gratis.asp": dict(
  title="VeriFactu Gratis: qué opciones hay realmente en 2026 | Caja 5",
  desc="Programas VeriFactu gratis: qué ofrece la AEAT, qué hacen los programas gratuitos del mercado y dónde está la letra pequeña. Comparado sin vender humo.",
  kw="verifactu gratis, programa verifactu gratis, verifactu aeat descargar, software facturacion gratis verifactu, aplicacion verifactu gratuita",
  h1="VeriFactu gratis: qué hay de verdad y dónde está la letra pequeña",
  sub="Sí existen opciones gratuitas, incluida una de la propia Agencia Tributaria. Lo importante es saber para qué sirve cada una y cuándo se te queda corta.",
  badge='<i class="fa-solid fa-tag"></i> OPCIONES GRATUITAS',
  crumb="VeriFactu gratis",
  bloques=[
    ("La aplicación gratuita de la Agencia Tributaria",
     ["La AEAT ha previsto una aplicación gratuita para emitir facturas conforme al sistema VeriFactu. Es la opción de coste cero más obvia y para determinados perfiles es perfectamente suficiente.",
      "Ahora bien, conviene entender qué es y qué no es. Es una herramienta para emitir facturas cumpliendo la norma. No es un TPV: no lleva catálogo de artículos con stock, ni matriz de tallas y colores, ni control de caja por dependiente, ni fidelización, ni etiquetas con código de barras. Si lo que necesitas es facturar de forma esporádica, encaja. Si tienes un mostrador con cien clientes al día, no.",
      "Consulta siempre las condiciones y limitaciones vigentes en la sede electrónica de la Agencia Tributaria, porque es información que puede cambiar."]),
    ("Los programas «gratis» del mercado: dónde está el truco",
     ["Cuando un fabricante privado ofrece un programa gratuito, el coste está en otro sitio. No es necesariamente malo, pero tienes derecho a saber dónde:"],
     ["<strong>Límite de uso.</strong> Gratis hasta X facturas o tickets al mes; a partir de ahí, se paga.",
      "<strong>Funciones capadas.</strong> La caja es gratis pero el stock, los informes o el multipuesto son de pago.",
      "<strong>Comisión por transacción.</strong> El programa no cuesta, pero el cobro con tarjeta pasa por su pasarela con su porcentaje.",
      "<strong>Hardware propietario.</strong> El software es gratis y el terminal que estás obligado a comprar, no.",
      "<strong>Tus datos.</strong> En algunos modelos el producto es la información agregada de las ventas."]),
    ("Cuándo el gratis sale caro y cuándo sale bien",
     ["Sale bien si facturas poco, no llevas inventario y solo necesitas cumplir. En ese escenario, pagar por un TPV completo es tirar el dinero y te lo decimos aunque vendamos TPV.",
      "Sale caro cuando el negocio crece y descubres que el límite mensual se queda corto, que exportar tus datos para irte a otro programa no es posible, o que la comisión por transacción supera con creces lo que habría costado una licencia. Un 1,5 % sobre 150.000 € de facturación anual son 2.250 € al año, todos los años.",
      "Nuestra posición es sencilla: Caja 5 para PC son 333 € una vez, sin comisión por venta y con el programa en propiedad. No es gratis, pero a partir del primer año suele salir más barato que casi cualquier «gratis» con letra pequeña. Y si tu caso es el de facturar seis veces al mes, usa la aplicación de la AEAT y ahórrate el dinero."]),
  ],
  faqs=[
    ("¿La Agencia Tributaria ofrece un programa VeriFactu gratis?",
     "Sí, la AEAT ha previsto una aplicación gratuita para emitir facturas conforme a VeriFactu. Sirve para facturar cumpliendo la norma, pero no es un TPV: no gestiona catálogo con stock, ni caja de tienda, ni etiquetas, ni clientes. Consulta sus condiciones y limitaciones actuales en la sede electrónica de la AEAT."),
    ("¿Un TPV gratis puede cumplir con VeriFactu?",
     "Puede, si el fabricante lo ha adaptado y te entrega la declaración responsable. Lo que debes revisar es dónde está el coste real: límite de tickets al mes, funciones de pago, comisión por transacción o hardware obligatorio. Pregúntalo antes de montar tu tienda encima."),
    ("¿Puedo sacar mis datos si luego quiero cambiar de programa?",
     "Con un programa gratuito conviene comprobarlo antes de empezar, porque no todos lo permiten con comodidad. Es la pregunta que menos se hace y la que más cara sale después. Con una licencia en propiedad y base de datos local, los datos están en tu equipo."),
    ("¿Caja 5 tiene versión gratuita?",
     "Caja 5 tiene demo completa y gratuita para que la pruebes sin tarjeta, pero el producto es de pago: 333 € en licencia de propiedad para PC. Si buscas específicamente un TPV gratuito de uso continuado, la vía dentro de nuestra propia casa es Carrito5, con un plan gratuito real para volúmenes pequeños."),
    ("¿Es obligatorio ya tener un programa VeriFactu?",
     "No en 2026. Con el calendario vigente, la obligación llega el 1 de enero de 2027 para sociedades y el 1 de julio de 2027 para autónomos. Tienes margen para elegir con calma."),
  ],
  rel=[("Cuándo entra en vigor VeriFactu", "/verifactu-cuando-entra-en-vigor.asp"),
       ("VeriFactu para autónomos", "/verifactu-autonomos.asp"),
       ("TPV gratis para comercio", "/tpv-gratis-para-comercio.asp"),
       ("Qué es VeriFactu", "/que-es-verifactu.asp"),
       ("Pago único frente a cuotas", "/tpv-pago-unico-vs-cuotas-mensuales.asp"),
       ("Software TPV homologado VeriFactu", "/verifactu-tpv.asp")]),

# ============================================================ datafono vs software
"tpv-software-o-datafono.asp": dict(
  title="TPV: ¿software o datáfono? Diferencias y comisiones | Caja 5",
  desc="La palabra TPV significa dos cosas distintas: el datáfono del banco y el software de punto de venta. Qué es cada uno, cuál necesitas y cómo se comparan las comisiones.",
  kw="tpv o datafono, diferencia tpv y datafono, tpv banco comision, que banco cobra menos por el tpv, tpv sin comision, datafono comercio comisiones",
  h1="TPV: ¿te refieres al datáfono del banco o al software de caja?",
  sub="Es la confusión más común del sector y cuesta dinero: son dos productos distintos, con dos proveedores distintos y dos formas de cobrarte muy distintas.",
  badge='<i class="fa-solid fa-circle-info"></i> DATÁFONO O SOFTWARE',
  crumb="Software o datáfono",
  aviso=False,
  bloques=[
    ("Dos cosas distintas con el mismo nombre",
     ["Cuando alguien busca «TPV» puede estar buscando dos productos que no tienen nada que ver entre sí. Merece la pena aclararlo porque la confusión hace que muchos comercios acaben pagando dos veces, o pagando comisiones que no necesitaban pagar."],
     ["<strong>El TPV bancario o datáfono.</strong> Es el aparatito donde el cliente pasa la tarjeta. Lo contratas con tu banco o con una pasarela de pago, y te cobran un porcentaje por cada cobro. Su función es una sola: mover el dinero de la tarjeta del cliente a tu cuenta.",
      "<strong>El software TPV o programa de punto de venta.</strong> Es el programa del ordenador de la tienda: catálogo, precios, stock, tickets, clientes, informes y cumplimiento fiscal. No mueve dinero; organiza tu negocio y emite los tickets."]),
    ("Los necesitas los dos, pero no tienen por qué venir del mismo sitio",
     ["Una tienda normal necesita ambos: el datáfono para cobrar con tarjeta y el software para gestionar y facturar. La diferencia importante está en si van atados o no.",
      "Hay plataformas que te dan el software «gratis» a cambio de que cobres obligatoriamente por su pasarela, con su comisión. El programa parece regalado, pero pagas un porcentaje de cada venta durante toda la vida del negocio.",
      "Caja 5 funciona al revés: te vendemos el software una vez y tú cobras con el datáfono que quieras, al precio que hayas negociado con tu banco. No participamos en el cobro y no cobramos comisión por venta."]),
    ("Cuánto cuesta cada cosa, en números",
     ["Las comisiones de datáfono en España se mueven habitualmente entre el 0,4 % y el 1,5 % según el volumen, el tipo de tarjeta y lo que negocies. Es un porcentaje que se paga siempre, mientras vendas.",
      "Sobre 150.000 € de facturación anual con tarjeta, cada punto porcentual son 1.500 € al año. Por eso la comisión del datáfono, y no el precio del software, suele ser la partida más grande a cinco años. Negociarla con tu banco o comparar entre varios es de las cosas más rentables que puedes hacer en una tarde.",
      "El software, en cambio, es un coste que puedes cerrar: 333 € una vez en el caso de Caja 5, frente a modelos de suscripción que siguen corriendo indefinidamente."]),
    ("Qué preguntar antes de firmar nada",
     ["Tanto al banco como al proveedor de software, conviene llevar la lista escrita:"],
     ["¿Cuál es la comisión exacta por operación, y cambia según el tipo de tarjeta?",
      "¿Hay cuota de mantenimiento mensual del datáfono aparte de la comisión?",
      "¿El software me obliga a cobrar por una pasarela concreta?",
      "¿Hay permanencia? ¿Qué pasa si me quiero ir?",
      "¿Puedo exportar mis datos de ventas y clientes si cambio de programa?"]),
  ],
  faqs=[
    ("¿Qué diferencia hay entre un TPV y un datáfono?",
     "El datáfono es el terminal físico del banco que cobra las tarjetas y te aplica una comisión por operación. El software TPV es el programa que gestiona tu tienda: artículos, stock, tickets, clientes e informes. Son dos productos distintos, de proveedores distintos, y una tienda normal usa los dos."),
    ("¿Qué banco cobra menos comisión por el TPV?",
     "Varía constantemente y depende mucho de tu volumen y de lo que negocies, así que cualquier ranking se queda anticuado enseguida. Lo práctico es pedir oferta a tu banco y a dos más con tu facturación real en la mano: la diferencia entre la primera oferta y la negociada suele ser significativa. Nosotros no vendemos datáfonos, así que no tenemos preferencia."),
    ("¿Caja 5 me cobra comisión por cada venta?",
     "No. Caja 5 es una licencia de software: 333 € en pago único para PC. El cobro con tarjeta lo haces con el datáfono que tú contrates, con la comisión que hayas acordado con tu banco. Nosotros no participamos en esa operación."),
    ("¿Puedo usar el datáfono que ya tengo?",
     "Sí. Al no estar atados a ninguna pasarela, puedes seguir con tu banco actual. Registras el cobro como pago con tarjeta en el programa y el arqueo cuadra por medio de pago."),
    ("¿Necesito software si el banco ya me dio un datáfono con pantalla?",
     "Algunos datáfonos modernos incluyen funciones básicas de caja, y para un negocio con cuatro productos puede bastar. En cuanto tienes catálogo, tallas, stock o quieres saber qué se vende, se queda corto. Ahí es donde entra un software de punto de venta."),
  ],
  rel=[("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp"),
       ("TPV gratis para comercio", "/tpv-gratis-para-comercio.asp"),
       ("Hardware compatible con el TPV", "/hardware-tpv-compatible.asp"),
       ("Pago único frente a cuotas mensuales", "/tpv-pago-unico-vs-cuotas-mensuales.asp"),
       ("Qué es un TPV", "/que_es_tpv.asp"),
       ("Comparativas de TPV", "/comparativas-tpv.asp")]),

# =================================================================== tpv gratis
"tpv-gratis-para-comercio.asp": dict(
  title="TPV Gratis para Comercio: opciones reales y letra pequeña | Caja 5",
  desc="TPV gratis para tu tienda: qué opciones existen de verdad, dónde está el coste oculto (comisiones, límites, hardware) y cuándo compensa pagar una licencia.",
  kw="tpv gratis, programa tpv gratis, software tpv gratuito, descargar tpv gratis, tpv gratis para tienda, mejor tpv gratis autonomos",
  h1="TPV gratis: qué opciones hay de verdad y cuál es el truco de cada una",
  sub="Sí se puede montar una tienda con software gratuito. Lo que conviene es saber por dónde cobra cada modelo antes de construir tu negocio encima.",
  badge='<i class="fa-solid fa-gift"></i> OPCIONES GRATUITAS',
  crumb="TPV gratis",
  aviso=False,
  bloques=[
    ("Los cuatro modelos de «gratis» que existen",
     ["Ningún fabricante regala software por altruismo. Hay cuatro maneras de que un TPV sea gratis, y cada una tiene consecuencias distintas para ti:"],
     ["<strong>Freemium con límite.</strong> Gratis hasta cierto número de tickets o artículos al mes. Honesto si el límite está claro; el problema aparece cuando creces y el salto de precio es grande.",
      "<strong>Gratis con comisión.</strong> El software no cuesta pero cobras obligatoriamente por su pasarela, con un porcentaje de cada venta. Es el modelo más caro a largo plazo y el que menos lo parece al principio.",
      "<strong>Gratis con hardware obligatorio.</strong> El programa es gratuito pero solo funciona con su terminal, su impresora y su datáfono, que compras tú.",
      "<strong>Versión reducida de un producto de pago.</strong> Funciona, pero las piezas que de verdad necesitas (stock, informes, multipuesto) están al otro lado del muro."]),
    ("La pregunta que casi nadie hace: ¿puedo llevarme mis datos?",
     ["Montar la tienda sobre un programa es una decisión que arrastras años. El catálogo, el histórico de ventas y la ficha de clientes son tuyos, pero solo en la práctica si puedes exportarlos.",
      "Antes de empezar con cualquier opción gratuita, comprueba que puedas sacar artículos, stock y clientes a Excel o CSV. Si no puedes, no estás eligiendo un programa: estás firmando una permanencia indefinida sin contrato."]),
    ("Cuándo el gratis es la decisión correcta",
     ["Te lo decimos aunque vendamos software de pago: si estás empezando, facturas poco y no llevas inventario, un TPV gratuito o incluso la aplicación gratuita de la AEAT para facturar puede ser exactamente lo que necesitas. Pagar 333 € por un programa de tienda cuando haces seis ventas al día no tiene sentido.",
      "Dentro de nuestra propia casa, si lo que buscas es un TPV gratuito de verdad para empezar, la opción es <strong>Carrito5</strong>, con plan gratuito real para volúmenes pequeños y sin tarjeta.",
      "El momento de plantearse una licencia llega cuando el catálogo crece, cuando necesitas control de stock serio o cuando la comisión por venta que estás pagando supera lo que costaría comprar el programa. Ahí, Caja 5 son 333 € una vez y se acabó."]),
  ],
  faqs=[
    ("¿Existe algún TPV gratis de verdad para una tienda?",
     "Existen opciones gratuitas reales, normalmente con límite de volumen o de funciones. Lo importante es leer dónde está el límite: número de tickets al mes, funciones capadas, comisión por cobro o hardware obligatorio. Un gratuito con límites claros y datos exportables es una opción perfectamente razonable para empezar."),
    ("¿Cuál es el mejor TPV gratis para autónomos?",
     "Depende de si necesitas solo facturar o también gestionar tienda. Para facturar cumpliendo la norma, la aplicación gratuita de la AEAT cubre el caso básico. Para llevar catálogo y stock con un plan gratuito, Carrito5 tiene un nivel gratuito para volúmenes pequeños. Y si el negocio ya tiene mostrador con movimiento, probablemente te compense una licencia."),
    ("¿Un TPV gratis cumple con VeriFactu?",
     "Depende del programa concreto: solo cumple si su fabricante lo ha adaptado y te entrega la declaración responsable. Es la primera pregunta que hay que hacer, antes incluso que el precio."),
    ("¿Por qué Caja 5 no es gratis?",
     "Porque el modelo es el contrario: pagas una vez 333 € y el programa es tuyo, sin comisión por venta ni cuota obligatoria. Preferimos cobrar por el software de forma transparente que regalarlo y cobrarte un porcentaje de cada venta durante los próximos diez años. Hay demo gratuita completa para que lo pruebes antes."),
    ("¿Puedo empezar gratis y pasarme después a una licencia?",
     "Sí, siempre que el programa que uses te deje exportar artículos, stock y clientes. Con esos datos en un Excel o CSV, la migración a Caja 5 es el procedimiento habitual y te acompañamos por teléfono."),
  ],
  rel=[("VeriFactu gratis: qué hay de verdad", "/verifactu-gratis.asp"),
       ("TPV: software o datáfono", "/tpv-software-o-datafono.asp"),
       ("Pago único frente a cuotas mensuales", "/tpv-pago-unico-vs-cuotas-mensuales.asp"),
       ("Alternativa al TPV por suscripción", "/alternativa-tpv-suscripcion.asp"),
       ("Comparativas de TPV", "/comparativas-tpv.asp"),
       ("Preguntas frecuentes sobre TPV", "/preguntas-frecuentes-tpv.asp")]),
}


def main():
    for fichero, d in PAGINAS.items():
        cuerpo = envolver([bloque(t, ps, li[0] if li else None)
                           for t, ps, *li in d["bloques"]],
                          aviso=d.get("aviso", True))
        html_ = P.pagina(
            fichero=fichero, title=d["title"], description=d["desc"], keywords=d["kw"],
            h1=d["h1"], subtitulo=d["sub"], badge=d["badge"],
            trail=[("Inicio", "/"), ("Normativa y guías", "/verifactu-tpv.asp"),
                   (d["crumb"], "/" + fichero)],
            cuerpo=cuerpo, faqs=d["faqs"],
            faq_titulo=f"Preguntas frecuentes sobre {d['crumb'].lower()}",
            cta=("¿Dudas sobre cómo te afecta a ti?",
                 "Llámanos o escríbenos por WhatsApp y te decimos con franqueza qué necesitas y qué no. Sin vender miedo."),
            links=d["rel"])
        open(os.path.join(OUT, fichero), "w", encoding="utf-8").write(html_)
    print(f"Cluster VeriFactu/gratis/datafono: {len(PAGINAS)} paginas")


if __name__ == "__main__":
    main()
