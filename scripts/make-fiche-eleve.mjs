// Génère docs/fiche-eleve.html : fiche élève imprimable (2 fiches identiques par feuille Lettre),
// avec le code QR intégré (lu depuis docs/qr-code.svg, généré par `npm run qr`).
// Usage : node scripts/make-fiche-eleve.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const url = readFileSync('docs/qr-code.txt', 'utf8').split('\n')[0].trim();
const short = url.replace(/^https:\/\//, '').replace(/\/$/, '');
const svg = readFileSync('docs/qr-code.svg', 'utf8').replace(
  '<svg ',
  `<svg role="img" aria-label="Code QR vers ${url}" width="100%" height="100%" `,
);

const fiche = `
  <section class="fiche">
    <header class="fiche__head">
      <div>
        <p class="tag">Core French · Grade 7</p>
        <h1>Mission Francophonie</h1>
        <p class="sub">Le signal perdu</p>
      </div>
      <p class="group">Mon groupe : <span>☐ 7-15</span> <span>☐ 7-17</span> <span>☐ 7-18</span></p>
    </header>

    <div class="fiche__body">
      <div class="fiche__text">
        <p class="pitch"><strong>Le Réseau Écho est en panne!</strong> Tu es un agent du QG d’Ottawa. Voyage dans cinq communautés francophones des Amériques : la Louisiane, Haïti, la Martinique, la Guyane et Saint-Pierre-et-Miquelon. Dans chaque station, lis, écoute et réponds <strong>en français</strong> pour gagner un mot-clé. À la fin, écris l’invitation au grand festival!</p>
        <p class="en">The Écho Network is down! You are an agent from HQ in Ottawa. Travel to five francophone communities in the Americas. At each station, read, listen and answer in French to win a keyword. At the end, write the invitation to the big festival!</p>

        <ol class="steps">
          <li>Scanne le code ou tape l’adresse. <span class="en">Scan the code or type the address.</span></li>
          <li>Choisis ton groupe. Mets tes écouteurs. <span class="en">Choose your group. Put on your headphones.</span></li>
          <li>Rallume les 5 stations dans l’ordre. <span class="en">Turn the 5 stations back on, in order.</span></li>
          <li>Montre l’écran <strong>MISSION ACCOMPLIE!</strong> à ton enseignant·e. <span class="en">Show the final screen to your teacher.</span></li>
        </ol>
      </div>

      <div class="fiche__qr">
        <div class="qr">${svg}</div>
        <p class="url">${short
          .split('/')
          .map((p, i, arr) => `<span>${p}${i < arr.length - 1 ? '/' : ''}</span>`)
          .join('')}</p>
      </div>
    </div>

    <div class="fiche__help">
      <span><strong>Indice</strong> = hint</span>
      <span><strong>Carnet</strong> = word book</span>
      <span><strong>EN</strong> = English</span>
      <span><strong>Consignes</strong> = instructions</span>
    </div>

    <div class="fiche__keys">
      <p>Mes mots-clés <span class="en">· My keywords</span></p>
      <ol>
        <li><small>Lafayette</small><span></span></li>
        <li><small>Port-au-Prince</small><span></span></li>
        <li><small>Fort-de-France</small><span></span></li>
        <li><small>Cayenne</small><span></span></li>
        <li><small>Saint-Pierre</small><span></span></li>
      </ol>
    </div>
    <p class="privacy">Tu peux réessayer autant de fois que tu veux. Aucun compte, aucun nom : ta progression reste sur ce Chromebook. <span class="en">Try again as often as you want. No account, no name: your progress stays on this Chromebook.</span></p>
  </section>`;

const html = `<!doctype html>
<html lang="fr-CA">
<head>
<meta charset="utf-8">
<title>Fiche élève — Mission Francophonie : Le signal perdu</title>
<style>
  @page { size: letter; margin: 8mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Atkinson Hyperlegible", Verdana, Arial, sans-serif; color: #1f2a44; font-size: 10pt; line-height: 1.3; }
  .sheet { width: 200mm; margin: 0 auto; }
  .fiche { height: 129mm; justify-content: flex-start; border: 2px solid #1f2a44; border-radius: 6px; padding: 4mm 5mm; display: flex; flex-direction: column; gap: 1.5mm; overflow: hidden; background: #fff; }
  .cut { height: 5mm; display: flex; align-items: center; gap: 2mm; color: #6b7385; font-size: 8pt; }
  .cut::before, .cut::after { content: ""; flex: 1; border-top: 1.5px dashed #6b7385; }
  .fiche__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 4mm; }
  .tag { display: inline-block; margin: 0; border: 1.3px solid #1f2a44; border-radius: 3px; padding: 0 1.5mm; font-size: 7pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  h1 { margin: .5mm 0 0; font-size: 18pt; line-height: 1; letter-spacing: -0.02em; }
  .sub { display: inline-block; margin: 1.2mm 0 0; color: #b5381f; border: 2px solid #b5381f; border-radius: 3px; padding: 0 2mm; font-weight: 800; font-size: 11pt; transform: rotate(-2deg); }
  .group { margin: 0; font-weight: 700; white-space: nowrap; font-size: 10pt; }
  .group span { margin-left: 2mm; font-weight: 400; }
  .fiche__body { display: grid; grid-template-columns: 1fr 44mm; gap: 4mm; align-items: start; }
  .pitch { margin: 0; }
  .en { color: #4a5468; font-size: 8.5pt; }
  p.en { margin: 1mm 0 0; }
  .steps { margin: 1.5mm 0 0; padding-left: 5mm; }
  .steps li { margin: .3mm 0; }
  .steps .en { margin-left: 1mm; }
  .fiche__qr { text-align: center; }
  .qr { width: 44mm; height: 44mm; border: 2px solid #1f2a44; border-radius: 5px; padding: 1.5mm; background: #fff; }
  .url { margin: 1.5mm 0 0; font-weight: 700; font-size: 8.5pt; line-height: 1.25; }
  .url span { display: block; white-space: nowrap; }
  .fiche__help { display: flex; flex-wrap: wrap; gap: 1.2mm 3mm; background: #f4ebdd; border-radius: 4px; padding: 1.5mm 2.5mm; font-size: 9pt; }
  .fiche__keys p { margin: 0 0 1mm; font-weight: 700; font-size: 9.5pt; }
  .fiche__keys ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 2mm; counter-reset: k; }
  .fiche__keys li { counter-increment: k; border: 1.5px solid #1f2a44; border-radius: 4px; padding: 1mm 1.5mm; height: 9mm; display: flex; flex-direction: column; }
  .fiche__keys li small::before { content: counter(k) " · "; font-weight: 800; }
  .fiche__keys small { font-size: 7pt; color: #4a5468; }
  .privacy { margin: auto 0 0; font-size: 7pt; line-height: 1.2; color: #4a5468; }
  .privacy .en { font-size: 7pt; }
  @media screen { body { background: #e8e2d6; padding: 8mm 0; } }
</style>
</head>
<body>
  <main class="sheet">
${fiche}
    <div class="cut">couper ici · cut here</div>
${fiche}
  </main>
</body>
</html>
`;

writeFileSync('docs/fiche-eleve.html', html);
console.log(`docs/fiche-eleve.html généré pour ${url}`);
