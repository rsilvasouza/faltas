<?php

namespace App\Domains\Grupo\Repositories;

use App\Domains\Grupo\Entities\Grupo;

class GrupoRepository
{
    public function all()
    {
        return Grupo::orderBy('nome', 'asc')->get();
    }
}
