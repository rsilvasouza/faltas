<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdutoSeeder extends Seeder
{
    public function run(): void
    {
        $produtos = [
            // Papelaria
            ['nome' => 'Caneta Azul', 'created_at' => now()],
            ['nome' => 'Caderno 10 Matérias', 'created_at' => now()],
            ['nome' => 'Lápis HB', 'created_at' => now()],
            ['nome' => 'Cartolina Branca', 'created_at' => now()],
            // Doces
            ['nome' => 'Bala de Goma', 'created_at' => now()],
            ['nome' => 'Pirulito Tutti-Frutti', 'created_at' => now()],
            ['nome' => 'Chocolate Barra', 'created_at' => now()],
            // Bazar
            ['nome' => 'Copo de Vidro', 'created_at' => now()],
            ['nome' => 'Pilha AA', 'created_at' => now()],
        ];

        DB::table('produtos')->insert($produtos);
    }
}
