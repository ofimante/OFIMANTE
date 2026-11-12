<?php
/**
 * OFIMANTE - INTEGRACIÓN DE GOOGLE OAUTH 2.0
 * Ciudad Mante, Tamaulipas
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/database.php';

class GoogleAuth {

    /**
     * Retorna la URL de redirección oficial de Google OAuth 2.0.
     */
    public static function getAuthUrl(string $role = 'candidato'): string {
        $state = bin2hex(random_bytes(16)) . ':' . urlencode($role);
        $_SESSION['google_oauth_state'] = $state;

        $params = [
            'client_id'     => GOOGLE_CLIENT_ID,
            'redirect_uri'  => GOOGLE_REDIRECT_URI,
            'response_type' => 'code',
            'scope'         => 'openid email profile',
            'access_type'   => 'online',
            'state'         => $state,
            'prompt'        => 'select_account'
        ];

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    }

    /**
     * Procesa la respuesta de Google tras la autorización.
     */
    public static function handleCallback(string $code, string $receivedState): array {
        if (empty($_SESSION['google_oauth_state']) || !hash_equals($_SESSION['google_oauth_state'], $receivedState)) {
            return ['success' => false, 'error' => 'Validación de estado CSRF inválida en Google OAuth.'];
        }

        $parts = explode(':', $receivedState);
        $role = $parts[1] ?? 'candidato';

        // Intercambiar código por Token
        $postData = [
            'code'          => $code,
            'client_id'     => GOOGLE_CLIENT_ID,
            'client_secret' => GOOGLE_CLIENT_SECRET,
            'redirect_uri'  => GOOGLE_REDIRECT_URI,
            'grant_type'    => 'authorization_code'
        ];

        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {
            return ['success' => false, 'error' => 'No fue posible intercambiar el código con Google.'];
        }

        $tokenData = json_decode($response, true);
        $idToken = $tokenData['id_token'] ?? '';
        if (!$idToken) {
            return ['success' => false, 'error' => 'Google no emitió un id_token válido.'];
        }

        // Consultar info del perfil
        $userInfoUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken);
        $userInfoRaw = @file_get_contents($userInfoUrl);
        $googleUser = json_decode($userInfoRaw, true) ?: [];

        if (empty($googleUser['email'])) {
            return ['success' => false, 'error' => 'No se pudo obtener el correo de la cuenta de Google.'];
        }

        return [
            'success'   => true,
            'google_id' => $googleUser['sub'] ?? '',
            'email'     => $googleUser['email'],
            'nombre'    => $googleUser['name'] ?? explode('@', $googleUser['email'])[0],
            'foto'      => $googleUser['picture'] ?? 'logo.png',
            'rol'       => $role
        ];
    }
}

