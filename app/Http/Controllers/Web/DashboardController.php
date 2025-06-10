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
        $user = auth()->user();

        // Base data needed for all dashboards
        $metrics = $this->getMetrics();
        $recentIncidents = $this->getRecentIncidents();
        $caseWorkload = $this->getCaseWorkload();
        $incidentStatusDistribution = $this->getIncidentStatusDistribution();
        $caseStatusDistribution = $this->getCaseStatusDistribution();

        // Role-specific data
        $roleSpecificData = $this->getRoleSpecificData($user);

        return Inertia::render('dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles()->select('name')->get(),
            ],
            'metrics' => $metrics,
            'recentIncidents' => $recentIncidents,
            'caseWorkload' => $caseWorkload,
            'incidentStatusDistribution' => $incidentStatusDistribution,
            'caseStatusDistribution' => $caseStatusDistribution,
            ...$roleSpecificData
        ]);
    }

    private function getRoleSpecificData(User $user)
    {
        $userRole = $user->roles()->first()?->name;

        switch ($userRole) {
            case RoleName::ADMIN->value:
                return $this->getAdminData();

            case RoleName::CASE_WORKER:
                return $this->getCaseworkerData($user);

            case RoleName::SURVIVOR:
                return $this->getSurvivorData($user);

            case RoleName::LAW_ENFORCEMENT:
                return $this->getLawEnforcementData($user);

            default:
                return $this->getSurvivorData($user);
        }
    }

    private function getAdminData()
    {
        // Mock data for pending approvals - you can implement this based on your needs
        $pendingApprovals = [
            ['title' => 'New User Registration', 'date' => '2 hours ago'],
            ['title' => 'Case Assignment Request', 'date' => '4 hours ago'],
            ['title' => 'System Access Request', 'date' => '1 day ago'],
        ];

        // Mock system logs - implement based on your audit/logging system
        $systemLogs = [
            ['action' => 'User Login', 'user' => 'John Doe', 'timestamp' => now()],
            ['action' => 'Case Created', 'user' => 'Jane Smith', 'timestamp' => now()->subHours(2)],
        ];

        return [
            'pendingApprovals' => $pendingApprovals,
            'systemLogs' => $systemLogs,
        ];
    }

    private function getCaseworkerData(User $user)
    {
        // Personal workload for the caseworker
        $openCases = CaseModel::where('assigned_to', $user->id)->open()->count();
        $closedCasesThisMonth = CaseModel::where('assigned_to', $user->id)
            ->closed()
            ->whereMonth('updated_at', now()->month)
            ->count();

        $pendingIncidents = Incident::whereDoesntHave('case')->count();

        // Calculate average response time for this caseworker
        $avgResponseTime = $this->getCaseworkerAvgResponseTime($user->id);

        $personalWorkload = [
            'open_cases' => $openCases,
            'closed_cases' => $closedCasesThisMonth,
            'pending_incidents' => $pendingIncidents,
            'avg_response_time' => $avgResponseTime,
        ];

        // Get caseworker's cases with priority (you may need to add priority field to your model)
        $userCases = CaseModel::where('assigned_to', $user->id)
            ->with(['incident.survivor', 'status'])
            ->get()
            ->map(function($case) {
                return [
                    'id' => $case->id,
                    'title' => "Case #{$case->id} - " . ($case->incident->description ?? 'N/A'),
                    'survivor_name' => $case->incident->survivor->name ?? 'Anonymous',
                    'priority' => $this->determineCasePriority($case), // You'll need to implement this
                    'status' => str_replace('Case: ', '', $case->status->name),
                    'progress' => $this->calculateCaseProgress($case), // You'll need to implement this
                    'updated_at' => $case->updated_at->format('M d, Y'),
                ];
            });

        return [
            'personalWorkload' => $personalWorkload,
            'userCases' => $userCases,
        ];
    }

    private function getSurvivorData(User $user)
    {
        // Get survivor's cases
        $userCases = CaseModel::whereHas('incident', function($q) use ($user) {
            $q->where('survivor_id', $user->id);
        })
            ->with(['incident', 'status', 'assignedTo'])
            ->get()
            ->map(function($case) {
                return [
                    'id' => $case->id,
                    'incident_id' => $case->incident_id,
                    'assigned_to' => $case->assigned_to,
                    'status_id' => $case->status_id,
                    'status' => str_replace('Case: ', '', $case->status->name),
                    'title' => "Case #{$case->id}",
                    'progress' => $this->calculateCaseProgress($case),
                    'updated_at' => $case->updated_at->format('M d, Y'),
                    'resolution_notes' => $case->resolution_notes,
                    'created_at' => $case->created_at->format('M d, Y'),
                ];
            });

        // Get assigned caseworker (from the first case)
        $assignedCaseworker = null;
        if ($userCases->isNotEmpty()) {
            $firstCase = CaseModel::whereHas('incident', function($q) use ($user) {
                $q->where('survivor_id', $user->id);
            })->with('assignedTo')->first();

            if ($firstCase && $firstCase->assignedTo) {
                $assignedCaseworker = [
                    'id' => $firstCase->assignedTo->id,
                    'name' => $firstCase->assignedTo->name,
                    'email' => $firstCase->assignedTo->email,
                    'phone' => $firstCase->assignedTo->phone ?? null, // Add phone field to User model if needed
                ];
            }
        }

        return [
            'userCases' => $userCases,
            'assignedCaseworker' => $assignedCaseworker,
        ];
    }

    private function getLawEnforcementData(User $user)
    {
        // Get incidents under investigation
        $investigationIncidents = Incident::whereHas('status', function($q) {
            $q->where('name', 'Incident: Under Investigation');
        })
            ->with(['survivor', 'status'])
            ->get()
            ->map(function($incident) {
                return [
                    'id' => $incident->id,
                    'status' => str_replace('Incident: ', '', $incident->status->name),
                    'description' => $incident->description,
                    'survivor_name' => $incident->survivor->name ?? 'Anonymous',
                    'created_at' => $incident->created_at->format('M d, Y'),
                    'assigned_caseworker_id' => $incident->case?->assigned_to,
                ];
            });

        return [
            'investigationIncidents' => $investigationIncidents,
        ];
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
            'avg_response_time' => round($avgResponseTime ?? 0, 1),
        ];
    }

    private function getRecentIncidents()
    {
        return Incident::with(['survivor', 'status'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($incident) {
                return [
                    'id' => $incident->id,
                    'survivor_id' => $incident->survivor_id,
                    'survivor_name' => $incident->survivor?->name ?? 'Anonymous',
                    'description' => $incident->description,
                    'location' => $incident->location,
                    'location_address' => $incident->location_address,
                    'status' => str_replace('Incident: ', '', $incident->status->name),
                    'created_at' => $incident->created_at->format('M d, Y'),
                    'updated_at' => $incident->updated_at->format('M d, Y'),
                    'has_case' => $incident->case()->exists(),
                    'assigned_caseworker_id' => $incident->case?->assigned_to ?? null,
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
        $statuses = Status::where('name', 'like', 'Incident:%')->get();
        $distribution = [];

        foreach ($statuses as $status) {
            $count = Incident::where('status_id', $status->id)->count();
            $distribution[] = [
                'status' => str_replace('Incident: ', '', $status->name),
                'count' => $count,
            ];
        }

        return $distribution;
    }

    private function getCaseStatusDistribution()
    {
        $statuses = Status::where('name', 'like', 'Case:%')->get();
        $distribution = [];

        foreach ($statuses as $status) {
            $count = CaseModel::where('status_id', $status->id)->count();
            $distribution[] = [
                'status' => str_replace('Case: ', '', $status->name),
                'count' => $count,
            ];
        }

        return $distribution;
    }

    private function getCaseworkerAvgResponseTime($caseworkerId)
    {
        $avgResponseTime = Incident::whereHas('case', function($q) use ($caseworkerId) {
            $q->where('assigned_to', $caseworkerId);
        })
            ->with('case')
            ->get()
            ->map(function($incident) {
                $incidentDate = Carbon::parse($incident->created_at);
                $caseDate = Carbon::parse($incident->case->created_at);
                return $incidentDate->diffInDays($caseDate);
            })
            ->avg();

        return round($avgResponseTime ?? 0, 1);
    }

    // Helper methods you'll need to implement based on your business logic
    private function determineCasePriority($case)
    {
        // Implement logic to determine case priority
        // This could be based on case age, incident type, survivor vulnerability, etc.
        $daysOld = Carbon::parse($case->created_at)->diffInDays(now());

        if ($daysOld > 30) return 'high';
        if ($daysOld > 14) return 'medium';
        return 'low';
    }

    private function calculateCaseProgress($case)
    {
        // Implement logic to calculate case progress percentage
        // This could be based on case updates, status, time elapsed, etc.
        $statusProgressMap = [
            'Case: Open' => 10,
            'Case: In Progress' => 50,
            'Case: Pending Review' => 80,
            'Case: Resolved' => 100,
            'Case: Closed' => 100,
        ];

        return $statusProgressMap[$case->status->name] ?? 0;
    }
}
