<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    protected function guard(): JWTGuard
    {
        return auth('api');
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'sometimes|in:member,manager',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role ?? 'member',
        ]);

        $token = $this->guard()->login($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = $this->guard()->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'user' => $this->guard()->user(),
            'token' => $token,
        ]);
    }

    public function logout()
    {
        $token = $this->guard()->getToken();

        if (!$token) {
            return response()->json(['message' => 'No active session'], 400);
        }

        try {
            \Tymon\JWTAuth\Facades\JWTAuth::invalidate($token);
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['message' => 'Failed to logout, please try again.'], 500);
        }
    }

    public function me()
    {
        return response()->json($this->guard()->user());
    }
}