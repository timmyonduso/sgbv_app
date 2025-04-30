<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Status extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function cases()
    {
        return $this->hasMany(CaseModel::class);
    }

    // In Status.php
    public function getDisplayNameAttribute()
    {
        // Remove the prefix for display purposes
        return str_replace(['Case: ', 'Incident: '], '', $this->name);
    }

    public function isCaseStatus()
    {
        return str_starts_with($this->name, 'Case:');
    }

    public function isIncidentStatus()
    {
        return str_starts_with($this->name, 'Incident:');
    }

    public function scopeCaseStatuses($query)
    {
        return $query->where('name', 'like', 'Case:%');
    }

    public function scopeIncidentStatuses($query)
    {
        return $query->where('name', 'like', 'Incident:%');
    }
}
