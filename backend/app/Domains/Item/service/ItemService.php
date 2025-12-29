<?php

namespace App\Domain\Service;

use App\Domains\Item\Entities\Item;
use App\Domains\Item\Repositories\ItemRepository;
use Exception;

class ItemService
{
    public function __construct(
        protected ItemRepository $repository,
    ) {}

    public function create(array $data)
    {
        $itemExistente = $this->repository->findByName($data['name']);

        if ($itemExistente !== null) {
            throw new Exception("Já existe um item com o nome {$data['name']}");
        }

        return $this->repository->create($data);
    }
}
