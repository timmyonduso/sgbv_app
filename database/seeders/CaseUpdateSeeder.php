<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\CaseModel;
use App\Models\CaseUpdate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CaseUpdateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all cases
        $cases = CaseModel::all();

        // Get all users who can update cases (caseworkers, admin)
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', [RoleName::CASE_WORKER, RoleName::ADMIN]);
        })->get();

        // Update templates
        $updateNotes = [
            'Contacted survivor to check in on their well-being.',
            'Provided additional resources for community support.',
            'Scheduled follow-up meeting for next week.',
            'Received additional information from survivor regarding the incident.',
            'Updated safety plan based on new circumstances.',
            'Connected survivor with specialized counseling services.',
            'Coordinated with law enforcement for additional information.',
            'Documentation received and added to case file.',
            'Case review conducted with supervisor.',
            'Survivor reports improvement in situation.',
            'New concerns have emerged, addressing with revised plan.',
            'Support group referral made at survivor\'s request.',
            'Legal advocacy services contacted on behalf of survivor.',
            'Status update provided to survivor per protocol.',
            'Case approaching resolution, final steps in progress.',
        ];

        // For each case, create 0-5 updates
        foreach ($cases as $case) {
            $numUpdates = rand(0, 5);
            $caseCreatedDate = Carbon::parse($case->created_at);

            for ($i = 1; $i <= $numUpdates; $i++) {
                // Updates happen after case creation, spaced out by 1-7 days each
                $updateDate = $caseCreatedDate->copy()->addDays($i * rand(1, 7));

                // Don't create updates in the future
                if ($updateDate->isFuture()) {
                    continue;
                }

                CaseUpdate::create([
                    'case_id' => $case->id,
                    'updated_by' => $users->random()->id,
                    'update_notes' => $updateNotes[array_rand($updateNotes)],
                    'created_at' => $updateDate,
                    'updated_at' => $updateDate,
                ]);
            }
        }
    }
}
