<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrupoSeeder extends Seeder
{
    public function run(): void
    {
        $grupos = [
            ['nome' => 'Bazar', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Doces', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Papelaria', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Limpeza', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Higiene', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('grupos')->insert($grupos);
    }
}
