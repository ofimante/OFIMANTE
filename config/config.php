<?php
/**
 * OFIMANTE - ARCHIVO DE CONFIGURACIÓN GLOBAL
 * Ciudad Mante, Tamaulipas, México
 */

// Iniciar sesión con configuración segura si no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

// Configuración general de la plataforma
define('APP_NAME', 'OFIMANTE');
define('APP_TAGLINE', 'Bolsa de Empleo y Conexión Laboral');
define('APP_CITY', 'Ciudad Mante, Tamaulipas, México');
define('APP_URL', 'http://localhost/OFIMANTE');
define('APP_VERSION', '2.0.0');

// Tarifa obligatoria de publicación de vacantes en MXN
define('FEE_VACANCY_AMOUNT', 100.00);
define('FEE_VACANCY_CURRENCY', 'MXN');

// Parámetros de conexión a la Base de Datos MySQL (XAMPP / WAMP estándar)
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'ofimante_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuración de Google OAuth 2.0
// Para uso en producción, sustituir con las credenciales de Google Cloud Console:
// https://console.cloud.google.com/apis/credentials
define('GOOGLE_CLIENT_ID', 'TU_GOOGLE_CLIENT_ID_AQUI.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', 'TU_GOOGLE_CLIENT_SECRET_AQUI');
define('GOOGLE_REDIRECT_URI', APP_URL . '/config/google_oauth.php');

// Rutas del sistema
define('DIR_ROOT', dirname(__DIR__));
define('DIR_UPLOADS', DIR_ROOT . '/uploads');
define('DIR_UPLOADS_PDF', DIR_UPLOADS . '/pdf');
define('DIR_UPLOADS_IMG', DIR_UPLOADS . '/img');

// Asegurar directorios de subida
if (!file_exists(DIR_UPLOADS)) {
    @mkdir(DIR_UPLOADS, 0777, true);
}
if (!file_exists(DIR_UPLOADS_PDF)) {
    @mkdir(DIR_UPLOADS_PDF, 0777, true);
}
if (!file_exists(DIR_UPLOADS_IMG)) {
    @mkdir(DIR_UPLOADS_IMG, 0777, true);
}

// Generación de Token CSRF para protección de formularios
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function getCsrfToken() {
    return $_SESSION['csrf_token'] ?? '';
}

function verifyCsrfToken($token) {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// Función para sanitizar salidas contra XSS
function e($string) {
    return htmlspecialchars((string)$string, ENT_QUOTES, 'UTF-8');
}

