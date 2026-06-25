<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer'
        ]);
    }

    public function googleLogin(Request $request)
    {
        $data = $request->validate([
            'credential' => ['required', 'string'],
        ]);

        $googleClientId = config('services.google.client_id');

        if (! $googleClientId) {
            return response()->json(['message' => 'Login Google não configurado.'], 500);
        }

        $googleResponse = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $data['credential'],
        ]);

        if (! $googleResponse->ok()) {
            return response()->json(['message' => 'Token Google inválido.'], 401);
        }

        $payload = $googleResponse->json();

        if (($payload['aud'] ?? null) !== $googleClientId) {
            return response()->json(['message' => 'Cliente Google inválido.'], 401);
        }

        if (! filter_var($payload['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            return response()->json(['message' => 'E-mail Google não verificado.'], 401);
        }

        $email = $payload['email'] ?? null;

        if (! $email) {
            return response()->json(['message' => 'E-mail Google não encontrado.'], 401);
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $payload['name'] ?? $email,
                'password' => Hash::make(Str::random(40)),
                'email_verified_at' => now(),
            ]
        );

        if (! $user->email_verified_at) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);
    }
}
