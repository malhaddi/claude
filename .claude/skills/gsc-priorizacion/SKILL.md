---
name: gsc-priorizacion
description: Prioriza trabajo SEO cruzando exportaciones de Search Console, Semrush o Ahrefs con las páginas reales del sitio. Detecta posiciones 4-15 con potencial de empuje, impresiones altas con CTR bajo, y huecos de contenido con volumen y dificultad baja. Úsala cuando el usuario aporte CSV de keywords, datos de Search Console o informes de Semrush y quiera saber por dónde empezar.
---

# Priorización SEO con datos reales

## Antes de nada: comprueba qué datos hay de verdad

Los exports llegan con columnas vacías más veces de lo que parece. Verifica la
cobertura real antes de prometer un análisis:

```python
gsc = [r for r in rows if r.get('GSC_Impressions')]
pos = [r for r in gsc if r.get('GSC_Position')]
print(len(rows), len(gsc), len(pos))
```

Si `GSC_Position` y `GSC_Clicks` vienen vacías, **no puedes calcular CTR ni detectar
posiciones 4-15**. Dilo claramente en lugar de inventar el análisis. Con solo
impresiones todavía puedes trabajar: son consultas donde Google ya considera
relevante el dominio, que es la señal más barata de aprovechar.

Ojo con los ficheros "gap": la columna del dominio propio suele venir a cero **por
construcción** (son justo las keywords donde no posicionas). Eso no significa que el
sitio no posicione para nada.

## Orden de prioridad

1. **Posiciones 4-15 con volumen.** El empuje más barato que existe: la página ya
   existe y ya rankea. Mejorar título, intención y enlazado interno mueve más que
   crear contenido nuevo.
2. **Impresiones altas con CTR bajo.** Problema de título y meta description, no de
   contenido. Se arregla en minutos.
3. **Huecos con volumen alto y KD baja.** Filtra por `KD <= 30` y `volumen >= 200`.
   Ahí es donde una página nueva rinde rápido.
4. **Clusters completos frente a páginas sueltas.** Si una raíz tiene decenas de
   variantes (por ejemplo VeriFactu: "qué es", "cuándo entra en vigor", "autónomos",
   "gratis"), una sola página no las captura. Una página por intención.

## Filtrar el ruido

Los exports de keywords traen mucha basura no relacionada con el negocio. Filtra por
patrón antes de sacar conclusiones, o acabarás recomendando contenido sobre
"calcular porcentaje" a un fabricante de TPV:

```python
PAT = re.compile(r'\b(tpv|punto de venta|verifactu|factura|software|comercio|tienda|stock)', re.I)
```

Revisa también la intención: "navegacional" hacia una marca ajena rara vez compensa.

## Preguntas también revelan intención

Los árboles de AlsoAsked o People Also Ask muestran cómo formula la gente el problema,
y a veces destapan una confusión de mercado explotable. Ejemplo real del sector TPV:
casi todas las preguntas de "TPV" en España son sobre **comisiones de datáfono
bancario**, no sobre software de punto de venta. Una página que desambigüe ambos
conceptos captura ese volumen y además posiciona la propuesta de valor.

## Entregable

Un plan a 30, 60 y 90 días. En los primeros 30, solo cosas que ya se pueden ejecutar
sobre páginas existentes. Contenido nuevo a partir del día 30. Y di siempre qué
decisión se apoya en datos y cuál en criterio.
