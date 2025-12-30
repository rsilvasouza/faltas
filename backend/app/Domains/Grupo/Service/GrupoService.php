<?php

namespace App\Domains\Grupo\Service;

use App\Domains\Grupo\Repositories\GrupoRepository;
use Exception;

class GrupoService
{
    public function __construct(
        protected GrupoRepository $repository,
    ) {}

    public function all()
    {
        return $this->repository->all();
    }
}
