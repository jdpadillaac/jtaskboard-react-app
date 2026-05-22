/** Indicador mostrado mientras se cargan las tareas. */
function LoadingState() {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>Cargando tareas...</p>
    </div>
  );
}

export default LoadingState;
