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
}
