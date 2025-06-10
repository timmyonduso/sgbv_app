<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SystemSettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'system' => [
                'app_name' => config('app.name'),
                'app_url' => config('app.url'),
                'timezone' => config('app.timezone'),
                'maintenance_mode' => app()->isDownForMaintenance(),
            ],
            'notifications' => [
                'email_notifications' => true,
                'sms_notifications' => false,
                'push_notifications' => true,
            ],
            'security' => [
                'session_timeout' => 120, // minutes
                'password_expiry' => 90, // days
                'max_login_attempts' => 5,
            ],
            'backup' => [
                'auto_backup' => true,
                'backup_frequency' => 'daily',
                'retention_days' => 30,
            ]
        ];

        return Inertia::render('Admin/SystemSettings', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'system.app_name' => 'required|string|max:255',
            'system.timezone' => 'required|string',
            'notifications.email_notifications' => 'boolean',
            'notifications.sms_notifications' => 'boolean',
            'notifications.push_notifications' => 'boolean',
            'security.session_timeout' => 'required|integer|min:5|max:480',
            'security.password_expiry' => 'required|integer|min:30|max:365',
            'security.max_login_attempts' => 'required|integer|min:3|max:10',
            'backup.auto_backup' => 'boolean',
            'backup.backup_frequency' => 'required|in:daily,weekly,monthly',
            'backup.retention_days' => 'required|integer|min:7|max:365',
        ]);

        // Here you would typically save these settings to a database table
        // or configuration file. For this example, we'll use cache
        Cache::put('system_settings', $request->all(), now()->addDays(30));

        Log::info('System settings updated by admin', [
            'admin_id' => auth()->id(),
            'settings' => $request->all()
        ]);

        return redirect()->back()->with('success', 'System settings updated successfully');
    }

    public function roles()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/RoleManagement', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function storeRole(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:500',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        Log::info('New role created by admin', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Role created successfully');
    }

    public function updateRole(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string|max:500',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        Log::info('Role updated by admin', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    public function destroyRole(Role $role)
    {
        // Prevent deletion of core system roles
        $protectedRoles = ['admin', 'system', 'survivor', 'case_worker', 'law_enforcement'];

        if (in_array(strtolower($role->name), $protectedRoles)) {
            return redirect()->back()->with('error', 'Cannot delete core system roles');
        }

        // Check if role is assigned to any users
        if ($role->users()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete role that is assigned to users');
        }

        $roleName = $role->name;
        $role->delete();

        Log::info('Role deleted by admin', [
            'role_name' => $roleName,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Role deleted successfully');
    }

    public function assignPermission(Request $request, Role $role)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id'
        ]);

        $permission = Permission::find($request->permission_id);

        if ($role->permissions()->where('permission_id', $permission->id)->exists()) {
            return redirect()->back()->with('error', 'Role already has this permission');
        }

        $role->permissions()->attach($permission);

        Log::info('Permission assigned to role by admin', [
            'role_id' => $role->id,
            'permission_id' => $permission->id,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Permission assigned successfully');
    }
}
