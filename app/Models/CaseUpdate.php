<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CaseUpdate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'case_id',
        'updated_by',
        'update_notes'
    ];

    // Relationships
    public function case(): BelongsTo
    {
        return $this->belongsTo(CaseModel::class);
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
