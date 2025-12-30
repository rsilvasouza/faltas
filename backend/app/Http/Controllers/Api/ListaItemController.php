<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domains\Lista\Service\ListaItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function store(Request $request, $listaId)
    {
        $listaItem = $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'grupo_id' => 'required|exists:grupos,id',
            'quantidade' => 'required|integer|min:1',
            'preco_atual' => 'nullable|numeric'
        ]);

        return response()->json($this->service->create($listaItem), 201);
    }
}
