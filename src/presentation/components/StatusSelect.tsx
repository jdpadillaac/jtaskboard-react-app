import { TASK_STATUSES, type TaskStatus } from '@domain/task/task';
import { ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import StatusBadge from './StatusBadge';

interface StatusSelectProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
  disabled?: boolean;
}

interface MenuPos {
  top: number;
  left: number;
}

function StatusSelect({ status, onChange, disabled = false }: StatusSelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Calcula la posicion del menu a partir del disparador. El menu se
  // renderiza en un portal sobre <body>, fuera de la tabla, para que el
  // `overflow: hidden` de `.task-table` no lo recorte. Si no cabe debajo
  // (filas al final de la pantalla), se abre hacia arriba.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const menuH = menuRef.current?.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow < menuH + 8 ? r.top - menuH - 4 : r.bottom + 4;
    setPos({ top, left: r.left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      // El menu vive en un portal: hay que comprobar ambos refs.
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    // Con position: fixed, al hacer scroll/resize la posicion quedaria
    // desfasada; lo mas simple y correcto es cerrar el menu.
    function close() {
      setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  function select(next: TaskStatus) {
    setOpen(false);
    if (next !== status) onChange(next); // mismo estado -> no-op
  }

  return (
    <div className="status-select">
      <button
        ref={triggerRef}
        type="button"
        className="status-select-trigger"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <StatusBadge status={status} />
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <ul
            ref={menuRef}
            className="status-menu"
            role="menu"
            // Mientras no se ha medido la posicion, se mantiene fuera de
            // pantalla para evitar un parpadeo en la esquina.
            style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
          >
            {TASK_STATUSES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  role="menuitem"
                  className="status-menu-item"
                  onClick={() => select(s)}
                >
                  <StatusBadge status={s} />
                  {s === status && <span aria-hidden="true">✓</span>}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}

export default StatusSelect;
