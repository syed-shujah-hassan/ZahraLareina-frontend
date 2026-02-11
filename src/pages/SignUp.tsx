import { FormEvent, useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithGooglePopup } from "@/lib/firebase";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:5000";

  const state = location.state as { from?: string } | null;
  const redirectTo = state?.from || "/";

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("authToken")) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (isOtpStep) {
      return;
    }

    const run = async () => {
      try {
        setIsSubmitting(true);
        setInfoMessage("");
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, password }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to create account");
        }

        // Signup successful: backend has created an unverified user and sent OTP
        setIsOtpStep(true);
        setPendingEmail((data.user?.email || email).toLowerCase());
        setInfoMessage(
          data.message ||
            "A verification code has been sent to your email. Please enter it below to activate your account."
        );
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    };
    run();
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const run = async () => {
      try {
        if (!pendingEmail) {
          throw new Error("Missing email for verification. Please sign up again.");
        }

        if (!otpCode.trim()) {
          throw new Error("Please enter the verification code sent to your email.");
        }

        setIsSubmitting(true);
        const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: pendingEmail, code: otpCode.trim() }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Verification failed");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", data.token);
          if (data.user?.email) {
            localStorage.setItem("userEmail", data.user.email.toLowerCase());
          }
        }

        navigate(redirectTo);
      } catch (err: any) {
        setError(err.message || "Verification failed");
      } finally {
        setIsSubmitting(false);
      }
    };
    run();
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      setIsSubmitting(true);
      const cred = await signInWithGooglePopup();
      const displayName = cred.user.displayName || "";
      const email = cred.user.email || "";
      const googleId = cred.user.uid;

      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName: displayName, email, googleId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Google sign-up failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data.token);
        if (data.user?.email) {
          localStorage.setItem("userEmail", data.user.email.toLowerCase());
        }
      }

      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message || "Google sign-up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 pt-32 pb-16 bg-background">
        <div className="w-full max-w-md bg-card border border-border px-8 py-10 shadow-luxury">
          <p className="text-luxury-subtitle mb-3">Create Account</p>
          <h1 className="font-serif text-3xl tracking-[0.15em] uppercase mb-6">
            Sign Up
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {isOtpStep
              ? "We have sent a verification code to your email. Please enter it below to activate your account."
              : "Join ZahraLareina to save your favorites and track your luxury orders."}
          </p>

          {!isOtpStep ? (
            <form className="space-y-5 text-left" onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                  placeholder="Your name"
                  autoComplete="name"
                  name="signup-name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                  placeholder="you@example.com"
                  autoComplete="email"
                  name="signup-email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 pr-10 text-sm outline-none focus:border-foreground transition-colors"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    name="signup-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-destructive">
                  {error}
                </p>
              )}

              {infoMessage && (
                <p className="text-xs text-foreground/80">
                  {infoMessage}
                </p>
              )}

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full mt-4 border border-border bg-background/60 hover:bg-background flex items-center justify-center gap-3 py-3 text-sm transition-all duration-300 hover:-translate-y-[1px] hover:shadow-luxury"
              >
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 48 48"
                    className="w-4 h-4"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.42-5.42C33.64 4.02 29.27 2 24 2 14.82 2 6.91 7.55 3.44 15.26l6.9 5.36C11.74 14.54 17.33 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.15 24.5c0-1.64-.15-3.21-.43-4.75H24v9.03h12.55c-.54 2.9-2.23 5.36-4.77 7.01l7.45 5.78C43.9 37.7 46.15 31.55 46.15 24.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M10.34 28.39A14.5 14.5 0 0 1 9.5 24c0-1.52.26-2.98.74-4.34l-6.9-5.36A23.9 23.9 0 0 0 2 24c0 3.86.92 7.5 2.54 10.73l7.8-6.34z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M24 46c5.84 0 10.75-1.93 14.33-5.26l-7.45-5.78C29.06 36.76 26.7 37.5 24 37.5c-6.67 0-12.26-5.04-13.66-11.61l-7.8 6.34C6.91 40.45 14.82 46 24 46z"
                    />
                  </svg>
                </span>
                <span className="tracking-[0.18em] uppercase text-[11px]">
                  Continue with Google
                </span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-luxury mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Creating..." : "Create Account"}</span>
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp} autoComplete="off">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors tracking-[0.3em] uppercase"
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-destructive">
                  {error}
                </p>
              )}

              {infoMessage && (
                <p className="text-xs text-foreground/80">
                  {infoMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-luxury mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Verifying..." : "Verify & Create Account"}</span>
              </button>

              <p className="text-[11px] text-muted-foreground mt-2">
                If you did not receive the code, please check your spam folder or try signing up again with the correct email.
              </p>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <span className="mr-1">Already have an account?</span>
            <Link
              to="/signin"
              className="luxury-underline tracking-[0.2em] uppercase"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
