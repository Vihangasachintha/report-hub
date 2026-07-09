<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1'); // 5 attempts/minute

Route::middleware('auth:api')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);

    Route::middleware('role:manager')->group(function () {
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    });

    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/{report}', [ReportController::class, 'show']);
    Route::put('/reports/{report}', [ReportController::class, 'update']);
    Route::patch('/reports/{report}/submit', [ReportController::class, 'submit']);
    Route::delete('/reports/{report}', [ReportController::class, 'destroy']);
});

Route::middleware(['auth:api', 'role:manager'])->prefix('dashboard')->group(function () {
    Route::get('/summary', [DashboardController::class, 'summary']);
    Route::get('/submission-status', [DashboardController::class, 'submissionStatus']);
    Route::get('/reports', [DashboardController::class, 'teamReports']);
    Route::get('/trend', [DashboardController::class, 'trend']);
    Route::get('/workload-by-project', [DashboardController::class, 'workloadByProject']);
    Route::get('/recent-activity', [DashboardController::class, 'recentActivity']);
});
