<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListaController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::apiResource('listas', ListaController::class);
});
