<?php

namespace App\Domains\Lista\Service;

use App\Domains\Lista\Repositories\ListaItemRepository;

class ListaItemService
{
    public function __construct(
        protected ListaItemRepository $repository
    ) {}

    public function listItemsByLista(int $listaId)
    {
        return $this->repository->getByLista($listaId);
    }
}
