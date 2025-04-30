<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cases Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin-bottom: 5px;
        }
        .header p {
            margin: 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 10px;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .filters {
            margin-bottom: 20px;
            font-size: 11px;
        }
        .filters strong {
            display: inline-block;
            width: 80px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .status-open {
            background-color: #e0e7ff;
            color: #4338ca;
        }
        .status-in-progress {
            background-color: #dbeafe;
            color: #1d4ed8;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #b45309;
        }
        .status-resolved {
            background-color: #d1fae5;
            color: #047857;
        }
        .status-closed {
            background-color: #f3f4f6;
            color: #4b5563;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>Cases Report</h1>
    <p>Generated on {{ $exportDate }} by {{ $exportedBy }}</p>
</div>

<div class="filters">
    <p><strong>Status:</strong> {{ $filters['status'] === 'all' ? 'All Statuses' : ($filters['status'] === 'open' ? 'Open Cases' : ($filters['status'] === 'closed' ? 'Closed Cases' : 'Specific Status')) }}</p>
    <p><strong>Assigned To:</strong> {{ $filters['assignedTo'] === 'all' ? 'All Caseworkers' : 'Specific Caseworker' }}</p>
    <p><strong>Search:</strong> {{ $filters['search'] ?: 'None' }}</p>
</div>

<table>
    <thead>
    <tr>
        <th>Case ID</th>
        <th>Incident</th>
        <th>Survivor</th>
        <th>Assigned To</th>
        <th>Status</th>
        <th>Created</th>
    </tr>
    </thead>
    <tbody>
    @foreach($cases as $case)
        <tr>
            <td>#{{ $case->id }}</td>
            <td>
                <strong>{{ $case->incident->title }}</strong><br>
                <span style="font-size: 9px;">{{ \Illuminate\Support\Str::limit($case->incident->description, 50) }}</span>
            </td>
            <td>{{ $case->incident->survivor->name }}</td>
            <td>{{ $case->assignedTo ? $case->assignedTo->name : 'Unassigned' }}</td>
            <td>
                @php
                    $statusName = str_replace('Case: ', '', $case->status->name);
                    $statusClass = 'status-badge ';

                    if (stripos($statusName, 'open') !== false) {
                        $statusClass .= 'status-open';
                    } elseif (stripos($statusName, 'in progress') !== false) {
                        $statusClass .= 'status-in-progress';
                    } elseif (stripos($statusName, 'pending') !== false) {
                        $statusClass .= 'status-pending';
                    } elseif (stripos($statusName, 'resolved') !== false) {
                        $statusClass .= 'status-resolved';
                    } elseif (stripos($statusName, 'closed') !== false) {
                        $statusClass .= 'status-closed';
                    }
                @endphp
                <span class="{{ $statusClass }}">{{ $statusName }}</span>
            </td>
            <td>{{ \Carbon\Carbon::parse($case->created_at)->format('Y-m-d') }}</td>
        </tr>
    @endforeach

    @if(count($cases) === 0)
        <tr>
            <td colspan="6" style="text-align: center;">No cases found matching the current filters.</td>
        </tr>
    @endif
    </tbody>
</table>

<div class="footer">
    <p>Confidential - For authorized personnel only</p>
    <p>Total Cases: {{ count($cases) }}</p>
</div>
</body>
</html>
