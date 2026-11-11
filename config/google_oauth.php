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
     * Genera la URL oficial de redirección hacia el flujo de consentimiento de Google OAuth 2.0.
     */
    public static function getAuthUrl(string $role = 'candidato'): string {
        $state = bin2hex(random_bytes(16)) . ':' . urlencode($role);
        $_SESSION['oauth_state'] = $state;

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
     * Procesa el código de autorización devuelto por Google o valida un ID Token emitido.
     */
    public static function handleCallback(string $code, string $receivedState): array {
        if (empty($_SESSION['oauth_state']) || !hash_equals($_SESSION['oauth_state'], $receivedState)) {
            return ['success' => false, 'error' => 'Validación de estado CSRF inválida en Google OAuth.'];
        }

        // Intercambiar código por tokens mediante POST a Google
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
        $accessToken = $tokenData['access_token'] ?? '';

        // Obtener perfil del usuario desde Google API
        $userInfoCh = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
        curl_setopt($userInfoCh, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($userInfoCh, CURLOPT_HTTPHEADER, ["Authorization: Bearer {$accessToken}"]);
        $userResponse = curl_exec($userInfoCh);
        curl_close($userInfoCh);

        $userData = json_decode($userResponse, true);
        if (empty($userData['email'])) {
            return ['success' => false, 'error' => 'No se pudo obtener el correo del perfil de Google.'];
        }

        return [
            'success'   => true,
            'google_id' => $userData['sub'] ?? '',
            'email'     => $userData['email'],
            'nombre'    => $userData['name'] ?? $userData['email'],
            'foto'      => $userData['picture'] ?? 'logo.png'
        ];
    }
}

