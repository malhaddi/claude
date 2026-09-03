---
name: limpieza-cliches-ia
description: Elimina patrones de escritura de IA en copy en español, respetando el HTML y manteniendo el JSON-LD sincronizado con el texto visible. Quita rayas em, adverbios de relleno en -mente, contrastes binarios y aperturas de carraspeo. Úsala tras generar o revisar contenido web, fichas de producto, páginas SEO o textos de marketing en español.
---

# Limpieza de clichés de IA en copy español

## Qué se quita

**Rayas em (—).** No se usan en copy español natural. Sustituye por dos puntos cuando
separan etiqueta de explicación, por coma en incisos, o parte la frase en dos.

**Adverbios de relleno en -mente.** Fuera: `exactamente`, `perfectamente`,
`justamente`, `realmente`, `claramente`, `simplemente`, `sencillamente`, `plenamente`,
`extremadamente`. Se conservan los que aportan información: `normalmente`,
`habitualmente`, `automáticamente`, `parcialmente`, `periódicamente`,
`obligatoriamente`, `necesariamente`.

**Contrastes binarios.** "No es X, es Y" y "no se trata de X, sino de Y". Afirma Y
directamente.

**Carraspeo inicial.** "Aquí tienes", "Esto es lo que", "En este artículo veremos",
"Vamos a ver". Entra en materia.

**Muletillas.** "La clave está en", "En un mundo donde", "Y eso es precisamente",
"No solo... sino también".

**Ritmo metronómico.** Tres frases seguidas de longitud parecida cansan. Parte una.
Dos elementos suelen leerse mejor que tres. No cierres cada párrafo con una frase
lapidaria.

## Cómo se hace sin romper el HTML

Nunca apliques un `replace` global sobre el fichero: destrozarías atributos, rutas y
código. Calcula los **tramos de texto visible** excluyendo `<script>`, `<style>`,
`<%...%>` y todo lo que esté dentro de `<...>`, y transforma solo esos tramos.

```python
def visible_spans(s):
    bloqueado = []
    for m in re.finditer(r"<%.*?%>|<script.*?</script>|<style.*?</style>", s, re.S | re.I):
        bloqueado.append((m.start(), m.end()))
    for m in re.finditer(r"<[^>]+>", s):
        bloqueado.append((m.start(), m.end()))
    # fusiona solapes y devuelve los huecos
```

### El JSON-LD hay que limpiarlo también

Si limpias una FAQ visible y no tocas su `FAQPage`, el schema deja de coincidir con
la página y Google puede ignorarlo. Parsea cada bloque `application/ld+json`, aplica
la misma transformación a los **valores de texto** (nunca a `@context`, `@type`,
`@id`, `url`, `item`, `logo`) y vuelve a serializar. Valida con `json.loads` después.

## Verificación

Vuelve a escanear al terminar y reporta el antes y el después por patrón. Si la
cuenta no baja, la limpieza no se ha aplicado donde creías.

Revisa además que no hayan quedado finales colgantes tras recortar frases o títulos:
un texto que acaba en `de`, `al`, `la`, `con`, `y`, `una` está cortado a mitad. Es el
fallo más habitual al truncar títulos a 65 caracteres.

## Lo que no se toca

Los tecnicismos correctos, las cifras y las citas literales. Limpiar no es
empobrecer: si al quitar un adverbio la frase pierde precisión, déjalo.
