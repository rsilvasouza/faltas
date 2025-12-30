<?php

namespace App\Http\Controllers\Api;

use App\Domains\Produto\Service\ProdutoService;
use App\Http\Controllers\Controller;
use App\Domains\Produto\Entities\Produto;
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
}
