<?php

namespace App\Providers;

use App\Enums\RoleName;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {

    }


    public function boot()
    {
        $this->registerGates();
    }

    protected function registerGates(): void
    {
        try {
            foreach (Permission::pluck('name') as $permission) {
                Gate::define($permission, function ($user) use ($permission) {
                    return $user->hasPermission($permission);
                });
            }

            // Define a Gate to check if the user is an admin
            Gate::define('view-admin-dashboard', function (User $user) {
                return $user->hasRole(RoleName::ADMIN);
            });
        } catch (\Exception $e) {
            info('registerPermissions(): Database not found or not yet migrated. Ignoring user permissions while booting app.');
        }
    }
}
