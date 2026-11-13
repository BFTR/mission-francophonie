# Étape E — Prototype jouable : mission 1 (Lafayette)

> 12 novembre 2026. Rien n'est publié. Aucun commit, aucun dépôt distant.

## Ce qui est jouable

Accueil (choix du groupe) → briefing de Lumi (5 messages) → carte du Réseau Écho → **mission 1 complète** → récompense → retour à la carte, avec la station 2 déverrouillée.

**Mission 1 — « Le marché de Claire »**, à Lafayette (Louisiane)

| Phase | Tâche de l'élève | Attentes |
|-------|------------------|----------|
| A. Fouille | Lire la liste de Claire (8 ingrédients pour un gombo) et les trouver parmi 18 produits illustrés | C1.2, C1.4 |
| B. Quantités | Lire des nombres écrits en lettres et tenir compte d'un P.-S. (« J'ai déjà deux oignons ») pour régler le panier | C1.2 (inférence) |
| Récompense | Mot-clé 1 « un gombo » (le menu de l'invitation) + deux faits culturels vérifiés | C3.1 |

- **Rétroaction** : chaque mauvais clic nomme le produit en français et en anglais (« Ce sont des tomates. Ce n'est pas sur la liste. »). Le poivron rouge déclenche une explication sur la couleur. Dans le panier, chaque ligne est marquée « OK » ou « À revoir » (icône + texte, jamais la couleur seule).
- **Indices à 3 niveaux** (phases A et B) : une stratégie, puis une piste ciblée (l'étagère est surlignée), puis la réponse expliquée (le produit clignote).
- **Aucun blocage** : essais illimités ; après 3 erreurs de suite, un conseil de méthode apparaît.
- **Récompense « Œil de lynx »** : si l'élève fait au plus 2 erreurs et n'utilise aucun indice.

## Vérifications réellement effectuées

| Contrôle | Résultat |
|----------|----------|
| TypeScript strict (`tsc -b`) | Aucune erreur |
| ESLint | Aucune erreur |
| Tests unitaires (Vitest) | **64 / 64** : moteur, quantités, comparaison de réponses (accents, variantes, mot-clé seul refusé, réponse vide), code de réussite, réducteur, sauvegardes corrompues ou incohérentes, stockage bloqué, contenus bilingues, typographie, **contrastes WCAG calculés** |
| Tests de bout en bout (Playwright, version de production servie dans un sous-dossier `/mission-francophonie/` comme sur GitHub Pages, 1366×768) | **5 / 5** : parcours complet, mauvaise réponse, indices, actualisation en cours de mission, double clic, clics rapides, recommencer (annuler puis confirmer), stockage bloqué, sauvegarde corrompue, clavier, aller-retour carte ↔ mission, station verrouillée sans bouton « Jouer », **aucune requête vers un tiers, aucune ressource manquante, aucune erreur JavaScript** |
| Compilation de production | Réussie. ~103 Ko de JS compressé, ~6 Ko de CSS, polices ~130 Ko. Moins de 500 Ko au total |
| Inspection visuelle dans un navigateur | Accueil, briefing, carte, station verrouillée, intro de mission, fouille, mauvaise réponse, indices 2 et 3, quantités (piège du P.-S.), récompense, carte après réussite, consignes. Formats 1366×660, tablette 768×1024 et mobile 375×812 |

## Défauts trouvés pendant l'inspection, puis corrigés

1. Mini-carte de l'accueil coupée sur un écran de 660 px de haut : masquée quand l'écran est bas.
2. Étiquette « Saint-Pierre » qui masquait « QG » sur la carte : déplacée.
3. Bouton « Jouer » sous la ligne de flottaison : remonté sous le nom de la ville.
4. Étagère du bas hors de l'écran : grille resserrée.
5. **Rétroaction invisible après une erreur** (sous la ligne de flottaison) : liste sur deux colonnes, bouton « Indice » dans le pied de la liste, défilement doux automatique.
6. Bouton « Vérifier » sous la ligne de flottaison : panier sur deux colonnes.
7. **Bogue : des clics rapides sur « + » n'ajoutaient qu'une unité.** L'incrément est maintenant calculé dans le réducteur ; un test le couvre.
8. Tampon « Lafayette » coupé sur la carte du mot-clé.
9. Station 2 sélectionnée sans explication : message « Cette mission arrive dans la prochaine version ».
10. **Typographie** : espaces à la française avant « ! » et « ? ». Harmonisation selon l'usage canadien (Bureau de la traduction) : pas d'espace avant ! ? ;, espace insécable avant : et dans « ». Un test vérifie la règle sur tous les textes.
11. **Contraste** : l'« encre pâle » était à 4,02:1, sous le seuil AA de 4,5:1. Elle est assombrie, et le test calcule désormais le contraste.
12. Code mal formaté par un premier script de typographie trop naïf : remplacé par une version fondée sur l'analyseur TypeScript, puis code reformaté avec Prettier.

## Limites connues (non corrigées à ce stade)

| Gravité | Limite |
|---------|--------|
| Important | Les poivrons rouge et vert se distinguent aussi par leur luminosité (vert foncé, rouge clair), mais un élève daltonien peut quand même hésiter. Piste : lui indiquer de demander l'indice, ou ajouter un mode « couleurs nommées ». |
| Important | **Non testé sur un vrai Chromebook**, ni avec le filtre réseau de l'école. Les performances ne sont pas mesurées sur un appareil réel. |
| Important | Durée de la mission 1 **non mesurée** avec des élèves (estimation : 6 à 9 minutes). |
| Mineur | Sur mobile, les étiquettes de la carte se serrent (le Chromebook reste la cible). |
| Mineur | L'écran d'introduction de la mission est riche en texte ; sa moitié droite pourrait accueillir une illustration du marché. |
| Mineur | Pour les lecteurs d'écran, les produits portent leur nom en français. C'est une adaptation voulue (sinon la tâche est impossible), qui facilite la fouille. |
| Info | `npm audit` : 10 alertes « modérées », toutes dans ESLint (outil de développement, jamais livré aux élèves). |

## Pas encore construit (étape F)
Missions 2 à 5, audio (synthèse vocale locale), écran final « MISSION ACCOMPLIE », code de réussite affiché, écran enseignant, dossiers bonus, guide enseignant, guide pédagogique, Plan B, configuration GitHub Pages.

## Reproduire
```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typage + lint + tests + build + e2e
```
