<?php

namespace App\Http\Requests\Case;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
//        return $this->user()->hasPermission('update_case');
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
            'assigned_to' => 'sometimes|required|exists:users,id',
            'status_id' => 'sometimes|required|exists:statuses,id',
            'resolution_notes' => 'nullable|string|max:1000',
        ];
    }
}
