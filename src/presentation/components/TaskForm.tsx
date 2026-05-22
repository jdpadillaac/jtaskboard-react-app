import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  type NewTask,
} from '@domain/task/task';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <Box>
          <TextField
            id="task-title"
            label="Titulo"
            fullWidth
            value={title}
            slotProps={{ htmlInput: { maxLength: TITLE_MAX_LENGTH } }}
            placeholder="Titulo de la tarea"
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            error={titleTooLong}
            helperText={`${title.length}/${TITLE_MAX_LENGTH}`}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Descripcion
          </Typography>
          <MarkdownEditor
            initialValue={initialDescription}
            onChange={setDescription}
            readOnly={submitting}
          />
          {descriptionTooLong && (
            <FormHelperText error>
              La descripcion supera el maximo de {DESCRIPTION_MAX_LENGTH} caracteres.
            </FormHelperText>
          )}
        </Box>

        {error && <Alert severity="error" role="alert">{error}</Alert>}

        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || submitting}
          >
            {submitting ? 'Guardando...' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default TaskForm;