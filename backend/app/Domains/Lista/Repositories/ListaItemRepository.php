<?php

namespace App\Domains\Lista\Repositories;

use App\Domains\Lista\Entities\ListaItem;

class ListaItemRepository
{
    public function getByLista(int $listaId)
    {
        return ListaItem::where('lista_id', $listaId)
            ->with(['produto', 'grupo'])
            ->get();
    }

    public function create(array $data)
    {
        return ListaItem::create($data);
    }

    public function delete(int $itemId)
    {
        ListaItem::where('id', $itemId)->delete();
    }

    public function updateStatus(int $itemId, bool $comprado)
    {
        $item = ListaItem::find($itemId);
        if ($item) {
            $item->comprado = $comprado;
            $item->save();
        }
    }
}
