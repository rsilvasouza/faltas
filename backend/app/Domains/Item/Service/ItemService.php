<?php

namespace App\Domains\Item\Service;

use App\Domains\Item\Entities\Item;
use App\Domains\Item\Repositories\ItemRepository;
use Exception;

class ItemService
{
    public function __construct(
        protected ItemRepository $repository,
    ) {}

    public function all()
    {
        return $this->repository->all();
    }

    public function create(array $data)
    {
        $itemExistente = $this->repository->findByName($data['nome']);

        if ($itemExistente !== null) {
            throw new Exception("Já existe um item com o nome {$data['nome']}");
        }

        return $this->repository->create($data);
    }

    public function delete(Item $item)
    {
        $this->repository->delete($item);
    }
}
