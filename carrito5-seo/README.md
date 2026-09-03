# carrito5-seo

Pipeline de contenido para carrito5.com (TPV gratuito para Windows).

Sitio estático, distinto de abacosoftware (ASP). Comparte con él el motor de
`../motor/`, que incluye el filtro anti-plantilla y la **comprobación cruzada
entre sitios**: los dos dominios son del mismo dueño, así que reutilizar texto
entre ellos crea contenido duplicado que perjudica a ambos.

    python3 pipeline/generar.py <dir-salida> nucleo verifactu

Comprobar duplicación entre los dos sitios:

    python3 -c "import sys; sys.path.insert(0,'../motor'); import gate; \
                gate.cruzado('<dir-carrito5>','<dir-abacosoftware>')"

La web base del cliente no está en el repo. Las tres páginas originales
(index, tpv-tienda-ropa, tpv-zapateria) se extraen del fichero de auditoría
que entregó el cliente.
