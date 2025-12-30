<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListaController;
use App\Http\Controllers\Api\ListaItemController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::apiResource('listas', ListaController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::get('listas/{lista}/items', [ListaItemController::class, 'index']);
});
