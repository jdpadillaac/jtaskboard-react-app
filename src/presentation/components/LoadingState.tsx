import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function LoadingState() {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 6 }}
    >
      <CircularProgress aria-hidden="true" />
      <Typography color="text.secondary">Cargando tareas...</Typography>
    </Box>
  );
}

export default LoadingState;