<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    // List own reports, organized by week, optionally filtered
    public function index(Request $request)
    {
        $query = Report::where('user_id', auth('api')->id())
            ->with('project')
            ->orderBy('week_start', 'desc');

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'nullable|exists:projects,id',
            'week_start' => [
                'required',
                'date',
                Rule::unique('reports')->where(function ($query) use ($request) {
                    return $query->where('user_id', auth('api')->id())
                        ->where('week_end', $request->week_end);
                }),
            ],
            'week_end' => 'required|date|after_or_equal:week_start',
            'tasks_completed' => 'nullable|string',
            'tasks_planned' => 'nullable|string',
            'blockers' => 'nullable|string',
            'hours_worked' => 'nullable|numeric|min:0|max:168',
            'notes' => 'nullable|string',
        ],[
            'week_start.unique' => 'You already have a report for this week.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $report = Report::create([
            'user_id' => auth('api')->id(),
            'project_id' => $request->project_id,
            'week_start' => $request->week_start,
            'week_end' => $request->week_end,
            'tasks_completed' => $request->tasks_completed,
            'tasks_planned' => $request->tasks_planned,
            'blockers' => $request->blockers,
            'hours_worked' => $request->hours_worked,
            'notes' => $request->notes,
            'status' => 'draft',
        ]);

        return response()->json($report->load('project'), 201);
    }

    public function show(Report $report)
    {
        if ($report->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($report->load('project'));
    }

    public function update(Request $request, Report $report)
    {
        if ($report->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'project_id' => 'nullable|exists:projects,id',
            'week_start' => 'sometimes|required|date',
            'week_end' => 'sometimes|required|date|after_or_equal:week_start',
            'tasks_completed' => 'nullable|string',
            'tasks_planned' => 'nullable|string',
            'blockers' => 'nullable|string',
            'hours_worked' => 'nullable|numeric|min:0|max:168',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $report->update($request->only([
            'project_id',
            'week_start',
            'week_end',
            'tasks_completed',
            'tasks_planned',
            'blockers',
            'hours_worked',
            'notes',
        ]));

        return response()->json($report->load('project'));
    }

    // Separate action: locks the report in as submitted
    public function submit(Report $report)
    {
        if ($report->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // If the week already ended more than 2 days ago, mark it late instead of submitted
        $status = now()->gt($report->week_end->addDays(2)) ? 'late' : 'submitted';

        $report->update([
            'status' => $status,
            'submitted_at' => now(),
        ]);

        return response()->json($report->load('project'));
    }

    public function destroy(Report $report)
    {
        if ($report->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($report->status !== 'draft') {
            return response()->json([
                'message' => 'Cannot delete a report that has already been submitted.',
            ], 409);
        }

        $report->delete();

        return response()->json(['message' => 'Report deleted successfully']);
    }
}
