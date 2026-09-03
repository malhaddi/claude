#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cierra los huecos de metadatos que quedaban: canonical, H1, description
y titulos/descripciones demasiado largos para la SERP."""
import re, os, glob, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "site"
BASE = "https://www.abacosoftware.com"

# description + H1 para las paginas que no tenian
FICHAS = {
 "aviso_legal.asp": ("Aviso legal de Ábaco Software: datos identificativos de Ábaco Infoelectrónica S.L., condiciones de uso del sitio y responsabilidades.", "Aviso legal"),
 "condiciones.asp": ("Condiciones de contratación de las licencias Caja 5: precios, formas de pago, entrega del software, garantía y derecho de desistimiento.", "Condiciones de contratación"),
 "politica_privacidad.asp": ("Política de privacidad de Ábaco Software: qué datos tratamos, con qué finalidad y base jurídica, plazos de conservación y cómo ejercer tus derechos.", "Política de privacidad"),
 "politica_cookies.asp": ("Política de cookies de abacosoftware.com: qué cookies usamos, para qué sirven y cómo configurarlas o desactivarlas desde tu navegador.", "Política de cookies"),
 "terminos_uso.asp": ("Términos de uso del sitio web de Ábaco Software: propiedad intelectual, uso permitido de los contenidos y limitación de responsabilidad.", "Términos de uso"),
 "resolucion_litigios.asp": ("Resolución de litigios en línea: plataforma europea de resolución de conflictos para compras realizadas a través de la web de Ábaco Software.", "Resolución de litigios en línea"),
 "comprar_tpv.asp": ("Compra tu licencia de Caja 5 TPV: pago único de 333 € para PC, sin cuotas obligatorias, con soporte telefónico incluido y homologación VeriFactu.", "Comprar licencia Caja 5 TPV"),
 "album_caja5.asp": ("Galería de comercios que trabajan con Caja 5 TPV: tiendas de ropa, calzado, joyerías, perfumerías y más de 70 sectores del comercio minorista español.", "Comercios que trabajan con Caja 5"),
 "que_es_tpv.asp": ("Qué es un TPV y para qué sirve en una tienda: diferencia entre el software de punto de venta y el datáfono del banco, y qué necesitas de cada uno.", "Qué es un TPV y para qué sirve"),
 "descargar.asp": ("Descarga la demo gratuita de Caja 5 TPV y contacta con Ábaco Software: teléfono, WhatsApp y localización.", "Descargar Caja 5 y contacto"),
 "vercarrito.asp": ("Carrito de la compra de Ábaco Software.", "Tu carrito"),
 "carrito5.asp": ("Carrito de la compra de Ábaco Software.", "Tu carrito"),
 "recuento5.asp": ("Aplicación de recuento e inventario de Caja 5.", "Recuento de inventario"),
 "tpv_pedir_caja5_gratis.asp": ("Solicita tu demo gratuita de Caja 5 TPV sin compromiso y sin tarjeta.", "Pedir Caja 5 gratis"),
 "tpv_consultas_desde_web.asp": ("Consultas de stock y precios desde la web con Caja 5.", "Consultas desde la web"),
 "app_etiquetas_ql5.asp": ("App de etiquetas QL5 para imprimir etiquetas con código de barras, talla, color y precio desde tu TPV Caja 5.", "App de etiquetas QL5"),
 "que_nos_diferencia.asp": ("Qué diferencia a Ábaco Software: licencia en propiedad sin cuotas, soporte telefónico directo y 28 años trabajando con el pequeño comercio español.", "Qué nos diferencia"),
}

# titulos recortados a <=62 caracteres para que no se corten en Google
TITULOS = {
 "catinfog-vs-caja5.asp": "Alternativa a Catinfog: comparativa con Caja 5 TPV",
 "gesio-vs-caja5.asp": "Alternativa a Gesio TPV: comparativa con Caja 5",
 "glop-vs-caja5.asp": "Alternativa a Glop TPV: comparativa con Caja 5",
 "simplygest-vs-caja5.asp": "Alternativa a SimplyGest Tallas y Colores | Caja 5",
 "stmoda-vs-caja5.asp": "Alternativa a STMODA (Status2) | Comparativa Caja 5",
 "stockagile-vs-caja5.asp": "Alternativa a Stockagile: comparativa con Caja 5",
 "square-vs-caja5.asp": "Alternativa a Square TPV sin comisión por venta",
 "ofitienda-vs-caja5.asp": "Alternativa a OfiTienda: comparativa con Caja 5",
 "solvermedia-vs-caja5.asp": "Alternativa a Solvermedia TPV Moda | Caja 5",
 "noproblem-vs-caja5.asp": "Alternativa a No Problem Moda | Comparativa Caja 5",
 "funciones-tpv.asp": "Funciones del software TPV Caja 5, una a una",
 "comparativas-tpv.asp": "Comparativas de software TPV 2026 | Ábaco Software",
 "hardware-tpv-compatible.asp": "Hardware compatible con el TPV: qué necesitas",
 "preguntas-frecuentes-tpv.asp": "Preguntas frecuentes sobre software TPV | Ábaco",
 "impresora-tickets-compatible-tpv.asp": "Impresora de tickets para TPV: cuál comprar",
 "lector-codigo-barras-compatible-tpv.asp": "Lector de código de barras para TPV: cuál elegir",
 "etiquetas-codigo-de-barras-tpv.asp": "Etiquetas con código de barras para tu tienda",
 "inventario-con-pda-lector-codigo-barras.asp": "Inventario con PDA o lector de código de barras",
 "matriz-tallas-y-colores.asp": "Matriz de tallas y colores en el TPV | Caja 5",
 "control-de-stock-multialmacen.asp": "Control de stock multialmacén en el TPV | Caja 5",
 "programa-fidelizacion-puntos.asp": "Programa de puntos y fidelización en el TPV",
 "vales-y-tarjetas-regalo-tpv.asp": "Vales de devolución y tarjetas regalo en el TPV",
 "rebajas-y-promociones-tpv.asp": "Rebajas y promociones en el TPV | Caja 5",
 "arqueo-de-caja-cierre-diario.asp": "Arqueo de caja y cierre diario en el TPV",
 "gestion-de-proveedores-y-pedidos.asp": "Proveedores y pedidos de compra en el TPV",
 "tpv-sin-internet-modo-offline.asp": "TPV que funciona sin internet: modo offline",
 "tpv-tactil-o-teclado-raton.asp": "TPV táctil o con teclado y ratón: qué conviene",
 "cajon-portamonedas-tpv.asp": "Cajón portamonedas para TPV: cómo se conecta",
 "verifactu-cuando-entra-en-vigor.asp": "VeriFactu: cuándo entra en vigor. Fechas 2027",
 "que-es-verifactu.asp": "Qué es VeriFactu y a quién afecta | Caja 5",
 "verifactu-autonomos.asp": "VeriFactu para autónomos: fechas y obligaciones",
 "verifactu-gratis.asp": "VeriFactu gratis: qué opciones hay realmente",
 "tpv-software-o-datafono.asp": "TPV: ¿software o datáfono? Diferencias reales",
 "tpv-gratis-para-comercio.asp": "TPV gratis para comercio: opciones y letra pequeña",
 "verifactu-tpv.asp": "Software TPV homologado VeriFactu | Caja 5",
}


def main():
    n_can = n_h1 = n_desc = n_tit = n_dsc = 0
    for f in sorted(glob.glob(os.path.join(OUT, "*.asp"))):
        b = os.path.basename(f)
        s = open(f, encoding="utf-8").read()
        orig = s

        # --- canonical
        if 'rel="canonical"' not in s and "<head>" in s:
            s = s.replace("<head>", f'<head>\n\t<link rel="canonical" href="{BASE}/{b}">', 1)
            n_can += 1

        ficha = FICHAS.get(b)
        # --- description
        if ficha and not re.search(r'<meta name="description"', s):
            m = re.search(r'<link rel="canonical"[^>]*>', s)
            if m:
                s = s[:m.end()] + f'\n\t<meta name="description" content="{ficha[0]}">' + s[m.end():]
                n_desc += 1

        # --- H1 (solo si no hay ninguno)
        if ficha and not re.search(r"<h1[\s>]", s):
            m = re.search(r"<body[^>]*>", s, re.I)
            if m:
                # tras el include del menu si existe
                mm = re.search(r'<div id="menu-contenedor">.*?</script>', s, re.S)
                pos = mm.end() if mm else m.end()
                h1 = (f'\n\t<div class="container" style="padding-top:26px;">'
                      f'\n\t\t<h1 style="font-size:29px; font-weight:800; color:#1e293b; margin:0 0 8px;">{ficha[1]}</h1>'
                      f'\n\t</div>\n')
                s = s[:pos] + h1 + s[pos:]
                n_h1 += 1

        # --- titulo recortado
        if b in TITULOS:
            nuevo = TITULOS[b]
            s = re.sub(r"<title>.*?</title>", f"<title>{nuevo}</title>", s, count=1, flags=re.S)
            for p in ("og:title", "twitter:title"):
                s = re.sub(rf'((?:property|name)="{p}" content=")[^"]*(")',
                           lambda m: m.group(1) + nuevo + m.group(2), s)
            n_tit += 1

        # --- description demasiado larga: recortar en limite de palabra
        m = re.search(r'(<meta name="description" content=")(.*?)(">)', s, re.S)
        if m and len(m.group(2)) > 165:
            corto = m.group(2)[:162]
            corto = corto[:corto.rfind(" ")].rstrip(" ,;:") + "."
            s = s[:m.start(2)] + corto + s[m.end(2):]
            for p in ("og:description", "twitter:description"):
                s = re.sub(rf'((?:property|name)="{p}" content=")[^"]*(")',
                           lambda mm: mm.group(1) + corto + mm.group(2), s)
            n_dsc += 1

        if s != orig:
            open(f, "w", encoding="utf-8").write(s)

    print(f"canonical anadidos: {n_can} | H1 anadidos: {n_h1} | descriptions anadidas: {n_desc}")
    print(f"titulos recortados: {n_tit} | descriptions recortadas: {n_dsc}")


if __name__ == "__main__":
    main()
