interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <p>{message}</p>
      <button type="button" className="retry-button" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
}

export default ErrorState;