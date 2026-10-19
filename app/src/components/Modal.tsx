import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { MSG } from '../lib/messages';

type Props = { title: string; children: ReactNode; onClose: () => void; dirty?: boolean; width?: number };
export function Modal({ title, children, onClose, dirty = false, width = 560 }: Props) {
  const [ask, setAsk] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const requestClose = () => dirty ? setAsk(true) : onClose();
  useEffect(() => {
    opener.current = document.activeElement as HTMLElement;
    dialog.current?.querySelector<HTMLElement>('input:not([disabled]),button:not([disabled])')?.focus();
    return () => opener.current?.focus();
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (document.querySelector('[role="alertdialog"]')) return;
      if (event.key === 'Escape') { event.preventDefault(); requestClose(); }
      if (event.key !== 'Tab') return;
      const nodes = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])') ?? []);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  });
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) requestClose(); }}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={dialog} style={{ width }} onClickCapture={event => { if ((event.target as HTMLElement).closest('[data-modal-cancel]')) { event.preventDefault(); event.stopPropagation(); requestClose(); } }}>
      <header><h2>{title}</h2><button aria-label="닫기" onClick={requestClose}>×</button></header>
      <div className="modal-body">{children}</div>
    </div>
    {ask && <ConfirmDialog title="확인" message={MSG.dirty} onCancel={() => setAsk(false)} onConfirm={onClose} />}
  </div>;
}

export function ConfirmDialog({ title, message, onCancel, onConfirm, danger = false, confirmLabel = '확인', cancelLabel = '취소' }: { title: string; message: string; onCancel: () => void; onConfirm: () => void; danger?: boolean; confirmLabel?: string; cancelLabel?: string }) {
  useEffect(() => { const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onCancel(); } }; document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key); }, [onCancel]);
  return <div className="confirm-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onCancel(); }}><div className="confirm" role="alertdialog" aria-modal="true" aria-label={title}><h2>{title}</h2><p>{message}</p><footer><button onClick={onCancel}>{cancelLabel}</button><button className={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</button></footer></div></div>;
}
