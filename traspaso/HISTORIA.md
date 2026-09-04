# Historia del proyecto

Este proyecto se desarrolló con 11 commits antes de traerlo aquí. Al subirlo
como ZIP, esa historia se pierde, así que queda escrita: cada entrada dice qué
se hizo y, sobre todo, **por qué**.

## Add SEO skills for technical audit and Spanish content work

Four reusable skills extracted from an SEO audit and rebuild of a
classic-ASP retail site:

- seo-audit-tecnico: audit and fix a site from local files (duplicate
  detection via Jaccard similarity, orphan pages, metadata gaps, robots
  vs sitemap conflicts). Documents the ASP @CODEPAGE trap where setting
  Response.CodePage without the directive double-encodes accents.
- schema-verifactu-tpv: content and JSON-LD for Spanish POS/e-invoicing,
  with the current VeriFactu calendar and the aggregateRating manual
  action risk.
- gsc-priorizacion: prioritise from Search Console/Semrush exports,
  including verifying which columns actually carry data first.
- limpieza-cliches-ia: strip AI writing patterns from Spanish copy
  without touching HTML, keeping JSON-LD in sync with visible text.


---

## Add abacosoftware-seo content pipeline and run skill

Reproducible pipeline that takes the client's classic-ASP site and adds
the technical SEO layer plus ~80 hand-written pages. Previously this
toolchain only existed in an ephemeral scratchpad.

- driver.py: single entry point (build / gate / validate / preview /
  stats / package). `preview` resolves ASP includes and strips <% %> so
  a page can be served and screenshotted with Chromium, since there is
  no IIS in the container.
- gate: Jaccard similarity check over visible text, threshold 0.45.
  Deriving pages from a thin fact base scores 0.75-0.91; hand-written
  pages score 0.28-0.41. The gate refuses to publish the former.
- recortar_titulos.py: new, trims SERP-overflowing titles and guards
  against dangling prepositions left by naive word truncation.

Two bugs found by actually running it: symlinked pipeline modules broke
sys.path so every generator failed on `import plantilla` (needs explicit
PYTHONPATH), and the sidebar WhatsApp button rendered white-on-white on
40+ pages because btn-hero-secondary is scoped to the dark hero.


---

## Add normativa cluster and wire the three new hubs into the pipeline

Five hand-written pages on Spanish retail compliance, each with nine FAQ
entries: Ley Antifraude sanctions, ticketBAI, the Crea y Crece e-invoice
obligation (routinely confused with VeriFactu), shop-floor legal duties,
and the fabricante's declaración responsable.

Also fixes two things the driver exposed:
- the abrir/operativa/normativa hub links were added to menu_nav by an
  ad-hoc script, so a clean build lost them; they now live in
  enlazado_y_sitemap.py and survive a rebuild.
- driver.py handles SIGPIPE, so `validate | head` no longer raises
  BrokenPipeError.

Clean build: 191 indexable pages, 177,418 visible words, 184 sitemap
URLs, 1,356 schema FAQ entries. Similarity gate over the 83 new pages:
mean 0.24, max 0.41, zero pairs above the 0.45 threshold.


---

## Add carrito5.com pipeline and shared cross-site duplicate gate

Second site for the same owner. Static HTML, its own template built from
the client's real design tokens (#bd5883 pink, Inter/Outfit) since
styles.css was not supplied, so the CSS ships embedded.

The client's three existing pages link to 42 pages that do not exist —
the architecture was designed but never built. Eight of those 404s are
now real pages: the download page (their money page, linked from all
three), the sector hub, the local-commerce positioning page and a
five-page VeriFactu cluster.

New in motor/: gate.cruzado() compares two sites against each other.
Reusing text between two domains owned by the same company creates
duplicate content that hurts both. It immediately caught a real case —
carrito5's Crea y Crece page scored 0.47 against abacosoftware's, so it
was rewritten with its own angle and now sits at 0.30.

Gates: internal mean 0.19 / max 0.34; cross-site max 0.43, zero pairs
over the 0.45 threshold.


---

## Correct two wrong findings about carrito5.com, verified against the live site

With web access restored I checked carrito5.com and two things I reported
were wrong. Both came from treating the client's audit dump as the whole
site when it only contained three templates.

1. The "42 broken internal links" finding does not hold. The live site
   already has many of those pages — tpv-comercio, tpv-jugueteria-regalos,
   tpv-tienda-muebles, tpv-drogueria, tpv-papeleria, tpv-textil-hogar,
   tpv-tienda-bicicletas and more, plus local-SEO pages like tpv-zaragoza
   that were never in the link graph I saw.

2. The free tier is the "plan Inicio" with up to 1,000 catalogue items,
   not "50 tickets al mes". That figure came from the client's internal
   dossier and contradicts what their own site publishes. It appeared 16
   times across body copy and FAQs and would have shipped wrong pricing
   information to their customers.

Fixes: all 16 occurrences corrected; generar.py now diverts any page that
already exists live into _propuestas/ instead of writing it over the real
one — four of the eight pages I generated collided, including their money
page descargar-tpv-gratis.html.


---

## Map the real carrito5.com inventory and rewrite 15 templated titles

The audit dump held 3 pages; the live site has at least 73. Direct fetch of
carrito5.com is blocked by the egress proxy, so the inventory was rebuilt from
the search index instead and recorded in carrito5-seo/inventario/.

Two tools, both reusable:

  analizar_inventario.py  normalises slugs (drops the tpv-/software-tpv-
                          prefix, singularises) and groups URLs by intent, so
                          pages competing for the same query fall out.
  calidad_titulos.py      flags titles generated from the filename, "Tpv" for
                          "TPV", and missing Spanish accents.

Findings that came out of it:

  - tpv-tienda-instrumentos-musica.html and tpv-tiendas-instrumentos-musica.html
    are the same page on two URLs, singular vs plural.
  - Zaragoza and Malaga each have a page under both city URL schemes.
  - 13 pages carry the filename as their title, unaccented and title-cased.

Those 13 are rewritten by hand in contenido/titulos_reescritos.py, plus 2 more
whose titles were merely missing accents. Each starts from what the trade
actually does at the counter, so a dry cleaner talks about the claim ticket and
a bike shop about frame numbers.

The first draft of those descriptions failed the anti-template gate at 0.50:
all fifteen recycled four boilerplate closers. Rewritten, they measure 0.26
against a 0.45 threshold, and none exceeds 60 characters.

Two checks in calidad_titulos.py were wrong and are fixed here: "parafarmacia"
carries no accent, and length was being measured on titles the search index had
already truncated, which understates the real count.

Also adds arreglar_existentes.py, which demotes the duplicate H1 inside the
mobile block to a <p> keeping its class and style, and drops byte-identical
repeated ld+json blocks. Verified non-destructive: -2 bytes, visible text
unchanged. It deliberately leaves the aggregateRating alone.


---

## Find that Madrid, the largest retail market in Spain, has no city page

cobertura_geografica.py compares the cities carrito5.com advertises in its own
menu against the ones that actually have a page. Ten of eleven are covered.
Madrid is not: it appears only in tpv-instrumentos-musica-madrid.html, a
sector-crossed-with-city page that captures "TPV tienda de musica Madrid" and
not "TPV Madrid". There is a page for Vigo and one for Murcia.

Five separate searches failed to surface any Madrid neighbourhood page either,
though the menus name Salamanca, Malasana, Chueca, Chamberi, Sol, Gran Via and
Retiro. Absence from the search index is not proof of absence on the server, so
the report gives both readings: the pages do not exist (largest content gap on
the site), or they exist unindexed (orphaned or blocked). The sitemap settles
it, and the next action is the same either way.

Also records tpv-palma-de-mallorca.html, found while probing, bringing the
inventory to 74 URLs, and notes the evidence that neighbourhoods are sections
inside city pages rather than separate URLs: sevilla-centro-tetuan covers
Sierpes, Tetuan, Velazquez, Campana, O'Donnell and Plaza Nueva in one page.


---

## Find and retire 11 files that should not be published on abacosoftware.com

limpieza_raiz.py walks the whole tree looking for files that were never meant
to be public: backup copies left beside the original, stray executables,
Windows shortcuts and test leftovers. It reports by default and moves findings
to _retirados/ with --aplicar, checking first that nothing links to them.

What it found: three .exe files (two VB6 serial-port testers, one that is
actually a ZIP despite the extension), "Copia de global.asa", two dated .asp
backups, two dated stylesheets totalling 78 KB that no page references, an
archivojs/copias/ folder, a Windows .lnk shortcut, and a test.txt containing
"hello world".

On the config copy: it holds no credentials. Checked for connection strings,
user, password, data path and SQL server patterns and found none. It is 52
lines of cart session variables, and an outdated version at that. It still
needs to go, because IIS shields global.asa by exact name and a copy under a
different name is served as plain text.

Four bugs in the tool itself, all fixed here, all found by running it:

  - The NO.asp suffix rule was case-insensitive, so it matched
    negocio_segunda_maNO.asp. It was about to retire a real page and only the
    link check saved it. Now case-sensitive.
  - The link check counted a file naming itself as an inbound link.
  - \bcopia\b matched copia-seguridad-tpv.asp, a legitimate page about backups.
    Narrowed to the prefix Windows adds when duplicating a file.
  - prueba_gratis.css was classified as a development leftover. "Prueba gratis"
    is the product name in Spanish, so it is now excluded deliberately.

The first version also only scanned the root and missed a whole backup folder,
hence the walk.

The deliverable ZIP carried the same files because the build copied the tree
wholesale. Repackaged: 1,019 files, 198 pages, 184 sitemap URLs, nothing stray
left inside.


---

## Add a keyword clustering engine and find 14 cross-domain collisions

clusters.py groups search intents; analizar_clusters.py crosses them against
the pages that exist and reports CUBIERTO / CANIBALIZADO / HUECO. It reads
Search Console, Semrush and Ahrefs exports, or a plain list, sniffing the
delimiter and the query column, and orders gaps by impressions or volume.

inventario.py dumps a site to TSV so the analysis survives the session: the
built abacosoftware tree lives in a temporary directory, and the committed
inventories (198 + 74 pages) do not.

Across both domains: 272 pages, 239 distinct intents, 28 served by more than
one page, 14 of those split across the two domains. Same company competing
with itself on telefonia/informatica, electrodomesticos, perfumeria/cosmetica,
parafarmacia/herboristeria, comics, papeleria and textil hogar. Within
abacosoftware, negocio_antiguedad.asp and negocio_antiguedades.asp are a
singular/plural pair, the same defect already found on carrito5.

Three layers, each added because the previous one gave a wrong answer:

  - Synonym families, deliberately conservative: fruteria and carniceria stay
    apart even though both are food retail.
  - Rarity weighting, log(N/df). Without it "Catinfog vs Caja5" and "Gesio vs
    Caja5" scored 0.50 and merged, since two of their three words belong to the
    comparison frame rather than the subject.
  - Asymmetric coverage. A narrower page does not answer a broader query. This
    one mattered: without it "software tpv madrid" at 2,800 impressions came
    back CUBIERTO via the music-shop-in-Madrid page, hiding the largest gap on
    the site inside the very report meant to surface it.

Five bugs found by running it, all now locked down by tests (10/10):

  - Brand tokens joined unrelated sectors, since "| Carrito5" ends every title.
  - Collapsing synonyms before measuring frequency quadrupled the apparent
    frequency of the representative, so the generic-term filter dropped "aeat"
    and took all 16 VeriFactu pages with it. Frequency is now measured on raw
    tokens.
  - Truncated titles from the search index contributed "carr", a fragment of
    "Carrito5" so rare the weighting leaned on it, pushing the certain
    singular/plural duplicate down to 0.466 and under the threshold.
  - Title cleaning lived in the caller, so the same engine gave different
    answers to different consumers.
  - Matching on the title let marketing detail act as a qualifier, which stopped
    tpv-tienda-ropa.html from covering "tpv tienda de ropa". Topic now comes
    from the slug.


---

## Set up the repo for two Claude accounts working at once

The two sessions cannot see each other: no shared chat, no shared memory, and
neither notices what the other just did. The repository is the only channel
between them, so the conventions have to live in it.

CLAUDE.md carries the four rules (branch per session, directory ownership,
rebase before pushing, write down what you decide) along with the project
context and the traps that have already cost time: the ASP codepage that breaks
every accent, the free plan being 1,000 articles and not the 50 tickets the
client's own dossier claims, and the near-miss that would have overwritten the
live downloads page.

estado/ holds one file per agent rather than a shared status file. A shared one
would conflict exactly when both agents are writing, which is precisely when it
matters that they don't.

---

## Handle SIGPIPE in analizar_clusters so piping to head exits quietly

Found by cloning the bundle into a clean directory and piping the output to
head, which is what the other agent will do within five minutes.

---

