<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    // Open to everyone (member + manager) — needed for the report form's project dropdown
    public function index()
    {
        $projects = Project::withCount('reports')->orderBy('name')->get();

        return response()->json($projects);
    }

    public function show(Project $project)
    {
        return response()->json($project->load('creator'));
    }

    // Manager-only (enforced via route middleware, not here)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:projects,name',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => auth('api')->id(),
        ]);

        return response()->json($project, 201);
    }

    public function update(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:projects,name,' . $project->id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update($request->only('name', 'description'));

        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        // Prevent deleting a project that already has reports attached to it,
        // so historical reports don't lose their category unexpectedly
        if ($project->reports()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a project that has reports attached to it.',
            ], 409);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function members(Project $project)
    {
        return response()->json($project->members()->get(['users.id', 'users.name', 'users.email']));
    }

    public function syncMembers(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->members()->sync($request->user_ids ?? []);

        return response()->json($project->load('members'));
    }
}
