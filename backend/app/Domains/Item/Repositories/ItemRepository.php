<?php

namespace App\Domains\Item\Repositories;

use App\Domains\Item\Entities\Item;

class ItemRepository
{
    public function all()
    {
        return Item::orderBy('created_at', 'desc')->get();
    }

    public function findByName(string $name)
    {
        return Item::where('nome', $name)->first();
    }

    public function create(array $data)
    {
        return Item::create($data);
    }

    public function delete(Item $lista)
    {
        return $lista->delete();
    }
}
