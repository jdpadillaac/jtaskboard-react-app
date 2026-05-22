import type { Task } from '@domain/task/task';
import {
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatusBadge from './StatusBadge';

interface TaskDetailDialogProps {
  task: Task;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function TaskDetailDialog({ task, onClose }: TaskDetailDialogProps) {
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {task.taskKey}
        </Typography>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mt: 0.5 }}>
          {task.title}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Cerrar"
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <StatusBadge status={task.status} />
          <Typography variant="caption" color="text.secondary">
            Creada el {formatDate(task.createdAt)}
          </Typography>
        </Stack>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          Descripcion
        </Typography>
        {task.description.trim() ? (
          <Box className="markdown-editor" sx={{ p: 1 }}>
            <MDXEditor
              key={task.id}
              markdown={task.description}
              readOnly
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
              ]}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Esta tarea no tiene descripcion.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetailDialog;
