import { useState, useId } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- tiny local helpers so this file stays self-contained for now ---

type FieldError = { email?: string; password?: string };

function validate(email: string, password: string): FieldError {
  const errors: FieldError = {};
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

// -------------------------------------------------------------------

type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasErrors = Object.keys(errors).length > 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const fieldErrors = validate(email, password);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // TODO: wire up auth service / replace with real call
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin();
    }, 1200);
  }

  function clearError(field: keyof FieldError) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <div className="login-root">
      {/* Left — branding panel (hidden on mobile) */}
      <aside className="login-brand-panel" aria-hidden="true">
        <div className="login-brand-inner">
          <div className="login-brand-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="7" fill="currentColor" />
              <path
                d="M7 10h14M7 14h10M7 18h7"
                stroke="var(--primary-foreground)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="login-brand-name">Nexora</h1>
          <p className="login-brand-tagline">
            The modern e-commerce dashboard for teams that move fast.
          </p>

          <ul className="login-feature-list" role="list">
            {[
              "Real-time order & payment tracking",
              "Multi-merchant management",
              "Smart inventory alerts",
              "Role-based access control",
            ].map((feature) => (
              <li key={feature} className="login-feature-item">
                <span className="login-feature-dot" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="login-brand-decoration" aria-hidden="true">
          <div className="login-deco-circle login-deco-circle--1" />
          <div className="login-deco-circle login-deco-circle--2" />
        </div>
      </aside>

      {/* Right — form panel */}
      <main className="login-form-panel">
        <div className="login-form-container">
          {/* Mobile-only brand */}
          <div className="login-mobile-brand">
            <div className="login-brand-logo login-brand-logo--sm">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="7" fill="currentColor" />
                <path
                  d="M7 10h14M7 14h10M7 18h7"
                  stroke="var(--primary-foreground)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="login-brand-wordmark">Nexora</span>
          </div>

          <header className="login-form-header">
            <h2 className="login-form-title">Sign in to your account</h2>
            <p className="login-form-subtitle">
              Enter your credentials to access the admin dashboard.
            </p>
          </header>

          {submitError && (
            <div className="login-submit-error" role="alert">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="login-form" aria-label="Sign in form">
            {/* Email */}
            <div className="login-field">
              <Label htmlFor={emailId}>Email address</Label>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${emailId}-error` : undefined}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span id={`${emailId}-error`} className="login-field-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field-labelrow">
                <Label htmlFor={passwordId}>Password</Label>
                {/* TODO: wire forgot-password route once router is set up */}
                <button type="button" className="login-forgot-link">
                  Forgot password?
                </button>
              </div>

              <div className="login-password-wrap">
                <Input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? `${passwordId}-error` : undefined}
                  disabled={isSubmitting}
                  className="login-password-input"
                />
                <button
                  type="button"
                  className="login-toggle-visibility"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword
                    ? <EyeOff size={16} aria-hidden="true" />
                    : <Eye size={16} aria-hidden="true" />
                  }
                </button>
              </div>

              {errors.password && (
                <span id={`${passwordId}-error`} className="login-field-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Remember me */}
            <label className="login-remember-row">
              <input
                type="checkbox"
                className="login-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="login-remember-label">Keep me signed in for 30 days</span>
            </label>

            <Button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting || hasErrors}
            >
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <footer className="login-form-footer">
            <p className="login-footer-note">
              Nexora Admin · v1.0 &mdash; Internal access only.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Login;
