<?php

namespace App\Http\Requests\Incident;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncidentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Either the user is the survivor who reported the incident
        // or they have permission to update incidents
//        return $this->incident->survivor_id === auth()->id() ||
//            auth()->user()->hasPermission('update_incident');
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'description' => 'sometimes|required|string|min:10|max:2000',
            'location' => 'sometimes|required|string|max:255',
        ];

        // Only allow status updates for users with permission
        if (auth()->user()->hasPermission('update_incident')) {
            $rules['status_id'] = 'sometimes|required|exists:statuses,id';
        }

        return $rules;
    }
}
