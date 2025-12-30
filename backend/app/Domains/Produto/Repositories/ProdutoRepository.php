<?php

namespace App\Domains\Produto\Repositories;

use App\Domains\Produto\Entities\Produto;

class ProdutoRepository
{
    public function searchByName(string $query)
    {
        return Produto::where('nome', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get(['id', 'nome']);
    }

    public function create(array $data)
    {
        return Produto::create($data);
    }
}
