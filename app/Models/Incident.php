<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Incident extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'survivor_id',
        'status_id',
        'description',
        'location',
        'location_address',
        'latitude',
        'longitude',
        'contact_info',
        'tracking_code',
    ];

    // Relationships
    public function survivor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'survivor_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function case()
    {
        return $this->hasOne(CaseModel::class);
    }

    // Scopes
    // In Incident.php
    public function scopePending($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('name', 'Incident: Pending');
        });
    }

    public function scopeResolved($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('name', 'Incident: Resolved');
        });
    }
}
