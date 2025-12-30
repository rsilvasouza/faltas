<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ListaController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::apiResource('listas', ListaController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('listas', ListaController::class);

    Route::get('listas/{lista}/items', [ItemController::class, 'index']);
    Route::post('listas/{lista}/items', [ItemController::class, 'store']);

    Route::delete('items/{item}', [ItemController::class, 'destroy']);
});
