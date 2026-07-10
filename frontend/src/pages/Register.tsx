import { useState } from "react";
import type { FormEvent } from "react";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ReportHubLogo from "../assets/ReportHub_logo.png";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"member" | "manager">("member");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      navigate("/login");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? (Object.values(errors).flat() as string[]).join(" ")
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center p-4 antialiased font-sans">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-[#3d40c0] via-[#363bb8] to-[#3237b1]" />
      <div className="absolute inset-x-0 top-1/2 bottom-0 bg-[#efeff6]" />

      <div className="relative z-10 w-full max-w-250 bg-white rounded-4xl flex flex-col md:flex-row overflow-hidden border border-slate-100">
        <div className="w-full md:w-[42%] bg-[#2e3bb1] p-8 md:p-12 flex flex-col justify-between text-white relative min-h-100 md:min-h-155">
          <div className="flex items-center gap-2">
            <div className="bg-white/80 p-0 rounded-xl backdrop-blur-sm">
              <img src={ReportHubLogo} alt="ReportHub Logo" className="h-15 w-auto" />
            </div>
            <span className="font-bold text-2xl tracking-tight">ReportHub</span>
          </div>

          <div className="my-auto py-8">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 tracking-tight">
              Master your weekly data flow.
            </h1>
            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-sm">
              Join thousands of teams simplifying their reporting lifecycle with
              AI-driven insights and elegant visualizations.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-inner">
            <h3 className="font-semibold text-sm mb-1 text-white">
              Weekly Report Dashboard
            </h3>
            <p className="text-xs text-white/70 mb-3 leading-normal">
              Track team progress, submissions, blockers, and workload in one
              place.
            </p>
          </div>
        </div>

        <div className="w-full md:w-[58%] p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-110 w-full mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-slate-400 text-sm mt-1.5 mb-8">
              Start generating beautiful reports in seconds.
            </p>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 text-slate-800 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 text-slate-800 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 text-slate-800 placeholder-slate-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 text-slate-800 placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Role
                </label>
                <div className="bg-slate-100 p-1 rounded-xl flex w-full">
                  <button
                    type="button"
                    onClick={() => setRole("member")}
                    className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      role === "member"
                        ? "bg-[#f05a28] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("manager")}
                    className={`flex-1 py-2.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${
                      role === "manager"
                        ? "bg-[#f05a28] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Manager
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  {role === "manager"
                    ? "Managers can create projects and invite team members."
                    : "Members can access assigned tasks and submit updates."}
                </p>
              </div>

              {error && (
                <p className="text-center text-sm font-medium text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f05a28] hover:bg-[#e04f1e] active:scale-[0.99] text-white font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition-all mt-6 disabled:opacity-60 disabled:active:scale-100"
              >
                <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <p className="mt-1 text-[0.88rem] text-[#61504b]">
                  Already have an account?
                </p>
                <Link to="/login">
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-[0.98rem] font-bold text-[#f15a20] cursor-pointer"
                  >
                    Login Here
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}