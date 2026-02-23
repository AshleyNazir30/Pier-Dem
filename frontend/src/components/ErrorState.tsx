/**
 * Error state with retry button
 */
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div 
      className="flex flex-1 items-center justify-center px-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full max-w-sm space-y-5 rounded-2xl border border-error-border bg-surface-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-light" aria-hidden="true">
          <svg
            className="h-6 w-6 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">{message}</p>
        <button
          onClick={onRetry}
          type="button"
          aria-label="Retry loading"
          className="w-full rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-text-inverse shadow-sm transition-all duration-200 hover:bg-brand-hover hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
