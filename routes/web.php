<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\SystemSettingsController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Contact\ContactController;
use App\Http\Controllers\Web\CaseWebController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\IncidentWebController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('web')->group(function () {
    // Anonymous incident routes (no auth required)
    Route::get('/anonymous-report', [IncidentWebController::class, 'createAnonymous'])->name('incidents.create-anonymous');
    Route::post('/anonymous-report', [IncidentWebController::class, 'storeAnonymous'])->name('incidents.store-anonymous');
    Route::get('/track-incident', [IncidentWebController::class, 'anonymousTracking'])->name('incidents.track');
    Route::post('/track-incident', [IncidentWebController::class, 'trackAnonymous'])->name('incidents.track-anonymous');
});

// Route group for authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // About page route
    Route::get('/about', function () {
        return inertia('about/Index');
    })->name('about');

// Chat page routes
    Route::get('chat', [ChatController::class, 'index'])->name('chat');
    Route::post('chat', [ChatController::class, 'send']);

// Contact page routes
    Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Incident routes
    Route::prefix('incidents')->group(function () {
        Route::get('/', [IncidentWebController::class, 'index'])->name('incidents.index');
        Route::get('/create', [IncidentWebController::class, 'create'])->name('incidents.create');
        Route::post('/', [IncidentWebController::class, 'store'])->name('incidents.store');
        Route::get('/{incident}', [IncidentWebController::class, 'show'])->name('incidents.show');
        Route::get('/{incident}/edit', [IncidentWebController::class, 'edit'])->name('incidents.edit');
        Route::put('/{incident}', [IncidentWebController::class, 'update'])->name('incidents.update');
    });
    // Cases
    Route::prefix('cases')->group(function () {
        Route::get('/export-pdf', [CaseWebController::class, 'exportPdf'])->name('cases.export-pdf');

        Route::get('/', [CaseWebController::class, 'index'])->name('cases.index');
        Route::get('/create', [CaseWebController::class, 'create'])->name('cases.create');
        Route::post('/', [CaseWebController::class, 'store'])->name('cases.store');
        Route::get('/{case}', [CaseWebController::class, 'show'])->name('cases.show');
        Route::get('/{case}/edit', [CaseWebController::class, 'edit'])->name('cases.edit');
        Route::get('/{case}/update', [CaseWebController::class, 'edit'])->name('cases.update');
        Route::put('/{case}', [CaseWebController::class, 'update'])->name('cases.updates');
        Route::delete('/{case}', [CaseWebController::class, 'destroy'])->name('cases.destroy');

        // Additional custom routes
        Route::post('/{case}/updates', [CaseWebController::class, 'addUpdate'])->name('cases.add-update');
        Route::post('/{case}/assign', [CaseWebController::class, 'assign'])->name('cases.assign');
    });

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportWebController::class, 'index'])->name('reports.index');
        Route::get('/create', [ReportWebController::class, 'create'])->name('reports.create');
        Route::get('/{report}', [ReportWebController::class, 'show'])->name('reports.show');
    });

    // Admin routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        // User management
        Route::get('/users', [UserWebController::class, 'index'])->name('admin.users.index');
        Route::get('/users/create', [UserWebController::class, 'create'])->name('admin.users.create');
        Route::get('/users/{user}', [UserWebController::class, 'show'])->name('admin.users.show');
        Route::get('/users/{user}/edit', [UserWebController::class, 'edit'])->name('admin.users.edit');

        // Role management
        Route::get('/roles', [RoleWebController::class, 'index'])->name('admin.roles.index');
        Route::get('/roles/create', [RoleWebController::class, 'create'])->name('admin.roles.create');
        Route::get('/roles/{role}', [RoleWebController::class, 'show'])->name('admin.roles.show');
        Route::get('/roles/{role}/edit', [RoleWebController::class, 'edit'])->name('admin.roles.edit');

        // Permission management
        Route::get('/permissions', [PermissionWebController::class, 'index'])->name('admin.permissions.index');
    });

    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        // Admin Dashboard
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        // User Management
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/roles', [UserManagementController::class, 'assignRole'])->name('users.assign-role');
        Route::delete('/users/{user}/roles/{role}', [UserManagementController::class, 'removeRole'])->name('users.remove-role');
        Route::put('/users/{user}/status', [UserManagementController::class, 'updateStatus'])->name('users.update-status');

        // System Settings
        Route::get('/settings', [SystemSettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SystemSettingsController::class, 'update'])->name('settings.update');

        // Roles and Permissions
        Route::get('/roles', [SystemSettingsController::class, 'roles'])->name('roles.index');
        Route::post('/roles', [SystemSettingsController::class, 'storeRole'])->name('roles.store');
        Route::put('/roles/{role}', [SystemSettingsController::class, 'updateRole'])->name('roles.update');
        Route::delete('/roles/{role}', [SystemSettingsController::class, 'destroyRole'])->name('roles.destroy');
        Route::post('/roles/{role}/permissions', [SystemSettingsController::class, 'assignPermission'])->name('roles.assign-permission');

        // System Actions
        Route::post('/backup', [AdminDashboardController::class, 'backup'])->name('backup');
        Route::get('/reports', [AdminDashboardController::class, 'reports'])->name('reports');
        Route::get('/alerts', [AdminDashboardController::class, 'alerts'])->name('alerts');
        Route::put('/alerts/{alert}/resolve', [AdminDashboardController::class, 'resolveAlert'])->name('alerts.resolve');

        // Activity Logs
        Route::get('/activity', [AdminDashboardController::class, 'activity'])->name('activity');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
