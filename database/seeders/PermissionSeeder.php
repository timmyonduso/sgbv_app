<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Incident permissions
            ['name' => 'create_incident'],
            ['name' => 'view_incident'],
            ['name' => 'update_incident'],
            ['name' => 'delete_incident'],
            ['name' => 'view_all_incidents'],

            // Case permissions
            ['name' => 'create_case'],
            ['name' => 'view_case'],
            ['name' => 'update_case'],
            ['name' => 'delete_case'],
            ['name' => 'view_all_cases'],
            ['name' => 'assign_case'],

            // User permissions
            ['name' => 'view_user_details'],
            ['name' => 'update_user'],
            ['name' => 'view_all_users'],

            // Report permissions
            ['name' => 'create_report'],
            ['name' => 'view_report'],
            ['name' => 'view_all_reports'],
            ['name' => 'view_sensitive_reports'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission['name']]);
        }

        // Assign permissions to roles
        $roles = Role::all();

        // Admin role - gets all permissions
        $adminRole = $roles->where('name', RoleName::ADMIN)->first();
        $adminRole->permissions()->sync(Permission::all());

        // Survivor role
        $survivorRole = $roles->where('name', RoleName::SURVIVOR)->first();
        $survivorPermissions = Permission::whereIn('name', [
            'create_incident',
            'view_incident',
            'update_incident',
            'view_case',
        ])->pluck('id');
        $survivorRole->permissions()->sync($survivorPermissions);

        // Caseworker role
        $caseworkerRole = $roles->where('name', RoleName::CASE_WORKER)->first();
        $caseworkerPermissions = Permission::whereIn('name', [
            'view_incident',
            'view_all_incidents',
            'create_case',
            'view_case',
            'update_case',
            'view_all_cases',
            'assign_case',
            'view_user_details',
            'create_report',
            'view_report',
        ])->pluck('id');
        $caseworkerRole->permissions()->sync($caseworkerPermissions);

        // Law enforcement role
        $lawEnforcementRole = $roles->where('name', RoleName::LAW_ENFORCEMENT)->first();
        $lawEnforcementPermissions = Permission::whereIn('name', [
            'view_incident',
            'view_all_incidents',
            'view_case',
            'view_all_cases',
            'view_user_details',
            'view_report',
        ])->pluck('id');
        $lawEnforcementRole->permissions()->sync($lawEnforcementPermissions);

        // System role
        $systemRole = $roles->where('name', RoleName::SYSTEM)->first();
        $systemPermissions = Permission::whereIn('name', [
            'create_report',
            'view_all_incidents',
            'view_all_cases',
            'view_all_reports',
        ])->pluck('id');
        $systemRole->permissions()->sync($systemPermissions);
    }
}
