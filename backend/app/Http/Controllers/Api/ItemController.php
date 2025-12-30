<?php

namespace App\Http\Controllers\Api;

use App\Domains\Item\Service\ItemService;
use App\Http\Controllers\Controller;
use App\Domains\Item\Entities\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function __construct(
        private ItemService $service,
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

    public function destroy(Item $item)
    {
        $this->service->delete($item);
        return response()->noContent();
    }
}
