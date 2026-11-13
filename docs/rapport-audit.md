# Rapport d'audit — Mission Francophonie : Le signal perdu

*Version 1.0 · 12 novembre 2026 · publiée sur https://bftr.github.io/mission-francophonie/*

Ce rapport dit ce qui a été **vérifié**, ce qui a été **corrigé** et ce qui **reste à vérifier**. Il peut être remis à la direction avec la demande d'autorisation.

---

## 1. Résumé

- **Le jeu complet est jouable de bout en bout** : 5 missions, des mécaniques différentes, 15 défis bonus, un écran final avec code de réussite et un défi oral.
- **Vérifications automatisées réussies** :
  - 104 tests unitaires ;
  - 9 scénarios de bout en bout sur la version de production, servie dans un sous-dossier comme sur GitHub Pages ;
  - 0 violation d'accessibilité axe-core sur 14 écrans ;
  - typage strict, lint et typographie conformes.
- **Confidentialité** : aucune donnée personnelle, aucun service tiers, aucune requête réseau hors du site lui-même (vérifié automatiquement pendant une partie complète).
- **Non vérifié** :
  - sur un vrai Chromebook d'élève ;
  - avec le filtre réseau de l'école ;
  - avec de vrais élèves (durées) ;
  - la prononciation des 10 messages audio par une oreille humaine.

## 2. Conditions nécessaires avant l'utilisation en classe

| # | Condition | Responsable |
|---|---|---|
| 1 | Accord de la direction (ressource numérique utilisée avec des élèves) | Enseignant |
| 2 | ~~Publication sur GitHub Pages~~ (fait le 12/11/2026, 9 scénarios automatisés réussis sur le site publié) ; reste le test **sur un Chromebook d'élève, au réseau de l'école** | Enseignant |
| 3 | Écoute des 10 messages audio (environ 50 s) : prononciation correcte? | Enseignant |
| 4 | Une partie complète jouée par un adulte, chronomètre en main | Enseignant |
| 5 | Écouteurs disponibles pour la mission 2 | École |
| 6 | Plan B imprimé, en cas de panne | Enseignant |

## 3. Contrôles réalisés

### 3.1 Technique
| Contrôle | Résultat |
|---|---|
| TypeScript strict (`tsc -b`) | aucune erreur |
| ESLint, avec les règles React Hooks | aucune erreur |
| Typographie française canadienne (script dédié, intégré au lint) | conforme |
| Tests unitaires (Vitest) | **104 / 104** |
| Tests de bout en bout (Playwright, Chromium, 1366×768, version de production sous `/mission-francophonie/`) | **9 / 9** |
| Compilation de production | réussie : JS 130 Ko compressé, CSS 9 Ko, polices ≈ 85 Ko chargées, audio 411 Ko à la demande |
| `npm audit` sur les dépendances livrées (5 paquets) | 0 vulnérabilité |
| `npm audit` sur les outils de développement | 10 alertes « modérées » dans ESLint, jamais livré aux élèves |

### 3.2 Scénarios testés automatiquement
- premier lancement, choix du groupe, refus de démarrer sans groupe ;
- partie complète des 5 missions jusqu'à « MISSION ACCOMPLIE! », avec une erreur volontaire dans chaque mission ;
- indices (3 niveaux), mauvaise réponse, réponse vide, double clic, **clics très rapides** ;
- actualisation en pleine mission et sur l'écran final (reprise exacte) ;
- aller-retour carte ↔ mission sans perte ;
- recommencer (annuler, puis confirmer) ;
- stockage local bloqué (avertissement, jeu jouable) et sauvegarde corrompue (message, départ propre) ;
- accès direct à une station verrouillée ou à l'écran final : refusé ;
- **son indisponible** (fichiers bloqués, aucune voix) : la mission 2 reste faisable grâce à la transcription ;
- réduction des animations respectée ;
- navigation au clavier et anneau de focus visible ;
- espace enseignant : le code affiché correspond à celui de l'écran final ;
- aucune requête vers un service tiers, aucune ressource manquante, aucune erreur JavaScript.

### 3.3 Contenus (double vérification)
1. **Première vérification** : chaque défi est résolu par les tests, avec les réponses correctes, incorrectes, limites et ambiguës (plusieurs ordres valables, article défini accepté avec une remarque, « oe » pour « œ », accent manquant signalé sans être compté faux).
2. **Deuxième vérification** : relecture indépendante des énoncés, transcriptions, traductions, choix, variantes, rétroactions et faits culturels.
3. **Tests de cohérence** : chaque texte a sa version française et anglaise ; aucun mot anglais oublié dans le français ; apostrophes typographiques ; le texte prononcé de chaque clip est **identique** à sa transcription ; aucun chiffre dans les textes prononcés ; le carnet de mots ne donne pas les réponses.

### 3.4 Audio (mesuré, non écouté)
| Mesure | Résultat |
|---|---|
| Volume intégré | -17,6 à -19,1 LUFS (écart de 1,5 LU, homogène) |
| Crête maximale | ≤ -2,1 dBTP |
| Fins de clip | toutes ≤ -57 dB sur les 60 dernières ms (aucune coupure) |
| Prononciation et correspondance mot à mot | **non vérifiées** (aucun outil d'écoute disponible) |

### 3.5 Accessibilité (référence WCAG 2.2 AA)
- **axe-core** (règles WCAG 2.0, 2.1 et 2.2 A/AA) : 0 violation sur 14 écrans, mesurés après les animations d'entrée.
- **Contrastes** : 17 paires de couleurs calculées par test, toutes ≥ 4,5:1 (≥ 3:1 pour l'anneau de focus).
- **Clavier** : tous les contrôles sont de vrais boutons ; anneau de focus visible ; Échap ferme les fenêtres.
- **Jamais la couleur seule** : chaque verdict a une icône et un texte (« OK », « À revoir »).
- **Son** : désactivable, jamais déclenché sans clic ; transcription disponible, marquée « écoute adaptée ».
- **Animations** : courtes, réduites si le système le demande.
- **Lecteurs d'écran** : zones « live » pour les rétroactions ; noms accessibles conformes au critère 2.5.3.

### 3.6 Inspection visuelle réelle
Écrans observés dans un navigateur, pas seulement lus dans le code : accueil, briefing, carte (avant, pendant et après), introduction de chaque mission, fouille, mauvaise réponse, indices 2 et 3, quantités, console radio, conversation, plan de ville, phrases en tuiles, touche personnelle, chaque récompense, dossier secret, écran final, espace enseignant, consignes, Plan B. Formats : 1366×660 (Chromebook avec barre de navigateur), tablette 768×1024, mobile 375×812.

## 4. Problèmes trouvés et corrigés

| Gravité | Problème | Correction |
|---|---|---|
| Bloquant | Clics rapides : des réponses perdues (panier M1, cadrans M2, tuiles M5) | calcul dans le réducteur, depuis l'état courant ; tests ajoutés |
| Bloquant | Rétroaction invisible après une erreur (hors écran à 660 px) | mise en page resserrée et défilement doux automatique |
| Important | Une traduction anglaise donnait la réponse finale de la mission 3 | traduction masquée pour cette question |
| Important | Mission 3 : une réplique sans option « mauvais registre » | réplique remplacée (« Et toi, tu viens d'où? ») |
| Important | Contraste de l'« encre pâle » à 4,02:1 (annoncé 4,6:1 à tort) | couleur assombrie, test de contraste ajouté |
| Important | Bouton « EN » : nom accessible ≠ texte visible (WCAG 2.5.3) | nom corrigé |
| Important | Typographie à la française (espace avant « ! ») | usage canadien appliqué partout, vérifié au lint |
| Important | Barre du haut qui élargissait la page sur mobile | barre compacte et garde-fou contre le défilement horizontal |
| Mineur | Boutons « Jouer », « Vérifier » ou de départ sous la ligne de flottaison | mises en page en deux colonnes |
| Mineur | Tampon de l'écran final sur le sous-titre ; mot-clé long trop grand | espacements et taille ajustés |
| Mineur | Espace enseignant trop facile à trouver depuis l'accueil | déplacé à l'adresse `#enseignant` (discrétion, pas une sécurité) |

## 5. Audit critique final (quatre perspectives)

**Directeur artistique** : l'identité « carnet de terrain » est cohérente (papier, encre marine, impression décalée, tampons). Les 18 produits et les 8 personnages sont faits avec le même gabarit, et la console sombre est réservée à la mission 2. *Mineur* : les illustrations restent simples (aplats géométriques) ; les intros de mission sont riches en texte.

**Enseignant de Core French** : chaque mission exige vraiment le français (distracteurs oraux, registre, faux amis, articles). Le soutien diminue de la mission 1 à la mission 5. *Important* : l'oral n'est travaillé qu'avec l'enseignant ; les voix ont un accent de France, pas d'Haïti ni des Antilles.

**Élève de 7e année** : progression visible sur la carte, mots-clés à collectionner, réactions des personnages, défis bonus. *Mineur* : la mission 1 demande beaucoup de clics ; un élève peut essayer tous les produits au hasard, mais chaque erreur lui apprend le mot.

**Auditeur technique** : site 100 % statique, chemins relatifs testés en sous-dossier, sauvegarde validée et réparée au chargement. *Important* : non testé sur un Chromebook réel ni derrière le filtre de l'école.

## 6. Risques restants

| Gravité | Risque | Atténuation |
|---|---|---|
| Important | `github.io` bloqué par le filtre de l'école | test préalable ; Plan B imprimé |
| Important | Durées non mesurées avec des élèves | essai adulte ; dossiers bonus pour les rapides ; sauvegarde pour finir plus tard |
| Important | Prononciation des voix non écoutée | écoute de 50 s avant la classe ; fichiers remplaçables par des enregistrements |
| Important | Élève daltonien : poivron rouge ou vert | les deux diffèrent aussi par la clarté ; indice 3 ; observation de l'enseignant |
| Mineur | Code de réussite partageable ou inspectable | validation visuelle et question orale |
| Mineur | Progression liée au Chromebook et au navigateur | même appareil, ou recommencer (environ 35 min) |
| Info | GitHub reçoit l'adresse IP des visiteurs (journaux techniques) | à mentionner à la direction |

## 7. Confidentialité et sécurité

| Exigence | État |
|---|---|
| Compte, nom, courriel | aucun ; seul le groupe (7-15, 7-17, 7-18) est choisi |
| Données envoyées à un serveur | aucune (vérifié : aucune requête hors du site) |
| Stockage | `localStorage` du navigateur : groupe, progression, réglages |
| Cookies, analytique, publicité, traqueurs | aucun |
| Services tiers (polices, CDN, IA, API) | aucun : tout est hébergé avec le jeu |
| Clés secrètes dans le code | aucune |
| Micro, caméra, clavardage, classement public | aucun |
| `index.html` | `referrer: no-referrer`, `robots: noindex` |

Cadre ontarien : les conseils scolaires sont soumis à la LAIMPVP (MFIPPA) et ont généralement un processus d'approbation des ressources numériques. **L'autorisation de la direction reste nécessaire avant l'utilisation en classe.**

## 8. Licences et crédits

- Code du jeu : écrit pour ce projet.
- Illustrations, carte stylisée, icône : originales ; la carte vient de Natural Earth (domaine public).
- Icônes d'interface : Tabler Icons (MIT).
- Polices : Atkinson Hyperlegible et Bricolage Grotesque (SIL OFL), hébergées avec le jeu.
- Audio : synthèse sherpa-onnx (Apache-2.0), voix Piper siwis (CC BY 4.0) et upmc (CC BY-SA 4.0). Fichiers diffusés sous CC BY-SA 4.0 (`public/audio/CREDITS.txt`).
- Effets sonores : synthétisés en direct (Web Audio), aucun fichier.
