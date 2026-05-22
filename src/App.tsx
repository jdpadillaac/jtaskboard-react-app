import LoadingState from '@presentation/components/LoadingState';
import HomePage from '@presentation/pages/HomePage';
import '@presentation/styles/app.css';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// La pagina de creacion carga el editor Markdown (pesado): se separa en su
// propio chunk para no afectar el peso inicial del listado.
const CreateTaskPage = lazy(() => import('@presentation/pages/CreateTaskPage'));

function App() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks/new" element={<CreateTaskPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
