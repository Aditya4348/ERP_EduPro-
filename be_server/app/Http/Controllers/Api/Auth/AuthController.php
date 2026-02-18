<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Otp;
use App\Mail\SendOtpMail;
use Illuminate\Support\Facades\Mail;


class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        // Autentikasi & rate limit sudah dilakukan di LoginRequest
        $request->authenticate();

        $user = $request->user(); // ambil user yang berhasil login

        // Buat token API Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'phone_number' => 'required|string|max:25',
        ]);

        // Create user but as inactive
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'is_active' => false, // User is inactive until OTP verification
            'role' => 'user', // Default role
            'avatar' => 'default.png', // Provide a default
            'last_login_at' => now(), // Provide a default
        ]);

        // Generate and send OTP
        $this->sendOtp($user->email);

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan cek email Anda untuk kode OTP.',
        ], 201);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|digits:6',
        ]);

        $otpRecord = Otp::where('identifier', $request->email)
                        ->where('token', $request->otp)
                        ->where('expires_at', '>', now())
                        ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'OTP tidak valid atau telah kedaluwarsa.'], 400);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Activate user
        $user->forceFill([
            'is_active' => true,
            'email_verified_at' => now(),
        ])->save();

        // Delete the OTP record
        $otpRecord->delete();

        // Create token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Verifikasi OTP berhasil. Akun Anda sekarang aktif.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();

        if ($user->is_active) {
            return response()->json(['message' => 'Akun ini sudah aktif.'], 400);
        }

        $this->sendOtp($request->email);

        return response()->json(['message' => 'OTP baru telah dikirim ke email Anda.']);
    }

    private function sendOtp($identifier)
    {
        // Invalidate previous OTPs for this identifier
        Otp::where('identifier', $identifier)->delete();

        // Generate a 6-digit OTP
        $otpCode = rand(100000, 999999);

        // Create OTP record
        Otp::create([
            'identifier' => $identifier,
            'token' => $otpCode,
            'expires_at' => now()->addMinutes(10), // OTP is valid for 10 minutes
        ]);

        // Send email using a Mailable
        Mail::to($identifier)->send(new SendOtpMail($otpCode));
    }

    public function logout(Request $request)
    {
        // Menghapus token yang sedang digunakan
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $this->sendOtp($request->email);

        return response()->json([
            'message' => 'OTP untuk reset password telah dikirim ke email Anda.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|digits:6',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);

        $otpRecord = Otp::where('identifier', $request->email)
                        ->where('token', $request->otp)
                        ->where('expires_at', '>', now())
                        ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'OTP tidak valid atau telah kedaluwarsa.'], 400);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        // Delete the OTP record
        $otpRecord->delete();

        return response()->json(['message' => 'Password berhasil direset. Silakan login dengan password baru Anda.']);
    }
}