# Mission Francophonie — Phase 1 : audit, curriculum, concept optimisé, architecture

> Document de travail. Aucun code n'a été écrit. Rien n'est publié.
> Date : 12 novembre 2026.

---

## 1. Audit critique du concept initial « Le Code Perdu »

### Forces
- Structure d'escape game claire : 5 fragments → coffre final. Les élèves comprennent tout de suite l'objectif.
- Format autonome, compatible avec une période de 50 minutes et un enseignant suppléant.
- Faisable en application 100 % statique (aucun serveur requis).

### Faiblesses
| # | Problème | Gravité |
|---|----------|---------|
| 1 | « Un réseau francophone » reste abstrait : aucun lieu réel, aucune culture. On rate l'attente interculturelle de 7e année. | Important |
| 2 | Les « fragments de code » sont arbitraires (des lettres ou des chiffres). Le coffre final devient un test de mémoire, pas de français. | Bloquant |
| 3 | Les 5 missions décrites risquent d'être 5 QCM habillés différemment. | Important |
| 4 | Aucune décision du joueur n'a de conséquence. | Important |
| 5 | « Communiquer » dans une appli statique ≠ expression orale. Le jeu ne peut pas évaluer la parole. | Bloquant (si on le prétend) |
| 6 | Aucun thème de vocabulaire défini : impossible d'aligner sur ce que la classe étudie. | Important |

### Améliorations décidées
1. **Ancrer le récit dans de vrais lieux** : les stations du réseau sont des communautés francophones des Amériques hors du Canada (Louisiane, Haïti, Martinique, Guyane, Saint-Pierre-et-Miquelon). Cela couvre A3.1 et C3.1, qui portent exactement sur ce sujet en 7e année.
2. **Les fragments sont des mots français**, gagnés en réussissant chaque mission. Au coffre final, l'élève doit **utiliser** ces mots pour composer et valider un message en français. Le défi final teste donc la langue, pas la mémoire visuelle.
3. **Un mécanisme différent par mission** (voir § 4) : fouille de scène, réglage d'une radio, conversation à embranchements, carte avec choix d'itinéraire, composition d'un message.
4. **Des choix qui comptent** : dans la mission « Décider », un mauvais itinéraire mène à une impasse expliquée, puis l'élève revient en arrière. Dans « Communiquer », le registre choisi (tu/vous) change la réaction du personnage.
5. **Honnêteté sur l'oral** : le jeu travaille l'écoute, la lecture et une écriture guidée. L'expression orale passe par un **« défi oral » final avec l'enseignant**, en dehors de l'appli.

---

## 2. Curriculum vérifié — Grade 7 Core French (Ontario, FSL 2013)

Source consultée le 12/11/2026 : `dcp.edu.gov.on.ca/en/curriculum/elementary-fsl/grades/core-g7` (pages strands, a/a1, a/a2, a/a3, b/b2, c/c1, c/c3, d/d1). Codes recopiés tels quels, aucun inventé.

| Code | Intitulé (résumé fidèle) | Travaillé par le jeu ? |
|------|--------------------------|------------------------|
| **A1.2** | Comprendre le but et le sens de textes oraux sur des sujets quotidiens, avec soutien visuel et contextuel | **Oui** — mission 2 (messages radio) |
| **A1.1** | Stratégies d'écoute avant/pendant/après | Oui, partiellement (prédire avec l'image, réécouter) |
| **A3.2** | Conventions sociolinguistiques à l'oral (ex. parler à un enseignant vs à un pair) | Oui — mission 3 (tu/vous), si les répliques sont audio |
| **C1.2** | Comprendre des textes avec visuels et mots familiers (ex. une confirmation de réservation, une lettre) | **Oui** — missions 1, 4 |
| **C1.1 / C1.4** | Stratégies de lecture ; mots apparentés, indices de genre et de nombre | Oui — indices du jeu (« cherche un mot apparenté ») |
| **C3.1** | Identifier des communautés francophones des Amériques hors Canada et des aspects de leur culture | **Oui** — fil narratif, fiches de station |
| **C3.2** | Conventions sociolinguistiques dans des textes écrits | Oui — mission 3 |
| **D1.3** | Communiquer clairement : parties du discours, orthographe, ordre des mots, ponctuation | **Oui, de façon guidée** — mission 5 (message à compléter) |
| **A2.2 / B2.2** | Interagir à l'oral avec des pairs ou l'enseignant | **Non par l'appli.** Couvert par le défi oral final avec l'enseignant ou un partenaire |
| **B1** | Communiquer de l'information à l'oral | **Non par l'appli.** Le jeu ne demande jamais le micro |

**Limite assumée** : l'appli ne mesure pas la production orale. Elle la prépare (modèles de phrases entendus et lus) et la renvoie à l'enseignant.

---

## 3. Concept optimisé

### Titre proposé
**MISSION FRANCOPHONIE : LE SIGNAL PERDU**
(on garde l'esprit « code perdu », mais le mot « signal » colle au récit radio. À valider.)

### Synopsis
Le **Réseau Écho** relie des stations de radio francophones à travers les Amériques. Ce matin, le signal s'est éteint. Le QG d'Ottawa envoie des agents (les élèves) rallumer cinq stations. Chaque station rallumée livre un **mot-clé**. Avec les cinq mots, l'agent rédige le message de relance qui rétablit le réseau.

### Fil conducteur
- Une **carte des Amériques** s'illumine station par station : la progression est visible en un coup d'œil.
- Un personnage guide, **Lumi**, opératrice radio du QG, parle en français simple. Ses bulles ont un bouton « EN » pour la traduction.
- Chaque station a un contact local avec une petite fiche culturelle vraie et vérifiée.

### Thème linguistique transversal (à confirmer selon l'unité en cours)
**« Préparer le grand festival francophone »** : nourriture, heures, météo, lieux en ville, invitations, goûts (*j'aime / je n'aime pas / je voudrais*). Ce vocabulaire est courant en 7e année et réutilisable d'une mission à l'autre.

---

## 4. Les cinq missions (première version)

| # | Station | Mécanique de jeu | Compétence | Attente | Tâche observable | Réussite |
|---|---------|------------------|------------|---------|------------------|----------|
| 1 | **Lafayette, Louisiane** (marché) | **Fouille de scène** : une scène illustrée du marché ; l'élève lit une liste de courses en français et clique sur les bons objets, puis range les étiquettes. | Vocabulaire, lecture de mots | C1.2, C1.4, C3.1 | Retrouver 8 objets décrits en français | 8/8 (essais illimités, indice après 2 erreurs) |
| 2 | **Port-au-Prince, Haïti** (studio radio) | **Console radio** : trois messages audio courts ; l'élève règle trois cadrans (heure, lieu, météo) selon ce qu'il entend. | Compréhension orale | A1.1, A1.2 | Régler 3 cadrans × 3 messages | 3 messages décodés |
| 3 | **Fort-de-France, Martinique** (café) | **Conversation à embranchements** : l'élève choisit les répliques de l'agent ; le choix tu/vous et la logique question/réponse changent la réaction du contact. | Interaction écrite, registre | A3.2, C3.2, C1.2 | Mener une conversation cohérente jusqu'au bout | Conversation terminée sans réplique illogique |
| 4 | **Cayenne, Guyane** (ville) | **Carte et itinéraire** : l'élève lit des messages (invitation, panneau, horaire) et choisit où aller ; un mauvais choix mène à une impasse expliquée. | Lecture de situations, décision | C1.1, C1.2 | Atteindre le point de rendez-vous en 4 décisions | Arrivée au bon lieu |
| 5 | **Saint-Pierre-et-Miquelon** (phare-relais) | **Message de relance** : l'élève assemble et complète un message avec les 5 mots-clés et une banque de mots ; validation déterministe (ordre, accords, orthographe guidée). | Écriture guidée, synthèse | D1.3, C1.2 | Message correct de 3 phrases | Message validé → MISSION ACCOMPLIE |

**Bonus pour les rapides** (facultatifs, déverrouillés après chaque mission) : « Dossier secret » de la station, avec un mini-défi plus difficile (dictée de mots entendus, phrase à remettre dans l'ordre, question culturelle).

**Défi oral final (hors appli)** : l'élève lit son message de relance à voix haute à l'enseignant, qui pose une question tirée d'une liste (ex. « Qu'est-ce que tu voudrais manger au festival ? »).

### Soutien linguistique dégressif
- Missions 1–2 : consignes bilingues visibles, banque de mots illustrée, traduction sur demande.
- Missions 3–4 : consignes en français, bouton « EN » pour traduire, phrases modèles.
- Mission 5 : consignes en français, amorces de phrases, banque de mots ; la traduction anglaise reste accessible mais coûte un « indice ».
- Indices progressifs à 3 niveaux : stratégie → piste ciblée → réponse expliquée. Aucun élève n'est bloqué.

### Rythme visé (estimation non mesurée)
Lancement 4 min · M1 6 min · M2 8 min · M3 7 min · M4 7 min · M5 7 min · validation 5 min ≈ 44 min. À ajuster après un essai réel avec un groupe.

---

## 5. Audit technique

| Question | Réponse |
|----------|---------|
| GitHub Pages ? | Oui. Site statique servi en HTTPS, gratuit pour un dépôt public. |
| Sans serveur ? | Oui. Tout est dans le navigateur. |
| Images et audio ? | SVG (illustrations) et fichiers audio compressés (Opus/MP3, ~20–40 Ko par message). Compatibles Chrome/ChromeOS. |
| Performance Chromebook ? | Budget visé : < 1,5 Mo au premier chargement, animations CSS uniquement (transform/opacity). À **mesurer** ; non garanti sans appareil réel. |
| Sauvegarde locale ? | `localStorage`, versionné, protégé par try/catch. Si indisponible : le jeu marche quand même et l'écran l'indique (« progression non sauvegardée »). |
| QR code ? | Généré **après** publication, vers l'URL réellement testée. |
| Sans comptes ? | Oui. Un seul choix au départ : le groupe (7-15, 7-17, 7-18), qui n'identifie personne. |
| Routage ? | Machine à états interne, sans routeur d'URL : aucun risque de page 404 sur GitHub Pages. Chemins relatifs (`base: './'`). |

### Risque technique n° 1 : le filtre réseau de l'école
Les Chromebooks gérés peuvent bloquer `*.github.io`. **À tester sur un Chromebook d'élève avant la période.** Solution de secours prévue : un fichier HTML autonome (tout en un) à ouvrir hors ligne, plus le Plan B imprimable.

### Risque technique n° 2 : l'audio
- La synthèse vocale du navigateur dépend des voix installées. Elle sert seulement de **secours**.
- La solution principale : des fichiers audio préenregistrés (voir question 2).
- 30 élèves qui écoutent en même temps sans écouteurs, ce n'est pas viable (voir question 3).
- Chaque audio a une transcription accessible. Dans la mission 2, la transcription est marquée comme une **adaptation d'accessibilité** : la mission reste réussie, mais l'écran final indique « écoute adaptée ».

---

## 6. Sécurité et confidentialité

- Aucun compte, aucun nom, aucun courriel, aucune réponse envoyée à un serveur.
- Aucune analytique, aucune publicité, aucun cookie posé par l'appli, aucun clavardage, aucun micro, aucune caméra.
- **Polices auto-hébergées** (pas de Google Fonts) : aucune requête vers un tiers.
- Aucune clé d'API, aucune IA externe.
- **À signaler à l'école** : comme tout hébergeur, GitHub reçoit l'adresse IP des visiteurs dans ses journaux serveur. L'appli n'ajoute rien à cela.
- **À signaler à l'enseignant** : l'URL GitHub Pages contient le nom du compte GitHub (`nom-du-compte.github.io/...`). Si ce nom est votre nom réel, les élèves le verront.
- Cadre ontarien : les conseils scolaires sont soumis à la LAIMPVP (MFIPPA) et ont en général un processus d'approbation des ressources numériques. Je ne connais pas la procédure exacte du conseil ; **l'accord de la direction reste nécessaire avant l'utilisation en classe.** Le rapport d'audit final servira de fiche de présentation à la direction.

---

## 7. Coûts
Zéro : Vite, React, TypeScript, Vitest, Playwright, polices OFL et GitHub Pages sont gratuits. Aucun service payant.

---

## 8. Architecture retenue

```
mission-francophonie/
├─ index.html
├─ vite.config.ts           base: './'
├─ public/audio/*.mp3       messages préenregistrés
├─ src/
│  ├─ main.tsx, App.tsx     machine à états (accueil → intro → carte → missions → fin)
│  ├─ content/              textes FR/EN, réponses, indices (données pures, testées)
│  ├─ engine/               validation des réponses, normalisation, code de réussite
│  ├─ save/                 localStorage versionné + repli mémoire
│  ├─ missions/M1…M5/       un composant par mécanique
│  ├─ ui/                   système de design (boutons, panneaux, bulles, progression)
│  ├─ art/                  illustrations SVG en composants
│  └─ audio/                lecteur + secours synthèse vocale + effets WebAudio
├─ tests/unit/              Vitest : validation, sauvegarde, code de réussite
├─ tests/e2e/               Playwright : parcours complet, reprise, réinitialisation
├─ docs/                    guide enseignant, guide pédagogique, Plan B, rapport d'audit
└─ .github/workflows/deploy.yml   (créé, mais non activé sans votre accord)
```

Dépendances d'exécution : **react, react-dom** seulement. Le reste sert au développement.

---

## 9. Décisions validées par l'enseignant (12/11/2026)
- **Direction artistique** : A « Carnet de terrain » (papier chaud, encre marine, rouge signal, vert sarcelle), avec la console radio sombre de B réservée à la mission 2.
- **Voix audio** : synthèse vocale libre générée localement en MP3 (licence à vérifier et à documenter), remplaçable plus tard par une voix enregistrée.
- **Écouteurs** : la plupart des élèves en auront. La mission 2 se joue en solo au casque ; la transcription reste l'adaptation d'accessibilité.
- **GitHub** : compte existant au nom neutre.

## 10. Éléments bloquants avant utilisation en classe
1. Accord de la direction.
2. Test de l'URL sur un Chromebook d'élève (filtre réseau).
3. Écouteurs disponibles, ou plan d'écoute adapté.
4. Essai réel du parcours par un adulte, chronomètre en main.
