<?php

namespace App\Http\Controllers\Api;

use App\Domains\Lista\Service\ListaService;
use App\Http\Controllers\Controller;
use App\Domains\Lista\Entities\Lista;
use Illuminate\Http\Request;

class ListaController extends Controller
{
    public function __construct(
        private ListaService $service,
    ) {}

    public function index()
    {
        return response()->json($this->service->all());
    }

    public function store(Request $request)
    {
        $item = $request->validate([
            'nome' => 'required|string'
        ]);

        return response()->json($this->service->create($item), 201);
    }

    public function destroy(Lista $item)
    {
        $this->service->delete($item);
        return response()->noContent();
    }
}
