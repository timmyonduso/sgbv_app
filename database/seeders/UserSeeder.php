<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $adminUser->roles()->sync(Role::where('name', RoleName::ADMIN)->first()->id);

        // Create system user
        $systemUser = User::firstOrCreate(
            ['email' => 'system@example.com'],
            [
                'name' => 'System Account',
                'password' => Hash::make('systempassword'),
                'email_verified_at' => now(),
            ]
        );
        $systemUser->roles()->sync(Role::where('name', RoleName::SYSTEM)->first()->id);

        // Create caseworkers
        $caseworkers = [
            [
                'name' => 'Emma Johnson',
                'email' => 'emma@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'James Rodriguez',
                'email' => 'james@example.com',
                'password' => Hash::make('password'),
            ],
        ];

        $caseworkerRole = Role::where('name', RoleName::CASE_WORKER)->first();

        foreach ($caseworkers as $caseworker) {
            $user = User::firstOrCreate(
                ['email' => $caseworker['email']],
                [
                    'name' => $caseworker['name'],
                    'password' => $caseworker['password'],
                    'email_verified_at' => now(),
                ]
            );
            $user->roles()->sync($caseworkerRole->id);
        }

        // Create law enforcement users
        $lawEnforcement = [
            [
                'name' => 'Officer Taylor',
                'email' => 'taylor@police.gov',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Detective Garcia',
                'email' => 'garcia@police.gov',
                'password' => Hash::make('password'),
            ],
        ];

        $lawEnforcementRole = Role::where('name', RoleName::LAW_ENFORCEMENT)->first();

        foreach ($lawEnforcement as $officer) {
            $user = User::firstOrCreate(
                ['email' => $officer['email']],
                [
                    'name' => $officer['name'],
                    'password' => $officer['password'],
                    'email_verified_at' => now(),
                ]
            );
            $user->roles()->sync($lawEnforcementRole->id);
        }

        // Create survivors (25 users)
        $survivorRole = Role::where('name', RoleName::SURVIVOR)->first();

        $firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Robin', 'Sam', 'Avery', 'Jamie', 'Quinn'];
        $lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor'];

        for ($i = 1; $i <= 25; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $email = strtolower($firstName) . '.' . strtolower($lastName) . $i . '@example.com';

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => "$firstName $lastName",
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->roles()->sync($survivorRole->id);
        }
    }
}
