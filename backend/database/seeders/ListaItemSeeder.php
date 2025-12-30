<?php

// database/seeders/ListaItemSeeder.php

namespace Database\Seeders;

use App\Domains\Lista\Entities\Lista as Lista;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ListaItemSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar uma Lista de teste
        $lista = Lista::create([
            'nome' => 'Material Escolar 2026',
        ]);

        // 2. Buscar IDs de Grupos e Produtos existentes (criados nos seeders anteriores)
        $grupoPapelaria = DB::table('grupos')->where('nome', 'Papelaria')->first();
        $grupoDoces = DB::table('grupos')->where('nome', 'Doces')->first();

        $prodCaneta = DB::table('produtos')->where('nome', 'Caneta Azul')->first();
        $prodCaderno = DB::table('produtos')->where('nome', 'Caderno 10 Matérias')->first();
        $prodBala = DB::table('produtos')->where('nome', 'Bala de Goma')->first();

        // 3. Cadastrar os itens na Tabela Pivô (lista_items)
        $itens = [
            [
                'lista_id' => $lista->id,
                'produto_id' => $prodCaneta->id,
                'grupo_id' => $grupoPapelaria->id,
                'quantidade' => 5,
                'comprado' => false,
                'preco_atual' => 2.50,
                'created_at' => now()
            ],
            [
                'lista_id' => $lista->id,
                'produto_id' => $prodCaderno->id,
                'grupo_id' => $grupoPapelaria->id,
                'quantidade' => 2,
                'comprado' => false,
                'preco_atual' => 25.90,
                'created_at' => now()
            ],
            [
                'lista_id' => $lista->id,
                'produto_id' => $prodBala->id,
                'grupo_id' => $grupoDoces->id,
                'quantidade' => 10,
                'comprado' => true,
                'preco_atual' => 0.50,
                'created_at' => now()
            ]
        ];

        DB::table('lista_items')->insert($itens);
    }
}
