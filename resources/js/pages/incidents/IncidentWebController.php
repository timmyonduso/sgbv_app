<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Incident\StoreIncidentRequest;
use App\Http\Requests\Incident\UpdateIncidentRequest;
use App\Models\Incident;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncidentWebController extends Controller
{
    /**
     * Display the incident reporting form.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('incidents/create');
    }

    /**
     * Store a newly created incident in storage.
     *
     * @param  \App\Http\Requests\Incident\StoreIncidentRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreIncidentRequest $request)
    {
        // Get the "Reported" status
        $reportedStatus = Status::where('name', 'Incident: Reported')->first();

        if (!$reportedStatus) {
            // Fallback to "Pending" if "Reported" doesn't exist
            $reportedStatus = Status::where('name', 'Incident: Pending')->firstOrFail();
        }

        // Create the incident with the authenticated user as the survivor
        $incident = Incident::create([
            'survivor_id' => Auth::id(),
            'status_id' => $reportedStatus->id,
            'description' => $request->description,
            'location' => $request->location
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Incident reported successfully. A case worker will be assigned to your case shortly.');
    }

    /**
     * Display a listing of the incidents for the authenticated user.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $incidents = Incident::where('survivor_id', Auth::id())
            ->with(['status', 'case', 'case.status'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('incidents/index', [
            'incidents' => $incidents
        ]);
    }

    /**
     * Display the specified incident.
     *
     * @param  \App\Models\Incident  $incident
     * @return \Inertia\Response
     */
    public function show(Incident $incident)
    {
        // Ensure the user can only view their own incidents
        if ($incident->survivor_id !== Auth::id() && !Auth::user()->hasPermission('view_all_incidents')) {
            abort(403, 'Unauthorized action.');
        }

        $incident->load(['status', 'case', 'case.status', 'case.updates', 'case.updates.updatedBy']);

        return Inertia::render('incidents/show', [
            'incident' => $incident
        ]);
    }

    /**
     * Show the form for editing the specified incident.
     *
     * @param  \App\Models\Incident  $incident
     * @return \Inertia\Response
     */
    public function edit(Incident $incident)
    {
        // Ensure the user can only edit their own incidents
        if ($incident->survivor_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Incidents/Edit', [
            'incident' => $incident
        ]);
    }

    /**
     * Update the specified incident in storage.
     *
     * @param  \App\Http\Requests\Incident\UpdateIncidentRequest  $request
     * @param  \App\Models\Incident  $incident
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateIncidentRequest $request, Incident $incident)
    {
        // Ensure the user can only update their own incidents
        if ($incident->survivor_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $incident->update($request->validated());

        return redirect()->route('incidents.show', $incident)
            ->with('success', 'Incident updated successfully.');
    }
}
