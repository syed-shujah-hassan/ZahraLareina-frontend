import { FormEvent } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }

    navigate("/orders");
  };
  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 pt-32 pb-16 bg-background">
        <div className="w-full max-w-md bg-card border border-border px-8 py-10 shadow-luxury">
          <p className="text-luxury-subtitle mb-3">Welcome Back</p>
          <h1 className="font-serif text-3xl tracking-[0.15em] uppercase mb-6">
            Sign In
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Enter your details to access your orders and saved items.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-foreground" />
                <span className="tracking-[0.18em] uppercase">Remember me</span>
              </label>
              <button
                type="button"
                className="luxury-underline text-[11px] tracking-[0.2em] uppercase"
              >
                Forgot password
              </button>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              className="w-full mt-6 border border-border bg-background/60 hover:bg-background flex items-center justify-center gap-3 py-3 text-sm transition-all duration-300 hover:-translate-y-[1px] hover:shadow-luxury"
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

            <button type="submit" className="w-full btn-luxury mt-4">
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <span className="mr-1">New to ZahraLareina?</span>
            <Link
              to="/signup"
              className="luxury-underline tracking-[0.2em] uppercase font-black"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
