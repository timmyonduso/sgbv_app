<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CaseModel extends Model
{
    use SoftDeletes;

    // Explicitly set table name to avoid reserved keyword issues
    protected $table = 'cases';

    protected $fillable = [
        'incident_id',
        'assigned_to',
        'status_id',
        'resolution_notes'
    ];

    // Relationships
    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to', 'id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(CaseUpdate::class, 'id');
    }

    // Scopes
//    public function scopeOpen($query)
//    {
//        return $query->whereHas('status', function($q) {
//            $q->where('name', 'Open');
//        });
//    }

    // In CaseModel.php
    public function scopeOpen($query)
    {
        return $query->whereHas('status', function($q) {
            $q->whereIn('name', [
                'Case: Open',
                'Case: In Progress',
                'Case: Pending Review',
                'Case: Pending External'
            ]);
        });
    }

    public function scopeClosed($query)
    {
        return $query->whereHas('status', function($q) {
            $q->whereIn('name', ['Case: Resolved', 'Case: Closed']);
        });
    }
    // Helpers
    public function isAssignedTo(User $user): bool
    {
        return $this->assigned_to === $user->id;
    }


}
