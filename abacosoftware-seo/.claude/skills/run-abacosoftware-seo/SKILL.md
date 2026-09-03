---
name: run-abacosoftware-seo
description: Construye, verifica, previsualiza y empaqueta el sitio SEO de abacosoftware.com (Caja 5 TPV). Úsala para generar las páginas, añadir contenido nuevo, pasar el filtro anti-plantilla, auditar el SEO técnico, hacer una captura de una página o producir el ZIP entregable. Palabras clave: run, build, generar páginas, screenshot, captura, validar, sitemap, empaquetar, abacosoftware, Caja 5.
---

# Sitio SEO de abacosoftware.com

Pipeline que toma la web del cliente (ASP clásico) y le añade la capa técnica SEO
más ~80 páginas de contenido escritas a mano. Todo se maneja con un único driver:
`.claude/skills/run-abacosoftware-seo/driver.py`.

**Las rutas de este documento son relativas a `abacosoftware-seo/`.**

No hay servidor de aplicaciones: las páginas son `.asp` con includes. El comando
`preview` resuelve los includes, elimina el código `<% %>` y sirve el HTML para
poder abrirlo en Chromium. Es la única forma de ver una página sin IIS.

## Requisitos

Todo lo necesario ya está en el contenedor. Solo `Pillow` hace falta si vas a
recortar capturas:

```bash
pip install --quiet --retries 2 --timeout 60 Pillow
```

Chromium está en `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; el driver
lo localiza solo. No instales Playwright: no se usa.

## Preparar la web base

El pipeline **modifica el directorio in situ**. Trabaja siempre sobre una copia:

```bash
rm -rf /tmp/prueba && cp -r <dir-web-original> /tmp/prueba
```

`<dir-web-original>` es el ZIP del cliente descomprimido (unos 880 ficheros).
No está en el repo: es material del cliente y pesa 8 MB.

## Camino del agente

### Construir todo

```bash
python3 .claude/skills/run-abacosoftware-seo/driver.py build --base /tmp/prueba
```

Ejecuta, en orden: capa técnica (OpenGraph, breadcrumbs, lazy loading, charset),
los seis generadores de contenido, limpieza anti-clichés, metadatos, recorte de
títulos y, al final, enlazado interno y sitemap. Salida esperada:

```
  paginas indexables : 185
  palabras visibles  : 171.245
  URLs en sitemap    : 178
```

**El orden importa.** `enlazado_y_sitemap.py` va el último: recorre las páginas
que existen en ese momento, así que si lo ejecutas antes de los generadores el
sitemap sale corto (101 URLs en vez de 178) y las páginas nuevas quedan huérfanas.

### Filtro anti-plantilla

```bash
python3 .claude/skills/run-abacosoftware-seo/driver.py gate \
    --base /tmp/prueba --original <dir-web-original>
```

Compara por Jaccard el texto visible de todas las páginas nuevas. Umbral 0,45.
Sale con código 1 si algún par lo supera. Resultado esperado:

```
  paginas comparadas: 77
  similitud media 0.24   maxima 0.41   umbral 0.45
  pares por encima del umbral: 0
```

`--original` limita la comparación a lo nuevo; sin él compara las 185.

### Auditoría SEO

```bash
python3 .claude/skills/run-abacosoftware-seo/driver.py validate --base /tmp/prueba
```

Comprueba title, description, canonical, OpenGraph, breadcrumb, un solo H1,
longitudes de SERP, validez de todo el JSON-LD y que el sitemap no apunte a
ficheros inexistentes. Todo debe salir `ok`; devuelve 1 si algo falla.

### Ver una página (captura)

```bash
python3 .claude/skills/run-abacosoftware-seo/driver.py preview \
    --base /tmp/prueba --page negocio_ferreteria.asp --out /tmp/pagina.png
```

Levanta un `http.server` en un puerto libre, resuelve los includes ASP y captura
con Chromium headless. **Mira la captura.** Ahí es donde aparecen los fallos que
ninguna validación de HTML detecta: en esta sesión salió un botón blanco sobre
fondo blanco que afectaba a las 40 páginas con barra lateral.

Para ver un detalle de cerca:

```bash
python3 -c "
from PIL import Image
Image.open('/tmp/pagina.png').crop((840,730,1230,1120)).save('/tmp/detalle.png')"
```

### Empaquetar

```bash
python3 .claude/skills/run-abacosoftware-seo/driver.py package \
    --base /tmp/prueba --out /tmp/ABACOSOFTWARE_WEB_SEO_CORREGIDA.zip
```

## Añadir páginas nuevas

Es la operación más frecuente. Las páginas se escriben a mano en un módulo de
`contenido/` y el generador solo pone la maqueta.

1. Crea `contenido/<cluster>_<n>.py` con un dict cuyo nombre empiece por un
   prefijo registrado en `HUBS` dentro de `pipeline/gen_generico.py`
   (`ABRIR`, `OPERATIVA`, `NORMATIVA`). Copia la forma de
   `contenido/operativa_1.py`: cada entrada lleva `title`, `desc`, `kw`, `h1`,
   `sub`, `icono`, `crumb`, `bloques`, `faqs` y `rel`.
2. Añade el módulo a la lista `gen_generico.py` dentro de `GENERADORES` en
   `driver.py`.
3. `build`, luego `gate`, luego `preview` de una de las nuevas.

**No generes páginas a partir de una base de hechos con plantilla.** Se probó y
da 0,75–0,91 de similitud: el andamiaje compartido pesa el 77 % del texto. Las
páginas escritas a mano se quedan en 0,28–0,41. El `gate` las rechazará.

## Gotchas

- **Los módulos del pipeline esperan `./site`.** El driver monta un directorio
  temporal con enlaces simbólicos y un `site` que apunta a `--base`. Como Python
  resuelve el enlace para fijar `sys.path[0]`, hay que forzar `PYTHONPATH`, o
  todos los generadores fallan con `ModuleNotFoundError: plantilla`.

- **Nunca pongas `Response.CodePage = 65001`.** Los `.asp` están guardados en
  UTF-8 pero no declaran `@CODEPAGE`, así que ASP los lee con la codepage ANSI
  del servidor. Ese viaje es hoy byte a byte reversible. Poner `CodePage` sin la
  directiva provoca doble codificación y rompe todos los acentos del sitio. El
  pipeline solo declara `Response.CharSet = "utf-8"`, que etiqueta la cabecera
  sin tocar los bytes.

- **`btn-hero-secondary` solo sirve sobre el héroe oscuro.** Lleva
  `color:#ffffff !important`; sobre la barra lateral clara el botón desaparece.
  Usa estilo propio en cualquier fondo claro.

- **`robots.txt` tenía `Disallow: /*202*.asp`.** Bloqueaba cualquier fichero con
  «202» en el nombre, incluido un futuro `verifactu-2027.asp`. Ya está corregido,
  pero revisa las reglas nuevas que añadas: son más amplias de lo que parecen.

- **`limpiar_copy.py` toca también el JSON-LD.** Si limpias el texto visible de
  una FAQ y no el schema, dejan de coincidir y Google puede ignorarlo. El script
  parsea cada bloque `ld+json` y aplica la misma transformación a los valores.

- **`aggregateRating` en 34 páginas sin reseñas visibles.** Riesgo de acción
  manual de Google. Se dejó intacto a propósito: es decisión del cliente
  publicar las reseñas o retirar el schema. No lo toques sin preguntar.

- **El recorte de títulos deja finales colgantes.** «...sin Cerrar al» es peor
  que un título largo. `recortar_titulos.py` tiene una lista `MANUALES` para los
  casos que el algoritmo resuelve mal; añade ahí los que aparezcan.

## Troubleshooting

| Síntoma | Causa y arreglo |
|---|---|
| `ModuleNotFoundError: No module named 'plantilla'` en los generadores | Falta `PYTHONPATH` al lanzar el script desde el directorio temporal. Ya lo hace `correr()` en el driver; si escribes un lanzador nuevo, replícalo. |
| `build` deja el sitemap en 101 URLs | Los generadores fallaron y `enlazado_y_sitemap.py` solo vio las páginas originales. Mira la salida de la sección «generadores de contenido». |
| `gate` sale con código 1 | Hay páginas demasiado parecidas. Reescribe la que se repite dando a cada una la estructura de su propio tema, no un esquema común. |
| `preview` no genera captura | Chromium no está donde espera el glob. Comprueba con `ls /opt/pw-browsers/*/chrome-linux/chrome`. |
| `IndexError: list index out of range` al importar `gen_competidores` | Lee `sys.argv[2]` al importarse. Ya está guardado con `if len(sys.argv) > 2`. |
| La captura sale con el banner de cookies tapando el contenido | Es el comportamiento real del sitio. Para ver lo de debajo, recorta la imagen o sube `--height`. |
