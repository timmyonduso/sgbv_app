<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Incident\StoreIncidentRequest;
use App\Http\Requests\Incident\UpdateIncidentRequest;
use App\Models\Incident;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class IncidentController extends Controller
{
    /**
     * Display a listing of the incidents.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Check if user has permission to view all incidents
        $query = Auth::user()->hasPermission('view_all_incidents')
            ? Incident::query()
            : Incident::where('survivor_id', Auth::id());

        // Include relationships
        if ($request->has('with')) {
            $relations = explode(',', $request->with);
            $allowedRelations = ['survivor', 'status', 'case', 'case.status'];
            $filteredRelations = array_intersect($allowedRelations, $relations);

            if (!empty($filteredRelations)) {
                $query->with($filteredRelations);
            }
        }

        // Apply filters
        if ($request->has('status')) {
            $query->whereHas('status', function($q) use ($request) {
                $q->where('name', $request->status);
            });
        }

        $incidents = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($incidents);
    }

    /**
     * Store a newly created incident in storage.
     *
     * @param  \App\Http\Requests\Incident\StoreIncidentRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreIncidentRequest $request): JsonResponse
    {
        // Get the "Reported" status
        $reportedStatus = Status::where('name', 'Reported')->first();

        if (!$reportedStatus) {
            // Fallback to "Pending" if "Reported" doesn't exist
            $reportedStatus = Status::where('name', 'Pending')->firstOrFail();
        }

        // Create the incident with the authenticated user as the survivor
        $incident = Incident::create([
            'survivor_id' => Auth::id(),
            'status_id' => $reportedStatus->id,
            'description' => $request->description,
            'location' => $request->location
        ]);

        return response()->json([
            'message' => 'Incident reported successfully',
            'incident' => $incident->load('status')
        ], 201);
    }

    /**
     * Display the specified incident.
     *
     * @param  \App\Models\Incident  $incident
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Incident $incident, Request $request): JsonResponse
    {
        // Ensure the user can only view their own incidents unless they have permission
        if ($incident->survivor_id !== Auth::id() && !Auth::user()->hasPermission('view_all_incidents')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Include relationships
        if ($request->has('with')) {
            $relations = explode(',', $request->with);
            $allowedRelations = ['survivor', 'status', 'case', 'case.status', 'case.updates'];
            $filteredRelations = array_intersect($allowedRelations, $relations);

            if (!empty($filteredRelations)) {
                $incident->load($filteredRelations);
            }
        }

        return response()->json($incident);
    }

    /**
     * Update the specified incident in storage.
     *
     * @param  \App\Http\Requests\Incident\UpdateIncidentRequest  $request
     * @param  \App\Models\Incident  $incident
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateIncidentRequest $request, Incident $incident): JsonResponse
    {
        // Ensure the user can only update their own incidents unless they have permission
        if ($incident->survivor_id !== Auth::id() && !Auth::user()->hasPermission('update_incident')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $incident->update($request->validated());

        return response()->json([
            'message' => 'Incident updated successfully',
            'incident' => $incident->fresh()
        ]);
    }

    /**
     * Remove the specified incident from storage.
     *
     * @param  \App\Models\Incident  $incident
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Incident $incident): JsonResponse
    {
        // Only allow deletion if user has permission
        if (!Auth::user()->hasPermission('delete_incident')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $incident->delete();

        return response()->json([
            'message' => 'Incident deleted successfully'
        ]);
    }
}
