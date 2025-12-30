<?php

namespace App\Http\Controllers\Api;

use App\Domains\Produto\Service\ProdutoService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function __construct(
        private ProdutoService $service,
    ) {}


    public function search(Request $request)
    {
        $term = $request->query('term');

        if (!$term) return response()->json([]);

        $produtos = $this->service->search($term);
        return response()->json($produtos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|unique:produtos,nome'
        ]);

        $produto = $this->service->create($validated);
        return response()->json($produto, 201);
    }
}
