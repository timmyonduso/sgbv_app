<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use App\Models\CaseModel;
use App\Models\Incident;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Get dashboard statistics
        $stats = [
            'totalUsers' => User::count(),
            'activeUsers' => User::whereNotNull('email_verified_at')
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->count(),
            'inactiveUsers' => User::whereNull('email_verified_at')
                ->orWhere('created_at', '<', Carbon::now()->subDays(30))
                ->count(),
            'totalCases' => CaseModel::count(),
            'recentLogins' => User::where('updated_at', '>=', Carbon::now()->subHours(24))->count(),
            'systemAlerts' => $this->getSystemAlertsCount(),
        ];

        return Inertia::render('admin/AdminDashboard', [
            'stats' => $stats,
            'recentActivity' => $this->getRecentActivity()
        ]);
    }

    public function backup(Request $request)
    {
        try {
            // Log the backup attempt
            Log::info('System backup initiated by admin', [
                'admin_id' => auth()->id(),
                'timestamp' => now()
            ]);

            // Here you would implement your backup logic
            // This could involve:
            // - Database backup
            // - File system backup
            // - Cloud storage backup

            // For now, we'll simulate a backup
            $backupFileName = 'backup_' . now()->format('Y_m_d_H_i_s') . '.sql';

            // Simulate backup creation
            sleep(2); // Simulate processing time

            return response()->json([
                'success' => true,
                'message' => 'System backup completed successfully',
                'backup_file' => $backupFileName
            ]);

        } catch (\Exception $e) {
            Log::error('System backup failed', [
                'error' => $e->getMessage(),
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Backup failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function reports()
    {
        $reports = [
            'system_usage' => [
                'total_users' => User::count(),
                'active_cases' => CaseModel::where('status', '!=', 'closed')->count(),
                'incidents_this_month' => Incident::whereMonth('created_at', now()->month)->count(),
                'reports_generated' => Report::whereMonth('created_at', now()->month)->count(),
            ],
            'user_statistics' => [
                'by_role' => User::select('roles.name', DB::raw('count(*) as count'))
                    ->join('role_user', 'users.id', '=', 'role_user.user_id')
                    ->join('roles', 'role_user.role_id', '=', 'roles.id')
                    ->groupBy('roles.name')
                    ->get(),
                'recent_registrations' => User::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            ],
            'case_statistics' => [
                'by_status' => CaseModel::select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
                'by_priority' => CaseModel::select('priority', DB::raw('count(*) as count'))
                    ->groupBy('priority')
                    ->get(),
            ]
        ];

        return Inertia::render('Admin/Reports', [
            'reports' => $reports
        ]);
    }

    public function alerts()
    {
        $alerts = [
            // System alerts
            [
                'id' => 1,
                'type' => 'system',
                'level' => 'warning',
                'title' => 'High Database Usage',
                'message' => 'Database usage is at 85% capacity',
                'created_at' => Carbon::now()->subHours(2),
                'resolved' => false
            ],
            [
                'id' => 2,
                'type' => 'security',
                'level' => 'info',
                'title' => 'Multiple Failed Login Attempts',
                'message' => 'User attempted login 5 times unsuccessfully',
                'created_at' => Carbon::now()->subHours(1),
                'resolved' => false
            ],
            // Add more alerts as needed
        ];

        return Inertia::render('Admin/Alerts', [
            'alerts' => $alerts
        ]);
    }

    public function resolveAlert(Request $request, $alertId)
    {
        // Here you would update the alert status in your database
        Log::info('Alert resolved by admin', [
            'alert_id' => $alertId,
            'admin_id' => auth()->id(),
            'timestamp' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alert resolved successfully'
        ]);
    }

    public function activity()
    {
        // Get recent admin activities
        $activities = collect([
            [
                'id' => 1,
                'type' => 'user_created',
                'description' => 'New user registered',
                'details' => 'john.doe@example.com',
                'created_at' => Carbon::now()->subHours(2),
                'user' => 'System'
            ],
            [
                'id' => 2,
                'type' => 'settings_updated',
                'description' => 'System settings updated',
                'details' => 'Notification templates modified',
                'created_at' => Carbon::now()->subHours(4),
                'user' => auth()->user()->name
            ],
            [
                'id' => 3,
                'type' => 'alert_resolved',
                'description' => 'System alert resolved',
                'details' => 'Database connection issue',
                'created_at' => Carbon::now()->subHours(6),
                'user' => auth()->user()->name
            ]
        ]);

        return Inertia::render('Admin/Activity', [
            'activities' => $activities
        ]);
    }

    private function getSystemAlertsCount(): int
    {
        // This would typically query your alerts/notifications table
        // For now, return a mock count
        return 3;
    }

    private function getRecentActivity(): array
    {
        return [
            [
                'type' => 'user_registration',
                'description' => 'New user registered',
                'details' => 'john.doe@example.com',
                'timestamp' => Carbon::now()->subHours(2)->toISOString()
            ],
            [
                'type' => 'system_update',
                'description' => 'System settings updated',
                'details' => 'Notification templates modified',
                'timestamp' => Carbon::now()->subHours(4)->toISOString()
            ],
            [
                'type' => 'alert_resolved',
                'description' => 'System alert resolved',
                'details' => 'Database connection issue',
                'timestamp' => Carbon::now()->subHours(6)->toISOString()
            ]
        ];
    }
}
