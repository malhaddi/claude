# Carrito5.com — inventario real y primeros arreglos

Fecha: 3 de septiembre de 2026

## Cómo se ha obtenido esto (y qué fiabilidad tiene)

La descarga directa de `carrito5.com` está **bloqueada por el proxy de salida** de
este entorno: tanto `curl` como el lector de páginas devuelven 403 / `EGRESS_BLOCKED`.
No es un problema de la web del cliente.

Así que el inventario se ha reconstruido **desde el índice de búsqueda**, consultando
el sitio por bloques temáticos. Consecuencia importante:

> Las **73 URLs** de `inventario/urls_descubiertas.txt` son un **suelo, no el total**.
> Hay al menos un bloque que sé que existe y que no he podido enumerar entero: las
> páginas de barrio (Salamanca, Malasaña, Chamberí, Sol, Retiro, Ruzafa, Colón,
> Triana, Nervión…), que aparecen citadas en los menús pero no salen una a una.
> Con el `sitemap.xml` tendría el total exacto en un minuto.

El dossier que se me pasó al principio contenía **3 páginas**. La web viva tiene
**73 o más**. Todo lo que dije basándome en aquel dossier hay que darlo por caducado.

## 1. Duplicado real: la misma página en dos URLs

```
https://www.carrito5.com/tpv-tienda-instrumentos-musica.html
https://www.carrito5.com/tpv-tiendas-instrumentos-musica.html
```

Singular y plural. Dos URLs, misma intención de búsqueda. Google elegirá una y la
otra se queda sin posición, además de repartir en dos el enlazado interno que
debería ir a una sola.

**Qué hacer:** quedarse con `tpv-tienda-instrumentos-musica.html` (su título ya está
bien escrito, con tilde en «Música») y hacer un **301** desde la otra.

## 2. Dos esquemas de URL de ciudad compitiendo entre sí

| Esquema A | Esquema B |
|---|---|
| `tpv-zaragoza.html` | `software-tpv-zaragoza-centro-delicias.html` |
| `tpv-malaga.html` | `software-tpv-malaga-larios-centro.html` |
| `tpv-alicante.html`, `tpv-vigo.html`, `tpv-murcia.html` | `software-tpv-bilbao-gran-via-casco-viejo.html`, `software-tpv-sevilla-centro-tetuan.html`, `software-tpv-sabadell-terrassa.html` |
| — | `software-tpv-barcelona.html`, `software-tpv-valencia.html` |

En Zaragoza y en Málaga **existen las dos**, y las dos van a por «TPV \<ciudad\>».

**Qué hacer:** decidir un único patrón. Lo razonable es que la página de ciudad sea
la genérica (`tpv-zaragoza.html`) y que la de barrio, si se mantiene, hable de verdad
del barrio (comercios de esa calle, horarios, competencia local) y enlace hacia
arriba. Si no puede decir nada específico del barrio, no debería existir.

## 3. Trece páginas con el título generado desde el nombre del fichero

Este es el hallazgo con más recorrido y el más barato de arreglar.

```
Tpv Tienda Iluminacion | Carrito5 TPV
Tpv Tienda Antiguedades | Carrito5 TPV
Tpv Lavanderia Tintoreria | Carrito5 TPV
...
```

Tres defectos a la vez, y los tres los ve el cliente en Google antes de entrar:

1. **`Tpv`** en vez de `TPV`. Son siglas; en minúsculas delatan un *title-case*
   automático aplicado al slug.
2. **Sin tildes**: «Iluminacion», «Antiguedades», «Electrodomesticos», «Cosmetica».
   Un comerciante español lee eso como una falta de ortografía de la empresa.
3. **No prometen nada**. El título repite el nombre del fichero. No hay ni una razón
   para preferir ese resultado al del competidor de al lado.

**Ya está hecho:** los 13 títulos y sus meta-descripciones están reescritos a mano en
`contenido/titulos_reescritos.py`, y exportados para quien edite las páginas en
`inventario/titulos_propuestos.tsv`. Se añaden 2 más (`tpv-tienda-optica.html`,
`tpv-floristeria.html`) que no eran plantilla pero sí tenían faltas de tilde.

Cada uno parte de lo que ese negocio hace en el mostrador:

| Página | Título nuevo |
|---|---|
| tintorería | TPV para Tintorerías \| Resguardo, Prenda y Recogida |
| bicicletas | TPV para Tiendas de Bicicletas \| Taller y Nº de Cuadro |
| anticuarios | TPV para Anticuarios \| Pieza Única, Procedencia y Margen |
| electrodomésticos | TPV para Electrodomésticos \| Nº de Serie y Garantías |
| ópticas | TPV para Ópticas \| Graduaciones, Monturas y Encargos |

Los 15 pasan el control anti-plantilla del motor: **similitud máxima 0,26** entre
descripciones, con umbral 0,45. Ninguno pasa de 60 caracteres.

> Nota de honestidad: la primera versión que escribí **no pasó** (0,50). Las quince
> descripciones acababan reciclando cuatro cierres del tipo «TPV local para Windows
> sin cuota mensual». Era mi propia plantilla, en el sitio donde más se nota. Están
> reescritas para que el cierre también sea del sector.

## 4. Dos cosas que parecen despistes de publicación

- **`tpv_gratis_verifactu_bonito.html`** está indexada. Guiones bajos en vez de
  guiones, y la palabra «bonito» en el nombre del fichero: tiene toda la pinta de una
  prueba que se quedó publicada. Compite con `verifactu-gratis.html`.
- **`pg/condiciones.asp` se titula «El cofre de tu vida»**. Ese título no es de este
  negocio. Está en una página legal, que es de las que más mira un cliente antes de
  descargar software de facturación.

## 5. Solapes de sector que conviene revisar

| Se pisan | Comentario |
|---|---|
| `tpv-herboristeria.html` · `tpv-herboristeria-parafarmacia.html` · `tpv-tienda-parafarmacia.html` | Tres páginas para dos negocios |
| `tpv-colchones-financiacion-pagos.html` · `tpv-colchonerias-descanso.html` | La primera va de financiación; separables si se respeta ese ángulo |
| `tpv-electronica-informaticas.html` · `tpv-informatica-telefonia.html` | Solapan en informática |
| `tpv-tienda-muebles.html` («Muebles y Decoración») · `tpv-tienda-decoracion.html` | El título de muebles ya se lleva «decoración» |
| `tpv-comercio.html` · `software-tpv-comercio-local.html` | Las dos genéricas de comercio minorista |

No todas son un error. `tpv-zapateria.html` + `tpv-zapateria-hardware.html` +
`programa-stock-zapateria.html` **sí** están bien: una por intención distinta
(producto, hardware, control de stock). Ese es el patrón a copiar en el resto.

## 6. Confirmado por fuente independiente

El plan gratuito es **Plan Inicio, hasta 1.000 artículos**. Lo dicen las propias
páginas vivas recogidas en el índice. Queda confirmada la corrección que ya hice: el
«50 tickets al mes» del dossier interno **es incorrecto** y no debe publicarse.

## Pendiente

1. `sitemap.xml` para cerrar el inventario (bloqueado por el proxy, lo tiene que
   pasar el cliente).
2. Enumerar el cluster de barrios.
3. Decidir el patrón de URL de ciudad antes de escribir una sola página nueva.
4. El `aggregateRating` de 4,9 sobre 318 valoraciones sigue declarándose sin reseñas
   visibles. Es riesgo de acción manual. Decisión del cliente: retirarlo o publicar
   las reseñas.
