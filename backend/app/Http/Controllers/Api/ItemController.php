<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domains\Item\Repositories\ItemRepository;
use App\Domains\Item\Entities\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function __construct(
        private ItemRepository $repository
    ) {}

    public function index()
    {
        return response()->json($this->repository->all());
    }

    public function store(Request $request)
    {
        $item = $this->repository->create($request->validate([
            'nome' => 'required|string'
        ]));

        return response()->json($item, 201);
    }

    public function update(Request $request, Item $item)
    {
        return response()->json(
            $this->repository->update($item, $request->validate([
                'nome' => 'required|string'
            ]))
        );
    }

    public function destroy(Item $item)
    {
        $this->repository->delete($item);
        return response()->noContent();
    }
}
