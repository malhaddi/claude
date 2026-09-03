---
name: seo-audit-tecnico
description: Audita técnicamente un sitio web estático o en ASP/PHP a partir de sus ficheros locales (un ZIP descomprimido o un repositorio) y aplica las correcciones directamente sobre los archivos. Detecta canibalización por contenido duplicado, páginas huérfanas, metadatos ausentes o desbordados, jerarquía de encabezados rota, JSON-LD inválido, conflictos entre robots.txt y sitemap, y URLs duplicadas de portada. Úsala cuando el usuario entregue los ficheros de su web y pida auditarla, posicionarla mejor, corregirla o "dejarla lista para SEO", incluso si no dice la palabra auditoría.
---

# Auditoría SEO técnica sobre ficheros locales

Trabaja siempre sobre una **copia** del sitio (`cp -r web site`), nunca sobre el original:
así puedes diferenciar lo que había de lo que has cambiado.

## 1. Inventario inicial

Antes de tocar nada, mide. Sin números no hay prioridades.

```bash
ls *.asp *.html | wc -l                       # páginas totales
grep -L 'rel="canonical"' *.asp | wc -l       # sin canonical
grep -L 'og:title' *.asp | wc -l              # sin OpenGraph
grep -L 'application/ld+json' *.asp | wc -l   # sin datos estructurados
```

Cuenta también palabras de texto visible por página (quitando `<%...%>`, `<script>`,
`<style>` y etiquetas). Menos de 300 palabras es contenido fino.

## 2. Los siete fallos que más cuestan

Búscalos en este orden, que es el de impacto decreciente:

1. **Canibalización.** Compara el texto visible de todas las páginas por similitud de
   Jaccard. Por encima de 0,72 hay duplicado real. Dos páginas con el mismo `<title>`
   y `canonical` propio compiten entre sí y pierden las dos.
2. **Páginas huérfanas.** Una página sin enlaces entrantes internos no se rastrea bien
   aunque esté en el sitemap. Cuenta cuántos ficheros enlazan a cada uno.
3. **Metadatos.** `title` de 25 a 65 caracteres, `description` hasta 165. Por encima,
   Google los corta; por debajo, desaprovechas espacio.
4. **Jerarquía de encabezados.** Exactamente un `<h1>` por página y sin saltos de H1 a H3.
5. **JSON-LD roto.** Un bloque que no parsea es peor que no tenerlo. Valida todos con
   `json.loads` antes de dar nada por bueno.
6. **robots.txt contra sitemap.** Cruza ambos: ninguna URL del sitemap puede estar
   bloqueada. Cuidado con reglas demasiado amplias tipo `Disallow: /*202*.asp`, que
   bloquean cualquier fichero que contenga "202" (incluido "2027").
7. **Portada duplicada.** Si conviven `index.html` e `index.asp` sirviendo lo mismo,
   unifica los enlaces internos a `/` y redirige con 301.

## 3. Corregir sin romper

Las correcciones masivas se hacen con scripts **idempotentes**: comprueba siempre si
la etiqueta ya existe antes de insertarla, para poder ejecutar el script dos veces.

Reglas que evitan estropear el sitio:

- Nunca toques texto dentro de `<script>`, `<style>`, `<%...%>` ni atributos HTML
  cuando edites contenido visible.
- Si limpias el texto visible de una FAQ, limpia igual el JSON-LD correspondiente:
  Google exige que el schema coincida con lo que ve el usuario.
- No pongas `loading="lazy"` en el logo ni en las dos primeras imágenes: suelen ser
  el LCP y retrasarlas empeora Core Web Vitals.

### Trampa de codificación en ASP clásico

Si los `.asp` están guardados en UTF-8 pero no declaran `@CODEPAGE`, ASP los lee con
la codepage ANSI del servidor. Ese viaje suele ser lossless, así que los bytes que
salen ya son UTF-8 válidos.

**Poner `Response.CodePage = 65001` sin `@CODEPAGE=65001` provoca doble codificación
y rompe todos los acentos.** Lo seguro es declarar solo la cabecera:

```asp
<%
Response.CharSet = "utf-8"
%>
```

## 4. Entregable

Un informe con hallazgos priorizados por impacto y esfuerzo, los cambios realmente
aplicados con su recuento, y el backlog de lo que queda. Distingue siempre lo que has
ejecutado de lo que solo has recomendado.
