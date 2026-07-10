import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Report } from "../types";

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-orange-50 text-orange-700",
  late: "bg-rose-50 text-rose-600",
};

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const loadReports = () => {
    setLoading(true);
    api
      .get<Report[]>("/reports", { params: statusFilter ? { status: statusFilter } : {} })
      .then((res) => setReports(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const submittedCount = reports.filter((r) => r.status === "submitted" || r.status === "late").length;
  const draftCount = reports.filter((r) => r.status === "draft").length;
  const avgHours =
    reports.length > 0
      ? (
          reports.reduce((sum, r) => sum + (r.hours_worked ?? 0), 0) / reports.length
        ).toFixed(1)
      : "0.0";

  const handleDelete = async (report: Report) => {
    if (!confirm("Delete this draft report?")) return;
    try {
      await api.delete(`/reports/${report.id}`);
      loadReports();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete report.");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-20 bg-[#f8fafc] px-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Reports History
        </h1>
      </header>

      <main className="px-10 pb-10 space-y-6 overflow-y-auto max-w-310 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatBox title="SUBMITTED" value={submittedCount} />
          <StatBox title="DRAFTS" value={draftCount} />
          <StatBox title="AVG. HOURS" value={avgHours} />

          <button
            onClick={() => navigate("/my-reports/report")}
            className="bg-orange-500 hover:bg-orange-600 active:scale-[0.99] rounded-2xl flex flex-col items-center justify-center text-white font-medium p-6 shadow-lg shadow-orange-500/10 transition-all min-h-30"
          >
            <div className="bg-white/20 p-2 rounded-xl mb-2">
              <Plus className="w-4 h-4 stroke-3" />
            </div>
            <span className="text-xs font-semibold tracking-wide">
              Create New Report
            </span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Recent Submissions
            </h2>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Week Range</th>
                  <th className="pb-3 font-bold">Project</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Hours</th>
                  <th className="pb-3 font-bold text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700 font-medium">
                {!loading && reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No reports yet — create your first one.
                    </td>
                  </tr>
                )}
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4">
                      <span className="font-bold text-slate-800 block">
                        {report.week_start} – {report.week_end}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-slate-700">
                      {report.project?.name ?? "—"}
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-slate-800">
                      {report.hours_worked ?? "—"}
                    </td>
                    <td className="py-4 text-right pr-4">
                      {report.status === "draft" ? (
                        <div className="inline-flex items-center gap-3 text-orange-700/80">
                          <button
                            onClick={() => navigate(`/my-reports/report/${report.id}`)}
                            className="hover:text-orange-900 p-1"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(report)}
                            className="hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4 text-red-500/80" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate(`/my-reports/report/${report.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 inline-block"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && <p className="text-xs text-slate-400 text-center">Loading…</p>}
      </main>
    </div>
  );
}

function StatBox({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-30">
      <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{title}</p>
      <p className="text-3xl font-bold text-slate-800 tracking-tight mt-1">{value}</p>
    </div>
  );
}