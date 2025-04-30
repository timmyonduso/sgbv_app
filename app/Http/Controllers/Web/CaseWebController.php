<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CaseModel;
use App\Models\CaseUpdate;
use App\Models\Incident;
use App\Models\Status;
use App\Models\User;
use App\Http\Requests\Case\StoreCaseRequest;
use App\Http\Requests\Case\UpdateCaseRequest;
use App\Http\Requests\Case\StoreCaseUpdateRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CaseWebController extends Controller
{
    /**
     * Display a listing of cases.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Use consistent camelCase parameters
        $filters = [
            'status' => $request->input('status', 'all'),
            'assignedTo' => $request->input('assigned_to', 'all'), // Match the frontend parameter name
            'search' => $request->input('search')
        ];

        \Log::debug('Starting case index request', ['normalized_filters' => $filters]);

        // Make sure the with() loads the relationship correctly
        $query = CaseModel::with([
            'incident.survivor',
            'status',
            'assignedTo' => function($q) { // Use camelCase here
                $q->select('id', 'name'); // Explicitly select fields
            }
        ]);

        // Apply filters with normalized parameter names
        if ($filters['status'] && $filters['status'] !== 'all') {
            $query = $this->applyStatusFilter($query, $filters['status']);
        }

        if ($filters['assignedTo'] && $filters['assignedTo'] !== 'all') {
            $query = $this->applyAssignmentFilter($query, $filters['assignedTo']);
        }

        if ($filters['search']) {
            $query = $this->applySearchFilter($query, $filters['search']);
        }

        // Always apply permission filters
        $query = $this->applyPermissionFilters($query, $user);

        // Get paginated results
        $cases = $query->latest()->paginate(10);

        // Add verbose debugging
        \Log::debug('Final cases with relationships:', [
            'count' => $cases->count(),
            'sample_case_id' => $cases->first() ? $cases->first()->id : 'No cases',
            'has_relation_data' => $cases->first() && $cases->first()->assignedTo ? true : false,
            'first_relation_data' => $cases->first() && $cases->first()->assignedTo ?
                ['id' => $cases->first()->assignedTo->id, 'name' => $cases->first()->assignedTo->name] : 'No data'
        ]);

        // Explicitly add the relationship to the array to ensure it's included in the JSON
        $casesArray = $cases->toArray();
        foreach ($cases as $index => $case) {
            if ($case->assignedTo) {
                $casesArray['data'][$index]['assignedTo'] = [
                    'id' => $case->assignedTo->id,
                    'name' => $case->assignedTo->name
                ];
            } else {
                $casesArray['data'][$index]['assignedTo'] = null;
            }
        }

        // Now use the modified array instead of the original cases collection
        return Inertia::render('cases/index', [
            'cases' => $casesArray,
            'caseworkers' => $this->getCaseworkers(),
            'statuses' => $this->getCaseStatuses(),
            'filters' => $filters,
            'can' => [
                'create_case' => $user->hasPermission('create_case')
            ]
        ]);
    }

    /**
     * Display the specified case.
     *
     * @param \App\Models\CaseModel $case
     * @return \Inertia\Response
     */
    public function show(CaseModel $case)
    {
        // Load relationships needed for the case detail view
        $case->load([
            'incident.survivor',
            'status',
            'assignedTo',
            'updates.updatedBy' // Make sure to load the updatedBy relationship for each update
        ]);

        \Log::debug('Showing case details:', [
            'case_id' => $case->id,
            'incident_id' => $case->incident_id,
            'assigned_to' => $case->assigned_to,
            'status' => $case->status ? $case->status->name : 'No status',
            'updates_count' => $case->updates->count() // Log the number of updates for debugging
        ]);

        return Inertia::render('cases/show', [
            'case' => $case,
        ]);
    }

    /**
     * Export cases to PDF.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function exportPdf(Request $request)
    {
        $user = Auth::user();

        // Get the same filters used in the index method
        $filters = [
            'status' => $request->input('status', 'all'),
            'assignedTo' => $request->input('assigned_to', 'all'),
            'search' => $request->input('search')
        ];

        // Build query with the same logic as the index method
        $query = CaseModel::with([
            'incident.survivor',
            'status',
            'assignedTo' => function($q) {
                $q->select('id', 'name');
            }
        ]);

        // Apply the same filters
        if ($filters['status'] && $filters['status'] !== 'all') {
            $query = $this->applyStatusFilter($query, $filters['status']);
        }

        if ($filters['assignedTo'] && $filters['assignedTo'] !== 'all') {
            $query = $this->applyAssignmentFilter($query, $filters['assignedTo']);
        }

        if ($filters['search']) {
            $query = $this->applySearchFilter($query, $filters['search']);
        }

        // Apply permission filters
        $query = $this->applyPermissionFilters($query, $user);

        // Get all matching cases (no pagination for exports)
        $cases = $query->latest()->get();

        // Generate PDF using a view
        $pdf = PDF::loadView('exports.cases-pdf', [
            'cases' => $cases,
            'filters' => $filters,
            'exportDate' => now()->format('Y-m-d H:i:s'),
            'exportedBy' => $user->name
        ]);

        // Set paper size and orientation
        $pdf->setPaper('a4', 'landscape');

        // Return the PDF as a download
        return $pdf->download('cases-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Apply status filter to the query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|int|null $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function applyStatusFilter($query, $status)
    {
        \Log::debug('Status filter received:', ['status' => $status]);

        // Only apply filter if status is explicitly provided and not 'all'
        if (!$status || $status === 'all') {
            \Log::debug('No status filter applied - using all statuses');
            return $query;
        }

        if ($status === 'open') {
            \Log::debug('Applying open status filter');
            $query = $query->open();
            // Debug the SQL query after applying the filter
            \Log::debug('SQL after open filter: ' . $query->toSql(), ['bindings' => $query->getBindings()]);
            return $query;
        }

        if ($status === 'closed') {
            \Log::debug('Applying closed status filter');
            $query = $query->closed();
            \Log::debug('SQL after closed filter: ' . $query->toSql(), ['bindings' => $query->getBindings()]);
            return $query;
        }

        if (is_numeric($status)) {
            \Log::debug('Applying numeric status filter', ['status_id' => (int)$status]);
            // Verify the status ID exists
            $statusExists = Status::where('id', (int)$status)->exists();
            \Log::debug('Status ID exists in database?', ['exists' => $statusExists]);

            if ($statusExists) {
                $query = $query->where('status_id', (int)$status);
                \Log::debug('SQL after specific status filter: ' . $query->toSql(), ['bindings' => $query->getBindings()]);
                return $query;
            } else {
                \Log::warning('Invalid status ID provided - filter ignored', ['status_id' => (int)$status]);
                return $query;
            }
        }

        \Log::debug('No matching status filter condition - returning original query');
        return $query;
    }

    /**
     * Apply assignment filter to the query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|int|null $assignedTo
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function applyAssignmentFilter($query, $assignedTo)
    {
        \Log::debug('Assignment filter received:', ['assignedTo' => $assignedTo]);

        if (!$assignedTo || $assignedTo === 'all') {
            \Log::debug('No assignment filter applied - showing all assignments');
            return $query;
        }

        \Log::debug('Applying assignment filter for user ID:', ['user_id' => (int)$assignedTo]);

        // Verify the user exists
        $userExists = User::where('id', (int)$assignedTo)->exists();
        \Log::debug('User exists check:', ['exists' => $userExists, 'id' => (int)$assignedTo]);

        if ($userExists) {
            return $query->where('assigned_to', (int)$assignedTo);
        }

        \Log::debug('Invalid user ID - skipping filter');
        return $query;
    }
    /**
     * Apply search filter to the query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function applySearchFilter($query, $search)
    {
        \Log::debug('Search filter received:', ['search' => $search]);

        if (!$search) {
            \Log::debug('No search filter applied');
            return $query;
        }

        \Log::debug('Applying search filter');
        $query = $query->where(function($q) use ($search) {
            $q->whereHas('incident', function($subq) use ($search) {
                $subq->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            })
                ->orWhereHas('incident.survivor', function($subq) use ($search) {
                    $subq->where('name', 'LIKE', "%{$search}%");
                });
        });

        \Log::debug('SQL after search filter: ' . $query->toSql(), ['bindings' => $query->getBindings()]);
        return $query;
    }

    /**
     * Apply permission-based filters to the query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function applyPermissionFilters($query, $user)
    {
        \Log::debug('User permissions check:', [
            'user_id' => $user->id,
            'has_view_all_permission' => $user->hasPermission('view_all_cases')
        ]);

        if (!$user->hasPermission('view_all_cases')) {
            \Log::debug('Restricting cases to user\'s survivor records only');
            $query = $query->whereHas('incident', function($q) use ($user) {
                $q->where('survivor_id', $user->id);
            });
            \Log::debug('SQL after permission filter: ' . $query->toSql(), ['bindings' => $query->getBindings()]);
        } else {
            \Log::debug('User has view_all_cases permission - no restriction applied');
        }

        return $query;
    }

    /**
     * Get caseworkers for dropdown
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    protected function getCaseworkers()
    {
        $caseworkers = User::whereHas('roles', function($q) {
            $q->where('name', 'caseworker');
        })->get(['id', 'name']);

        \Log::debug('Caseworkers loaded for dropdown:', [
            'count' => $caseworkers->count(),
            'sample' => $caseworkers->take(3)->pluck('name', 'id')
        ]);

        return $caseworkers;
    }

    /**
     * Get case statuses for dropdown
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    protected function getCaseStatuses()
    {
        $statuses = Status::caseStatuses()->get();

        \Log::debug('Case statuses loaded for dropdown:', [
            'count' => $statuses->count(),
            'statuses' => $statuses->pluck('name', 'id')
        ]);

        return $statuses;
    }

    /**
     * Debug the assignedTo relationship issue
     *
     * @param \Illuminate\Database\Eloquent\Collection $cases
     */
    protected function debugAssignedToRelationship($cases)
    {
        if ($cases->isEmpty()) {
            \Log::debug('No cases found for relationship debugging');
            return;
        }

        // Sample case debugging
        $sampleCase = $cases->first();
        \Log::debug('Sample case data:', [
            'id' => $sampleCase->id,
            'assigned_to_id' => $sampleCase->assigned_to,
            'has_assignedTo_relation' => isset($sampleCase->assignedTo),
            'assignedTo_data' => $sampleCase->assignedTo
        ]);

        // Check for valid user IDs
        $userIds = CaseModel::pluck('assigned_to')->filter()->unique();
        $validUserIds = User::whereIn('id', $userIds)->pluck('id');
        \Log::debug('User ID validation:', [
            'unique_assigned_ids' => $userIds->toArray(),
            'valid_user_ids' => $validUserIds->toArray(),
            'missing_ids' => $userIds->diff($validUserIds)->toArray()
        ]);

        // Direct relationship check
        if ($sampleCase->assigned_to) {
            $assignedUser = User::find($sampleCase->assigned_to);
            \Log::debug('Direct relationship check:', [
                'case_assigned_to_id' => $sampleCase->assigned_to,
                'assigned_user_exists' => $assignedUser ? true : false,
                'assigned_user' => $assignedUser ? $assignedUser->toArray() : null
            ]);
        }
    }
    /**
     * Show the form for creating a new case.
     */
    public function create()
    {
        // Check permission
        if (!Auth::user()->hasPermission('create_case')) {
            abort(403);
        }

        // Get available incidents without cases
        $incidents = Incident::doesntHave('case')
            ->with('survivor')
            ->latest()
            ->get();

        // Get available caseworkers
        $caseworkers = User::whereHas('roles', function($q) {
            $q->where('name', 'case_worker');
        })->get(['id', 'name']);

        // Get initial case statuses
        $statuses = Status::whereIn('name', [
            'Case: Open',
            'Case: In Progress',
            'Case: Pending Review',
            'Case: Pending External'
        ])->get();

        return Inertia::render('cases/create', [
            'incidents' => $incidents,
            'caseworkers' => $caseworkers,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Store a newly created case in storage.
     */
    public function store(StoreCaseRequest $request)
    {
        // Check permission
        if (!Auth::user()->hasPermission('create_case')) {
            abort(403);
        }

        $case = CaseModel::create($request->validated());

        return redirect()->route('cases.show', $case->id)
            ->with('success', 'Case created successfully');
    }

    /**
     * Show the form for editing the specified case.
     */
    public function edit(CaseModel $case)
    {
        // Check permission
        if (!Auth::user()->hasPermission('update_case')) {
            abort(403);
        }

        $case->load(['incident.survivor', 'assignedTo', 'status']);

        // Get all case statuses
        $statuses = Status::where('name', 'LIKE', 'Case:%')->get();

        // Get caseworkers
        $caseworkers = User::whereHas('roles', function($q) {
            $q->where('name', 'caseworker');
        })->get(['id', 'name']);

        return Inertia::render('cases/edit', [
            'case' => $case,
            'statuses' => $statuses,
            'caseworkers' => $caseworkers,
        ]);
    }

    /**
     * Update the specified case in storage.
     */
    public function update(UpdateCaseRequest $request, CaseModel $case)
    {
        // Check permission
        if (!Auth::user()->hasPermission('update_case')) {
            abort(403);
        }

        $case->update($request->validated());

        return redirect()->route('cases.show', $case->id)
            ->with('success', 'Case updated successfully');
    }

    /**
     * Remove the specified case from storage.
     */
    public function destroy(CaseModel $case)
    {
        // Check permission
        if (!Auth::user()->hasPermission('delete_case')) {
            abort(403);
        }

        $case->delete();

        return redirect()->route('cases.index')
            ->with('success', 'Case deleted successfully');
    }

    /**
     * Add an update to a case.
     */
    public function addUpdate(StoreCaseUpdateRequest $request, CaseModel $case)
    {
        // Check permission
        if (!Auth::user()->hasPermission('update_case')) {
            abort(403);
        }

        CaseUpdate::create([
            'case_id' => $case->id,
            'updated_by' => Auth::id(),
            'update_notes' => $request->update_notes,
        ]);

        return redirect()->route('cases.show', $case->id)
            ->with('success', 'Case update added successfully');
    }

    /**
     * Assign a case to a caseworker.
     */
    public function assign(Request $request, CaseModel $case)
    {
        // Check permission
        if (!Auth::user()->hasPermission('assign_case')) {
            abort(403);
        }

        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $case->update([
            'assigned_to' => $validated['assigned_to'],
        ]);

        return redirect()->route('cases.show', $case->id)
            ->with('success', 'Case assigned successfully');
    }
}
