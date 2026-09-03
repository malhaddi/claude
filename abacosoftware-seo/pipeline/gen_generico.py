#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generador generico para paginas escritas a mano, con filtro de similitud.

Uso: python3 gen_generico.py <modulo> [<modulo> ...]
Cada modulo expone un dict cuyo nombre empieza por el prefijo que se indique en
la variable PREFIJO del propio modulo (o se detecta por el nombre de la variable).
"""
import os, sys, re, importlib, itertools, json
import plantilla as P

OUT = "site"
UMBRAL = 0.45


def visible(html):
    t = re.sub(r"<%.*?%>", "", html, flags=re.S)
    t = re.sub(r"<script.*?</script>", "", t, flags=re.S | re.I)
    t = re.sub(r"<style.*?</style>", "", t, flags=re.S | re.I)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)).lower()


def parrafos(ps):
    return "".join(f'\n\t\t\t\t\t<p style="font-size:15.5px; line-height:1.8; color:#3f3f46;">{p}</p>'
                   for p in ps)


def lista(xs):
    return ('\n\t\t\t\t\t<ul style="list-style:none; padding:0; margin:18px 0;">' + "".join(
        f'\n\t\t\t\t\t\t<li style="padding:10px 0; border-bottom:1px solid #f0ebe2; '
        f'font-size:14.6px; line-height:1.65;">'
        f'<i class="fa-solid fa-check" style="color:#8c2d19; margin-right:9px;"></i>{x}</li>'
        for x in xs) + "\n\t\t\t\t\t</ul>")


def cuerpo(bloques, aside_t, aside_p):
    c = "".join(f'\n\t\t\t\t\t<h2 style="font-size:25px; font-weight:800; color:#1e293b; '
                f'margin-top:34px;">{t}</h2>{parrafos(ps)}'
                f'{lista(li[0]) if li and li[0] else ""}'
                for t, ps, *li in bloques)
    return f"""
	<section style="padding:48px 0 40px; background:#ffffff;">
		<div class="container">
			<div class="row">
				<div class="col-md-8">{c}
				</div>
				<div class="col-md-4">
					<div style="background:#faf8f4; border:1.5px solid #e4dfd5; border-radius:10px; padding:24px; position:sticky; top:20px;">
						<h3 style="font-size:18px; font-weight:800; color:#1e293b; margin-top:0;">{aside_t}</h3>
						<p style="font-size:14px; line-height:1.7; color:#52525b;">{aside_p}</p>
						<a href="descargar.asp?origen=descargas&amp;link=www.abacosoftware.com/eutpv.exe" class="btn-hero-primary" style="display:block; text-align:center; margin-bottom:10px;"><i class="fa-solid fa-download"></i> Descargar demo</a>
						<a href="https://wa.me/34611500052" style="display:block; text-align:center; background:#ffffff; color:#8c2d19; border:2px solid #8c2d19; border-radius:6px; font-weight:700; font-size:15px; padding:11px 18px; text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> Preguntar por WhatsApp</a>
						<hr style="border-color:#e4dfd5; margin:18px 0;">
						<p style="font-size:13px; color:#71717a; margin:0;"><strong>333 € pago único</strong> para PC. Sin cuota obligatoria ni comisión por venta. <strong>953 050 112</strong>.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
"""


def construir(fichero, d, hub_nom, hub_url, aside):
    return P.pagina(
        fichero=fichero,
        title=d["title"][:65], description=d["desc"][:165], keywords=d["kw"],
        h1=d["h1"], subtitulo=d["sub"],
        badge=f'<i class="fa-solid {d["icono"]}"></i> {d["crumb"].upper()}',
        trail=[("Inicio", "/"), (hub_nom, hub_url), (d["crumb"], "/" + fichero)],
        cuerpo=cuerpo(d["bloques"], *aside),
        faqs=d["faqs"], faq_titulo=d.get("faq_titulo", f"Preguntas frecuentes sobre {d['nom']}"),
        cta=d.get("cta", (f"¿Hablamos de tu caso?",
             "Llámanos antes de comprar nada. Te decimos qué necesitas de verdad y qué te puedes ahorrar.")),
        links=d["rel"])


HUBS = {
    "ABRIR": ("Abrir un negocio", "/abrir-un-negocio.asp",
              ("Empieza con el catálogo montado",
               "Te ayudamos a dar de alta tu catálogo inicial antes de abrir, para que el primer ticket ya salga con todo bajo control.")),
    "OPERATIVA": ("Operativa diaria del TPV", "/operativa-tpv.asp",
              ("Pruébalo con tu propio catálogo",
               "La demo es completa y no pide tarjeta. Media hora con tus artículos reales te dice más que cualquier folleto.")),
    "NORMATIVA": ("Normativa y obligaciones", "/normativa-comercio.asp",
              ("Caja 5 ya está adaptado",
               "Facturas simplificadas con QR reglamentario y registro encadenado. Licencia de 333 € en pago único.")),
}


def main():
    mods = sys.argv[1:]
    if not mods:
        print("uso: gen_generico.py <modulo>..."); return
    todo = {}
    prefijo = "ABRIR"
    for m in mods:
        mod = importlib.import_module(m)
        for a in dir(mod):
            if a.split("_")[0] in HUBS:
                prefijo = a.split("_")[0]
                todo.update(getattr(mod, a))

    hub_nom, hub_url, aside = HUBS[prefijo]
    paginas = {f: construir(f, d, hub_nom, hub_url, aside) for f, d in todo.items()}

    # filtro de similitud contra las nuevas y contra lo ya publicado del mismo prefijo
    import glob
    previos = {}
    pat = "abrir-*.asp" if prefijo == "ABRIR" else "*.asp"
    for f in glob.glob(os.path.join(OUT, pat)):
        b = os.path.basename(f)
        if b not in paginas:
            previos[b] = open(f, encoding="utf-8").read()

    vis = {f: set(visible(h).split()) for f, h in {**previos, **paginas}.items()}
    malos, peor = set(), 0.0
    claves = sorted(paginas)
    for a, b in itertools.combinations(sorted(vis), 2):
        if a not in paginas and b not in paginas:
            continue
        j = len(vis[a] & vis[b]) / len(vis[a] | vis[b])
        peor = max(peor, j)
        if j > UMBRAL:
            malo = b if b in paginas else a
            malos.add(malo)
            print(f"   !! {j:.2f}  {a} <-> {b}  -> no se publica {malo}")

    n = 0
    for f, html in paginas.items():
        if f in malos:
            continue
        open(os.path.join(OUT, f), "w", encoding="utf-8").write(html)
        n += 1
    print(f"\n  publicadas {n} / {len(paginas)}   rechazadas {len(malos)}   similitud maxima {peor:.2f}")


if __name__ == "__main__":
    main()
