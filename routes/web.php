<?php

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
