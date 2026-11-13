// Génère le code QR vers l'adresse RÉELLEMENT publiée du jeu.
// Refuse toute adresse qui ne répond pas, pour ne jamais imprimer un QR vers une adresse supposée.
// Usage : npm run qr -- https://<compte>.github.io/<depot>/
import { writeFileSync, mkdirSync } from 'node:fs';
import QRCode from 'qrcode';

const url = process.argv[2];
if (!url || !/^https:\/\/[^\s]+\/$/.test(url)) {
  console.error('Donne l’adresse publiée complète, en https et terminée par « / ».');
  console.error('Exemple : npm run qr -- https://compte.github.io/mission-francophonie/');
  process.exit(1);
}

// 1. La page répond-elle vraiment, et est-ce bien le jeu?
let res;
try {
  res = await fetch(url, { redirect: 'follow' });
} catch (e) {
  console.error(`Adresse injoignable : ${e.message}`);
  process.exit(1);
}
const html = await res.text();
if (!res.ok || !html.includes('Mission Francophonie')) {
  console.error(`L’adresse répond ${res.status}, mais ce n’est pas le jeu publié. QR non généré.`);
  process.exit(1);
}
// 2. Une ressource du jeu se charge-t-elle depuis ce sous-dossier?
const asset = html.match(/src="\.\/(assets\/[^"]+\.js)"/)?.[1];
if (asset) {
  const a = await fetch(new URL(asset, url));
  if (!a.ok) {
    console.error(`Le script ${asset} répond ${a.status} : chemins incorrects. QR non généré.`);
    process.exit(1);
  }
}

mkdirSync('docs', { recursive: true });
const opts = { errorCorrectionLevel: 'M', margin: 2, color: { dark: '#1f2a44', light: '#ffffff' } };
writeFileSync('docs/qr-code.svg', await QRCode.toString(url, { ...opts, type: 'svg' }));
await QRCode.toFile('docs/qr-code.png', url, { ...opts, width: 800 });
writeFileSync('docs/qr-code.txt', `${url}\nVérifié le ${new Date().toLocaleString('fr-CA')}\n`);
console.log(`QR généré pour ${url} → docs/qr-code.svg, docs/qr-code.png`);
console.log('Scannez-le avec un téléphone ET testez-le sur un Chromebook d’élève avant la classe.');
