import {
  IconBroadcast,
  IconBulb,
  IconCheck,
  IconAlertTriangle,
  IconSun,
  IconCloudRain,
  IconSnowflake,
  IconWind,
} from '@tabler/icons-react';
import { useState } from 'react';
import { M2_REWARD, M2_TEXT, RADIO_MESSAGES, type DialId, type RadioMessage } from '../content/m2';
import type { Bi as BiText } from '../content/types';
import { UI } from '../content/ui';
import { checkDials, type DialVerdict } from '../engine/missions';
import { useGame } from '../state/context';
import { initialM2 } from '../state/game';
import { AudioClip } from '../ui/AudioClip';
import { Bi, BtnLabel, Feedback, LiveRegion, Speaker } from '../ui/kit';
import { MissionIntro, MissionShell, StationReward } from '../ui/missionKit';
import { play } from '../audio/sfx';

const ICONS = { sun: IconSun, rain: IconCloudRain, snow: IconSnowflake, wind: IconWind } as const;
const LABELS: Record<DialId, BiText> = {
  meteo: { fr: 'Canal 1 · Météo', en: 'Channel 1 · Weather' },
  jour: { fr: 'Canal 2 · Jour', en: 'Channel 2 · Day' },
  heure: { fr: 'Canal 3 · Heure', en: 'Channel 3 · Time' },
};

export function M2Radio() {
  const { state, dispatch } = useGame();
  const { phase } = state.m2;
  const s = state.stats.portauprince;

  if (phase === 'reward') {
    return (
      <MissionShell id="portauprince" showBack={false}>
        <StationReward
          id="portauprince"
          thanks={M2_REWARD.thanks}
          culture={M2_REWARD.culture}
          sharp={s.errors <= 1 && s.hints === 0}
          onReplay={() => dispatch({ type: 'm2', patch: { ...initialM2(), phase: 'console' } })}
        />
      </MissionShell>
    );
  }

  return (
    <MissionShell id="portauprince">
      {phase === 'intro' ? (
        <MissionIntro
          id="portauprince"
          briefing={M2_TEXT.briefing}
          hello={M2_TEXT.hostHello}
          helloAudio={
            <AudioClip
              file={M2_TEXT.hostAudio}
              transcript={M2_TEXT.hostHello.fr}
              label="Écouter Jean-Robert"
              compact
              noText
            />
          }
          extra={<Feedback kind="hint" body={M2_TEXT.headphones} />}
          cta={{ fr: 'Entrer dans le studio', en: 'Enter the studio' }}
          onStart={() => dispatch({ type: 'm2', patch: { phase: 'console' } })}
        />
      ) : (
        <Console />
      )}
    </MissionShell>
  );
}

function Console() {
  const { state, dispatch } = useGame();
  const answers = state.m2.answers;
  const [rows, setRows] = useState<Partial<Record<DialId, { verdict: DialVerdict; feedback?: BiText }>>>({});
  const [fb, setFb] = useState<{ kind: 'ok' | 'retry' | 'hint'; body: BiText } | null>(null);

  const choose = (id: DialId, value: string) => {
    play('tap');
    dispatch({ type: 'm2Answer', dial: id, value });
    setRows((r) => ({ ...r, [id]: undefined }));
  };

  const transmit = () => {
    const r = checkDials(answers);
    setRows(r.rows);
    if (Object.values(r.rows).some((x) => x.verdict === 'missing')) {
      play('hint');
      setFb({ kind: 'hint', body: M2_TEXT.missing });
      return;
    }
    if (r.allOk) {
      play('fragment');
      setFb({ kind: 'ok', body: M2_TEXT.allOk });
      window.setTimeout(() => {
        dispatch({ type: 'completeStation', id: 'portauprince' });
        dispatch({ type: 'm2', patch: { phase: 'reward' } });
      }, 900);
    } else {
      play('retry');
      const wrong = Object.values(r.rows).filter((x) => x.verdict === 'wrong').length;
      dispatch({ type: 'stat', id: 'portauprince', errors: wrong });
      setFb({ kind: 'retry', body: M2_TEXT.someWrong });
    }
  };

  return (
    <section className="m2">
      <div className="m2__head">
        <Speaker who="jeanrobert" name="Jean-Robert · Radio Écho Haïti" t={M2_TEXT.instruction} force compact />
      </div>
      <div className="console" role="group" aria-label="Console radio">
        <div className="console__top" aria-hidden="true">
          <IconBroadcast size={22} />
          <span>RADIO ÉCHO · PORT-AU-PRINCE</span>
          <span className="console__led" />
        </div>
        <div className="console__grid">
          {RADIO_MESSAGES.map((m) => (
            <Channel key={m.id} msg={m} value={answers[m.id]} row={rows[m.id]} onChoose={(v) => choose(m.id, v)} />
          ))}
        </div>
        <div className="console__bottom">
          <button type="button" className="btn btn--amber btn--lg" onClick={transmit}>
            <IconBroadcast size={22} aria-hidden="true" />
            <BtnLabel t={M2_TEXT.transmit} />
          </button>
          <div className="console__fb">
            <LiveRegion>{fb && <Feedback kind={fb.kind} body={fb.body} />}</LiveRegion>
          </div>
        </div>
      </div>
    </section>
  );
}

function Channel({
  msg,
  value,
  row,
  onChoose,
}: {
  msg: RadioMessage;
  value: string | undefined;
  row?: { verdict: DialVerdict; feedback?: BiText };
  onChoose: (v: string) => void;
}) {
  const { dispatch } = useGame();
  const [hint, setHint] = useState(0);
  const groupId = `dial-${msg.id}`;

  const askHint = () => {
    const level = Math.min(3, hint + 1);
    setHint(level);
    play('hint');
    dispatch({ type: 'stat', id: 'portauprince', hints: 1, usedTranscript: level === 3 });
  };

  const hintText: BiText | null =
    hint === 1
      ? msg.strategy
      : hint === 2
        ? { fr: 'Clique sur « Plus lent », puis réécoute.', en: 'Click “Plus lent” (slower), then listen again.' }
        : hint === 3
          ? { fr: 'Lis le texte : la réponse est surlignée.', en: 'Read the text: the answer is highlighted.' }
          : null;

  return (
    <div
      className={`channel ${row?.verdict === 'ok' ? 'channel--ok' : row?.verdict === 'wrong' ? 'channel--retry' : ''}`}
    >
      <p className="channel__label">
        <span lang="fr">{LABELS[msg.id].fr}</span>
        {row?.verdict === 'ok' && (
          <span className="verdict verdict--ok">
            <IconCheck size={14} stroke={3} aria-hidden="true" /> OK
          </span>
        )}
        {row?.verdict === 'wrong' && (
          <span className="verdict verdict--retry">
            <IconAlertTriangle size={14} aria-hidden="true" /> À revoir
          </span>
        )}
      </p>
      <AudioClip
        file={msg.audio}
        transcript={msg.transcript}
        highlight={msg.key}
        forceHighlight={hint === 3}
        tone="console"
        onTranscript={() => dispatch({ type: 'stat', id: 'portauprince', usedTranscript: true })}
      />
      <Bi t={msg.question} force className="channel__q" as="h2" />
      <div className="dial" role="radiogroup" aria-labelledby={groupId}>
        <span id={groupId} className="sr-only">
          {msg.question.fr}
        </span>
        {msg.options.map((o) => {
          const Icon = o.icon ? ICONS[o.icon] : null;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={value === o.id}
              className={`dial__opt ${value === o.id ? 'dial__opt--on' : ''}`}
              onClick={() => onChoose(o.id)}
            >
              {Icon && <Icon size={20} aria-hidden="true" />}
              <span lang="fr">{o.label.fr}</span>
            </button>
          );
        })}
      </div>
      {row?.feedback && <Bi t={row.feedback} force className="channel__fb" />}
      <button type="button" className="btn btn--quiet channel__hint" onClick={askHint} disabled={hint >= 3}>
        <IconBulb size={18} aria-hidden="true" />
        {UI.hint.fr} {hint > 0 ? `${hint}/3` : ''}
      </button>
      {hintText && <Bi t={hintText} force className="channel__hinttext" />}
    </div>
  );
}
