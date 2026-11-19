import { IconArrowLeft, IconPrinter } from '@tabler/icons-react';
import { ORAL_QUESTIONS, TEACHER } from '../content/finale';
import { GROUPS } from '../content/types';
import { completionCode } from '../engine/code';
import { useGame } from '../state/context';
import { CREDIT } from '../content/ui';
import { Bi, BtnLabel } from '../ui/kit';

export function Teacher() {
  const { dispatch } = useGame();
  const now = new Date();
  const dateFr = now.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <main className="screen teacher enter" id="main">
      <h1 className="screen-title">{TEACHER.title!.fr}</h1>
      <Bi t={TEACHER.intro!} force />
      <p className="teacher__date">{dateFr}</p>
      <table className="wordbook teacher__codes">
        <caption className="sr-only">Codes de réussite par groupe</caption>
        <thead>
          <tr>
            <th scope="col">Groupe</th>
            <th scope="col">Code attendu aujourd’hui</th>
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((g) => (
            <tr key={g}>
              <td>{g}</td>
              <td className="teacher__code">{completionCode(g, now)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Bi t={TEACHER.warning!} force className="teacher__warn" />

      <h2 className="teacher__h2">{TEACHER.oral!.fr}</h2>
      <table className="wordbook">
        <thead>
          <tr>
            <th scope="col">Question</th>
            <th scope="col">Réponse attendue</th>
            <th scope="col">Attente</th>
          </tr>
        </thead>
        <tbody>
          {ORAL_QUESTIONS.map((q) => (
            <tr key={q.q}>
              <td lang="fr">{q.q}</td>
              <td lang="fr">{q.expected}</td>
              <td>{q.strand}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="signature">
        <span lang="fr">{CREDIT.fr}</span>
        <span className="signature__en" lang="en">
          {CREDIT.en}
        </span>
      </p>
      <div className="teacher__actions">
        <button type="button" className="btn btn--secondary" onClick={() => window.print()}>
          <IconPrinter size={20} aria-hidden="true" />
          Imprimer
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            history.replaceState(null, '', window.location.pathname + window.location.search);
            dispatch({ type: 'goto', screen: 'home' });
          }}
        >
          <IconArrowLeft size={20} aria-hidden="true" />
          <BtnLabel t={TEACHER.back!} />
        </button>
      </div>
    </main>
  );
}
