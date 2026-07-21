# 🚀 Simulateur de trajectoire de fusée

Une petite console de tir balistique interactive, en HTML/CSS/JavaScript pur
(aucune dépendance, aucun build). Tu règles l'**angle de tir** et la
**vitesse initiale**, tu lances&nbsp;: la fusée décolle du pas de tir à gauche,
trace son arc et s'écrase à droite. La **portée d'impact** dépend entièrement de
tes réglages.

## Utilisation

Ouvre simplement le fichier dans un navigateur :

```bash
# depuis la racine du dépôt
xdg-open rocket-sim/index.html      # Linux
open rocket-sim/index.html          # macOS
start rocket-sim/index.html         # Windows
```

- **Angle de tir** — 5° à 85°
- **Vitesse initiale** — 10 à 150 m/s
- **Gravité** — Terre, Lune, Mars ou Jupiter (change la portée pour les mêmes réglages)
- **Lancer** — bouton 🚀 ou la barre d'espace
- **Réinit.** — remet la scène à zéro

### Deux vues (onglets en haut à droite)

- **Profil** — vue de côté classique : la parabole dans le plan vertical.
- **Vue 3/4** — projection isométrique depuis le point d'origine, avec un sol
  quadrillé en perspective et les **3 axes** affichés : **X** (portée), **Y**
  (altitude) et **Z** (latéral / profondeur). La trajectoire reste dans le plan
  `Z = 0` ; des lignes verticales relient l'arc au sol pour la perception de la
  profondeur.

Les indicateurs affichent en direct l'altitude, la vitesse et la distance ;
le panneau de résultats donne la portée, l'altitude maximale, le temps de vol et
la vitesse d'impact.

## Le modèle physique

Mouvement de projectile idéal, **sans résistance de l'air**. Avec une vitesse
initiale `v`, un angle `θ` et une gravité `g` :

| Grandeur          | Formule                          |
|-------------------|----------------------------------|
| Portée            | `R = v² · sin(2θ) / g`           |
| Altitude maximale | `H = v² · sin²(θ) / (2g)`        |
| Temps de vol      | `T = 2 · v · sin(θ) / g`         |
| Position          | `x(t) = v·cos(θ)·t`, `y(t) = v·sin(θ)·t − ½·g·t²` |

Sans traînée, la vitesse d'impact est égale à la vitesse de lancement.

La portée est maximale à **45°** (à vitesse et gravité fixées).
