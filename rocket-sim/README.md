# 🚀 Simulateur de trajectoire de missile

Une console de tir balistique **3D** interactive, en HTML/CSS/JavaScript pur
(aucune dépendance, aucun build). Tu règles les **deux angles de tir** et la
**vitesse initiale**, tu lances&nbsp;: le missile décolle du point d'origine,
trace son arc dans l'espace et s'écrase au sol. La **portée** et la **direction**
d'impact dépendent entièrement de tes réglages.

## Utilisation

Ouvre simplement le fichier dans un navigateur :

```bash
# depuis la racine du dépôt
xdg-open rocket-sim/index.html      # Linux
open rocket-sim/index.html          # macOS
start rocket-sim/index.html         # Windows
```

- **Angle XY · élévation** — 5° à 85° (hauteur du tir dans le plan vertical)
- **Angle XZ · azimut** — −180° à 180° (direction dans le plan horizontal ⇒ la
  trajectoire se déplace vraiment dans **toutes les directions**)
- **Vitesse initiale** — 10 à 150 m/s
- **Gravité** — Terre, Lune, Mars ou Jupiter (change la portée pour les mêmes réglages)
- **Lancer** — bouton 🚀 ou la barre d'espace
- **Réinit.** — remet la scène à zéro

### Deux vues (onglets en haut à droite)

- **Profil** — vue de côté classique : la parabole dans son plan vertical
  (indépendante de l'azimut, car la portée ne dépend que de l'élévation).
- **Vue 3/4** — projection isométrique depuis le point d'origine, avec un sol
  quadrillé en perspective et les **3 axes** affichés : **X** (orange), **Y ·
  altitude** (bleu) et **Z · latéral** (violet). La trace au sol montre la
  direction réelle du tir, et des lignes verticales relient l'arc au sol pour la
  perception de la profondeur.
  - 🖱️ **Glisse sur le terrain pour pivoter la caméra à 360°** (orbite libre en
    yaw, inclinaison en pitch) et choisir le point de vue qui t'intéresse.

### Interception au sommet (missile 2)

Quand **« Interception au sommet »** est coché (par défaut), un **second missile**
part de **l'extrémité de l'axe Z** en même temps que le missile 1, avec une
vitesse balistique calculée pour qu'ils **entrent en collision pile au sommet**
de la parabole (à `t = T/2`). Astuce&nbsp;: les deux missiles partagent la même
altitude à chaque instant et ne diffèrent que sur l'axe Z, si bien que le missile
2 « glisse » le long de Z pour percuter le missile 1 au point le plus haut. Le
spectacle se voit surtout en **Vue 3/4**. Décoche l'option pour revenir au vol
libre avec atterrissage au sol.

### Impact dynamique

À la collision (ou au contact du sol), l'explosion — flash, onde de choc et
gerbe d'étincelles — est **d'autant plus vive, large et fournie que la vitesse
est grande**.

Les indicateurs affichent en direct l'**altitude**, la **vitesse**, la
**distance** et le **temps** ; le panneau de résultats donne la portée,
l'altitude maximale, l'instant de collision / temps de vol et la vitesse
d'impact (ou de rapprochement).

## Le modèle physique

Mouvement de projectile idéal, **sans résistance de l'air**. Avec une vitesse
`v`, une élévation `θ` (XY), un azimut `φ` (XZ) et une gravité `g` :

```
vₕ = v·cos(θ)              (vitesse horizontale)
vₓ = vₕ·cos(φ)   v_z = vₕ·sin(φ)   v_y = v·sin(θ)

x(t) = vₓ·t      z(t) = v_z·t      y(t) = v_y·t − ½·g·t²
```

| Grandeur           | Formule                          |
|--------------------|----------------------------------|
| Temps de vol       | `T = 2·v·sin(θ) / g`             |
| Altitude maximale  | `H = v²·sin²(θ) / (2g)`          |
| Portée (au sol)    | `R = vₕ·T = v²·sin(2θ) / g`      |

La trajectoire décrit une parabole dans le plan vertical incliné selon l'azimut.
Sans traînée, la **vitesse d'impact est égale à la vitesse de lancement**, et la
portée est maximale à une élévation de **45°** (à vitesse et gravité fixées).
