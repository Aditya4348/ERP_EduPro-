<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kode OTP Anda</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="color: #0056b3;">Kode Verifikasi OTP Anda</h1>
        <p>Gunakan kode berikut untuk menyelesaikan proses Anda. Kode ini hanya berlaku selama 10 menit.</p>
        <div style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 10px; background-color: #f2f2f2; text-align: center; border-radius: 5px;">
            {{ $otp }}
        </div>
        <p>Jika Anda tidak meminta kode ini, mohon abaikan email ini.</p>
        <hr>
        <p style="font-size: 0.9em; color: #777;">Terima kasih,<br>Tim {{ config('app.name') }}</p>
    </div>
</body>
</html>
