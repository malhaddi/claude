# Cómo se trabaja en este repositorio

Aquí trabajan **dos cuentas de Claude a la vez**, en sesiones que no se ven
entre sí. No hay chat compartido, no hay memoria común y ninguna de las dos se
entera de lo que la otra acaba de hacer. **El repositorio es el único canal de
comunicación.** Todo lo que no quede escrito aquí, se pierde.

Si estás leyendo esto al empezar una sesión: lee `estado/` antes de tocar nada.

## Las cuatro reglas

### 1. Nunca se trabaja en `main`

Cada sesión abre su rama y se queda en ella:

```bash
git fetch origin main
git checkout -b claude/<lo-que-haces>-<3 letras tuyas> origin/main
```

`main` solo recibe merges. Si las dos cuentas escriben en `main`, la segunda en
empujar se encuentra el rechazo y la tentación de forzar. Nadie fuerza nada.

### 2. Cada uno tiene sus carpetas

| Carpeta | Dueño | Qué es |
|---|---|---|
| `abacosoftware-seo/` | agente A | Generadores y contenido de abacosoftware.com |
| `carrito5-seo/` | agente B | Generadores y contenido de carrito5.com |
| `motor/` | **compartida** | Herramientas que usan los dos |
| `inventarios/` | **compartida** | Volcados de páginas, se regeneran |
| `informes/` | **compartida** | Salidas de análisis, se regeneran |
| `estado/` | un fichero por agente | Ver abajo |

Tocar la carpeta del otro no está prohibido, pero se avisa en tu fichero de
estado **antes**, no después.

`motor/` es lo delicado: un cambio ahí afecta a los dos sitios. Regla dura:

```bash
python3 motor/test_clusters.py     # 10/10 antes de empujar nada de motor/
```

Si añades un comportamiento a `motor/`, añades su prueba. Las diez que hay
salieron de fallos reales; sin ellas volverían.

### 3. Antes de empujar, se rebasa

```bash
git fetch origin main
git rebase origin/main
python3 motor/test_clusters.py
git push -u origin <tu-rama>
```

Commits pequeños y frecuentes. Una sesión que trabaja tres horas y empuja un
commit de 40 ficheros garantiza el conflicto.

### 4. Lo que decidas, lo escribes

En `estado/<tu-rama>.md`. **Un fichero por agente**, y por eso nunca hay
conflicto: cada uno escribe en el suyo. Un `ESTADO.md` compartido chocaría cada
vez que los dos escribieran a la vez, que es justo cuando hace falta.

Lo que va ahí: qué estás haciendo ahora, qué has decidido y por qué, y qué has
descubierto que el otro necesita saber. No un diario: lo que le ahorra trabajo
al otro.

## Contexto del proyecto

Dos webs del mismo dueño, las dos venden software TPV en España:

- **abacosoftware.com** — ASP clásico. 198 páginas, 184 en el sitemap.
- **carrito5.com** — HTML estático más algo de ASP. 74 URLs conocidas.

Y por eso importa que sean el mismo dueño: **compiten entre sí**. `motor/analizar_clusters.py`
encontró 14 intenciones de búsqueda servidas por páginas de los dos dominios.
Antes de crear una página nueva en cualquiera de los dos, se comprueba que el
otro no la tenga ya.

### Trampas que ya han costado tiempo

1. **Los ASP de abacosoftware son UTF-8 pero no declaran `@CODEPAGE`.** Poner
   `Response.CodePage = 65001` rompe todos los acentos por doble codificación.
   Solo es seguro `Response.CharSet = "utf-8"`.
2. **No se puede descargar carrito5.com desde el entorno**: el proxy de salida
   lo bloquea. El inventario está reconstruido desde el índice de búsqueda y es
   un suelo, no el total.
3. **El plan gratuito es «Plan Inicio, hasta 1.000 artículos».** El «50 tickets
   al mes» que aparece en el dossier interno del cliente **es falso** y
   contradice su propia web. No publicarlo.
4. **Nunca se sobrescribe una página viva** sin comprobar que existe. Hubo un
   intento que iba a machacar `descargar-tpv-gratis.html`, que es la página de
   descargas. Lo que colisione va a `_propuestas/`.
5. **El `aggregateRating` de 4,9 sobre 318 valoraciones** se declara sin reseñas
   visibles. Es riesgo de acción manual de Google. Decisión pendiente del
   cliente: no tocarlo por cuenta propia.

### La regla de calidad

Nada de plantillas. El filtro está en `motor/gate.py` y el umbral es **0,45** de
similitud de Jaccard sobre el texto visible.

Está medido: generar páginas desde una base de hechos con andamiaje común da
**0,75–0,91**, porque el texto propio del tema apenas pesa un 23 %. Escritas a
mano se quedan en **0,24–0,41**. No hay atajo. Si el gate rechaza tu página,
tiene razón.

Esto vale también para los títulos y las meta-descripciones: quince
descripciones que acaban todas en «TPV local para Windows sin cuota mensual» son
una plantilla, y encima en el sitio donde más se nota.
