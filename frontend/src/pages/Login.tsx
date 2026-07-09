import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Users,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ReportHubLogo from "../assets/ReportHub_logo.png";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      navigate(user.role === "manager" ? "/dashboard" : "/my-reports");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#efeff6] text-[#1f2937]">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#3d40c0] via-[#363bb8] to-[#3237b1]" />
      <div className="absolute inset-x-0 top-1/2 bottom-0 bg-[#efeff6]" />

      <div
        className="absolute left-10 top-[5.25rem] hidden h-40 w-40 items-center justify-center rounded-full bg-white/10 md:flex"
        aria-hidden="true"
      >
        <Users className="h-[4.5rem] w-[4.5rem] text-[#2f35a7] opacity-95" />
      </div>

      <div
        className="absolute bottom-8 right-8 hidden h-[11.6rem] w-[11.6rem] rotate-12 items-center justify-center rounded-[2.1rem] bg-[#f5dfd8] shadow-[0_22px_30px_rgba(121,78,68,0.08)] md:flex"
        aria-hidden="true"
      >
        <div className="relative -translate-y-1 translate-x-1 text-[#cc9b87]">
          <Sparkles className="absolute -left-8 top-[-1.7rem] h-5 w-5" />
          <Sparkles className="absolute left-4 top-[-1.9rem] h-7 w-7" />
          <GitBranch className="h-[3.8rem] w-[3.8rem]" />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col px-4 pb-4 pt-0 md:px-8 md:pt-6">
        <header className="flex flex-col items-center text-center text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-[#3a3fb8] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
              <img src={ReportHubLogo} alt="ReportHub Logo" className="h-10 w-auto" />
            </div>
            <h1 className="text-xl font-extrabold tracking-[-0.05em]">
              ReportHub.
            </h1>
          </div>
          <p className="mt-2 text-[0.95rem] text-white/70">
            Streamlining your data-driven decisions
          </p>
        </header>

        <main className="flex flex-1 min-h-0 items-center justify-center py-2 md:py-3">
          <section className="w-full max-w-[365px] rounded-[29px] bg-white px-7 py-5 shadow-[0_18px_45px_rgba(40,45,120,0.16)] md:px-8 md:py-6 border border-slate-100">
            <div className="text-center">
              <h2 className="text-[1.98rem] font-extrabold tracking-[-0.04em] text-[#20222a]">
                Welcome Back
              </h2>
              <p className="mx-auto mt-2.5 max-w-[16rem] text-[0.94rem] leading-[1.32] text-[#8d6f66]">
                Please enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-3.5">
              <div>
                <label className="mb-2 block text-[0.83rem] font-extrabold uppercase tracking-[0.06em] text-[#302521]">
                  Email Address
                </label>
                <div className="flex h-12 items-center rounded-xl border border-[#efcfc2] bg-[#f4f6fb] px-3.5 transition focus-within:border-[#d9a28d] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(217,162,141,0.1)]">
                  <Mail className="mr-3 h-4 w-4 shrink-0 text-[#6f584f]" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-full w-full min-w-0 bg-transparent text-[0.95rem] text-[#5f6677] outline-none placeholder:text-[#9098ad]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-[0.83rem] font-extrabold uppercase tracking-[0.06em] text-[#302521]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-[0.78rem] font-medium text-[#4b44c8]"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="flex h-12 items-center rounded-xl border border-[#efcfc2] bg-[#f4f6fb] px-3.5 transition focus-within:border-[#d9a28d] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(217,162,141,0.1)]">
                  <Lock className="mr-3 h-4 w-4 shrink-0 text-[#6f584f]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-full w-full min-w-0 bg-transparent text-[0.95rem] text-[#5f6677] outline-none placeholder:text-[#9098ad]"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-[#6f584f]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-center text-sm font-medium text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f9632a] text-[1.02rem] font-semibold text-white shadow-[0_12px_22px_rgba(249,99,42,0.38)] transition duration-200 hover:-translate-y-px hover:bg-[#ef5a21] hover:shadow-[0_14px_26px_rgba(249,99,42,0.45)] disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span>{isSubmitting ? "Logging in..." : "Login to Workspace"}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="my-3 border-t border-[#f1d9d1]" />

            <div className="text-center">
              <p className="mt-1 text-[0.88rem] text-[#61504b]">
                Don't have an account yet?
              </p>
              <Link to="/register">
                <button
                  type="button"
                  className="border-0 bg-transparent p-0 text-[0.98rem] font-bold text-[#f15a20] cursor-pointer"
                >
                  Register here
                </button>
              </Link>
            </div>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 pb-1 text-center text-[0.9rem] text-[#6b625e]">
          <button type="button" className="border-0 bg-transparent p-0">
            Privacy Policy
          </button>
          <button type="button" className="border-0 bg-transparent p-0">
            Terms of Service
          </button>
          <button type="button" className="border-0 bg-transparent p-0">
            Security
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Login;