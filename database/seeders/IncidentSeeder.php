<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Incident;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IncidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all survivors
        $survivors = User::whereHas('roles', function ($query) {
            $query->where('name', RoleName::SURVIVOR);
        })->get();

        // Get relevant statuses
// Get relevant statuses - update to use prefixed names
        $statuses = Status::whereIn('name', [
            'Incident: Reported',
            'Incident: Pending',
            'Incident: Under Investigation',
            'Incident: Verified',
            'Incident: Resolved'
        ])->get();

        // Common locations
        $locations = [
            'Downtown Area, Metro City',
            'North Park, Metro City',
            'West End, Metro City',
            'South Side, Metro City',
            'East Village, Metro City',
            'Central Park, Metro City',
            'Riverside District, Metro City',
            'University Campus, Metro City',
            'Harbor View, Metro City',
            'Suburban Heights, Metro County',
        ];

        // Incident descriptions
        $descriptions = [
            'Verbal harassment occurred while walking home from work.',
            'Followed by an unknown individual for several blocks.',
            'Experienced discriminatory comments in a public setting.',
            'Unwanted contact in a crowded area.',
            'Property damage to personal belongings.',
            'Threatening messages received online.',
            'Intimidation by a group of individuals.',
            'Unwanted attention that escalated to verbal threats.',
            'Identity-based harassment at a community event.',
            'Privacy violation involving personal information.',
            'Public humiliation involving discriminatory language.',
            'Targeted because of religious attire.',
            'Threatening behavior in a residential setting.',
            'Physical space invaded repeatedly despite requests to stop.',
            'Intimidation while using public transportation.',
        ];

        // Generate 40 incidents with timestamps spread over the last 6 months
        $startDate = Carbon::now()->subMonths(6);
        $endDate = Carbon::now();

        for ($i = 1; $i <= 40; $i++) {
            $createdDate = Carbon::createFromTimestamp(
                rand($startDate->timestamp, $endDate->timestamp)
            );

            Incident::create([
                'survivor_id' => $survivors->random()->id,
                'status_id' => $statuses->random()->id,
                'description' => $descriptions[array_rand($descriptions)],
                'location' => $locations[array_rand($locations)],
                'created_at' => $createdDate,
                'updated_at' => $createdDate->copy()->addDays(rand(0, 7)),
            ]);
        }
    }
}
