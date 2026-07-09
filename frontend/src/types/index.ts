export type Role = "member" | "manager";
export type ReportStatus = "draft" | "submitted" | "late";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  reports_count?: number;
}

export interface Report {
  id: number;
  user_id: number;
  project_id: number | null;
  week_start: string;
  week_end: string;
  tasks_completed: string | null;
  tasks_planned: string | null;
  blockers: string | null;
  hours_worked: number | null;
  notes: string | null;
  status: ReportStatus;
  submitted_at: string | null;
  project?: Project;
}

export interface DashboardSummary {
  week_start: string;
  week_end: string;
  total_team_members: number;
  total_reports_submitted: number;
  compliance_rate: number;
  open_blockers_count: number;
}

export interface SubmissionStatusItem {
  user_id: number;
  name: string;
  email: string;
  status: "submitted" | "late" | "draft" | "pending";
  report_id: number | null;
}

export interface WorkloadItem {
  project_name: string;
  report_count: number;
  total_hours: string;
}

export interface TeamReport {
  id: number;
  week_start: string;
  week_end: string;
  status: ReportStatus;
  hours_worked: number | null;
  blockers: string | null;
  user: { id: number; name: string; email: string };
  project: { id: number; name: string } | null;
}

export interface PaginatedReports {
  data: TeamReport[];
  current_page: number;
  last_page: number;
  total: number;
}