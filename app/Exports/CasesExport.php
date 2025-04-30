<?php

namespace App\Exports;

use App\Models\CaseModel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Collection;

class CasesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        $query = CaseModel::with([
            'incident.survivor',
            'status',
            'assignedTo'
        ]);

        // Apply the same filters as in the controller
        if (isset($this->filters['status']) && $this->filters['status'] !== 'all') {
            if ($this->filters['status'] === 'open') {
                $query->open();
            } elseif ($this->filters['status'] === 'closed') {
                $query->closed();
            } elseif (is_numeric($this->filters['status'])) {
                $query->where('status_id', $this->filters['status']);
            }
        }

        if (isset($this->filters['assignedTo']) && $this->filters['assignedTo'] !== 'all') {
            $query->where('assigned_to', $this->filters['assignedTo']);
        }

        if (isset($this->filters['search']) && !empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('incident', function ($subQuery) use ($search) {
                    $subQuery->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                    ->orWhereHas('incident.survivor', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query->latest()->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Case ID',
            'Incident',
            'Description',
            'Survivor',
            'Assigned To',
            'Status',
            'Created Date',
            'Updated Date'
        ];
    }

    /**
     * @param mixed $case
     * @return array
     */
    public function map($case): array
    {
        return [
            $case->id,
            $case->incident->title,
            $case->incident->description,
            $case->incident->survivor->name,
            $case->assignedTo ? $case->assignedTo->name : 'Unassigned',
            str_replace('Case: ', '', $case->status->name),
            date('Y-m-d', strtotime($case->created_at)),
            date('Y-m-d', strtotime($case->updated_at))
        ];
    }
}
