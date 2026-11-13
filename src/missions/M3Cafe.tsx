import { IconMessageCircle } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { CHAT, M3_FINAL, M3_REWARD, M3_TEXT, PEOPLE, RULES, type ReplyKind } from '../content/m3';
import type { Bi as BiText } from '../content/types';
import { checkFinalWord, evaluateReply } from '../engine/missions';
import { useGame } from '../state/context';
import { initialM3 } from '../state/game';
import { Avatar } from '../art/characters';
import { AudioClip } from '../ui/AudioClip';
import { Bi, Feedback, LiveRegion, RevealBi } from '../ui/kit';
import { MissionIntro, MissionShell, StationReward } from '../ui/missionKit';
import { play } from '../audio/sfx';

const HANDOFF: BiText = {
  fr: 'Le mot-clé? Demandez à mon petit-fils, Théo. Il est là-bas, à l’ordinateur.',
  en: 'The keyword? Ask my grandson, Théo. He’s over there, at the computer.',
};

export function M3Cafe() {
  const { state, dispatch } = useGame();
  const { phase } = state.m3;
  const s = state.stats.fortdefrance;

  if (phase === 'reward') {
    return (
      <MissionShell id="fortdefrance" showBack={false}>
        <StationReward
          id="fortdefrance"
          thanks={M3_REWARD.thanks}
          culture={M3_REWARD.culture}
          sharp={s.errors <= 1 && s.hints === 0}
          onReplay={() => dispatch({ type: 'm3', patch: { ...initialM3(), phase: 'chat' } })}
        />
      </MissionShell>
    );
  }
  return (
    <MissionShell id="fortdefrance">
      {phase === 'intro' ? (
        <MissionIntro
          id="fortdefrance"
          briefing={M3_TEXT.briefing}
          hello={{
            fr: 'Salut! Je suis Théo. Ma grand-mère tient le Café Madinina. Entre, elle va te parler!',
            en: 'Hi! I’m Théo. My grandma runs Café Madinina. Come in, she’s going to talk to you!',
          }}
          extra={<Feedback kind="hint" title={{ fr: 'Tu ou vous?', en: 'Tu or vous?' }} body={M3_TEXT.ruleBox} />}
          cta={{ fr: 'Entrer dans le café', en: 'Enter the café' }}
          onStart={() => dispatch({ type: 'm3', patch: { phase: 'chat' } })}
        />
      ) : (
        <Chat />
      )}
    </MissionShell>
  );
}

type Reaction = { kind: Exclude<ReplyKind, 'ok'>; who: 'josephine' | 'theo'; text: BiText } | null;

function Chat() {
  const { state, dispatch } = useGame();
  const { node, phase } = state.m3;
  const [reaction, setReaction] = useState<Reaction>(null);
  const [tried, setTried] = useState<number[]>([]);
  const [finalFb, setFinalFb] = useState<BiText | null>(null);
  const [repliesEn, setRepliesEn] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const current = phase === 'chat' ? CHAT[node] : null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [node, phase, reaction]);

  const choose = (i: number) => {
    const r = evaluateReply(node, i);
    if (r.kind === 'ok') {
      play('good');
      setReaction(null);
      setTried([]);
      if (node + 1 >= CHAT.length) dispatch({ type: 'm3', patch: { phase: 'final' } });
      else dispatch({ type: 'm3', patch: { node: node + 1 } });
    } else {
      play('retry');
      dispatch({ type: 'stat', id: 'fortdefrance', errors: 1 });
      setTried((t) => [...t, i]);
      setReaction({ kind: r.kind, who: CHAT[node]!.who, text: r.reaction ?? { fr: '', en: '' } });
    }
  };

  // Historique reconstruit à partir de l'avancée (identique après une actualisation).
  const done = phase === 'final' ? CHAT.length : node;
  const history = CHAT.slice(0, done).flatMap((n, i) => {
    const ok = n.replies.find((r) => r.kind === 'ok')!;
    const items: { side: 'them' | 'me' | 'note'; who?: 'josephine' | 'theo'; text: BiText }[] = [
      { side: 'them', who: n.who, text: n.line },
      { side: 'me', text: ok.text },
    ];
    if (i === 2) items.push({ side: 'them', who: 'josephine', text: HANDOFF });
    return items;
  });

  const rule = current?.who === 'theo' ? RULES.tu : RULES.vous;

  return (
    <section className="m3">
      <Bi t={M3_TEXT.instruction} force className="instruction" as="h1" />
      <div className="m3__grid">
        <div className="chat sheet" aria-label="Conversation">
          <ol className="chat__log">
            {history.map((h, i) => (
              <li key={i} className={`bubble bubble--${h.side}`}>
                {h.side === 'them' && h.who && <Avatar who={h.who} size={40} />}
                <div className="bubble__body">
                  {h.side === 'them' && h.who && <p className="bubble__name">{PEOPLE[h.who].name}</p>}
                  {h.side === 'me' && <p className="bubble__name">Toi</p>}
                  <RevealBi t={h.text} />
                </div>
              </li>
            ))}
            {current && (
              <li className="bubble bubble--them bubble--current">
                <Avatar who={current.who} size={48} />
                <div className="bubble__body">
                  <p className="bubble__name">
                    {PEOPLE[current.who].name} · <span className="bubble__role">{PEOPLE[current.who].role.fr}</span>
                  </p>
                  <RevealBi t={current.line} />
                  <AudioClip file={current.audio} transcript={current.line.fr} compact noText />
                </div>
              </li>
            )}
            {phase === 'final' && (
              <li className="bubble bubble--them bubble--current">
                <Avatar who="theo" size={48} />
                <div className="bubble__body">
                  <p className="bubble__name">Théo</p>
                  <RevealBi t={M3_FINAL.theoLine} />
                  <AudioClip file={M3_FINAL.theoAudio} transcript={M3_FINAL.theoLine.fr} compact noText />
                </div>
              </li>
            )}
            {reaction && (
              <li className="bubble bubble--them bubble--reaction">
                <Avatar who={reaction.who} size={40} />
                <div className="bubble__body">
                  <RevealBi t={reaction.text} />
                </div>
              </li>
            )}
          </ol>
          <div ref={endRef} />
        </div>

        <div className="m3__side">
          {current && (
            <fieldset className="replies">
              <legend className="replies__legend">
                <IconMessageCircle size={20} aria-hidden="true" /> Ta réponse <span lang="en">· Your answer</span>
                <button
                  type="button"
                  className="reveal__btn"
                  aria-pressed={repliesEn}
                  aria-label={
                    repliesEn ? 'EN : cacher la traduction des réponses' : 'EN : voir la traduction des réponses'
                  }
                  onClick={() => setRepliesEn(!repliesEn)}
                >
                  EN
                </button>
              </legend>
              {current.replies.map((r, i) => (
                <button
                  key={`${node}-${i}`}
                  type="button"
                  className={`reply ${tried.includes(i) ? 'reply--tried' : ''}`}
                  onClick={() => choose(i)}
                  aria-describedby={tried.includes(i) ? `tried-${i}` : undefined}
                >
                  <Bi t={r.text} show={repliesEn} />
                  {tried.includes(i) && (
                    <span id={`tried-${i}`} className="reply__tag">
                      déjà essayé
                    </span>
                  )}
                </button>
              ))}
            </fieldset>
          )}

          {phase === 'final' && (
            <fieldset className="replies">
              <legend className="replies__legend">
                <Bi t={M3_FINAL.question} force />
              </legend>
              {M3_FINAL.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="reply reply--big"
                  onClick={() => {
                    const r = checkFinalWord(o.id);
                    if (r.ok) {
                      play('fragment');
                      dispatch({ type: 'completeStation', id: 'fortdefrance' });
                      dispatch({ type: 'm3', patch: { phase: 'reward' } });
                    } else {
                      play('retry');
                      dispatch({ type: 'stat', id: 'fortdefrance', errors: 1 });
                      setFinalFb(r.feedback ?? null);
                    }
                  }}
                >
                  {/* Traduction masquée : elle donnerait la réponse. */}
                  <Bi t={o.text} show={false} />
                </button>
              ))}
            </fieldset>
          )}

          <LiveRegion>
            {reaction && (
              <Feedback
                kind="retry"
                title={reaction.kind === 'register' ? M3_TEXT.registerTitle : M3_TEXT.logicTitle}
                body={reaction.kind === 'register' ? rule : M3_TEXT.tryAgain}
              />
            )}
            {finalFb && <Feedback kind="retry" body={finalFb} />}
          </LiveRegion>
          <details className="rulebox">
            <summary>
              Rappel : tu ou vous? <span lang="en">Reminder</span>
            </summary>
            <Bi t={M3_TEXT.ruleBox} force />
          </details>
        </div>
      </div>
    </section>
  );
}
