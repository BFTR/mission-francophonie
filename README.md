# Mission Francophonie : Le signal perdu

Jeu d'aventure pédagogique en français pour la **7e année, Core French (Ontario)**. Application web 100 % statique, sans compte élève et sans collecte de données, prévue pour GitHub Pages et les Chromebooks.

Les élèves rallument cinq radios francophones des Amériques (Louisiane, Haïti, Martinique, Guyane, Saint-Pierre-et-Miquelon). Chaque station leur donne un mot-clé ; à la fin, ils rédigent une invitation au festival.

## Documents

| Document | Pour qui |
|---|---|
| [docs/guide-enseignant.md](docs/guide-enseignant.md) | lancer la période, vérifier la réussite, régler les problèmes |
| [docs/guide-pedagogique.md](docs/guide-pedagogique.md) | missions, attentes curriculaires, **corrigé complet** |
| [docs/plan-b.html](docs/plan-b.html) | activité papier imprimable (ouvrir dans Chrome → Imprimer) |
| [docs/rapport-audit.md](docs/rapport-audit.md) | contrôles, corrections, risques, conditions d'utilisation |
| [docs/01-audit-et-concept.md](docs/01-audit-et-concept.md) | audit initial, concept, curriculum vérifié |

## Démarrer (Windows, npm)

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # typage + lint + typographie + tests unitaires + build + tests e2e
```

Les tests de bout en bout demandent le navigateur de Playwright : `npx playwright install chromium` (une seule fois).

## Publier sur GitHub Pages (après l'accord de l'école)

1. Créer un dépôt **public** dédié sur un compte au nom neutre (le nom du compte apparaît dans l'adresse). Exemple de nom de dépôt : `mission-francophonie`.
2. Dans ce dossier :
   ```bash
   git init
   git add .
   git commit -m "Mission Francophonie 1.0"
   git branch -M main
   git remote add origin https://github.com/<compte>/<depot>.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : GitHub Actions**.
4. **Actions → « Publier sur GitHub Pages » → Run workflow.** Le flux vérifie le typage, le lint et les tests, compile, puis publie. Il ne se lance jamais tout seul.
5. Ouvrir l'adresse affichée par le flux (`https://<compte>.github.io/<depot>/`) et jouer une mission.
6. Générer le code QR **vers l'adresse réellement publiée** :
   ```bash
   npm run qr -- https://<compte>.github.io/<depot>/
   ```
   Le script vérifie d'abord que la page répond et que les fichiers du jeu se chargent. Il produit `docs/qr-code.svg` et `docs/qr-code.png`.
7. Tester l'adresse **sur un Chromebook d'élève, au réseau de l'école**, puis compléter le § 1 du guide enseignant.

Les chemins sont relatifs (`base: './'`) : le jeu fonctionne dans n'importe quel sous-dossier, sans domaine personnalisé.

## Remplacer ou régénérer l'audio

- **Par votre voix** : enregistrez chaque phrase de `audio-manifest.json` et enregistrez le MP3 sous le même nom dans `public/audio/` (mono, environ 64 kb/s). Le texte affiché ne change pas.
- **Par synthèse** (outils locaux dans `../outils-audio`, jamais livrés) :
  ```bash
  npm run audio:manifest
  cd ../outils-audio && node gen.mjs
  ```
  Si vous modifiez un texte prononcé dans `src/content/m2.ts` ou `m3.ts`, régénérez : un test vérifie que l'audio correspond au texte affiché.

## Structure

```
src/
  content/      textes FR/EN, réponses, indices (données pures)
  engine/       validation des réponses, normalisation, code de réussite
  state/        état du jeu (réducteur) et validation des sauvegardes
  save/         stockage local, avec repli en mémoire
  missions/     M1Market, M2Radio, M3Cafe, M4Town, M5Lighthouse
  screens/      accueil, briefing, carte, écran final, espace enseignant
  ui/           composants (boutons, bilingue, lecteur audio, récompense, dossiers secrets)
  art/          illustrations SVG originales, carte (Natural Earth)
  audio/        effets sonores Web Audio
  styles/       jetons de design et feuilles de style
public/audio/   10 messages MP3 + CREDITS.txt
tests/unit/     Vitest : moteur, contenus, contrastes, état, sauvegarde, audio
tests/e2e/      Playwright : parcours complets, accessibilité (axe-core)
scripts/        carte, typographie, manifeste audio, code QR
```

## Confidentialité

Aucun compte, aucune donnée personnelle, aucune requête vers un service tiers, aucun cookie ajouté par le jeu. La progression (groupe, avancée, réglages) reste dans le `localStorage` du Chromebook.

## Licences

Code écrit pour ce projet. Tabler Icons (MIT), polices SIL OFL, carte Natural Earth (domaine public), audio CC BY-SA 4.0 (voir `public/audio/CREDITS.txt`).
