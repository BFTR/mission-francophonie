# Rapport — retour d'utilisation en classe (13 novembre 2026)

## Résumé

| Problème signalé | Statut |
|---|---|
| L'audio lit parfois le message précédent | **Causes confirmées, corrigées, testées** (2 causes) |
| Jeu inaccessible depuis l'école, avertissement de sécurité | **Cause très probable identifiée** (signalement Google du domaine `bftr.github.io`). Solution prête : déploiement Vercel (**à autoriser**). Accès scolaire **non confirmé** tant qu'il n'est pas testé sur un Chromebook d'élève |
| Jouer sans Chromebooks élèves | **Mode projecteur ajouté** |

---

## 1. Audio : causes confirmées

**Cause 1, confirmée et reproduite.** Le lecteur créait son fichier audio au premier clic, puis le **réutilisait**. Dans la conversation de la mission 3 (« Je voudrais un jus de goyave… »), le lecteur de la réplique en cours reste au même endroit de la page : le texte changeait, mais le fichier restait celui de la première réplique écoutée.
*Preuve* : sur 6 répliques, le test a enregistré 5 lectures de `m3-j1.mp3`. L'actualisation recréait le lecteur, d'où la nécessité d'actualiser.

**Cause 2, mécanisme confirmé et reproduit.** Arrêter un son pendant son chargement (clic sur un autre message, réseau lent) annule la lecture. Le jeu prenait cette annulation pour une panne et passait en « mode secours » : avertissement à tort, ou **voix de synthèse du Chromebook lisant l'ancien message**.
*Preuve* : avec un réseau ralenti, 2 faux avertissements apparaissent. Que ce soit bien cette voix qui a été entendue en classe n'a pas pu être vérifié sur un Chromebook réel.

**Corrections** ([src/ui/AudioClip.tsx](../src/ui/AudioClip.tsx)) :
- un lecteur neuf pour chaque fichier : l'ancien est arrêté et libéré dès que le message change ;
- un seul son à la fois dans tout le jeu ;
- une lecture annulée volontairement ne déclenche plus jamais la voix de secours ;
- les réponses tardives d'une lecture périmée sont ignorées (numéro de lecture).

Aucun texte, aucun fichier audio et aucune activité n'ont changé.

## 2. Accès depuis l'école

**Vérifié** : HTTPS valide (certificat Let's Encrypt `*.github.io`, jusqu'au 29/12/2026), redirection `http` → `https`, en-tête HSTS, aucune ressource externe.

**Constat** : Google Navigation sécurisée signale **tout le domaine `bftr.github.io`** (y compris l'autre site `jeux-francais`). Motif affiché : « pages qui incitent à fournir des informations personnelles ou à télécharger des logiciels ». Chrome affiche alors un avertissement rouge, et les Chromebooks gérés empêchent généralement de passer outre.
- **Cause très probable**, cohérente avec ce que vous avez observé, mais pas prouvée : le filtre de l'école peut aussi bloquer `github.io` pour d'autres raisons.
- La page qui a déclenché le signalement n'est pas connue. Le jeu ne demande ni nom ni courriel ; un faux positif est possible.

**Solution préparée : Vercel.**
- Domaine différent, et votre autre site Vercel passe le filtre de l'école.
- Le jeu fonctionne sans modification : les chemins sont relatifs.
- Ajout de [vercel.json](../vercel.json) avec des en-têtes de sécurité stricts : politique de contenu limitée au site lui-même, micro et caméra interdits, aucune intégration dans d'autres sites, pas d'indexation.
- Testé localement avec ces en-têtes : aucune violation, polices et audio fonctionnels.

**Non fait** : la mise en ligne sur Vercel (votre accord et votre compte sont nécessaires). Nous ne contournons aucun avertissement de sécurité.

**Démarche facultative de votre côté** : demander à Google un réexamen de `bftr.github.io` (formulaire de signalement d'erreur de Navigation sécurisée, ou Google Search Console).

## 3. Mode projecteur (classe entière)

Adresse du jeu + `#classe`, ou bouton « Mode projecteur » (accueil ou menu ☰). Le texte et les boutons sont agrandis de 25 % ; tout le reste est identique et le réglage est conservé.
**Déroulement conseillé** : vous pilotez le jeu ; la classe lit à voix haute, vote les réponses à main levée, puis vous cliquez. Pour l'écoute (mission 2), utilisez des haut-parleurs et le bouton « Plus lent ».

## 4. Tests effectués (13/11/2026)

| Contrôle | Résultat |
|---|---|
| Tests unitaires | 104 / 104 |
| Tests de bout en bout | **16 / 16** (dont 5 nouveaux tests audio et 2 tests de déploiement et projecteur) |
| Audio, mission 3 : chaque réplique lit son fichier, sans actualiser | réussi (6 répliques, 6 fichiers différents) |
| Audio : l'ancien son s'arrête au changement de réplique | réussi |
| Audio, mission 2 : canaux alternés rapidement | réussi |
| Audio : réseau lent et changements rapides, aucune voix de secours parasite | réussi |
| Audio : aller-retour carte ↔ mission | réussi |
| En-têtes Vercel (CSP) : aucune violation, polices et audio chargés | réussi |
| Mode projecteur (`#classe` et menu, aucun débordement, réglage conservé) | réussi ; vérifié aussi à l'œil à 1280 × 720 |
| Accessibilité axe-core (14 écrans) | 0 violation |
| Typage, lint, typographie, compilation | réussis |

## 5. Reste à vérifier à l'école

1. Ouvrir la future adresse Vercel **sur un Chromebook d'élève, au réseau de l'école** (procédure ci-dessous).
2. Écouter les messages de la mission 3 dans l'ordre, sans actualiser.
3. Tester le mode projecteur sur le vrai projecteur (lisibilité depuis le fond de la classe).

---

## Procédure de test sur un Chromebook d'élève (5 minutes)

À faire avec un compte élève (ou demander à un élève), sur le réseau de l'école, **avant** la période :

1. Ouvrir l'adresse du jeu dans Chrome.
   - ✅ L'accueil « Mission Francophonie » s'affiche.
   - ❌ Une page de blocage ou un avertissement rouge apparaît : **ne pas contourner**. Noter le texte exact (ou prendre une photo) et utiliser le mode projecteur ou le Plan B.
2. Choisir un groupe → Commencer → Suivant ×4 → Voir la carte. ✅ La carte s'affiche.
3. Station 1 → Jouer → Aller au marché → cliquer un produit. ✅ Une réponse apparaît.
4. **Audio** : avec des écouteurs, ouvrir dans un nouvel onglet l'adresse du jeu suivie de `audio/m3-j2.mp3` (ex. `…vercel.app/audio/m3-j2.mp3`). ✅ On entend « Voilà votre jus. Vous venez d'où? ». Cela confirme que le filtre laisse passer les sons.
   La correction « bon audio pour chaque réplique » se vérifie ensuite en jouant la mission 3 (par exemple en mode projecteur) : écouter une réplique, répondre, écouter la suivante, **sans actualiser**. ✅ Chaque réplique a sa propre voix.
5. Actualiser la page. ✅ La progression est conservée.
6. Menu ☰ → Recommencer → Oui. ✅ Retour à l'accueil.

Si l'étape 1 échoue sur le Chromebook d'élève mais réussit sur le vôtre, c'est le **filtre de l'école** : il faudra demander au service informatique d'autoriser l'adresse.
