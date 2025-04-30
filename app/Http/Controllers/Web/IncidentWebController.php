<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Incident\StoreIncidentRequest;
use App\Http\Requests\Incident\StoreAnonymousIncidentRequest;
use App\Http\Requests\Incident\UpdateIncidentRequest;
use App\Models\Incident;
use App\Models\Status;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
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
        return Inertia::render('incidents/create', [
            'googleMapsApiKey' => config('services.google_maps.api_key'),
            'authenticated' => Auth::check(),
        ]);
    }

    /**
     * Display the anonymous incident reporting form.
     *
     * @return \Inertia\Response
     */
    public function createAnonymous()
    {
        return Inertia::render('incidents/create-anonymous', [
            'googleMapsApiKey' => config('services.google_maps.api_key'),
        ]);
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
            'location' => $request->location,
            'location_address' => $request->location_address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return redirect()->route('incidents.show', $incident)
            ->with('success', 'Incident reported successfully. A case worker will be assigned to your case shortly.');
    }

    /**
     * Store a newly created anonymous incident in storage.
     *
     * @param  \App\Http\Requests\Incident\StoreAnonymousIncidentRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeAnonymous(StoreAnonymousIncidentRequest $request): RedirectResponse
    {
        // Get the "Anonymous" status
        $anonymousStatus = Status::where('name', 'Incident: Anonymous')->first();

        if (!$anonymousStatus) {
            // Fallback to "Reported" if "Anonymous" doesn't exist
            $anonymousStatus = Status::where('name', 'Incident: Reported')->first();

            if (!$anonymousStatus) {
                // Further fallback to "Pending" if "Reported" doesn't exist
                $anonymousStatus = Status::where('name', 'Incident: Pending')->firstOrFail();
            }
        }

        // Generate a unique tracking code
        $trackingCode = 'ANO-' . Str::upper(Str::random(8));

        // Create the anonymous incident without a survivor_id
        $incident = Incident::create([
            'survivor_id' => null, // No survivor ID for anonymous reports
            'status_id' => $anonymousStatus->id,
            'description' => $request->description,
            'location' => $request->location,
            'location_address' => $request->location_address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'tracking_code' => $trackingCode, // Add tracking code for anonymous follow-up
            'contact_info' => $request->contact_info, // Optional contact info if provided
        ]);

        return redirect()->route('dashboard')
            ->with([
                'tracking_code' => $trackingCode,
                'success' => 'Anonymous incident reported successfully. Please save your tracking code to check the status later.'
            ]);
    }


    /**
     * Track an anonymous incident by its tracking code.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function trackAnonymous(Request $request)
    {
        $request->validate([
            'tracking_code' => 'required|string'
        ]);

        $incident = Incident::where('tracking_code', $request->tracking_code)
            ->whereNull('survivor_id')
            ->with(['status', 'case', 'case.status'])
            ->first();

        if (!$incident) {
            return Inertia::render('incidents/track-anonymous', [
                'error' => 'Invalid tracking code. Please check and try again.'
            ]);
        }

        return Inertia::render('incidents/anonymous-status', [
            'incident' => $incident
        ]);
    }

    /**
     * Display the anonymous tracking form.
     *
     * @return \Inertia\Response
     */
    public function anonymousTracking()
    {
        return Inertia::render('incidents/track-anonymous', [
            'auth' => [
                'user' => null // Explicitly set auth.user to null
            ]
        ]);
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
            'incident' => $incident,
            'googleMapsApiKey' => config('services.google_maps.api_key'),
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
            'incident' => $incident,
            'googleMapsApiKey' => config('services.google_maps.api_key'),
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
