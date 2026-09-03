# -*- coding: utf-8 -*-
"""Titulos y descripciones reescritos a mano para las paginas de carrito5.com
que hoy llevan el titulo generado desde el nombre del fichero.

Cada uno esta escrito desde lo que ese negocio hace de verdad en el mostrador,
no desde una formula. Por eso no se parecen entre si: una tintoreria cobra al
recoger y una tienda de bicicletas registra numeros de cuadro; si los dos
titulos dijeran "TPV para X gratis" no habria ninguna razon para que Google
prefiriese esta pagina a la de un competidor.

Regla que respetan todos:
  - 60 caracteres o menos, que es lo que Google muestra sin cortar.
  - tildes correctas.
  - una promesa concreta del sector, no la palabra "gratis" repetida.

Nada aqui afirma funciones que no se hayan visto en la web viva del cliente.
En concreto no se menciona el regimen de bienes usados (REBU) en anticuarios
ni el libro de municiones en caza: son obligaciones fiscales reales, pero no
esta verificado que el programa las cubra, y prometerlas seria mentir.
"""

# fichero -> (titulo, descripcion, por que este angulo y no otro)
REESCRITOS = {
 "tpv-tienda-artesania.html": (
   "TPV para Tiendas de Artesanía | Piezas Únicas sin Código",
   "Alta rápida de piezas sin código de barras y control del depósito de cada artesano, con su liquidación por separado. Ticket con QR de la AEAT.",
   "El problema real de una tienda de artesania es que casi nada trae codigo de barras y muchas piezas estan en deposito de un tercero."),

 "tpv-tienda-electrodomesticos.html": (
   "TPV para Electrodomésticos | Nº de Serie y Garantías",
   "Guarda el número de serie de cada aparato para poder atender la garantía dos años después, y organiza las entregas a domicilio pendientes.",
   "Ticket medio alto y postventa larga: sin numero de serie no se puede atender una garantia dos anos despues."),

 "tpv-tienda-manga-comics.html": (
   "TPV para Tiendas de Manga y Cómics | Series y Reservas",
   "Reservas de novedades por colección y aviso al cliente cuando llega su tomo. Miles de referencias en el plan gratuito, sin cuota.",
   "Aqui el negocio es la reserva recurrente por coleccion, no la venta suelta."),

 "tpv-tienda-iluminacion.html": (
   "TPV para Iluminación | Catálogo, Potencias y Presupuestos",
   "Busca por modelo, potencia y casquillo, y pasa un presupuesto a instalador sin salir del programa. Se instala en tu PC en un minuto.",
   "Se vende por ficha tecnica y buena parte del volumen sale de presupuestos a instaladores, no del mostrador."),

 "tpv-tienda-antiguedades.html": (
   "TPV para Anticuarios | Pieza Única, Procedencia y Margen",
   "Cada pieza con su procedencia, su precio de compra y su margen real, porque en anticuario no hay dos artículos iguales ni dos costes iguales.",
   "Cada pieza se compra a un precio distinto: el margen es por pieza, no por familia, y eso ningun TPV generico lo enseña."),

 "tpv-tienda-manualidades.html": (
   "TPV para Manualidades | Miles de Referencias Pequeñas",
   "Miles de referencias de poco importe con código propio, venta por unidad o por lote y recuento de inventario sin cerrar la tienda.",
   "El dolor es el numero de referencias baratas, no el importe de la venta."),

 "tpv-lavanderia-tintoreria.html": (
   "TPV para Tintorerías | Resguardo, Prenda y Recogida",
   "Resguardo numerado por prenda, cobro al retirar y aviso de lo que lleva semanas sin recoger. TPV local para Windows, sin cuota mensual.",
   "No es una tienda: es un servicio con dos visitas, entrega y recogida, y el cobro ocurre en la segunda. Ningun TPV de retail modela eso."),

 "tpv-textil-hogar.html": (
   "TPV para Textil Hogar | Medidas de Cama y Juegos",
   "Sábanas y juegos ordenados por medida de cama (90, 135, 150) y tejido vendido por metros, con el stock cuadrado en las dos formas.",
   "La variante no es la talla sino la medida de cama, y se vende tanto por unidad como por metro."),

 "tpv-tienda-bicicletas.html": (
   "TPV para Tiendas de Bicicletas | Taller y Nº de Cuadro",
   "Número de cuadro en la ficha y órdenes de taller con su fecha de entrega, para que la reparación no dependa de un cuaderno.",
   "Media tienda de bicis es taller: sin ordenes de reparacion el TPV solo sirve para la mitad del negocio."),

 "tpv-tienda-parafarmacia.html": (
   "TPV para Parafarmacias | Lotes y Fechas de Caducidad",
   "Lote y caducidad en cada entrada de mercancía, para retirar a tiempo lo que va a caducar en vez de descubrirlo en el inventario.",
   "Producto con caducidad y marca fuerte: lo que se pierde es la merma."),

 "tpv-tienda-cosmetica-natural.html": (
   "TPV para Cosmética Natural | Lotes, Caducidad y Granel",
   "Venta a granel y recarga de envase sin descontar un envase nuevo del stock, con lote y caducidad en cada producto.",
   "La recarga de envase es una venta sin unidad nueva: hay que poder cobrarla sin descontar stock de envase."),

 "tpv-tienda-pesca-caza.html": (
   "TPV para Tiendas de Pesca y Caza | Temporada y Stock",
   "Campañas de temporada con el stock que queda al cerrar la veda, para saber qué reponer y qué no antes del año siguiente.",
   "Negocio estacional puro: el stock que sobra en octubre no se vende hasta la temporada siguiente."),

 "tpv-tienda-decoracion.html": (
   "TPV para Decoración | Complementos, Menaje y Regalo",
   "Complementos, menaje y regalo con alta rápida por referencia y campañas de temporada, separado del catálogo de mueble grande.",
   "OJO: solapa con tpv-tienda-muebles.html, cuyo titulo ya dice 'Muebles y Decoracion'. Este angulo la separa en complemento y menaje; si no se separa de verdad, lo correcto es fusionarlas y redirigir una."),

}

# Paginas cuyo titulo tiene faltas de tilde pero NO son plantilla.
# Se reescriben igual porque una falta de ortografia en el resultado de
# Google la lee un cliente espanol como descuido de la empresa.
ACENTOS = {
 "tpv-tienda-optica.html": (
   "TPV para Ópticas | Graduaciones, Monturas y Encargos",
   "Graduación por cliente en su ficha y control de las lentes que están pedidas al laboratorio, con la montura ya reservada.",
   "Hoy: 'TPV Tienda Optica Gratis'. Sin tilde y sin decir nada del negocio."),

 "tpv-floristeria.html": (
   "TPV para Floristerías | Encargos, Fechas y Entregas",
   "Pedidos con dirección de entrega distinta de quien paga, picos de San Valentín o Todos los Santos y merma de flor fresca. Ticket con QR AEAT.",
   "Hoy: 'TPV Floristeria Gratis'. El encargo con fecha es el nucleo del negocio en floristeria y no aparece por ningun lado."),

}
