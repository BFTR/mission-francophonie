// Génère docs/fiche-eleve.html : fiche élève imprimable, une par feuille Lettre, en gros caractères,
// avec le code QR intégré (lu depuis docs/qr-code.svg, généré par `npm run qr`).
// Usage : node scripts/make-fiche-eleve.mjs   (puis `npm run pdf` pour le PDF prêt à imprimer)
import { readFileSync, writeFileSync } from 'node:fs';

const url = readFileSync('docs/qr-code.txt', 'utf8').split('\n')[0].trim();
const short = url.replace(/^https:\/\//, '').replace(/\/$/, '');
const svg = readFileSync('docs/qr-code.svg', 'utf8').replace(
  '<svg ',
  `<svg role="img" aria-label="Code QR vers ${url}" width="100%" height="100%" `,
);
// Adresse coupée en morceaux insécables : avant le premier point du domaine et après chaque « / ».
const urlLines = short
  .split('/')
  .flatMap((seg, i, arr) => {
    const part = seg + (i < arr.length - 1 ? '/' : '');
    const dot = i === 0 ? part.indexOf('.') : -1;
    return dot > 0 ? [part.slice(0, dot), part.slice(dot)] : [part];
  })
  .map((p) => `<span>${p}</span>`)
  .join('');

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
<title>Fiche élève — Mission Francophonie : Le signal perdu</title>
<style>
  @page { size: letter; margin: 11mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Atkinson Hyperlegible", Verdana, Arial, sans-serif; color: #1f2a44; font-size: 14pt; line-height: 1.35; }
  .fiche { width: 193mm; height: 256mm; margin: 0 auto; border: 2.5px solid #1f2a44; border-radius: 8px; padding: 7mm 8mm;
           display: flex; flex-direction: column; gap: 3.5mm; overflow: hidden; background: #fff; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 6mm; }
  .tag { display: inline-block; margin: 0; border: 1.5px solid #1f2a44; border-radius: 3px; padding: 0 2mm; font-size: 10pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  h1 { margin: 1.5mm 0 0; font-size: 32pt; line-height: 1; letter-spacing: -0.02em; white-space: nowrap; }
  .sub { display: inline-block; margin: 0; color: #b5381f; border: 2.5px solid #b5381f; border-radius: 4px; padding: 0 3mm; font-weight: 800; font-size: 18pt; transform: rotate(-2deg); }
  .group { margin: 0; font-weight: 700; font-size: 14pt; white-space: nowrap; }
  .group span { font-weight: 400; margin-left: 3mm; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 6mm; margin-top: 2.5mm; }
  .intro { display: grid; grid-template-columns: 1fr 62mm; gap: 7mm; align-items: start; }
  .pitch { margin: 0; font-size: 13.5pt; }
  .en { color: #4a5468; font-size: 11.5pt; line-height: 1.3; }
  p.en { margin: 2mm 0 0; }
  .qrbox { text-align: center; }
  .qr { width: 62mm; height: 62mm; border: 2.5px solid #1f2a44; border-radius: 6px; padding: 2.5mm; background: #fff; }
  .url { margin: 2.5mm 0 0; font-weight: 800; font-size: 14pt; line-height: 1.25; }
  .url span { display: block; white-space: nowrap; }
  h2 { margin: 0 0 1.5mm; font-size: 16pt; }
  .steps { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm 5mm; counter-reset: s; }
  .steps li { counter-increment: s; position: relative; padding-left: 9mm; }
  .steps li::before { content: counter(s); position: absolute; left: 0; top: 0; width: 7mm; height: 7mm; border-radius: 50%; background: #1f2a44; color: #fff; font-weight: 800; font-size: 12pt; display: grid; place-items: center; }

  .steps .en { display: block; }
  .help { display: grid; grid-template-columns: 1.2fr repeat(4, 1fr); gap: 3mm; align-items: center; }
  .help .help__label { background: none; text-align: left; padding: 0; }
  .help .help__label strong { font-size: 15pt; }
  .help div { background: #f4ebdd; border-radius: 5px; padding: 2mm 3mm; text-align: center; }
  .help strong { display: block; font-size: 15pt; }
  .help span { color: #4a5468; font-size: 11.5pt; }
  .keys ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 3mm; counter-reset: k; }
  .keys li { counter-increment: k; border: 2px solid #1f2a44; border-radius: 5px; padding: 1.5mm 2mm; height: 17mm; }
  .keys li::before { content: counter(k) " · " attr(data-city); display: block; font-size: 9pt; color: #4a5468; font-weight: 700; white-space: nowrap; letter-spacing: -0.01em; }
  .foot { margin: auto 0 0; font-size: 11.5pt; line-height: 1.25; border-top: 1.5px dashed #6b7385; padding-top: 2.5mm; }
  .foot .en { display: block; font-size: 10.5pt; }
  @media screen { body { background: #e8e2d6; padding: 10mm 0; } }
</style>
</head>
<body>
  <main class="fiche">
    <header>
      <p class="tag">Core French · Grade 7</p>
      <h1>Mission Francophonie</h1>
      <div class="row">
        <p class="sub">Le signal perdu</p>
        <p class="group">Mon groupe :<span>☐ 7-15</span><span>☐ 7-17</span><span>☐ 7-18</span></p>
      </div>
    </header>

    <section class="intro">
      <div>
        <p class="pitch"><strong>Le Réseau Écho est en panne!</strong> Tu es un agent du QG d’Ottawa. Voyage dans cinq communautés francophones des Amériques : la Louisiane, Haïti, la Martinique, la Guyane et Saint-Pierre-et-Miquelon. Dans chaque station, lis, écoute et réponds <strong>en français</strong> pour gagner un mot-clé. À la fin, écris l’invitation au grand festival!</p>
        <p class="en">The Écho Network is down! You are an agent from HQ in Ottawa. Travel to five francophone communities in the Americas. At each station, read, listen and answer in French to win a keyword. At the end, write the invitation to the big festival!</p>
      </div>
      <div class="qrbox">
        <div class="qr">${svg}</div>
        <p class="url">${urlLines}</p>
      </div>
    </section>

    <section>
      <h2>Comment jouer <span class="en">· How to play</span></h2>
      <ol class="steps">
        <li>Scanne le code ou tape l’adresse. <span class="en">Scan the code or type the address.</span></li>
        <li>Choisis ton groupe. Mets tes écouteurs. <span class="en">Choose your group. Put on your headphones.</span></li>
        <li>Rallume les 5 stations dans l’ordre. <span class="en">Turn the 5 stations back on, in order.</span></li>
        <li>Montre l’écran <strong>MISSION ACCOMPLIE!</strong> à ton enseignant·e. <span class="en">Show the final screen to your teacher.</span></li>
      </ol>
    </section>

    <section>
      <div class="help">
        <div class="help__label"><strong>Besoin d’aide?</strong><span>Need help?</span></div>
        <div><strong>Indice</strong><span>hint</span></div>
        <div><strong>Carnet</strong><span>word book</span></div>
        <div><strong>EN</strong><span>English</span></div>
        <div><strong>Consignes</strong><span>instructions</span></div>
      </div>
    </section>

    <section class="keys">
      <h2>Mes mots-clés <span class="en">· My keywords</span></h2>
      <ol>
        <li data-city="Lafayette"></li>
        <li data-city="Port-au-Prince"></li>
        <li data-city="Fort-de-France"></li>
        <li data-city="Cayenne"></li>
        <li data-city="Saint-Pierre"></li>
      </ol>
    </section>

    <p class="foot">Réessaie autant que tu veux. Aucun compte, aucun nom : ta progression reste sur ce Chromebook.
      <span class="en">Try again as often as you like. No account, no name.</span></p>
  </main>
</body>
</html>
`;

writeFileSync('docs/fiche-eleve.html', nbsp(html));
console.log(`docs/fiche-eleve.html généré pour ${url}`);
