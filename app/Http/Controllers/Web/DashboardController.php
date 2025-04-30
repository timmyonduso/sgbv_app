<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CaseModel;
use App\Models\Incident;
use App\Models\User;
use App\Models\Status;
use App\Enums\RoleName;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get metrics for the dashboard
        $metrics = $this->getMetrics();

        // Get recent incidents
        $recentIncidents = $this->getRecentIncidents();

        // Get case workload distribution
        $caseWorkload = $this->getCaseWorkload();

        // Get incident status distribution
        $incidentStatusDistribution = $this->getIncidentStatusDistribution();

        // Get case status distribution
        $caseStatusDistribution = $this->getCaseStatusDistribution();

        // Return the view with the data
        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'recentIncidents' => $recentIncidents,
            'caseWorkload' => $caseWorkload,
            'incidentStatusDistribution' => $incidentStatusDistribution,
            'caseStatusDistribution' => $caseStatusDistribution,
        ]);
    }

    private function getMetrics()
    {
        $totalIncidents = Incident::count();
        $totalCases = CaseModel::count();
        $openCases = CaseModel::open()->count();
        $pendingIncidents = Incident::pending()->count();
        $caseworkerCount = User::whereHas('roles', function($q) {
            $q->where('name', RoleName::CASE_WORKER);
        })->count();
        $survivorCount = User::whereHas('roles', function($q) {
            $q->where('name', RoleName::SURVIVOR);
        })->count();

        // Calculate average response time (days between incident creation and case creation)
        $avgResponseTime = Incident::whereHas('case')
            ->with('case')
            ->get()
            ->map(function($incident) {
                $incidentDate = Carbon::parse($incident->created_at);
                $caseDate = Carbon::parse($incident->case->created_at);
                return $incidentDate->diffInDays($caseDate);
            })
            ->avg();

        return [
            'total_incidents' => $totalIncidents,
            'total_cases' => $totalCases,
            'open_cases' => $openCases,
            'pending_incidents' => $pendingIncidents,
            'caseworker_count' => $caseworkerCount,
            'survivor_count' => $survivorCount,
            'avg_response_time' => round($avgResponseTime, 1),
        ];
    }

    private function getRecentIncidents()
    {
        return Incident::with(['survivor', 'status'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($incident) {
                return [
                    'id' => $incident->id,
                    'survivor_name' => $incident->survivor?->name ?? 'Anonymous',
                    'description' => $incident->description,
                    'location' => $incident->location,
                    'status' => str_replace('Incident: ', '', $incident->status->name), // Remove prefix for display
                    'created_at' => $incident->created_at->format('Y-m-d H:i'),
                    'has_case' => $incident->case()->exists(),
                ];
            });
    }

    private function getCaseWorkload()
    {
        $caseworkers = User::whereHas('roles', function($q) {
            $q->where('name', RoleName::CASE_WORKER);
        })->get();

        $workload = [];

        foreach ($caseworkers as $caseworker) {
            $openCases = CaseModel::where('assigned_to', $caseworker->id)
                ->open()
                ->count();

            $closedCases = CaseModel::where('assigned_to', $caseworker->id)
                ->closed()
                ->count();

            $workload[] = [
                'caseworker_id' => $caseworker->id,
                'caseworker_name' => $caseworker->name,
                'open_cases' => $openCases,
                'closed_cases' => $closedCases,
                'total_cases' => $openCases + $closedCases,
            ];
        }

        return $workload;
    }

    private function getIncidentStatusDistribution()
    {
        // Get incident statuses with the new prefixed names
        $statuses = Status::where('name', 'like', 'Incident:%')->get();

        $distribution = [];

        foreach ($statuses as $status) {
            $count = Incident::where('status_id', $status->id)->count();

            $distribution[] = [
                'status' => str_replace('Incident: ', '', $status->name), // Remove prefix for display
                'count' => $count,
            ];
        }

        return $distribution;
    }

    private function getCaseStatusDistribution()
    {
        // Get case statuses with the new prefixed names
        $statuses = Status::where('name', 'like', 'Case:%')->get();

        $distribution = [];

        foreach ($statuses as $status) {
            $count = CaseModel::where('status_id', $status->id)->count();

            $distribution[] = [
                'status' => str_replace('Case: ', '', $status->name), // Remove prefix for display
                'count' => $count,
            ];
        }

        return $distribution;
    }
}
