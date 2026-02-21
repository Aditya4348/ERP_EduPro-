<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Daftar Role sesuai types.ts
        $roles = [
            'SUPER_ADMIN',
            'KEPALA_SEKOLAH',
            'WAKASEK',
            'GURU',
            'WALI_KELAS',
            'BK',
            'TATA_USAHA',
            'BENDAHARA', // Value dari enum BENDA_HARA
            'SISWA',
            'ORANG_TUA',
            'OSIS',
            'PEMBINA_ESKUL',
            'ALUMNI',
            'MITRA_INDUSTRI',
            'YAYASAN'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web'
            ]);
        }
    }
}
