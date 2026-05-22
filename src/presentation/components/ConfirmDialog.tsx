import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

// Modal de confirmacion generico. Accesible: role=dialog, foco inicial
// en el boton de cancelar, Esc para cerrar, click en el fondo cancela.
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  error = null,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [loading, onCancel]);

  return (
    <div
      className="dialog-overlay"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className="dialog-title">
          {title}
        </h2>
        <p className="dialog-message">{message}</p>
        {error && <p className="form-error">{error}</p>}
        <div className="dialog-actions">
          <button
            ref={cancelRef}
            type="button"
            className="button button--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
