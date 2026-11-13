// Construit audio-manifest.json à partir des contenus du jeu (source unique de vérité).
// Les textes prononcés sont exactement ceux affichés en transcription.
// Usage : node scripts/build-audio-manifest.mjs   (puis, dans ../outils-audio : node gen.mjs)
import { writeFileSync } from 'node:fs';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const m2 = await server.ssrLoadModule('/src/content/m2.ts');
  const m3 = await server.ssrLoadModule('/src/content/m3.ts');
  const clips = [];
  clips.push({ id: 'm2-hote', voice: 'upmc-m', text: m2.M2_TEXT.hostHello.fr });
  for (const msg of m2.RADIO_MESSAGES) {
    clips.push({
      id: msg.audio.replace('.mp3', ''),
      voice: msg.speaker === 'male' ? 'upmc-m' : 'siwis',
      text: msg.transcript,
    });
  }
  for (const node of m3.CHAT) {
    clips.push({
      id: node.audio.replace('.mp3', ''),
      voice: node.who === 'theo' ? 'upmc-m' : 'upmc-f',
      text: node.line.fr,
    });
  }
  clips.push({ id: m3.M3_FINAL.theoAudio.replace('.mp3', ''), voice: 'upmc-m', text: m3.M3_FINAL.theoLine.fr });
  writeFileSync('audio-manifest.json', JSON.stringify({ clips }, null, 2) + '\n');
  console.log(`${clips.length} clips`);
} finally {
  await server.close();
}
