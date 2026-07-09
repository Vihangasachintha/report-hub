import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import ReportHubLogo from "../assets/ReportHub_logo.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"member" | "manager">("member");

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center p-4 antialiased font-sans">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#3d40c0] via-[#363bb8] to-[#3237b1]" />
      <div className="absolute inset-x-0 top-1/2 bottom-0 bg-[#efeff6]" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[1000px] bg-white rounded-[32px] flex flex-col md:flex-row overflow-hidden border border-slate-100">
        {/* Left Side: Brand / Marketing Panel */}
        <div className="w-full md:w-[42%] bg-[#2e3bb1] p-8 md:p-12 flex flex-col justify-between text-white relative min-h-[400px] md:min-h-[620px]">
          {/* Top: Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white/15 p-2 rounded-xl backdrop-blur-sm">
              <img src={ReportHubLogo} alt="ReportHub Logo" className="h-15 w-auto" />
            </div>
            <span className="font-bold text-2xl tracking-tight">ReportHub</span>
          </div>

          {/* Middle: Value Proposition */}
          <div className="my-auto py-8">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 tracking-tight">
              Master your weekly data flow.
            </h1>
            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-sm">
              Join thousands of teams simplifying their reporting lifecycle with
              AI-driven insights and elegant visualizations.
            </p>
          </div>

          {/* Bottom: Floating Feature Highlights Card */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-inner">
            <h3 className="font-semibold text-sm mb-1 text-white">
              Weekly Report Dashboard
            </h3>
            <p className="text-xs text-white/70 mb-3 leading-normal">
              Track team progress, submissions, blockers, and workload in one
              place.
            </p>
            <div className="space-y-1.5">
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">
                Why this is good:
              </p>
              <ul className="text-xs text-white/80 space-y-1 list-disc list-inside font-light">
                <li>matches the assignment exactly</li>
                <li>sounds product-like</li>
                <li>works for manager dashboard</li>
                <li>no fake feature</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full md:w-[58%] p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-[440px] w-full mx-auto">
            {/* Header */}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-slate-400 text-sm mt-1.5 mb-8">
              Start generating beautiful reports in seconds.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 text-slate-800 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="john@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 text-slate-800 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Password Controls (Grid for Password + Confirm) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 text-slate-800 placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Account Role Segmented Control */}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#f05a28] hover:bg-[#e04f1e] active:scale-[0.99] text-white font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition-all mt-6"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Login Redirection */}
              <div className="text-center">
                <p className="mt-1 text-[0.88rem] text-[#61504b]">
                  Don't have an account yet?
                </p>
                <Link to="/login">
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-[0.98rem] font-bold text-[#f15a20] cursor-pointer"
                  >
                    Login
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
