# SEO de abacosoftware.com y carrito5.com

Dos webs del mismo dueño, las dos venden software TPV en España. Este
repositorio tiene los generadores de contenido, las herramientas de análisis y
los informes. **No contiene los ficheros de las webs**: esos se entregan aparte.

Trabajan aquí dos cuentas de Claude a la vez. **Lee `CLAUDE.md` antes de tocar
nada**, y después `estado/`.

## Qué hay

```
motor/               herramientas compartidas por los dos sitios
abacosoftware-seo/   generadores y contenido de abacosoftware.com
carrito5-seo/        generadores y contenido de carrito5.com
inventarios/         volcado de las páginas de cada sitio (TSV)
informes/            salidas de análisis
estado/              un fichero por agente: el canal entre sesiones
.claude/skills/      4 skills del proyecto
```

## Empezar

```bash
python3 motor/test_clusters.py                          # 10/10
python3 motor/analizar_clusters.py paginas inventarios/*.tsv
python3 motor/analizar_clusters.py keywords export.csv -- inventarios/*.tsv
```

`motor/README.md` explica cómo agrupa y, sobre todo, las cinco cosas que se
aprendieron rompiéndolo.

## Dónde está el trabajo

| | abacosoftware.com | carrito5.com |
|---|---|---|
| Tecnología | ASP clásico | HTML estático + algo de ASP |
| Páginas | 198 (184 en sitemap) | 74 conocidas |
| Inventario | completo | **suelo, no total** (el proxy bloquea el dominio) |

### Lo que está pendiente y por qué

1. **`sitemap.xml` de carrito5.com.** Lo tiene que pasar el cliente. Cierra a la
   vez el inventario real y la pregunta de Madrid.
2. **Madrid no tiene página** en carrito5.com. Hay para Vigo y para Murcia. O no
   existe (mayor hueco del sitio) o existe sin indexar (páginas huérfanas). El
   sitemap lo resuelve.
3. **14 intenciones servidas por los dos dominios a la vez.** Ver
   `informes/clusters_cruzados.txt`.
4. **11 ficheros publicados que no deberían estarlo** en abacosoftware.com. Ver
   `abacosoftware-seo/HALLAZGOS_RAIZ_WEB.md`. Retirados del ZIP entregado, pero
   **siguen en el servidor** hasta que alguien los borre.
5. Profundizar las ~30 páginas de sector más flojas de abacosoftware.
