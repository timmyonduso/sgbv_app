<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Carbon::now();

        $statuses = [
            // Case Statuses
            ['name' => 'Case: Open'],
            ['name' => 'Case: In Progress'],
            ['name' => 'Case: Pending Review'],
            ['name' => 'Case: Pending External'],
            ['name' => 'Case: Resolved'],
            ['name' => 'Case: Closed'],

            // Incident Statuses
            ['name' => 'Incident: Reported'],
            ['name' => 'Incident: Pending'],
            ['name' => 'Incident: Under Investigation'],
            ['name' => 'Incident: Verified'],
            ['name' => 'Incident: Resolved'],
            ['name' => 'Incident: Anonymous'],
        ];

        DB::table('statuses')->insert($statuses);
    }
}
