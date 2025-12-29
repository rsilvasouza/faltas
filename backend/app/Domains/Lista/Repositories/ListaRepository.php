<?php

namespace App\Domains\Lista\Repositories;

use App\Domains\Lista\Entities\Lista;

class ListaRepository
{
    public function all()
    {
        return Lista::all();
    }

    public function findByName(string $name)
    {
        return Lista::where('nome', $name)->first();
    }

    public function create(array $data)
    {
        return Lista::create($data);
    }

    public function delete(Lista $lista)
    {
        return $lista->delete();
    }
}
