<?php

namespace App\Http\Controllers\Api;

use App\Domains\Grupo\Service\GrupoService;
use App\Http\Controllers\Controller;

class GrupoController extends Controller
{
    public function __construct(
        private GrupoService $service,
    ) {}


    public function index()
    {
        return response()->json($this->service->all());
    }
}
