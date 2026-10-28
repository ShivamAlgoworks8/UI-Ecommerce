import { useState, useId } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/api";

type FieldError = { name?: string; email?: string; password?: string };

function validate(email: string, password: string, name?: string, isSignup = false): FieldError {
  const errors: FieldError = {};
  if (isSignup && (!name || !name.trim())) {
    errors.name = "Full name is required.";
  }
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

type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const hasErrors = Object.keys(errors).length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const fieldErrors = validate(email, password, name, isSignup);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const endpoint = isSignup
      ? `${API_BASE_URL}/api/auth/admin/signup`
      : `${API_BASE_URL}/api/auth/admin/login`;

    const payload = isSignup
      ? { name: name.trim(), email: email.trim().toLowerCase(), password }
      : { email: email.trim().toLowerCase(), password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const fallback = response.status === 404
          ? "Auth endpoint not found on the server. Please restart the backend."
          : response.status >= 500
            ? "Server error. Please try again later."
            : isSignup ? "Signup failed. Please check your details." : "Invalid email or password";
        // 400 responses carry field validation messages, e.g. {"password": "..."}
        const fieldMessage = response.status === 400 && data && typeof data === "object" && !data.message
          ? Object.values(data).filter((v) => typeof v === "string").join(" ")
          : "";
        setSubmitError(data.message || fieldMessage || fallback);
        setIsSubmitting(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("nexora_token", data.token);
      }
      if (data.name) {
        localStorage.setItem("nexora_user", JSON.stringify(data));
      }

      setIsSubmitting(false);
      onLogin();
    } catch (err) {
      console.error("Admin auth error:", err);
      setSubmitError("Unable to connect to the server. Please try again.");
      setIsSubmitting(false);
    }
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

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setErrors({});
    setSubmitError(null);
  };

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
            <h2 className="login-form-title">
              {isSignup ? "Create admin account" : "Sign in to your account"}
            </h2>
            <p className="login-form-subtitle">
              {isSignup
                ? "Register a new administrator to manage the store workspace."
                : "Enter your credentials to access the admin dashboard."}
            </p>
          </header>

          {submitError && (
            <div className="login-submit-error" role="alert">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="login-form" aria-label="Admin auth form">
            {/* Full Name for signup */}
            {isSignup && (
              <div className="login-field">
                <Label htmlFor={nameId}>Full Name</Label>
                <Input
                  id={nameId}
                  type="text"
                  autoComplete="name"
                  placeholder="Admin Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${nameId}-error` : undefined}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <span id={`${nameId}-error`} className="login-field-error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>
            )}

            {/* Email */}
            <div className="login-field">
              <Label htmlFor={emailId}>Email address</Label>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                placeholder="admin@company.com"
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
              </div>

              <div className="login-password-wrap">
                <Input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
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

            {!isSignup && (
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
            )}

            <Button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting || hasErrors}
            >
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
              {isSubmitting
                ? (isSignup ? "Creating account…" : "Signing in…")
                : (isSignup ? "Create admin account" : "Sign in")}
            </Button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-6 text-center text-sm">
            {isSignup ? (
              <p className="text-muted-foreground">
                Already have an admin account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-medium text-primary hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Need an admin account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-medium text-primary hover:underline ml-1"
                >
                  Create admin account
                </button>
              </p>
            )}
          </div>

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
