import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  type NewTask,
} from '@domain/task/task';
import { useState, type FormEvent } from 'react';
import MarkdownEditor from './MarkdownEditor';

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  submitLabel: string;
  submitting: boolean;
  error: string | null;
  onSubmit: (input: NewTask) => void;
  onCancel: () => void;
}

function TaskForm({
  initialTitle = '',
  initialDescription = '',
  submitLabel,
  submitting,
  error,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const trimmedTitle = title.trim();
  const titleTooLong = title.length > TITLE_MAX_LENGTH;
  const descriptionTooLong = description.length > DESCRIPTION_MAX_LENGTH;
  const isValid = trimmedTitle.length > 0 && !titleTooLong && !descriptionTooLong;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || submitting) return;
    onSubmit({ title: trimmedTitle, description });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="task-title">Titulo</label>
        <input
          id="task-title"
          type="text"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="Titulo de la tarea"
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />
        <span className="field-hint">
          {title.length}/{TITLE_MAX_LENGTH}
        </span>
      </div>

      <div className="field">
        <label>Descripcion</label>
        <MarkdownEditor
          initialValue={initialDescription}
          onChange={setDescription}
          readOnly={submitting}
        />
        {descriptionTooLong && (
          <span className="field-error">
            La descripcion supera el maximo de {DESCRIPTION_MAX_LENGTH}{' '}
            caracteres.
          </span>
        )}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="button button--ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="button button--primary"
          disabled={!isValid || submitting}
        >
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;