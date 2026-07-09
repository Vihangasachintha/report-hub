<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Manager
        $manager = User::create([
            'name' => 'Jane Manager',
            'email' => 'manager@test.com',
            'password' => 'password123',
            'role' => 'manager',
        ]);

        // 2. Members
        $members = collect([
            ['name' => 'Bob Smith', 'email' => 'bob@test.com'],
            ['name' => 'Alice Chen', 'email' => 'alice@test.com'],
            ['name' => 'Raj Patel', 'email' => 'raj@test.com'],
            ['name' => 'Maria Garcia', 'email' => 'maria@test.com'],
        ])->map(fn($data) => User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => 'password123',
            'role' => 'member',
        ]));

        // 3. Projects
        $projects = collect([
            ['name' => 'Client A', 'description' => 'Retainer work'],
            ['name' => 'Internal Tooling', 'description' => 'Dev productivity tools'],
            ['name' => 'R&D', 'description' => 'Exploratory / research work'],
            ['name' => 'Marketing', 'description' => 'Website + campaign support'],
        ])->map(fn($data) => Project::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'created_by' => $manager->id,
        ]));

        // 4. Reports — last 4 weeks, each member, mixed statuses
        $tasksCompletedPool = [
            'Finished the login page UI',
            'Fixed 3 bugs reported by QA',
            'Wrote unit tests for the API layer',
            'Completed client onboarding flow',
            'Refactored the database queries',
            'Shipped the new dashboard chart',
        ];
        $tasksPlannedPool = [
            'Start on the reporting module',
            'Review PRs from the team',
            'Begin work on the mobile layout',
            'Investigate the performance issue',
            'Plan next sprint tasks',
        ];
        $blockersPool = [
            null,
            null,
            null, // most weeks have no blockers
            'Waiting on design assets from the client',
            'Blocked on API credentials',
            'Need clarification on requirements',
        ];

        for ($weekOffset = 3; $weekOffset >= 0; $weekOffset--) {
            $weekStart = now()->subWeeks($weekOffset)->startOfWeek();
            $weekEnd = now()->subWeeks($weekOffset)->endOfWeek();

            foreach ($members as $index => $member) {
                // Skip one member in one week to simulate a "pending" case in current week
                if ($weekOffset === 0 && $index === 3) {
                    continue;
                }

                // Determine status: past weeks are submitted/late, current week is a mix
                if ($weekOffset === 0) {
                    $status = $index === 0 ? 'draft' : 'submitted';
                } else {
                    $status = $index === 1 && $weekOffset === 2 ? 'late' : 'submitted';
                }

                $report = Report::create([
                    'user_id' => $member->id,
                    'project_id' => $projects->random()->id,
                    'week_start' => $weekStart->toDateString(),
                    'week_end' => $weekEnd->toDateString(),
                    'tasks_completed' => $tasksCompletedPool[array_rand($tasksCompletedPool)],
                    'tasks_planned' => $tasksPlannedPool[array_rand($tasksPlannedPool)],
                    'blockers' => $blockersPool[array_rand($blockersPool)],
                    'hours_worked' => rand(30, 45),
                    'status' => $status,
                ]);

                if (in_array($status, ['submitted', 'late'])) {
                    $report->update([
                        'submitted_at' => $status === 'late'
                            ? $weekEnd->copy()->addDays(3)
                            : $weekEnd->copy()->addDay(),
                    ]);
                }
            }
        }

        $this->command->info('Seeded: 1 manager, 4 members, 4 projects, ~15 reports across 4 weeks.');
    }
}
