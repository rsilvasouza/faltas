<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domains\Lista\Service\ListaItemService;
use Illuminate\Http\JsonResponse;

class ListaItemController extends Controller
{
    public function __construct(
        private ListaItemService $service
    ) {}

    public function index($listaId): JsonResponse
    {
        try {
            $items = $this->service->listItemsByLista((int) $listaId);
            return response()->json($items);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao listar itens'], 500);
        }
    }
}
