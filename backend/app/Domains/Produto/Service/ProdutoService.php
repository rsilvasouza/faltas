<?php

namespace App\Domains\Produto\Service;

use App\Domains\Produto\Repositories\ProdutoRepository;

class ProdutoService
{
    public function __construct(
        protected ProdutoRepository $repository,
    ) {}

    public function search(string $term)
    {
        return $this->repository->searchByName($term);
    }
}
