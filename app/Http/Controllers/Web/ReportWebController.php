<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CaseModel;
use App\Models\Incident;
use App\Models\Report;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportWebController extends Controller
{
    /**
     * Display a listing of the reports.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $isAdmin = $user->isAdmin();

        // Base query
        $query = Report::with('generatedBy');

        // Filter by user if not admin
        if (!$isAdmin && !$user->hasPermission('view_all_reports')) {
            $query->where('generated_by', $user->id);
        }

        // Filter by report type if provided
        if ($request->has('type')) {
            $query->where('report_type', $request->type);
        }

        // Paginate results
        $reports = $query->latest()->paginate(10);

        // Get available report types for filtering
        $reportTypes = Report::select('report_type')->distinct()->pluck('report_type');

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['type']),
            'reportTypes' => $reportTypes,
            'isAdmin' => $isAdmin,
            'canCreate' => $user->hasPermission('create_report'),
        ]);
    }

    /**
     * Show the form for creating a new report.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $this->authorize('create', Report::class);

        $user = Auth::user();
        $isAdmin = $user->isAdmin();

        // Define available report types based on user permissions
        $availableReportTypes = [
            'Incident Summary' => true,
            'Case Workload' => true,
            'Status Distribution' => true,
        ];

        // Admin-only report types
        if ($isAdmin || $user->hasPermission('view_sensitive_reports')) {
            $availableReportTypes['Geographic Distribution'] = true;
            $availableReportTypes['Incident Types Analysis'] = true;
            $availableReportTypes['Response Time Analysis'] = true;
        }

        return Inertia::render('Reports/Create', [
            'reportTypes' => $availableReportTypes,
        ]);
    }

    /**
     * Display the specified report.
     *
     * @param  \App\Models\Report  $report
     * @return \Inertia\Response
     */
    public function show(Report $report)
    {
        $this->authorize('view', $report);

        $user = Auth::user();
        $isAdmin = $user->isAdmin();

        // Load relationships
        $report->load('generatedBy');

        // Generate additional contextual data for the report
        $contextData = [];

        switch ($report->report_type) {
            case 'Incident Summary':
                $contextData = $this->getIncidentSummaryContext();
                break;

            case 'Case Workload':
                $contextData = $this->getCaseWorkloadContext();
                break;

            case 'Status Distribution':
                $contextData = $this->getStatusDistributionContext();
                break;

            // Additional report types...
        }

        return Inertia::render('Reports/Show', [
            'report' => $report,
            'contextData' => $contextData,
            'isAdmin' => $isAdmin,
            'canRegenerateReport' => $user->hasPermission('create_report'),
        ]);
    }

    /**
     * Get contextual data for Incident Summary report.
     *
     * @return array
     */
    private function getIncidentSummaryContext(): array
    {
        $totalIncidents = Incident::count();
        $recentTrend = Incident::whereDate('created_at', '>=', now()->subDays(30))->count();
        $prevPeriodCount = Incident::whereDate('created_at', '>=', now()->subDays(60))
            ->whereDate('created_at', '<', now()->subDays(30))
            ->count();

        $percentChange = $prevPeriodCount > 0
            ? (($recentTrend - $prevPeriodCount) / $prevPeriodCount) * 100
            : 0;

        return [
            'totalIncidents' => $totalIncidents,
            'recentTrend' => $recentTrend,
            'percentChange' => round($percentChange, 1),
            'trending' => $percentChange >= 0 ? 'up' : 'down',
        ];
    }

    /**
     * Get contextual data for Case Workload report.
     *
     * @return array
     */
    private function getCaseWorkloadContext(): array
    {
        $openCases = CaseModel::open()->count();
        $totalCaseworkers = User::whereHas('roles', function($q) {
            $q->where('name', 'Caseworker');
        })->count();

        $averageWorkload = $totalCaseworkers > 0 ? round($openCases / $totalCaseworkers, 1) : 0;

        $highWorkloadUsers = User::withCount(['assignedCases as open_cases' => function ($query) {
            $query->open();
        }])
            ->having('open_cases', '>', $averageWorkload * 1.5)
            ->orderByDesc('open_cases')
            ->take(5)
            ->get(['id', 'name', 'open_cases']);

        return [
            'openCases' => $openCases,
            'totalCaseworkers' => $totalCaseworkers,
            'averageWorkload' => $averageWorkload,
            'highWorkloadUsers' => $highWorkloadUsers,
        ];
    }

    /**
     * Get contextual data for Status Distribution report.
     *
     * @return array
     */
    private function getStatusDistributionContext(): array
    {
        $statuses = Status::withCount(['cases', 'incidents'])->get();

        return [
            'statuses' => $statuses,
            'totalStatuses' => $statuses->count(),
        ];
    }
}
