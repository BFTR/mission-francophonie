import { IconAlertTriangle, IconBulb, IconCheck, IconMinus, IconPlus } from '@tabler/icons-react';
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import type { Bi as BiText } from '../content/types';
import { Avatar, type CharacterId } from '../art/characters';
import { useGame } from '../state/context';

/**
 * Texte bilingue. Le français est toujours affiché.
 * - force : la traduction est toujours visible (consignes essentielles) ;
 * - show : contrôle explicite (soutien dégressif, missions 3 à 5) ;
 * - sinon : elle suit le réglage « Anglais » de la barre du haut.
 */
export function Bi({
  t,
  as: Tag = 'p',
  force = false,
  show,
  className,
}: {
  t: BiText;
  as?: ElementType;
  force?: boolean;
  show?: boolean;
  className?: string;
}) {
  const { state } = useGame();
  const showEn = force || (show ?? state.settings.showEnglish);
  return (
    <Tag className={['bi', className].filter(Boolean).join(' ')}>
      <span lang="fr">{t.fr}</span>
      {showEn && t.en && t.en !== t.fr && (
        <span className="bi__en" lang="en">
          {t.en}
        </span>
      )}
    </Tag>
  );
}

/**
 * Texte français avec traduction à la demande (soutien dégressif) :
 * un petit bouton « EN » révèle l'anglais pour cette phrase seulement.
 */
export function RevealBi({ t, className, as: Tag = 'div' }: { t: BiText; className?: string; as?: ElementType }) {
  const [open, setOpen] = useState(false);
  return (
    <Tag className={['reveal', className].filter(Boolean).join(' ')}>
      <span lang="fr">{t.fr}</span>{' '}
      <button
        type="button"
        className="reveal__btn"
        aria-pressed={open}
        aria-label={open ? 'EN : cacher la traduction anglaise' : 'EN : voir la traduction anglaise'}
        onClick={() => setOpen(!open)}
      >
        EN
      </button>
      {open && (
        <span className="bi__en reveal__en" lang="en">
          {t.en}
        </span>
      )}
    </Tag>
  );
}

/** Libellé de bouton court : français en gros, anglais en petit si activé. */
export function BtnLabel({ t }: { t: BiText }) {
  const { state } = useGame();
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
      <span lang="fr">{t.fr}</span>
      {state.settings.showEnglish && (
        <span lang="en" style={{ fontSize: '0.72em', fontWeight: 400, opacity: 0.85 }}>
          {t.en}
        </span>
      )}
    </span>
  );
}

export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      if (typeof d.showModal === 'function') d.showModal();
      else d.setAttribute('open', '');
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && <div className="dialog__body">{children}</div>}
    </dialog>
  );
}

export type FeedbackKind = 'ok' | 'retry' | 'hint';

export function Feedback({
  kind,
  title,
  body,
  children,
}: {
  kind: FeedbackKind;
  title?: BiText;
  body?: BiText;
  children?: ReactNode;
}) {
  const Icon = kind === 'ok' ? IconCheck : kind === 'retry' ? IconAlertTriangle : IconBulb;
  const label = kind === 'ok' ? 'Réussi' : kind === 'retry' ? 'À revoir' : 'Indice';
  return (
    <div className={`feedback feedback--${kind}`}>
      <span className="feedback__icon" aria-hidden="true">
        <Icon size={18} stroke={2.4} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <span className="sr-only">{label} : </span>
        {title && <Bi t={title} className="feedback__title" force />}
        {body && <Bi t={body} force />}
        {children}
      </div>
    </div>
  );
}

/** Zone annoncée aux lecteurs d'écran ; contient la dernière rétroaction. */
export function LiveRegion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Si la rétroaction sort de l'écran (petit Chromebook), on la ramène doucement en vue.
  useEffect(() => {
    const el = ref.current;
    if (!el || !el.firstElementChild || typeof el.scrollIntoView !== 'function') return;
    const r = el.getBoundingClientRect();
    if (r.bottom > window.innerHeight || r.top < 0) {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
  });
  return (
    <div ref={ref} aria-live="polite" aria-atomic="true">
      {children}
    </div>
  );
}

export function Speaker({
  who,
  name,
  t,
  force,
  compact,
}: {
  who: CharacterId;
  name: string;
  t: BiText;
  force?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`speaker ${compact ? 'speaker--compact' : ''}`}>
      <div className="speaker__avatar">
        <Avatar who={who} size={88} />
      </div>
      <div className="speaker__bubble">
        <p className="speaker__name">{name}</p>
        <Bi t={t} force={force} />
      </div>
    </div>
  );
}

export function Stepper({
  value,
  onStep,
  label,
  max,
}: {
  value: number;
  onStep: (delta: number) => void;
  label: string;
  max: number;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Moins de ${label}`} aria-disabled={value <= 0} onClick={() => onStep(-1)}>
        <IconMinus size={20} stroke={2.6} aria-hidden="true" />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={`Plus de ${label}`} aria-disabled={value >= max} onClick={() => onStep(1)}>
        <IconPlus size={20} stroke={2.6} aria-hidden="true" />
      </button>
    </div>
  );
}
