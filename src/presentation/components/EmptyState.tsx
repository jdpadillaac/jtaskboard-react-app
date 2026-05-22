import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function EmptyState() {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}
    >
      <Typography color="text.secondary">No hay tareas todavia.</Typography>
    </Box>
  );
}

export default EmptyState;