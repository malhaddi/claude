# Cómo pasar el proyecto al repositorio nuevo

El paquete es `tpv-seo.bundle` (291 KB). Es un repositorio de git entero
—historia, ramas y todo— dentro de un solo fichero. Está verificado: se clona en
limpio, pasa las 10 pruebas y produce las mismas cifras.

Si prefieres no pelearte con bundles, `tpv-seo.zip` es lo mismo con la carpeta
`.git` dentro; se descomprime y ya es un repositorio.

## Lo que lleva

11 commits, 63 ficheros. **No** lleva el lector de PDF ni el bloque de Shopify,
que estaban en `malhaddi/claude` mezclados con esto. Los mensajes de commit
originales se conservan: ahí está el porqué de cada decisión.

## Pasos

**1. Crea el repositorio vacío** en la cuenta nueva. Sin README, sin .gitignore,
sin licencia: tiene que estar vacío de verdad.

**Que sea privado.** No hay credenciales dentro, lo comprobé, pero
`abacosoftware-seo/HALLAZGOS_RAIZ_WEB.md` dice exactamente qué ficheros hay
publicados de más en el servidor del cliente. En un repositorio público eso es
un mapa para cualquiera.

**2. Súbelo:**

```bash
git clone tpv-seo.bundle tpv-seo
cd tpv-seo
git remote set-url origin https://github.com/<cuenta>/<repo>.git
git push -u origin main
```

**3. Protege `main`** en Ajustes → Branches: que nadie empuje directo. Con dos
agentes trabajando a la vez es la diferencia entre merges y pisotones.

## Para que las dos sesiones trabajen a la vez

Lo que hace falta ya está dentro del repositorio:

- **`CLAUDE.md`** en la raíz. Las dos sesiones de Claude Code lo leen solas al
  arrancar. Ahí están las cuatro reglas y las trampas del proyecto.
- **`estado/`**, un fichero por agente. Éste es el punto importante: las dos
  sesiones **no se ven**. No hay chat común ni memoria compartida, y ninguna se
  entera de lo que la otra acaba de hacer. El repositorio es el único canal.

Un fichero por agente y no un `ESTADO.md` compartido, porque un fichero
compartido choca justo cuando los dos escriben a la vez, que es exactamente
cuando importa que no choque.

### El reparto que propongo

| Carpeta | Quién |
|---|---|
| `abacosoftware-seo/` | agente A |
| `carrito5-seo/` | agente B |
| `motor/` | los dos, con cuidado |

`motor/` es lo delicado: un cambio ahí afecta a los dos sitios. Regla dura,
`python3 motor/test_clusters.py` en verde (10/10) antes de empujar nada de esa
carpeta. Las diez pruebas salieron de fallos reales; sin ellas volverían.

### Lo primero que debería hacer cada agente

Leer `CLAUDE.md`, luego todo `estado/`, y escribir su propio fichero de estado
antes de tocar código. Si no, el segundo repetirá trabajo del primero.

## Lo que sigue pendiente, para que no se pierda

1. **`sitemap.xml` de carrito5.com.** Lo tienes que pasar tú: el proxy de este
   entorno bloquea el dominio. Cierra el inventario y la pregunta de Madrid.
2. **Madrid no tiene página** en carrito5.com. Hay para Vigo y para Murcia.
3. **Los 11 ficheros de más siguen en el servidor** de abacosoftware.com. Yo los
   quité del ZIP; borrarlos del servidor es otra cosa.
4. **Las keywords** que ibas a pasarme. El sistema está listo:
   `python3 motor/analizar_clusters.py keywords export.csv -- inventarios/*.tsv`
