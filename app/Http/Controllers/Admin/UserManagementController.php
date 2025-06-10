<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RoleName;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['roles']);

        // Filter by role if specified
        if ($request->has('role') && $request->role !== 'all') {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->whereNotNull('email_verified_at');
            } elseif ($request->status === 'inactive') {
                $query->whereNull('email_verified_at');
            }
        }
        $users = $query->paginate(15)->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name ?? 'No role', // Get first role name
                'status' => $user->status,
                'lastLogin' => $user->last_login_at?->toDateTimeString(),
                'createdAt' => $user->created_at->toDateTimeString(),
            ];
        });
        $roles = Role::all();

        // Add stats calculation
        $stats = [
            'totalUsers' => User::count(),
            'activeUsers' => User::whereNotNull('email_verified_at')->count(),
            'inactiveUsers' => User::whereNull('email_verified_at')->count(),
            'suspendedUsers' => 0, // Add your suspension logic if you have it
        ];

        return Inertia::render('admin/UserManagement', [
            'users' => $users,
            'roles' => $roles,
            'stats' => $stats, // Add this line
            'filters' => $request->only(['role', 'search', 'status'])
        ]);
    }

    public function show(User $user)
    {
        $user->load(['roles', 'assignedCases', 'incidents', 'caseUpdates']);

        return Inertia::render('admin/UserDetail', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'status' => $user->status,
                'last_login_at' => $user->last_login_at,
                'created_at' => $user->created_at->toDateTimeString(),
                'updated_at' => $user->updated_at->toDateTimeString(),
                'roles' => $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name
                    ];
                }),
                'assignedCases' => $user->assignedCases->map(function ($case) {
                    return [
                        'id' => $case->id,
                        'title' => $case->title,
                        'status' => $case->status
                    ];
                }),
                'incidents' => $user->incidents->map(function ($incident) {
                    return [
                        'id' => $incident->id,
                        'title' => $incident->title,
                        'severity' => $incident->severity
                    ];
                }),
                'caseUpdates' => $user->caseUpdates->map(function ($update) {
                    return [
                        'id' => $update->id,
                        'content' => $update->content,
                        'created_at' => $update->created_at->toDateTimeString()
                    ];
                })
            ],
            'roles' => Role::all()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name
                ];
            })
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        Log::info('User updated by admin', [
            'user_id' => $user->id,
            'admin_id' => auth()->id(),
            'updated_fields' => array_keys($userData)
        ]);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        // Prevent deletion of the current admin user
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Cannot delete your own account');
        }

        // Check if user has any active cases or incidents
        if ($user->assignedCases()->where('status', '!=', 'closed')->exists() ||
            $user->incidents()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete user with active cases or incidents');
        }

        $userName = $user->name;
        $user->delete();

        Log::info('User deleted by admin', [
            'deleted_user_id' => $user->id,
            'deleted_user_name' => $userName,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        $role = Role::find($request->role_id);

        // Check if user already has this role
        if ($user->roles()->where('role_id', $role->id)->exists()) {
            return redirect()->back()->with('error', 'User already has this role');
        }

        $user->roles()->attach($role);

        Log::info('Role assigned to user by admin', [
            'user_id' => $user->id,
            'role_id' => $role->id,
            'role_name' => $role->name,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', "Role '{$role->name}' assigned successfully");
    }

    public function removeRole(User $user, Role $role)
    {
        // Prevent removing the last admin role
        if ($role->name === RoleName::ADMIN) {
            $adminCount = User::whereHas('roles', function ($q) {
                $q->where('name', RoleName::ADMIN);
            })->count();

            if ($adminCount <= 1) {
                return redirect()->back()->with('error', 'Cannot remove the last admin user');
            }
        }

        $user->roles()->detach($role);

        Log::info('Role removed from user by admin', [
            'user_id' => $user->id,
            'role_id' => $role->id,
            'role_name' => $role->name,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', "Role '{$role->name}' removed successfully");
    }

    public function updateStatus(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:active,inactive'
        ]);

        if ($request->status === 'active') {
            $user->email_verified_at = now();
        } else {
            $user->email_verified_at = null;
        }

        $user->save();

        Log::info('User status updated by admin', [
            'user_id' => $user->id,
            'new_status' => $request->status,
            'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'User status updated successfully');
    }
}
