<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => RoleName::ADMIN,
            ],
            [
                'name' => RoleName::SURVIVOR,
            ],
            [
                'name' => RoleName::CASE_WORKER,
            ],
            [
                'name' => RoleName::LAW_ENFORCEMENT,
            ],
            [
                'name' => RoleName::SYSTEM,
            ]
        ];


        DB::table('roles')->insert($roles);
    }
}
