<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\CaseModel;
use App\Models\Incident;
use App\Models\Report;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin and caseworkers who can generate reports
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', [RoleName::ADMIN->value, RoleName::CASE_WORKER]);
        })->get();

        // Report types
        $reportTypes = [
            'Incident Summary',
            'Case Workload',
            'Status Distribution',
            'Geographic Distribution',
            'Incident Types Analysis',
            'Response Time Analysis',
        ];

        // Generate 15 reports over the last 3 months
        $startDate = Carbon::now()->subMonths(3);
        $endDate = Carbon::now();

        for ($i = 1; $i <= 15; $i++) {
            $reportType = $reportTypes[array_rand($reportTypes)];
            $generatedDate = Carbon::createFromTimestamp(
                rand($startDate->timestamp, $endDate->timestamp)
            );

            // Generate report data based on type
            $reportData = $this->generateReportData($reportType);

            Report::create([
                'generated_by' => $users->random()->id,
                'report_type' => $reportType,
                'report_data' => $reportData,
                'created_at' => $generatedDate,
                'updated_at' => $generatedDate,
            ]);
        }
    }

private function generateReportData($reportType)
{
    switch ($reportType) {
        case 'Incident Summary':
            return [
                'total_incidents' => Incident::count(),
                'pending_incidents' => Incident::whereHas('status', function ($q) {
                    $q->where('name', 'Pending');
                })->count(),
                'resolved_incidents' => Incident::whereHas('status', function ($q) {
                    $q->where('name', 'Resolved');
                })->count(),
                'monthly_trend' => [
                    'Jan' => rand(5, 15),
                    'Feb' => rand(8, 18),
                    'Mar' => rand(10, 20),
                    'Apr' => rand(7, 17),
                    'May' => rand(9, 19),
                    'Jun' => rand(11, 21),
                ],
            ];

        case 'Case Workload':
            return [
                'total_cases' => CaseModel::count(),
                'open_cases' => CaseModel::whereHas('status', function ($q) {
                    $q->where('name', '!=', 'Closed');
                })->count(),
                'cases_per_worker' => $this->generateCasesPerWorker(),
                'average_resolution_days' => rand(14, 30),
            ];

        case 'Status Distribution':
            return $this->generateStatusDistribution();

        case 'Geographic Distribution':
            return [
                'locations' => [
                    'Downtown Area' => rand(5, 15),
                    'North Park' => rand(3, 12),
                    'West End' => rand(4, 10),
                    'South Side' => rand(6, 14),
                    'East Village' => rand(2, 8),
                    'Other' => rand(5, 10),
                ],
                'high_risk_areas' => [
                    'Downtown Area',
                    'South Side',
                ],
            ];

        case 'Incident Types Analysis':
            return [
                'types' => [
                    'Verbal harassment' => rand(15, 25),
                    'Stalking' => rand(5, 15),
                    'Discrimination' => rand(10, 20),
                    'Unwanted contact' => rand(8, 18),
                    'Property damage' => rand(3, 10),
                    'Online threats' => rand(7, 17),
                    'Other' => rand(5, 15),
                ],
                'recommendations' => [
                    'Increase awareness training in high-incident areas',
                    'Develop specific resources for most common incident types',
                    'Establish additional reporting channels for vulnerable populations',
                ],
            ];

        case 'Response Time Analysis':
            return [
                'average_response_time' => rand(24, 72) . ' hours',
                'target_response_time' => '48 hours',
                'compliance_rate' => rand(70, 95) . '%',
                'improvement_areas' => [
                    'Weekend coverage',
                    'High-volume periods',
                    'Complex cases requiring specialized resources',
                ],
            ];

        default:
            return [
                'summary' => 'Generic report data',
                'generated_on' => now()->format('Y-m-d'),
            ];
    }
}

    private function generateCasesPerWorker()
    {
        $caseworkers = User::whereHas('roles', function ($query) {
            $query->where('name', RoleName::CASE_WORKER);
        })->get(['id', 'name']);

        $workloadData = [];

        foreach ($caseworkers as $caseworker) {
            $workloadData[$caseworker->name] = rand(3, 12);
        }

        return $workloadData;
    }

    private function generateStatusDistribution()
    {
        $statuses = Status::all();
        $distribution = [];

        foreach ($statuses as $status) {
            $distribution[$status->name] = rand(3, 15);
        }

        return [
            'case_status' => array_filter($distribution, function ($key) {
                return in_array($key, ['Open', 'In Progress', 'Pending Review', 'Pending External', 'Resolved', 'Closed']);
            }, ARRAY_FILTER_USE_KEY),

            'incident_status' => array_filter($distribution, function ($key) {
                return in_array($key, ['Reported', 'Pending', 'Under Investigation', 'Verified', 'Resolved']);
            }, ARRAY_FILTER_USE_KEY),
        ];
    }
}
