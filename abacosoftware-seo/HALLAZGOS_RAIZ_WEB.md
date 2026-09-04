# Ficheros publicados que no deberían estarlo — abacosoftware.com

Encontrado recorriendo el árbol completo de la web entregada, no solo la raíz.
Se comprueba con `pipeline/limpieza_raiz.py` (informe por defecto, `--aplicar`
para retirarlos a `_retirados/`).

## Lo primero, porque es lo que más asusta y no es lo que parece

**`Copia de global.asa` NO contiene credenciales.** Lo he comprobado buscando
patrones de cadena de conexión, usuario, contraseña, ruta de datos y servidor
SQL: ninguno aparece. Son 52 líneas de VBScript con variables de sesión del
carrito (`Session("Compras")`, `Session("Total")`, `Session("FormaDePago")`,
`Session("TotalPortes")`…), y además es una versión vieja: al original le falta
`Session("TotalSinIVA")`, que sí está en el `global.asa` bueno.

Dicho eso, el fichero **sí debería retirarse**. IIS protege `global.asa` por su
nombre exacto: no lo sirve nunca. Un fichero llamado `Copia de global.asa` no
entra en esa protección, así que su código VBScript se puede servir como texto
plano a quien lo pida. No hay secretos dentro, pero sí queda expuesta la lógica
de sesión de la tienda.

## Los once ficheros

| Tipo | Fichero | Tamaño |
|---|---|---|
| BINARIO | `10.exe` | 86 KB |
| BINARIO | `Test.exe` | 24 KB |
| BINARIO | `replica.exe` | 193 KB |
| COPIA | `Copia de global.asa` | 1,2 KB |
| COPIA | `tpv_consultas_desde_web_med -09-10-2023.asp` | 2,2 KB |
| COPIA | `tpv_consultas_desde_web_medNO.asp` | 2,1 KB |
| COPIA | `css/estilo-abaco-nuevo30-11-2023.css` | 40 KB |
| COPIA | `css/estilo-abaco30-11-2023.css` | 38 KB |
| CARPETA | `archivojs/copias/` | 3 ficheros |
| ESCRITORIO | `abacosoftware - Acceso directo.lnk` | 734 B |
| PRUEBA | `test.txt` (contiene «hello world») | 11 B |

### Los ejecutables

`Test.exe` y `10.exe` son VB6 (`MSVBVM60.DLL`) y usan `MSCommLib.MSComm`: son
utilidades internas de prueba de puertos serie, seguramente para cajones y
tickeras. `replica.exe`, pese a la extensión, **es un ZIP**.

El problema no es que sean peligrosos. El problema es dónde están: en un dominio
cuyo negocio es «descárgate nuestro programa», tres ejecutables que nadie anuncia
ni enlaza son exactamente lo que penalizan la reputación del navegador y los
antivirus. Y son herramientas internas expuestas al público.

### Los CSS con fecha

`estilo-abaco-nuevo30-11-2023.css` y `estilo-abaco30-11-2023.css` suman 78 KB y
**los referencian cero páginas**. Las que se usan de verdad son
`bootstrap.min.css` (103 páginas), `all.min.css` (96) y `abaco-moderno.css` (96).

### `abacosoftware - Acceso directo.lnk`

Un acceso directo de Windows. Alguien arrastró su icono del escritorio al subir
la web.

## Cuatro errores que cometí escribiendo la herramienta

Los apunto porque son la razón de que ahora me fíe de ella:

1. La regla del sufijo `NO.asp` marcaba `negocio_segunda_ma**no**.asp` como
   descarte, porque no distinguía mayúsculas. Iba a retirar una página real; solo
   la salvó la comprobación de enlaces. Ahora la regla es sensible a mayúsculas y
   separa `medNO.asp` de `mano.asp`.
2. El chequeo de enlaces daba por «enlazado» un fichero que **se nombraba a sí
   mismo**. Un fichero que se cita dentro no tiene enlaces entrantes.
3. La regla `\bcopia\b` marcaba `copia-seguridad-tpv.asp`, que es una página
   legítima sobre copias de seguridad. Ahora solo casa el prefijo que pone
   Windows al duplicar (`Copia de …`).
4. `prueba_gratis.css` lo clasifiqué como resto de desarrollo. **«Prueba gratis»
   es el producto**, no una prueba. Está sin usar, pero eso es otra cosa y no
   justifica retirarlo por esta vía. Excluido a propósito.

Y una más, de método: la primera versión solo miraba la raíz y se dejó
`archivojs/copias/` entera. Ahora recorre el árbol.

## Estado de la entrega

El ZIP `ABACOSOFTWARE_WEB_SEO_CORREGIDA.zip` arrastraba estos mismos ficheros,
porque mi construcción copiaba el árbol completo. Ya está reempaquetado:

```
  1.019 ficheros    198 páginas    184 URLs en el sitemap
  basura restante dentro del ZIP: ninguna
```

Nada de lo retirado estaba enlazado desde ninguna página ni aparecía en el
sitemap, así que no se rompe ninguna ruta. Todo queda en `_retirados/` por si
alguno hiciera falta.
