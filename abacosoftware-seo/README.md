# abacosoftware-seo

Pipeline de contenido y SEO técnico para abacosoftware.com (Caja 5 TPV).

- `plantilla.py` — plantilla ASP nativa (usa el CSS y los includes del sitio).
- `contenido/` — las páginas, escritas a mano, una por tema.
- `pipeline/` — capa técnica, generadores, limpieza y sitemap.
- `.claude/skills/run-abacosoftware-seo/` — driver y su documentación.

Empieza por el skill:

    python3 .claude/skills/run-abacosoftware-seo/driver.py build --base /tmp/prueba

La web base del cliente no está en el repo (8 MB de material suyo). El driver la
recibe con `--base`.
