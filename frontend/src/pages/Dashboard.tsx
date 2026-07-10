import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  AlertCircle,
  SlidersHorizontal,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../api/axios";
import type {
  DashboardSummary,
  SubmissionStatusItem,
  WorkloadItem,
  PaginatedReports,
  Project,
  TrendItem,
  RecentActivityItem,
} from "../types";

const statusColors: Record<string, string> = {
  submitted: "bg-emerald-50 text-emerald-700",
  late: "bg-rose-50 text-rose-600",
  draft: "bg-amber-100/70 text-amber-700",
  pending: "bg-slate-100 text-slate-500",
};

const PIE_COLORS: Record<string, string> = {
  submitted: "#10b981",
  late: "#f43f5e",
  draft: "#f59e0b",
  pending: "#94a3b8",
};

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [statusList, setStatusList] = useState<SubmissionStatusItem[]>([]);
  const [workload, setWorkload] = useState<WorkloadItem[]>([]);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [reports, setReports] = useState<PaginatedReports | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get<Project[]>("/projects").then((res) => setProjects(res.data));
    api.get<RecentActivityItem[]>("/dashboard/recent-activity").then((res) =>
      setActivity(res.data)
    );
  }, []);

  useEffect(() => {
    const params =
      weekStart && weekEnd ? { week_start: weekStart, week_end: weekEnd } : {};

    setLoading(true);
    Promise.all([
      api.get<DashboardSummary>("/dashboard/summary", { params }),
      api.get<SubmissionStatusItem[]>("/dashboard/submission-status", { params }),
      api.get<WorkloadItem[]>("/dashboard/workload-by-project", { params }),
      api.get<TrendItem[]>("/dashboard/trend", { params: userId ? { user_id: userId } : {} }),
    ])
      .then(([summaryRes, statusRes, workloadRes, trendRes]) => {
        setSummary(summaryRes.data);
        setStatusList(statusRes.data);
        setWorkload(workloadRes.data);
        setTrend(trendRes.data);
      })
      .finally(() => setLoading(false));
  }, [weekStart, weekEnd, userId]);

  useEffect(() => {
    const params: Record<string, string | number> = { per_page: 10, page };
    if (userId) params.user_id = userId;
    if (projectId) params.project_id = projectId;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    if (status) params.status = status;

    api
      .get<PaginatedReports>("/dashboard/reports", { params })
      .then((res) => setReports(res.data));
  }, [userId, projectId, dateFrom, dateTo, status, page]);

  const clearFilters = () => {
    setUserId("");
    setProjectId("");
    setDateFrom("");
    setDateTo("");
    setStatus("");
    setPage(1);
  };

  // Aggregate status counts for the pie chart
  const statusCounts = statusList.reduce<Record<string, number>>((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});
  const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Team Dashboard
          </h1>
          {summary && (
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {summary.week_start} – {summary.week_end}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-500 font-medium">Week:</label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={weekEnd}
            onChange={(e) => setWeekEnd(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5"
          />
        </div>
      </header>

      <main className="p-8 space-y-6 overflow-y-auto max-w-300 w-full">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="TEAM MEMBERS" value={summary?.total_team_members ?? "—"} icon={Users} iconBg="bg-indigo-50 text-indigo-600" />
          <StatCard title="REPORTS SUBMITTED" value={summary?.total_reports_submitted ?? "—"} icon={FileText} iconBg="bg-orange-50 text-orange-600" />
          <StatCard title="COMPLIANCE" value={summary ? `${summary.compliance_rate}%` : "—"} icon={LayoutDashboard} iconBg="bg-blue-50 text-blue-600" />
          <StatCard
            title="OPEN BLOCKERS"
            value={summary?.open_blockers_count ?? "—"}
            icon={AlertCircle}
            iconBg="bg-red-50 text-red-600"
            badge={summary && summary.open_blockers_count > 0 ? "Needs attention" : undefined}
            badgeColor="text-red-600 bg-red-50"
          />
        </div>

        {/* Chart 1: Tasks completed trend over time */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
            Reports Submitted Over Time
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            {userId ? "Filtered to selected member" : "Team-wide"} — last 12 weeks
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week_start" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="reports_count"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Chart 2: Submission status by team member */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
              Submission Status by Team Member
            </h2>
            <p className="text-xs text-slate-400 mb-5">For the selected week</p>

            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={35}
                    outerRadius={60}
                  >
                    {statusPieData.map((entry) => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex-1 space-y-1.5">
                {statusList.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <span className="font-medium text-slate-700">{member.name}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[member.status]}`}
                    >
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 3: Workload / task distribution by project */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
              Workload by Project
            </h2>
            <p className="text-xs text-slate-400 mb-5">Total hours logged per project</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="project_name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total_hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Recent reports / activity feed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-3">
            {activity.length === 0 && (
              <p className="text-xs text-slate-400">No recent submissions yet.</p>
            )}
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.user.name}
                    <span className="font-normal text-slate-400">
                      {" "}submitted a report for {item.project?.name ?? "no project"}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Week {item.week_start} – {item.week_end}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filterable team reports table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Team Reports</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            <select value={userId} onChange={(e) => { setUserId(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs">
              <option value="">All Members</option>
              {statusList.map((m) => (
                <option key={m.user_id} value={m.user_id}>{m.name}</option>
              ))}
            </select>

            <select value={projectId} onChange={(e) => { setProjectId(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs">
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs" />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs" />

            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs">
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="late">Late</option>
            </select>
          </div>

          {(userId || projectId || dateFrom || dateTo || status) && (
            <button onClick={clearFilters} className="text-[11px] font-semibold text-orange-700 hover:underline mb-4">
              Clear filters
            </button>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Project</th>
                  <th className="pb-3">Week</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700 font-medium">
                {reports?.data.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400">No reports match these filters.</td></tr>
                )}
                {reports?.data.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 font-semibold text-slate-800">{r.user.name}</td>
                    <td className="py-3.5 text-slate-500">{r.project?.name ?? "—"}</td>
                    <td className="py-3.5 text-slate-500">{r.week_start} – {r.week_end}</td>
                    <td className="py-3.5">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${statusColors[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-800">{r.hours_worked ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reports && reports.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 mt-5 text-xs">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40">Previous</button>
              <span className="text-slate-500">Page {reports.current_page} of {reports.last_page}</span>
              <button disabled={page >= reports.last_page} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40">Next</button>
            </div>
          )}
        </div>

        {loading && <p className="text-xs text-slate-400 text-center">Loading dashboard…</p>}
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: typeof Users;
  iconBg: string;
  badge?: string;
  badgeColor?: string;
}

function StatCard({ title, value, icon: Icon, iconBg, badge, badgeColor }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-30">
      <div className="flex justify-between items-start">
        <div className={`${iconBg} p-2.5 rounded-xl`}>
          <Icon className="w-4 h-4" />
        </div>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor || "bg-slate-100 text-slate-500"}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{title}</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}