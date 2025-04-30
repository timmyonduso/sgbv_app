<?php

namespace App\Http\Requests\Case;

use Illuminate\Foundation\Http\FormRequest;

class StoreCaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
//        return $this->user()->hasPermission('create_case');
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'incident_id' => 'required|exists:incidents,id|unique:cases,incident_id',
            'assigned_to' => 'required|exists:users,id',
            'status_id' => 'required|exists:statuses,id',
            'resolution_notes' => 'nullable|string|max:1000',
        ];
    }
}
