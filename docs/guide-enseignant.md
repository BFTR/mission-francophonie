# Guide de lancement — Mission Francophonie : Le signal perdu

*Core French, 7e année · une période de 50 minutes · Chromebook · sans compte élève*

> **Avant la première utilisation :** accord de la direction, test de l'adresse sur un Chromebook d'élève, écoute des 10 messages audio (voir « Vérifications préalables »).

---

> **13/11/2026 :** le jeu est désormais hébergé sur **Vercel**. L'ancienne adresse `bftr.github.io` est signalée par Google Navigation sécurisée et a été bloquée à l'école : ne plus l'utiliser. Détails : [rapport-retour-classe.md](rapport-retour-classe.md).

## 1. Adresse du jeu et code QR

| | |
|---|---|
| **Adresse du jeu** | **https://mission-francophonie.vercel.app/** |
| **Code QR** | ci-dessous, ou en grand sur l'affiche à projeter : [affiche-qr.html](affiche-qr.html) |
| **Fiches à imprimer (PDF)** | [pdf/fiche-eleve.pdf](pdf/fiche-eleve.pdf) (1 page par élève, gros caractères, code QR) · [pdf/fiche-enseignant.pdf](pdf/fiche-enseignant.pdf) (4 pages) |
| **Mode projecteur** | adresse du jeu + `#classe` (ou bouton « Mode projecteur ») : texte agrandi pour jouer en classe entière |
| **Espace enseignant** | https://mission-francophonie.vercel.app/#enseignant |
| **Secours hors ligne** | le dossier `dist/` sur une clé USB (voir § 7) et le Plan B imprimable |

![Code QR vers https://mission-francophonie.vercel.app/](qr-code.png)

**Vérifié le 13 novembre 2026** sur le site Vercel : les 16 scénarios automatisés passent (partie complète, audio, en-têtes de sécurité, mode projecteur, accessibilité). Google Navigation sécurisée ne signale pas l'adresse. Le code QR a été décodé par programme.
**Pas encore vérifié** : l'ouverture sur un Chromebook d'élève, au réseau de l'école. C'est le test décisif.

## 2. Objectif de la période

Les élèves rallument cinq radios francophones des Amériques (Louisiane, Haïti, Martinique, Guyane, Saint-Pierre-et-Miquelon). Chaque station leur donne un mot-clé. À la fin, ils rédigent une invitation au festival en français.

- **Compétences travaillées** : lecture de vocabulaire, compréhension orale, interaction écrite (tu/vous), lecture de courts messages, écriture guidée.
- **Expression orale** : elle se fait avec vous, à la fin (défi oral, § 5). Le jeu ne l'évalue pas.

## 3. Déroulement conseillé (durées estimées, non mesurées en classe)

| Temps | Quoi | Vous faites |
|---|---|---|
| 0–5 min | Lancement | Projetez l'adresse ou le code QR. Demandez les écouteurs. Les élèves choisissent leur groupe (7-15, 7-17 ou 7-18). |
| 5–43 min | Jeu en autonomie | Circulez. Encouragez l'usage des boutons **Indice**, **Carnet** et **EN** avant de lever la main. |
| 43–50 min | Validation | Vérifiez les écrans « MISSION ACCOMPLIE! » et posez une question orale à quelques élèves. |

Repères par mission (estimation) : M1 ≈ 7 min · M2 ≈ 7 min · M3 ≈ 6 min · M4 ≈ 6 min · M5 ≈ 8 min.
**Élèves rapides** : les « Dossiers secrets » (3 défis bonus par station, accessibles depuis chaque écran de récompense).
**Élèves plus lents** : la progression est sauvegardée sur le Chromebook ; ils peuvent finir à la période suivante, sur le **même** Chromebook et le même navigateur.

## 4. Consignes à donner aux élèves (à lire ou projeter)

> Ouvre l'adresse. Choisis ton groupe. Écoute Lumi, puis va sur la carte.
> Rallume les cinq stations dans l'ordre. Tu peux réessayer autant de fois que tu veux.
> Bloqué? Clique sur **Indice**, puis **Carnet**. Le bouton **EN** montre la traduction.
> À la fin, montre-moi l'écran **MISSION ACCOMPLIE!**

## 5. Vérifier la réussite

1. **Regardez l'écran final** : titre « MISSION ACCOMPLIE! », cinq mots-clés, l'invitation de l'élève.
2. **Code de réussite** : il est affiché en grand (ex. `ECHO-717-XXXX`). Il dépend du **groupe** et de la **date du jour**. Les codes attendus du jour sont dans l'**espace enseignant** (`…/#enseignant`).
3. **Défi oral** (1 minute par élève) : l'élève lit son invitation à voix haute, puis vous posez une question :

| Question | Réponse attendue |
|---|---|
| Quand est le festival? | Le festival est samedi à 14 h (à quatorze heures). |
| Qu'est-ce qu'il y a au menu? | Il y a un gombo. |
| Où est le festival? | Au port (de Saint-Pierre), à côté du phare. |
| Qu'est-ce que tu apportes au festival? | J'apporte du pain / de la limonade / des pommes… |
| À la directrice, tu dis « tu » ou « vous »? Pourquoi? | « Vous », parce que c'est une adulte (politesse). |
| Nomme une communauté francophone des Amériques. | La Louisiane, Haïti, la Martinique, la Guyane, Saint-Pierre-et-Miquelon… |

**Limite honnête** : dans un site sans serveur, le code peut être retrouvé par un élève qui inspecte le jeu, ou partagé entre élèves du même groupe. Il sert à une vérification rapide et formative, avec le coup d'œil sur l'écran et la question orale. Ce n'est pas une preuve infalsifiable.

**Mention « écoute adaptée »** : si un élève a utilisé la transcription écrite à la mission 2, l'écran final l'indique. C'est une adaptation d'accessibilité légitime (son indisponible, besoin particulier), mais la compréhension *orale* n'a alors pas été démontrée.

## 6. Problèmes fréquents

| Problème | Solution |
|---|---|
| La page ne s'ouvre pas | Le filtre réseau bloque peut-être l'adresse : ne pas contourner l'avertissement, noter le message exact, utiliser le mode projecteur sur votre appareil ou le Plan B. |
| Pas de son | Vérifier le volume ou les écouteurs. Sinon, bouton **Texte** (la mission reste faisable). |
| Bandeau « ce navigateur ne peut pas sauvegarder » | Navigation privée ou stockage bloqué : le jeu fonctionne, mais un rechargement repart du début. Terminer d'une traite. |
| Un élève veut recommencer | Menu (☰) → Recommencer → confirmer. |
| Changement de Chromebook | La progression ne suit pas : elle reste sur l'appareil d'origine. |
| Élève bloqué dans une mission | Indice 3 / 3 donne la réponse expliquée : aucune mission n'est impossible à finir. |

## 7. Solution de secours hors ligne

Le dossier `dist/` produit par `npm run build` contient tout le jeu (chemins relatifs). Copié sur une clé USB ou un lecteur partagé, il peut être servi localement par un enseignant. **Non testé** sur un Chromebook géré : l'ouverture d'un fichier local (`file://`) peut être bloquée par les modules JavaScript. Le **Plan B imprimable** (`docs/plan-b.html`) reste la solution sûre.

## 8. Vérifications préalables (une fois)

- [ ] Accord de la direction (fiche : `docs/rapport-audit.md`).
- [ ] Adresse ouverte sur **un Chromebook d'élève**, à l'école, sur le réseau de l'école.
- [ ] Les 10 messages audio écoutés (environ 50 s) : prononciation correcte? (`public/audio/`)
- [ ] Une partie complète jouée par un adulte, chronomètre en main, pour ajuster les durées du § 3.
- [ ] Écouteurs disponibles.

## 9. Confidentialité (à communiquer si on vous le demande)

Aucun compte, aucun nom, aucun courriel. Aucune donnée n'est envoyée : la progression reste dans le navigateur du Chromebook. Pas de publicité, pas d'outil d'analyse, pas de cookie ajouté par le jeu, pas de micro ni de caméra, pas de clavardage. Les polices et les sons sont hébergés avec le jeu (aucun service tiers). Comme tout hébergeur, GitHub reçoit l'adresse IP des visiteurs dans ses journaux techniques.
