import { useEffect } from "react";

type ToastProps = {
  message: string | null;
  onDismiss: () => void;
};

function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timeoutId = window.setTimeout(onDismiss, 2600);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="admin-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default Toast;
