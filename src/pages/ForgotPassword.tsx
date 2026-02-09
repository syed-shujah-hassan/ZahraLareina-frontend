import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Eye, EyeOff } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleRequestCode = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const run = async () => {
      try {
        setIsSubmitting(true);
        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to send reset code");
        }
        setMessage(data.message || "A reset code has been sent to your email.");
        setStep("code");
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    };

    run();
  };

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const run = async () => {
      try {
        setIsSubmitting(true);
        const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, newPassword }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to reset password");
        }
        setMessage(data.message || "Your password has been updated. You can now sign in.");
        // Redirect to sign-in after successful reset
        navigate("/signin", { replace: true });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    };

    run();
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 pt-32 pb-16 bg-background">
        <div className="w-full max-w-md bg-card border border-border px-8 py-10 shadow-luxury">
          <p className="text-luxury-subtitle mb-3">Password Assistance</p>
          <h1 className="font-serif text-3xl tracking-[0.15em] uppercase mb-6">Forgot Password</h1>
          <p className="text-sm text-muted-foreground mb-8">
            {step === "email"
              ? "Enter your email to receive a reset code."
              : "Enter the code you received and choose a new password."}
          </p>

          {step === "email" ? (
            <form className="space-y-5" onSubmit={handleRequestCode}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}
              {message && <p className="text-xs text-foreground/80">{message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-luxury disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Sending..." : "Send Code"}</span>
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                  placeholder="Enter the code from your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 pr-10 text-sm outline-none focus:border-foreground transition-colors"
                    placeholder="Create a new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}
              {message && <p className="text-xs text-foreground/80">{message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-luxury disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Updating..." : "Reset Password"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
