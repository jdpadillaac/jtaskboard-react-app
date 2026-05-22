import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Alert severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
      <Button variant="outlined" color="error" onClick={onRetry}>
        Reintentar
      </Button>
    </Box>
  );
}

export default ErrorState;