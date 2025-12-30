<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GrupoController;
use App\Http\Controllers\Api\ListaController;
use App\Http\Controllers\Api\ListaItemController;
use App\Http\Controllers\Api\ProdutoController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::apiResource('listas', ListaController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::get('grupos', [GrupoController::class, 'index']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('listas/{lista}/items', [ListaItemController::class, 'index']);
    Route::post('listas/{lista}/items', [ListaItemController::class, 'store']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('produtos/search', [ProdutoController::class, 'search']);
});
