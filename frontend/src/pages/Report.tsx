import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  ChevronDown,
  Trash2,
  Eye,
  FileSpreadsheet,
  Send,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import type { Report as ReportType, Project } from "../types";

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-orange-50 text-orange-700",
  late: "bg-red-50 text-red-600",
};

export default function Report() {
  const navigate = useNavigate();
  const { id } = useParams(); // undefined = create mode, present = edit mode
  const isEditMode = Boolean(id);

  const [projects, setProjects] = useState<Project[]>([]);
  const [previousReports, setPreviousReports] = useState<ReportType[]>([]);
  const [currentReport, setCurrentReport] = useState<ReportType | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    week_start: "",
    week_end: "",
    project_id: "",
    tasks_completed: "",
    tasks_planned: "",
    blockers: "",
    hours_worked: "",
    notes: "",
  });

  // Load projects + previous reports list, and the specific report if editing
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<Project[]>("/projects"),
      api.get<ReportType[]>("/reports"),
      id ? api.get<ReportType>(`/reports/${id}`) : Promise.resolve(null),
    ])
      .then(([projectsRes, reportsRes, reportRes]) => {
        setProjects(projectsRes.data);
        setPreviousReports(reportsRes.data.filter((r) => String(r.id) !== id));

        if (reportRes) {
          const r = reportRes.data;
          setCurrentReport(r);
          setFormData({
            week_start: r.week_start,
            week_end: r.week_end,
            project_id: r.project_id ? String(r.project_id) : "",
            tasks_completed: r.tasks_completed ?? "",
            tasks_planned: r.tasks_planned ?? "",
            blockers: r.blockers ?? "",
            hours_worked: r.hours_worked !== null ? String(r.hours_worked) : "",
            notes: r.notes ?? "",
          });
        }
      })
      .catch(() => setError("Failed to load report data."))
      .finally(() => setLoading(false));
  }, [id]);

  const buildPayload = () => ({
    project_id: formData.project_id ? Number(formData.project_id) : null,
    week_start: formData.week_start,
    week_end: formData.week_end,
    tasks_completed: formData.tasks_completed || null,
    tasks_planned: formData.tasks_planned || null,
    blockers: formData.blockers || null,
    hours_worked: formData.hours_worked ? Number(formData.hours_worked) : null,
    notes: formData.notes || null,
  });

  const validateDates = () => {
    if (!formData.week_start || !formData.week_end) {
      setError("Week start and end dates are required.");
      return false;
    }
    return true;
  };

  // Save as Draft — create or update, stays in draft status
  const handleSaveDraft = async () => {
    setError("");
    if (!validateDates()) return;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/reports/${id}`, buildPayload());
      } else {
        const res = await api.post("/reports", buildPayload());
        navigate(`/my-reports/report/${res.data.id}`, { replace: true });
      }
      navigate("/my-reports");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      setError(
        errors ? (Object.values(errors).flat() as string[]).join(" ") : "Failed to save report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Report — save fields, then call the submit endpoint
  const handleSubmitReport = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateDates()) return;
    setIsSubmitting(true);
    try {
      let reportId = id;
      if (isEditMode) {
        await api.put(`/reports/${id}`, buildPayload());
      } else {
        const res = await api.post("/reports", buildPayload());
        reportId = res.data.id;
      }
      await api.patch(`/reports/${reportId}/submit`);
      navigate("/my-reports");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      setError(
        errors ? (Object.values(errors).flat() as string[]).join(" ") : "Failed to submit report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this draft report? This cannot be undone.")) return;
    try {
      await api.delete(`/reports/${id}`);
      navigate("/my-reports");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete report.");
    }
  };

  const isReadOnly = currentReport ? currentReport.status !== "draft" : false;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
        Loading report…
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-24 bg-[#f8fafc] px-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {isEditMode ? "Edit Report" : "New Report"}
        </h1>
      </header>

      <div className="px-10 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: previous reports list */}
        <main className="lg:col-span-7 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Previous Reports
            </h3>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6 font-bold">Week Range</th>
                      <th className="py-4 px-4 font-bold">Project</th>
                      <th className="py-4 px-4 font-bold">Status</th>
                      <th className="py-4 px-4 font-bold">Hours</th>
                      <th className="py-4 px-6 font-bold text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                    {previousReports.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 px-6 text-center text-slate-400 font-normal">
                          No previous reports yet.
                        </td>
                      </tr>
                    )}
                    {previousReports.slice(0, 5).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-5 px-6 font-bold text-slate-800">
                          {r.week_start} – {r.week_end}
                        </td>
                        <td className="py-5 px-4 text-slate-600">
                          {r.project?.name ?? "—"}
                        </td>
                        <td className="py-5 px-4">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColors[r.status]}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-5 px-4 font-bold text-slate-800">
                          {r.hours_worked ?? "—"}
                        </td>
                        <td className="py-5 px-6 text-right">
                          <button
                            onClick={() => navigate(`/my-reports/report/${r.id}`)}
                            className="text-[#2e3bb1] hover:text-[#1d2680] p-1.5 rounded-lg hover:bg-indigo-50/50 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-slate-100 text-center">
                <Link
                  to="/my-reports"
                  className="text-xs font-bold text-[#2e3bb1] hover:text-[#1d2680] hover:underline transition-all"
                >
                  View All History
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* RIGHT: the form */}
        <aside className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Report Details
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isReadOnly
                  ? "This report has been submitted and can no longer be edited."
                  : "Update or create your weekly report"}
              </p>
            </div>
            <div className="bg-orange-50 text-orange-600 p-2.5 rounded-2xl shadow-inner">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.week_start}
                  onChange={(e) => setFormData({ ...formData, week_start: e.target.value })}
                  disabled={isReadOnly}
                  required
                  className="w-full bg-slate-50/70 border border-slate-150 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-600 outline-none disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.week_end}
                  onChange={(e) => setFormData({ ...formData, week_end: e.target.value })}
                  disabled={isReadOnly}
                  required
                  className="w-full bg-slate-50/70 border border-slate-150 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-600 outline-none disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Project
              </label>
              <div className="relative">
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  disabled={isReadOnly}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#2e3bb1] focus:ring-2 focus:ring-[#2e3bb1]/10 transition-all cursor-pointer disabled:opacity-70"
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Tasks Completed
              </label>
              <textarea
                placeholder="What did you achieve this week?"
                value={formData.tasks_completed}
                onChange={(e) => setFormData({ ...formData, tasks_completed: e.target.value })}
                disabled={isReadOnly}
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2e3bb1] focus:bg-white focus:ring-2 focus:ring-[#2e3bb1]/10 transition-all resize-none disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Planned (Next Week)
              </label>
              <textarea
                placeholder="What are your upcoming goals?"
                value={formData.tasks_planned}
                onChange={(e) => setFormData({ ...formData, tasks_planned: e.target.value })}
                disabled={isReadOnly}
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2e3bb1] focus:bg-white focus:ring-2 focus:ring-[#2e3bb1]/10 transition-all resize-none disabled:opacity-70"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Blockers
                </label>
                <input
                  type="text"
                  placeholder="Any issues?"
                  value={formData.blockers}
                  onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                  disabled={isReadOnly}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2e3bb1] focus:bg-white focus:ring-2 focus:ring-[#2e3bb1]/10 transition-all disabled:opacity-70"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Hours Worked
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="168"
                  value={formData.hours_worked}
                  onChange={(e) => setFormData({ ...formData, hours_worked: e.target.value })}
                  disabled={isReadOnly}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2e3bb1] focus:bg-white focus:ring-2 focus:ring-[#2e3bb1]/10 transition-all disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Notes
              </label>
              <textarea
                placeholder="Any other context?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={isReadOnly}
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2e3bb1] focus:bg-white focus:ring-2 focus:ring-[#2e3bb1]/10 transition-all resize-none disabled:opacity-70"
              />
            </div>

            {error && <p className="text-xs font-medium text-red-500">{error}</p>}

            {!isReadOnly && (
              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f05a28] hover:bg-[#e04f1e] active:scale-[0.99] text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/10 transition-all disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5 rotate-45 -mt-0.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                    className="flex-1 bg-white hover:bg-slate-50 active:scale-[0.99] text-[#2e3bb1] border border-indigo-200 font-semibold text-xs py-3 px-4 rounded-xl transition-all disabled:opacity-60"
                  >
                    Save as Draft
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-3 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50/30 transition-all flex items-center justify-center shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}