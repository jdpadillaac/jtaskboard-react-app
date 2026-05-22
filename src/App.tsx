import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import LoadingState from '@presentation/components/LoadingState';
import HomePage from '@presentation/pages/HomePage';
import { theme } from '@presentation/styles/theme';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// La pagina de creacion carga el editor Markdown (pesado): se separa en su
// propio chunk para no afectar el peso inicial del listado.
const CreateTaskPage = lazy(() => import('@presentation/pages/CreateTaskPage'));
const EditTaskPage = lazy(() => import('@presentation/pages/EditTaskPage'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks/new" element={<CreateTaskPage />} />
          <Route path="/tasks/edit" element={<EditTaskPage />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
