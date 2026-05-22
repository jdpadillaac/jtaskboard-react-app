import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoadingState from './components/LoadingState';
import './App.css';

// La pagina de creacion carga el editor Markdown (pesado): se separa en su
// propio chunk para no afectar el peso inicial del listado.
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));

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
