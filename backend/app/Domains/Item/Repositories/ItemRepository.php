<?php

namespace App\Domains\Item\Repositories;

use App\Domains\Item\Entities\Item;

class ItemRepository
{
    public function all()
    {
        return Item::all();
    }

    public function create(array $data)
    {
        return Item::create($data);
    }

    public function update(Item $item, array $data)
    {
        $item->update($data);
        return $item;
    }

    public function delete(Item $item)
    {
        return $item->delete();
    }
}
