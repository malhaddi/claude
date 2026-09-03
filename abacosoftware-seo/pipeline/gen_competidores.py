#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera el cluster de comparativas / alternativas a competidores TPV.

Los datos objetivos salen del CSV de investigacion propia del cliente.
Las quejas se atribuyen SIEMPRE como opinion de usuarios en foros y resenas
(que es lo que recoge el CSV), nunca como afirmacion propia: publicidad
comparativa licita bajo el art. 10 de la Ley 3/1991 de Competencia Desleal.
"""
import csv, os, sys, io, re
import plantilla as P

CSV = sys.argv[1] if len(sys.argv) > 1 else ""
OUT = sys.argv[2] if len(sys.argv) > 2 else "site"

# slug -> (nombre CSV, titulo comercial, angulo editorial)
COMP = {
    "stockagile": dict(
        csv="Stockagile", nom="Stockagile",
        h1="Alternativa a Stockagile: TPV de moda sin cuota mensual",
        titulo="Alternativa a Stockagile 2026: Caja 5 TPV sin cuotas | Comparativa",
        desc="Comparativa Stockagile vs Caja 5: precio real a 5 años, matriz de tallas y colores, VeriFactu y sincronización. Alternativa española de pago único desde 333 €.",
        kw="alternativa a stockagile, stockagile precio, stockagile opiniones, stockagile vs caja 5, tpv moda sin cuotas, software tallas y colores",
        perfil="SaaS de gestión de inventario y TPV muy orientado a marcas de moda multicanal.",
        cuando="Tienes varias tiendas más un e-commerce con mucho volumen y necesitas sincronización en tiempo real con Shopify y marketplaces.",
        angulo="coste recurrente"),
    "glop": dict(
        csv="Glop Moda", nom="Glop",
        h1="Alternativa a Glop: TPV para moda sin contrato de mantenimiento",
        titulo="Alternativa a Glop TPV 2026: comparativa con Caja 5 | Sin cuotas",
        desc="Glop vs Caja 5: licencia, coste de mantenimiento anual, actualizaciones fiscales y matriz de tallas. Alternativa con soporte incluido y pago único de 333 €.",
        kw="alternativa a glop, glop tpv precio, glop opiniones, glop vs caja 5, tpv moda licencia, glop mantenimiento",
        perfil="Licencia perpetua muy asentada en hostelería que también comercializa una versión para moda.",
        cuando="Trabajas sin internet en local y ya tienes distribuidor Glop de confianza en tu provincia.",
        angulo="costes recurrentes ocultos"),
    "simplygest": dict(
        csv="SimplyGest Tallas y Colores", nom="SimplyGest",
        h1="Alternativa a SimplyGest Tallas y Colores para tu tienda",
        titulo="Alternativa a SimplyGest Tallas y Colores | Comparativa Caja 5 2026",
        desc="SimplyGest vs Caja 5: estabilidad, soporte incluido o de pago, sincronización con tienda online y VeriFactu. Comparativa objetiva y alternativa de pago único.",
        kw="alternativa a simplygest, simplygest tallas y colores precio, simplygest opiniones, simplygest vs caja 5, tpv tallas colores",
        perfil="Licencia perpetua económica muy extendida en el pequeño comercio español.",
        cuando="Buscas el desembolso inicial más bajo posible y no necesitas soporte continuado.",
        angulo="soporte y estabilidad"),
    "catinfog": dict(
        csv="Catinfog", nom="Catinfog",
        h1="Alternativa a Catinfog: TPV con control de stock avanzado",
        titulo="Alternativa a Catinfog 2026: comparativa con Caja 5 TPV | Stock real",
        desc="Catinfog vs Caja 5: control de stock, multialmacén, gestión de proveedores y conexión con tiendas online externas. Alternativa sin cuota mensual desde 333 €.",
        kw="alternativa a catinfog, catinfog precio, catinfog opiniones, catinfog vs caja 5, tpv nube tienda online",
        perfil="TPV en la nube muy sencillo que incluye una tienda online integrada de serie.",
        cuando="Empiezas de cero, quieres montar el TPV en dos minutos y aún no tienes web propia.",
        angulo="límites funcionales al crecer"),
    "gesio": dict(
        csv="Gesio (TPV Online)", nom="Gesio",
        h1="Alternativa a Gesio: TPV sin consultoría ni implantación",
        titulo="Alternativa a Gesio TPV 2026 | Comparativa con Caja 5 sin implantación",
        desc="Gesio vs Caja 5: coste por caja, implantación y consultoría obligatoria, curva de aprendizaje y funciones ERP. Alternativa que instalas tú mismo el mismo día.",
        kw="alternativa a gesio, gesio tpv precio, gesio opiniones, gesio vs caja 5, tpv sin implantacion, erp comercio",
        perfil="ERP y TPV en la nube potente, con contabilidad y CRM, orientado a multitienda.",
        cuando="Necesitas contabilidad real integrada y gestionas varias tiendas con un equipo administrativo detrás.",
        angulo="complejidad y coste de puesta en marcha"),
    "square": dict(
        csv="Square para Comercios", nom="Square",
        h1="Alternativa a Square para comercios en España",
        titulo="Alternativa a Square TPV 2026: sin comisión por venta | Caja 5",
        desc="Square vs Caja 5: comisión por transacción, retenciones de fondos, hardware propietario y VeriFactu. Alternativa española sin comisiones y con datáfono libre.",
        kw="alternativa a square tpv, square comisiones españa, square opiniones, square vs caja 5, tpv sin comision por venta",
        perfil="Plataforma internacional con hardware propio muy cuidado y cobro por transacción.",
        cuando="Vendes poco volumen, valoras el diseño del hardware y prefieres no comprar licencia.",
        angulo="comisiones por transacción"),
    "noproblem": dict(
        csv="No Problem Moda", nom="No Problem",
        h1="Alternativa a No Problem Moda: TPV ágil para tiendas de ropa",
        titulo="Alternativa a No Problem Moda | Comparativa Caja 5 TPV 2026",
        desc="No Problem Moda vs Caja 5: velocidad con muchas variantes, interfaz, soporte postventa y VeriFactu. Alternativa de pago único con soporte telefónico incluido.",
        kw="alternativa a no problem moda, no problem tpv precio, no problem opiniones, no problem vs caja 5, tpv tienda ropa",
        perfil="Software de retail tradicional muy completo en funciones clásicas de tienda.",
        cuando="Necesitas funciones de retail muy específicas y ya trabajas con su red comercial.",
        angulo="rendimiento con muchas variantes"),
    "ofitienda": dict(
        csv="OfiTienda (Ofimática)", nom="OfiTienda",
        h1="Alternativa a OfiTienda: TPV fácil para el dependiente",
        titulo="Alternativa a OfiTienda 2026 | Comparativa con Caja 5 TPV",
        desc="OfiTienda vs Caja 5: curva de aprendizaje, coste inicial, soporte obligatorio y uso en tablet. Alternativa sencilla de pago único que aprende cualquier dependiente.",
        kw="alternativa a ofitienda, ofitienda precio, ofitienda opiniones, ofitienda vs caja 5, tpv facil de usar",
        perfil="Solución robusta de corte industrial, fuerte en contabilidad y grandes inventarios.",
        cuando="Gestionas un inventario enorme y necesitas contabilidad seria integrada en el mismo paquete.",
        angulo="curva de aprendizaje y coste inicial"),
    "solvermedia": dict(
        csv="Solvermedia TPV Moda", nom="Solvermedia",
        h1="Alternativa a Solvermedia TPV Moda sin base de datos Access",
        titulo="Alternativa a Solvermedia TPV Moda | Comparativa Caja 5 2026",
        desc="Solvermedia vs Caja 5: rendimiento de la base de datos con años de tickets, soporte de pago y VeriFactu. Alternativa estable de pago único con soporte incluido.",
        kw="alternativa a solvermedia, solvermedia tpv precio, solvermedia opiniones, solvermedia vs caja 5, tpv moda barato",
        perfil="Opción muy económica de licencia perpetua para empezar con poco desembolso.",
        cuando="Solo necesitas cobrar y tu volumen de tickets es bajo.",
        angulo="rendimiento a largo plazo y VeriFactu"),
    "stmoda": dict(
        csv="STMODA (Status2)", nom="STMODA",
        h1="Alternativa a STMODA para tiendas independientes",
        titulo="Alternativa a STMODA (Status2) 2026 | Caja 5 TPV sin implantación",
        desc="STMODA vs Caja 5: coste de implantación, consultoría, omnicanalidad y tiempo de puesta en marcha. Alternativa accesible para tiendas independientes y pequeñas cadenas.",
        kw="alternativa a stmoda, stmoda status2 precio, stmoda opiniones, stmoda vs caja 5, tpv cadena moda",
        perfil="Solución enterprise para cadenas y marcas consolidadas con omnicanalidad real.",
        cuando="Eres una cadena con decenas de tiendas y presupuesto de implantación de cinco cifras.",
        angulo="coste inaccesible para tienda independiente"),
}

FILAS = [
    ("Modelo de negocio", "Modelo de Negocio"),
    ("Precio de entrada", "Precio Base"),
    ("Matriz de tallas y colores", "Matriz T/C"),
    ("Variables por artículo", "Var. Max"),
    ("Control multialmacén", "Control Multialmacen"),
    ("Inventario con PDA / móvil", "Inventario PDA/Movil"),
    ("Funciona sin internet", "Modo Offline"),
    ("Comisión por cobro con tarjeta", "Comision Tarjeta"),
    ("VeriFactu", "VeriFactu"),
    ("ticketBAI", "ticketBAI"),
    ("Sincronización con tienda online", "Sincronizacion Shopify"),
    ("Programa de puntos", "Programa Puntos"),
    ("Soporte telefónico", "Soporte Telefonico"),
    ("Coste de mantenimiento", "Coste Mantenimiento"),
]

CAJA5 = {
    "Modelo de Negocio": "Licencia perpetua (PC) o nube",
    "Precio Base": "333 € pago único (PC) · 99 €/mes (Nube)",
    "Matriz T/C": "Sí (matriz de tallas y colores)",
    "Var. Max": "Talla, color y variable libre",
    "Control Multialmacen": "Sí",
    "Inventario PDA/Movil": "Sí",
    "Modo Offline": "Sí (Caja 5 PC trabaja en local)",
    "Comision Tarjeta": "0 % — usas el datáfono de tu banco",
    "VeriFactu": "Sí, homologado",
    "ticketBAI": "Sí",
    "Sincronizacion Shopify": "Sí (Caja 5 Nube)",
    "Programa Puntos": "Sí",
    "Soporte Telefonico": "Sí, incluido",
    "Coste Mantenimiento": "0 € obligatorio en la licencia de PC",
}


def limpia(v):
    v = (v or "").strip()
    return v if v else "No indicado"


def celda(v):
    t = limpia(v)
    low = t.lower()
    if low.startswith("sí") or low.startswith("si "):
        ic, col = "fa-circle-check", "#15803d"
    elif low.startswith("no"):
        ic, col = "fa-circle-xmark", "#b91c1c"
    elif low.startswith("parcial"):
        ic, col = "fa-circle-half-stroke", "#b45309"
    else:
        return f'<td style="padding:11px 13px; border-bottom:1px solid #e9e4db; font-size:13.5px;">{t}</td>'
    return (f'<td style="padding:11px 13px; border-bottom:1px solid #e9e4db; font-size:13.5px;">'
            f'<i class="fa-solid {ic}" style="color:{col}; margin-right:6px;"></i>{t}</td>')


def tabla(row, nom):
    filas = "".join(
        f'\n\t\t\t\t\t<tr><th scope="row" style="padding:11px 13px; border-bottom:1px solid #e9e4db; '
        f'font-size:13.5px; font-weight:700; color:#1e293b; background:#faf8f4;">{et}</th>'
        f'{celda(row.get(col,""))}{celda(CAJA5.get(col,""))}</tr>'
        for et, col in FILAS)
    return f"""
	<section style="padding:50px 0; background:#ffffff;">
		<div class="container">
			<h2 style="font-size:27px; font-weight:800; color:#1e293b; margin-top:0;">{nom} vs Caja 5: comparativa punto por punto</h2>
			<p style="font-size:15px; color:#52525b; max-width:820px;">Tabla comparativa elaborada con información pública de ambos fabricantes. Las condiciones comerciales cambian con el tiempo: confirma siempre los datos de {nom} en su web oficial antes de decidir.</p>
			<div style="overflow-x:auto; margin-top:22px;">
				<table style="width:100%; border-collapse:collapse; min-width:640px; border:1.5px solid #e4dfd5; border-radius:8px;">
					<thead>
						<tr style="background:#18181b; color:#ffffff;">
							<th scope="col" style="padding:13px; text-align:left; font-size:13.5px;">Criterio</th>
							<th scope="col" style="padding:13px; text-align:left; font-size:13.5px;">{nom}</th>
							<th scope="col" style="padding:13px; text-align:left; font-size:13.5px; background:#8c2d19;">Caja 5</th>
						</tr>
					</thead>
					<tbody>{filas}
					</tbody>
				</table>
			</div>
		</div>
	</section>
"""


def coste(row, nom, meta):
    """Bloque de coste total de propiedad a 5 anos."""
    precio = limpia(row.get("Precio Base", ""))
    mant = limpia(row.get("Coste Mantenimiento", ""))
    def eur(n):
        """Formato español: punto como separador de millares."""
        return f"{n:,}".replace(",", ".")

    m = re.search(r"(\d+)\s*EUR/mes", precio)
    if m:
        mes = int(m.group(1))
        calc = (f"<p style='font-size:15px; line-height:1.8; color:#3f3f46;'>Con la tarifa de referencia de "
                f"<strong>{mes} €/mes</strong>, cinco años de {nom} suman <strong>{eur(mes*60)} €</strong> "
                f"({eur(mes*12)} € al año). Una licencia de <strong>Caja 5 para PC cuesta 333 € una sola vez</strong>: "
                f"la diferencia a cinco años ronda los <strong>{eur(mes*60-333)} €</strong>, sin contar subidas de "
                "tarifa. El matiz honesto: si dejas de pagar el SaaS pierdes el acceso; con la licencia el programa "
                "sigue siendo tuyo.</p>")
    else:
        calc = (f"<p style='font-size:15px; line-height:1.8; color:#3f3f46;'>{nom} parte de <strong>{precio}</strong>. "
                f"Lo que conviene mirar no es esa cifra sino lo que viene después: <strong>{mant}</strong>. "
                "Caja 5 para PC son 333 € una sola vez, con soporte telefónico incluido y sin contrato de "
                "mantenimiento obligatorio para seguir usando el programa.</p>")
    return f"""
	<section style="padding:50px 0; background:#f4efe6; border-top:2px solid #e4dfd5; border-bottom:2px solid #e4dfd5;">
		<div class="container">
			<h2 style="font-size:27px; font-weight:800; color:#1e293b; margin-top:0;">Cuánto cuesta {nom} de verdad a 5 años</h2>
			<div style="max-width:860px;">{calc}
				<p style="font-size:15px; line-height:1.8; color:#3f3f46;">Al comparar precios de TPV conviene sumar cuatro partidas que casi nunca aparecen en la portada: la licencia o cuota, el mantenimiento anual, el coste de las actualizaciones legales (VeriFactu, cambios de IVA) y la comisión por cobro con tarjeta. Esa última es la que más se subestima: un 1,5 % sobre 200.000 € de facturación anual son 3.000 € al año que no verás en ninguna tabla de precios.</p>
			</div>
		</div>
	</section>
"""


def cuerpo(row, meta, nom):
    fort = limpia(row.get("Fortaleza Clave", ""))
    queja = limpia(row.get("Queja Principal Foros", ""))
    rating = limpia(row.get("Rating Capterra/Trustpilot", ""))
    return f"""
	<section style="padding:50px 0 40px; background:#ffffff;">
		<div class="container">
			<div class="row">
				<div class="col-md-8">
					<h2 style="font-size:27px; font-weight:800; color:#1e293b; margin-top:0;">Qué es {nom} y para quién funciona bien</h2>
					<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">{meta['perfil']} Su punto fuerte reconocido es claro: <strong>{fort.rstrip('.')}</strong>. Valoración pública de referencia: {rating}.</p>
					<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">Si tu situación es esta, {nom} es una opción perfectamente razonable y no vamos a decirte lo contrario: <em>{meta['cuando']}</em></p>

					<h2 style="font-size:24px; font-weight:800; color:#1e293b; margin-top:34px;">Lo que más repiten los usuarios en foros y reseñas</h2>
					<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">Recogido de opiniones públicas en portales de reseñas y foros de comerciantes, la crítica que más se repite sobre {nom} es: <em>«{queja.rstrip('.')}»</em>. Es la opinión de usuarios, no un juicio nuestro, y conviene que la contrastes tú mismo pidiendo referencias de comercios parecidos al tuyo.</p>

					<h2 style="font-size:24px; font-weight:800; color:#1e293b; margin-top:34px;">Dónde encaja mejor Caja 5</h2>
					<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">Caja 5 está pensado para la tienda independiente española que quiere <strong>comprar su programa una vez y dejar de pagar cuotas</strong>. La licencia de PC son 333 € y el software es tuyo: sigue funcionando aunque no renueves nada. Incluye matriz de tallas y colores, control de stock, etiquetas con código de barras, fidelización por puntos, vales regalo y emisión de tickets homologada VeriFactu.</p>
					<ul class="lista-editorial" style="list-style:none; padding:0; margin:18px 0;">
						<li style="padding:9px 0; border-bottom:1px solid #f0ebe2; font-size:14.5px;"><i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i><strong>Sin comisión por venta.</strong> Cobras con el datáfono de tu banco, al precio que hayas negociado con él.</li>
						<li style="padding:9px 0; border-bottom:1px solid #f0ebe2; font-size:14.5px;"><i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i><strong>Funciona sin internet.</strong> Si se cae la línea, sigues cobrando: la base de datos es local.</li>
						<li style="padding:9px 0; border-bottom:1px solid #f0ebe2; font-size:14.5px;"><i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i><strong>Soporte telefónico incluido</strong> y en español, sin ticket ni cola de chat.</li>
						<li style="padding:9px 0; border-bottom:1px solid #f0ebe2; font-size:14.5px;"><i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i><strong>Hardware libre.</strong> Aprovechas el ordenador, la impresora y el lector que ya tengas.</li>
						<li style="padding:9px 0; font-size:14.5px;"><i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i><strong>Homologado VeriFactu</strong> y adaptado a la Ley Antifraude 11/2021, con QR reglamentario.</li>
					</ul>
					<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">Y donde <strong>no</strong> es la mejor opción, dicho igual de claro: si necesitas sincronización en tiempo real con marketplaces internacionales, contabilidad financiera completa dentro del mismo programa o gestionas decenas de tiendas con equipo de sistemas propio, hay soluciones más orientadas a ese escenario y {nom} puede ser una de ellas.</p>
				</div>
				<div class="col-md-4">
					<div style="background:#faf8f4; border:1.5px solid #e4dfd5; border-radius:10px; padding:24px; position:sticky; top:20px;">
						<h3 style="font-size:18px; font-weight:800; color:#1e293b; margin-top:0;">Prueba antes de decidir</h3>
						<p style="font-size:14px; line-height:1.7; color:#52525b;">La demo de Caja 5 es completa y no pide tarjeta. Instálala, mete veinte artículos con tallas y colores reales y comprueba si te cuadra.</p>
						<a href="descargar.asp?origen=descargas&amp;link=www.abacosoftware.com/eutpv.exe" class="btn-hero-primary" style="display:block; text-align:center; margin-bottom:10px;"><i class="fa-solid fa-download"></i> Descargar demo</a>
						<a href="tel:953050112" style="display:block; text-align:center; background:#ffffff; color:#8c2d19; border:2px solid #8c2d19; border-radius:6px; font-weight:700; font-size:15px; padding:11px 18px; text-decoration:none;"><i class="fa-solid fa-phone"></i> 953 050 112</a>
						<hr style="border-color:#e4dfd5; margin:18px 0;">
						<p style="font-size:13px; color:#71717a; margin:0;"><strong>Migración desde {nom}:</strong> te ayudamos a importar artículos, stock y clientes desde un Excel o CSV.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
"""


def faqs_de(nom, row, meta):
    precio = limpia(row.get("Precio Base", ""))
    return [
        (f"¿Cuánto cuesta {nom}?",
         f"Según la información pública disponible, {nom} parte de {precio}. A esa cifra hay que sumarle, según el caso, el mantenimiento anual ({limpia(row.get('Coste Mantenimiento',''))}) y la comisión por cobro con tarjeta ({limpia(row.get('Comision Tarjeta',''))}). Confirma siempre las condiciones vigentes con el fabricante. Caja 5 para PC es una licencia de 333 € en pago único, sin cuota obligatoria."),
        (f"¿Cuál es la mejor alternativa a {nom} en España?",
         f"Depende de qué te esté fallando. Si el problema es {meta['angulo']}, Caja 5 lo resuelve con una licencia en propiedad de 333 €, soporte telefónico incluido y sin comisión por venta. Si lo que necesitas es justamente el punto fuerte de {nom} ({limpia(row.get('Fortaleza Clave','')).rstrip('.')}), quizá te compense quedarte donde estás."),
        (f"¿Puedo pasar mis datos de {nom} a Caja 5?",
         f"Sí. Si puedes exportar desde {nom} el catálogo de artículos, el stock y la ficha de clientes a Excel o CSV, los importamos en Caja 5. Es el procedimiento habitual en una migración y te acompañamos por teléfono durante el proceso."),
        (f"¿{nom} y Caja 5 cumplen VeriFactu?",
         f"Caja 5 está homologado para VeriFactu y emite facturas simplificadas con el QR reglamentario y registro inalterable, según exige la Ley Antifraude 11/2021. Sobre {nom}, nuestra información es «{limpia(row.get('VeriFactu',''))}», pero es un dato que cambia rápido: pide al fabricante su declaración responsable actualizada por escrito."),
        ("¿Tengo que pagar comisión por cada venta con tarjeta?",
         f"Con Caja 5 no: cobras con el datáfono que tú contrates con tu banco, así que la comisión es la que negocies con él y no pasa por nosotros. En el caso de {nom}, la referencia que manejamos es «{limpia(row.get('Comision Tarjeta',''))}»."),
        ("¿Necesito internet para que funcione el TPV?",
         "Caja 5 para PC guarda los datos en tu propio ordenador, así que si se cae la línea sigues cobrando con normalidad. Los TPV que funcionan solo en la nube dejan de facturar cuando falla la conexión, que es el motivo por el que muchos comercios de calle prefieren la versión local."),
    ]


def main():
    with open(CSV, encoding="utf-8-sig") as f:
        rows = {r["Nombre"].strip(): r for r in csv.DictReader(f) if r.get("Nombre", "").strip()}

    otros = [(v["nom"], f"/{k}-vs-caja5.asp") for k, v in COMP.items()]
    n = 0
    for slug, meta in COMP.items():
        row = rows.get(meta["csv"])
        if not row:
            print("  !! sin fila CSV:", meta["csv"]); continue
        nom = meta["nom"]
        fichero = f"{slug}-vs-caja5.asp"
        links = [(f"{a} frente a Caja 5", b) for a, b in otros if b != "/" + fichero][:6]
        links += [("Todas las comparativas de TPV", "/comparativas-tpv.asp"),
                  ("TPV en la nube o en tu PC: cuál te conviene", "/comparativa_tpv_nube.asp"),
                  ("Qué es VeriFactu y cómo te afecta", "/verifactu-tpv.asp"),
                  ("Software TPV para tiendas de ropa y moda", "/negocio_moda.asp")]

        html = P.pagina(
            fichero=fichero,
            title=meta["titulo"], description=meta["desc"], keywords=meta["kw"],
            h1=meta["h1"],
            subtitulo=(f"Comparativa objetiva entre <strong>{nom}</strong> y <strong>Caja 5</strong>: precio real a cinco años, "
                       "funciones de tienda, cumplimiento de VeriFactu y comisiones. Con lo bueno y lo malo de cada uno."),
            badge=f'<i class="fa-solid fa-scale-balanced"></i> COMPARATIVA {nom.upper()} VS CAJA 5',
            trail=[("Inicio", "/"), ("Comparativas de TPV", "/comparativas-tpv.asp"),
                   (f"{nom} vs Caja 5", "/" + fichero)],
            cuerpo=cuerpo(row, meta, nom) + tabla(row, nom) + coste(row, nom, meta),
            faqs=faqs_de(nom, row, meta),
            faq_titulo=f"Preguntas frecuentes sobre {nom} y sus alternativas",
            cta=(f"¿Te cuadra más pagar una vez que pagar todos los meses?",
                 f"Descarga la demo completa de Caja 5, pruébala con tus propios artículos y compárala con {nom} sin compromiso."),
            links=links)

        open(os.path.join(OUT, fichero), "w", encoding="utf-8").write(html)
        n += 1
    print(f"Generadas {n} paginas de comparativa.")


if __name__ == "__main__":
    main()
