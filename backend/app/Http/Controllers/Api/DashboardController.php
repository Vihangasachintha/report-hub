<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    // Resolve the week being asked about — defaults to the current week (Mon-Sun)
    private function resolveWeek(Request $request): array
    {
        if ($request->has('week_start') && $request->has('week_end')) {
            return [
                Carbon::parse($request->week_start)->startOfDay(),
                Carbon::parse($request->week_end)->endOfDay(),
            ];
        }

        return [now()->startOfWeek(), now()->endOfWeek()];
    }

    // 1. Summary metrics for the selected week
    public function summary(Request $request)
    {
        [$weekStart, $weekEnd] = $this->resolveWeek($request);

        $totalMembers = User::where('role', 'member')->count();

        $reportsThisWeek = Report::whereBetween('week_start', [$weekStart, $weekEnd]);

        $submittedCount = (clone $reportsThisWeek)
            ->whereIn('status', ['submitted', 'late'])
            ->count();

        $complianceRate = $totalMembers > 0
            ? round(($submittedCount / $totalMembers) * 100, 1)
            : 0;

        $openBlockers = (clone $reportsThisWeek)
            ->whereNotNull('blockers')
            ->where('blockers', '!=', '')
            ->count();

        return response()->json([
            'week_start' => $weekStart->toDateString(),
            'week_end' => $weekEnd->toDateString(),
            'total_team_members' => $totalMembers,
            'total_reports_submitted' => $submittedCount,
            'compliance_rate' => $complianceRate,
            'open_blockers_count' => $openBlockers,
        ]);
    }

    // 2. Per-member submission status for the selected week (submitted / pending / late)
    public function submissionStatus(Request $request)
    {
        [$weekStart, $weekEnd] = $this->resolveWeek($request);

        $members = User::where('role', 'member')->get(['id', 'name', 'email']);

        $reports = Report::whereBetween('week_start', [$weekStart, $weekEnd])
            ->whereIn('user_id', $members->pluck('id'))
            ->get()
            ->keyBy('user_id');

        $result = $members->map(function ($member) use ($reports) {
            $report = $reports->get($member->id);

            return [
                'user_id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                'status' => $report ? $report->status : 'pending',
                'report_id' => $report?->id,
            ];
        });

        return response()->json($result);
    }

    // 3. Filterable team reports list — member, project, date range
    public function teamReports(Request $request)
    {
        $query = Report::with(['user:id,name,email', 'project:id,name'])
            ->orderBy('week_start', 'desc');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('date_from')) {
            $query->where('week_start', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('week_end', '<=', $request->date_to);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Simple pagination so the table doesn't blow up as data grows
        $perPage = $request->input('per_page', 20);

        return response()->json($query->paginate($perPage));
    }

    // 4. Chart: tasks completed trend over time (team-wide, grouped by week)
    public function trend(Request $request)
    {
        $weeks = Report::selectRaw('week_start, COUNT(*) as reports_count')
            ->when($request->filled('user_id'), fn($q) => $q->where('user_id', $request->user_id))
            ->whereIn('status', ['submitted', 'late'])
            ->groupBy('week_start')
            ->orderBy('week_start')
            ->limit(12) // last 12 weeks worth of groups
            ->get();

        return response()->json($weeks);
    }

    // 5. Chart: workload / report distribution by project
    public function workloadByProject(Request $request)
    {
        [$weekStart, $weekEnd] = $this->resolveWeek($request);

        $data = Report::selectRaw('projects.name as project_name, COUNT(reports.id) as report_count, SUM(reports.hours_worked) as total_hours')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->whereBetween('reports.week_start', [$weekStart, $weekEnd])
            ->groupBy('projects.id', 'projects.name')
            ->get();

        return response()->json($data);
    }

    // 6. Recent activity feed
    public function recentActivity()
    {
        $activity = Report::with(['user:id,name', 'project:id,name'])
            ->whereIn('status', ['submitted', 'late'])
            ->orderBy('submitted_at', 'desc')
            ->limit(10)
            ->get(['id', 'user_id', 'project_id', 'week_start', 'week_end', 'status', 'submitted_at']);

        return response()->json($activity);
    }

    // 7. Reports details
    public function reportDetail(Report $report)
    {
        return response()->json($report->load(['user:id,name,email', 'project:id,name']));
    }
}
