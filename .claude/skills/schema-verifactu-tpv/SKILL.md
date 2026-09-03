---
name: schema-verifactu-tpv
description: Redacta contenido y datos estructurados JSON-LD para software TPV y facturación electrónica española (VeriFactu, Ley Antifraude 11/2021, ticketBAI). Cubre las fechas vigentes del calendario, el reparto entre sociedades y autónomos, y los límites legales de lo que se puede afirmar. Úsala al escribir páginas sobre VeriFactu, facturación electrónica, obligaciones fiscales del comercio, o al generar Schema.org para un producto de software TPV.
---

# Contenido y schema para TPV y VeriFactu (España)

## Fechas: verifícalas siempre antes de publicar

El calendario de VeriFactu **se ha aplazado dos veces** y puede volver a moverse.
Nunca escribas una fecha de memoria: búscala antes de publicar.

Calendario vigente tras el **Real Decreto-ley 15/2025** (2 de diciembre de 2025):

| Quién | Desde cuándo |
|---|---|
| Sociedades y contribuyentes del Impuesto sobre Sociedades | 1 de enero de 2027 |
| Autónomos y resto de contribuyentes | 1 de julio de 2027 |
| Todos, durante 2026 | Adaptación voluntaria |

Marco normativo que sigue vigente: **Ley 11/2021** (antifraude) y **Real Decreto
1007/2023** (reglamento VeriFactu). En Álava, Bizkaia y Gipuzkoa lo aplicable es
**ticketBAI**, no VeriFactu.

## Qué puedes afirmar y qué no

Esto es contenido con consecuencias fiscales para quien lo lee. Tres reglas:

1. **Nada de alarmismo.** "Hacienda te vigila en tiempo real" es falso: se remiten
   registros de facturación, no hay acceso en directo a la caja. Tampoco existe
   ninguna tasa de la AEAT por VeriFactu.
2. **Remite al asesor.** Los plazos, el régimen aplicable y las sanciones dependen
   del caso concreto. Incluye un aviso visible de que la página es información
   general y no asesoramiento fiscal.
3. **No prometas homologación ajena.** Sobre competidores, cita solo lo que puedas
   verificar y recomienda pedir al fabricante su **declaración responsable** por escrito.

Distingue siempre VeriFactu (cómo debe comportarse tu programa de facturación) de la
**factura electrónica obligatoria** entre empresas, que viene de la Ley Crea y Crece y
tiene su propio calendario. Se confunden constantemente.

## Schema.org para un TPV

Combina en `@graph` o en bloques separados:

- **SoftwareApplication** con `applicationCategory: "BusinessApplication"`,
  `operatingSystem` y `offers` (precio y moneda).
- **FAQPage** solo con preguntas que estén **visibles en la página**. El texto del
  schema debe coincidir con el del HTML.
- **BreadcrumbList** derivado de la miga de pan real.
- **Organization** o **LocalBusiness** con `@id` estable en la portada.

### aggregateRating: el riesgo que más se subestima

No añadas `aggregateRating` salvo que las reseñas **existan de verdad y estén
visibles en esa misma página**. Una valoración autodeclarada sin reseñas a la vista
incumple las directrices de Google sobre fragmentos de reseña y expone el dominio a
una acción manual. Perder la estrellita es mucho más barato que perder la
indexación enriquecida de todo el sitio.

## Tono

El lector es un comerciante, no un fiscalista. Explica con el mostrador delante:
qué cambia al cobrar, qué imprime el ticket, qué tiene que preguntarle a su
proveedor de software. Evita el tecnicismo jurídico salvo al citar la norma.
