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

    public function store(Request $request): JsonResponse
    {
        $listaItem = $request->validate([
            'lista_id' => 'required|integer',
            'produto_id' => 'required|exists:produtos,id',
            'grupo_id' => 'required|exists:grupos,id',
            'quantidade' => 'required|integer|min:1',
            'preco_atual' => 'nullable|numeric',
            'observacao' => 'nullable|string',
        ]);

        return response()->json($this->service->create($listaItem), 201);
    }

    public function destroy($itemId): JsonResponse
    {
        try {
            $this->service->delete((int) $itemId);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao deletar item'], 500);
        }
    }
}
