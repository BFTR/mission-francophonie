// Applique la typographie française canadienne (Bureau de la traduction, Guide du rédacteur)
// aux chaînes et textes JSX du code source, via l'analyseur TypeScript :
//  - aucune espace avant ! ? ;
//  - espace insécable (U+00A0) avant :
//  - espaces insécables à l'intérieur des guillemets « »
// Usage : node scripts/fr-typo.mjs [--check] fichier...
import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

import { fixFr } from './fr-typo-rules.mjs';

const check = process.argv.includes('--check');
let problems = 0;
for (const f of process.argv.slice(2).filter((a) => a !== '--check')) {
  const src = readFileSync(f, 'utf8');
  const sf = ts.createSourceFile(
    f,
    src,
    ts.ScriptTarget.Latest,
    true,
    f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const edits = [];
  const visit = (node) => {
    const k = node.kind;
    const isStr =
      k === ts.SyntaxKind.StringLiteral ||
      k === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
      k === ts.SyntaxKind.TemplateHead ||
      k === ts.SyntaxKind.TemplateMiddle ||
      k === ts.SyntaxKind.TemplateTail ||
      k === ts.SyntaxKind.JsxText;
    if (isStr) {
      const start = node.getStart(sf);
      const raw = src.slice(start, node.end);
      // On ne corrige que du texte qui contient des lettres (pas les sélecteurs, chemins, etc.)
      if (/[a-zà-ÿ]{2}/i.test(raw) && !/^['"`](\.|@|node:|[\w-]+\/)/.test(raw)) {
        const fixed = fixFr(raw);
        if (fixed !== raw) edits.push({ start, end: node.end, fixed, raw });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!edits.length) continue;
  problems += edits.length;
  if (check) {
    for (const e of edits) console.log(`${f}: ${JSON.stringify(e.raw.slice(0, 80))}`);
    continue;
  }
  let out = src;
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.fixed + out.slice(e.end);
  writeFileSync(f, out);
  console.log(`corrigé : ${f} (${edits.length})`);
}
if (check && problems) process.exit(1);
