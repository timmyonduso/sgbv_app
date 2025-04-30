<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\CaseModel;
use App\Models\Incident;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get caseworkers
        $caseworkers = User::whereHas('roles', function ($query) {
            $query->where('name', RoleName::CASE_WORKER);
        })->get();

        // Get case statuses
        $statuses = Status::whereIn('name', [
            'Case: Open',
            'Case: In Progress',
            'Case: Pending Review',
            'Case: Pending External',
            'Case: Resolved',
            'Case: Closed'
        ])->get();

        // Get incidents that don't have a case yet (leave some without cases)
        $incidents = Incident::doesntHave('case')
            ->inRandomOrder()
            ->limit(30)
            ->get();

        foreach ($incidents as $incident) {
            // Case created 1-5 days after incident
            $createdDate = Carbon::parse($incident->created_at)->addDays(rand(1, 5));

            // Resolution notes templates
            $resolutionNotes = [
                'Initial assessment completed. Support services offered.',
                'Follow-up scheduled with survivor. Resource information provided.',
                'Safety plan created with survivor.',
                'Coordinated with community resources for additional support.',
                'Referred to legal assistance programs.',
                'Multiple support options discussed and documented.',
                'Regular check-ins established with survivor.',
                'Escalated to appropriate agency for additional intervention.',
                'Advised on documentation procedures for future reference.',
                'Created action plan with measurable outcomes.',
                'Pending additional information from survivor.',
                'Awaiting response from external resources.',
                null, // Some cases might not have notes yet
            ];

            CaseModel::create([
                'incident_id' => $incident->id,
                'assigned_to' => $caseworkers->random()->id,
                'status_id' => $statuses->random()->id,
                'resolution_notes' => $resolutionNotes[array_rand($resolutionNotes)],
                'created_at' => $createdDate,
                'updated_at' => $createdDate->copy()->addDays(rand(0, 14)),
            ]);
        }
    }
}
