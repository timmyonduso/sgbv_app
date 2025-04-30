<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'generated_by',
        'report_type',
        'report_data'
    ];

    protected $casts = [
        'report_data' => 'array'
    ];

    // Relationships
    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    // Scopes
    public function scopeOfType($query, $type)
    {
        return $query->where('report_type', $type);
    }

    // Helpers
    public static function generateIncidentSummary()
    {
        // Example method for generating a report
        $data = [
            'total_incidents' => Incident::count(),
            'pending_incidents' => Incident::pending()->count(),
            'resolved_incidents' => Incident::resolved()->count(),
        ];

        return self::create([
            'generated_by' => auth()->id(),
            'report_type' => 'Incident Summary',
            'report_data' => $data
        ]);
    }
}
