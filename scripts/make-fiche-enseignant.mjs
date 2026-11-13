// Génère docs/fiche-enseignant.html : fiche enseignant imprimable (gros caractères, format Lettre),
// avec le code QR intégré. Contenu repris du guide de lancement (docs/guide-enseignant.md).
// Usage : node scripts/make-fiche-enseignant.mjs   (puis `npm run pdf`)
import { readFileSync, writeFileSync } from 'node:fs';

const url = readFileSync('docs/qr-code.txt', 'utf8').split('\n')[0].trim();
const svg = readFileSync('docs/qr-code.svg', 'utf8').replace(
  '<svg ',
  `<svg role="img" aria-label="Code QR vers ${url}" width="100%" height="100%" `,
);

/** Typographie : espaces insécables dans « », avant : et dans « 50 s » (texte HTML seulement). */
const nbsp = (h) =>
  h
    .replace(/« /g, '«&nbsp;')
    .replace(/ »/g, '&nbsp;»')
    .replace(/(\S) :(\s)/g, '$1&nbsp;:$2')
    .replace(/(\d) (s|min|h)\b/g, '$1&nbsp;$2');

const html = `<!doctype html>
<html lang="fr-CA">
<head>
<meta charset="utf-8">
<title>Fiche enseignant — Mission Francophonie : Le signal perdu</title>
<style>
  @page { size: letter; margin: 14mm 15mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Atkinson Hyperlegible", Verdana, Arial, sans-serif; color: #1f2a44; font-size: 13pt; line-height: 1.4; }
  main { max-width: 186mm; margin: 0 auto; }
  .head { display: grid; grid-template-columns: 1fr 52mm; gap: 7mm; align-items: start; border-bottom: 2.5px solid #1f2a44; padding-bottom: 4mm; margin-bottom: 2mm; }
  .tag { display: inline-block; margin: 0; border: 1.5px solid #1f2a44; border-radius: 3px; padding: 0 2mm; font-size: 9.5pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  h1 { margin: 2mm 0 0; font-size: 26pt; line-height: 1.05; letter-spacing: -0.02em; }
  .sub { display: inline-block; margin: 2mm 0 3mm; color: #b5381f; border: 2px solid #b5381f; border-radius: 3px; padding: 0 2.5mm; font-weight: 800; font-size: 14pt; transform: rotate(-1.5deg); }
  .meta { margin: 0; font-size: 12pt; }
  .addr { margin: 2.5mm 0 0; font-size: 14pt; font-weight: 800; }
  .addr small { display: block; font-size: 11.5pt; font-weight: 400; margin-top: 1mm; }
  .addr small span { display: block; white-space: nowrap; font-weight: 700; }
  .qr { width: 52mm; height: 52mm; border: 2px solid #1f2a44; border-radius: 5px; padding: 2mm; }
  h2 { font-size: 17pt; margin: 6mm 0 2mm; padding-bottom: 1mm; border-bottom: 1.5px solid #cdbb9c; break-after: avoid; }
  .box, .quote, .warn, table { break-inside: avoid; }
  p { margin: 0 0 2mm; }
  ul, ol { margin: 0 0 2mm; padding-left: 7mm; }
  li { margin: 0 0 1.5mm; }
  table { width: 100%; border-collapse: collapse; margin: 1mm 0 2mm; font-size: 12.5pt; }
  th, td { border: 1.5px solid #1f2a44; padding: 2mm 2.5mm; text-align: left; vertical-align: top; }
  th { background: #f4ebdd; font-size: 11.5pt; }
  tr { break-inside: avoid; }
  .box { border: 2px solid #1f2a44; border-radius: 6px; padding: 3mm 4mm; background: #f8e7bd; margin: 2mm 0; }
  .quote { border-left: 4px solid #b5381f; padding: 1mm 0 1mm 4mm; margin: 2mm 0; font-size: 14pt; }
  .warn { font-size: 12pt; background: #f6ddd3; border-radius: 5px; padding: 2.5mm 3.5mm; }
  .check li { list-style: none; margin-left: -6mm; }
  .check li::before { content: "☐ "; font-size: 14pt; }
  @media screen { body { background: #e8e2d6; padding: 10mm 0; } main { background: #fff; padding: 14mm; } }
</style>
</head>
<body>
<main>
  <header class="head">
    <div>
      <p class="tag">Fiche enseignant · Core French · Grade 7</p>
      <h1>Mission Francophonie</h1>
      <p class="sub">Le signal perdu</p>
      <p class="meta">Une période de 50 minutes · Chromebook · écouteurs · sans compte élève</p>
      <p class="addr">${url}<small>Espace enseignant (codes du jour) :<span>${url}#enseignant</span></small></p>
    </div>
    <div class="qr">${svg}</div>
  </header>

  <div class="box"><strong>Avant la première utilisation :</strong> accord de la direction · test de l’adresse sur un Chromebook d’élève, au réseau de l’école · écoute des 10 messages audio (environ 50 s) · Plan B imprimé.</div>

  <section>
    <h2>Objectif</h2>
    <p>Les élèves rallument cinq radios francophones des Amériques (Louisiane, Haïti, Martinique, Guyane, Saint-Pierre-et-Miquelon). Chaque station donne un mot-clé. À la fin, ils rédigent une invitation au festival, en français.</p>
    <p><strong>Travaillé dans le jeu :</strong> lecture, compréhension orale, interaction écrite (tu/vous), écriture guidée. <strong>Expression orale :</strong> avec vous, à la fin (défi oral). Le jeu ne l’évalue pas.</p>
  </section>

  <section>
    <h2>Déroulement (durées estimées, non mesurées en classe)</h2>
    <table>
      <tr><th style="width:22%">Temps</th><th style="width:28%">Étape</th><th>Vous faites</th></tr>
      <tr><td>0 – 5 min</td><td>Lancement</td><td>Projetez l’affiche ou distribuez la fiche élève. Écouteurs. Choix du groupe.</td></tr>
      <tr><td>5 – 43 min</td><td>Jeu en autonomie</td><td>Circulez. Encouragez <strong>Indice</strong>, <strong>Carnet</strong> et <strong>EN</strong> avant de lever la main.</td></tr>
      <tr><td>43 – 50 min</td><td>Validation</td><td>Vérifiez les écrans « MISSION ACCOMPLIE! » et posez une question orale.</td></tr>
    </table>
    <p>Repères : mission 1 ≈ 7 min · 2 ≈ 7 min · 3 ≈ 6 min · 4 ≈ 6 min · 5 ≈ 8 min.<br>
    <strong>Élèves rapides :</strong> les « Dossiers secrets » (3 défis bonus par station).<br>
    <strong>Élèves plus lents :</strong> la progression est sauvegardée ; ils finissent plus tard sur le <em>même</em> Chromebook.</p>
  </section>

  <section>
    <h2>Consignes à lire aux élèves</h2>
    <div class="quote">Ouvre l’adresse. Choisis ton groupe. Écoute Lumi, puis va sur la carte.<br>
    Rallume les cinq stations dans l’ordre. Tu peux réessayer autant de fois que tu veux.<br>
    Bloqué? Clique sur <strong>Indice</strong>, puis <strong>Carnet</strong>. Le bouton <strong>EN</strong> montre la traduction.<br>
    À la fin, montre-moi l’écran <strong>MISSION ACCOMPLIE!</strong></div>
  </section>

  <section>
    <h2>Vérifier la réussite</h2>
    <ol>
      <li><strong>L’écran final :</strong> titre « MISSION ACCOMPLIE! », cinq mots-clés, l’invitation de l’élève.</li>
      <li><strong>Le code de réussite</strong> (ex. ECHO-717-XXXX) dépend du <strong>groupe</strong> et de la <strong>date</strong>. Codes attendus du jour : espace enseignant (adresse + <strong>#enseignant</strong>).</li>
      <li><strong>Le défi oral</strong> (1 minute) : l’élève lit son invitation à voix haute, puis répond à une question.</li>
    </ol>
    <p class="warn"><strong>Limite :</strong> le code peut être partagé entre élèves d’un même groupe ou retrouvé en inspectant le jeu. Il sert à une vérification rapide et formative, avec l’écran et la question orale. <strong>« Écoute adaptée »</strong> sur l’écran final : l’élève a utilisé la transcription à la mission 2 (adaptation légitime, mais la compréhension orale n’a pas été démontrée).</p>
  </section>

  <section>
    <h2>Questions orales et réponses attendues</h2>
    <table>
      <tr><th style="width:44%">Question</th><th>Réponse attendue</th></tr>
      <tr><td>Quand est le festival?</td><td>Le festival est samedi à 14 h (à quatorze heures).</td></tr>
      <tr><td>Qu’est-ce qu’il y a au menu?</td><td>Il y a un gombo.</td></tr>
      <tr><td>Où est le festival?</td><td>Au port (de Saint-Pierre), à côté du phare.</td></tr>
      <tr><td>Qu’est-ce que tu apportes au festival?</td><td>J’apporte du pain / de la limonade / des pommes…</td></tr>
      <tr><td>À la directrice, tu dis « tu » ou « vous »? Pourquoi?</td><td>« Vous », parce que c’est une adulte (politesse).</td></tr>
      <tr><td>Nomme une communauté francophone des Amériques.</td><td>La Louisiane, Haïti, la Martinique, la Guyane, Saint-Pierre-et-Miquelon…</td></tr>
    </table>
  </section>

  <section>
    <h2>Mots-clés à retrouver sur les fiches élèves</h2>
    <table>
      <tr><th>1 · Lafayette</th><th>2 · Port-au-Prince</th><th>3 · Fort-de-France</th><th>4 · Cayenne</th><th>5 · Saint-Pierre</th></tr>
      <tr><td>un gombo</td><td>samedi à 14 h</td><td>Venez!</td><td>au port</td><td>l’invitation</td></tr>
    </table>
  </section>

  <section>
    <h2>Problèmes fréquents</h2>
    <table>
      <tr><th style="width:40%">Problème</th><th>Solution</th></tr>
      <tr><td>La page ne s’ouvre pas</td><td>Filtre réseau de l’école (github.io bloqué?) → Plan B imprimable.</td></tr>
      <tr><td>Pas de son</td><td>Volume, écouteurs. Sinon bouton <strong>Texte</strong> : la mission reste faisable.</td></tr>
      <tr><td>« Ce navigateur ne peut pas sauvegarder »</td><td>Navigation privée ou stockage bloqué : le jeu marche, mais un rechargement repart du début.</td></tr>
      <tr><td>Recommencer</td><td>Menu (☰) → Recommencer → confirmer.</td></tr>
      <tr><td>Changement de Chromebook</td><td>La progression reste sur l’appareil d’origine.</td></tr>
      <tr><td>Élève bloqué</td><td>Indice 3 / 3 donne la réponse expliquée : aucune mission n’est impossible.</td></tr>
    </table>
  </section>

  <section>
    <h2>Vérifications préalables (une fois)</h2>
    <ul class="check">
      <li>Accord de la direction (rapport d’audit dans le dépôt : docs/rapport-audit.md).</li>
      <li>Adresse ouverte sur un Chromebook d’élève, à l’école, sur le réseau de l’école.</li>
      <li>Les 10 messages audio écoutés : prononciation correcte?</li>
      <li>Une partie complète jouée, chronomètre en main.</li>
      <li>Écouteurs disponibles · Plan B imprimé.</li>
    </ul>
  </section>

  <section>
    <h2>Confidentialité</h2>
    <p>Aucun compte, aucun nom, aucun courriel. Aucune donnée envoyée : la progression reste dans le navigateur du Chromebook. Pas de publicité, d’outil d’analyse, de cookie ajouté par le jeu, de micro, de caméra ni de clavardage. Aucun service tiers. Comme tout hébergeur, GitHub reçoit l’adresse IP des visiteurs dans ses journaux techniques.</p>
  </section>
</main>
</body>
</html>
`;

writeFileSync('docs/fiche-enseignant.html', nbsp(html));
console.log(`docs/fiche-enseignant.html généré pour ${url}`);
