<?php

namespace App\Domains\Lista\Service;

use App\Domains\Lista\Entities\Lista;
use App\Domains\Lista\Repositories\ListaRepository;
use Exception;

class ListaService
{
    public function __construct(
        protected ListaRepository $repository,
    ) {}

    public function all()
    {
        return $this->repository->all();
    }

    public function create(array $data)
    {
        $listaExistente = $this->repository->findByName($data['nome']);

        if ($listaExistente !== null) {
            throw new Exception("Já existe uma lista com o nome {$data['nome']}");
        }

        return $this->repository->create($data);
    }

    public function delete(Lista $lista)
    {
        $this->repository->delete($lista);
    }
}
