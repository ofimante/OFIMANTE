<?php
/**
 * OFIMANTE - ARCHIVO DE CONFIGURACIÓN GLOBAL
 * Ciudad Mante, Tamaulipas, México
 */

// Configurar directorio seguro y con permisos para sesiones
$sessionSavePath = __DIR__ . '/../uploads/sessions';
if (!file_exists($sessionSavePath)) {
    @mkdir($sessionSavePath, 0777, true);
}
if (is_dir($sessionSavePath) && is_writable($sessionSavePath)) {
    @session_save_path($sessionSavePath);
}

// Iniciar sesión con configuración segura
if (session_status() === PHP_SESSION_NONE) {
    @ini_set('session.cookie_httponly', 1);
    @ini_set('session.use_only_cookies', 1);
    @ini_set('session.cookie_samesite', 'Lax');
    @session_start();
}

// Configuración general de la plataforma
define('APP_NAME', 'OFIMANTE');
define('APP_TAGLINE', 'Bolsa de Empleo y Vinculación Laboral');
define('APP_CITY', 'Ciudad Mante, Tamaulipas, México');
define('APP_URL', 'http://localhost/OFIMANTE');
define('APP_VERSION', '3.0.0');

// Tarifa obligatoria por publicación de vacante en MXN
define('FEE_VACANCY_AMOUNT', 100.00);
define('FEE_VACANCY_CURRENCY', 'MXN');

// Conexión a Base de Datos MySQL (Estándar XAMPP / WAMP)
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'ofimante_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuración de Google OAuth 2.0
// Configurar con credenciales de https://console.cloud.google.com/
define('GOOGLE_CLIENT_ID', 'TU_GOOGLE_CLIENT_ID_AQUI.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', 'TU_GOOGLE_CLIENT_SECRET_AQUI');
define('GOOGLE_REDIRECT_URI', APP_URL . '/config/google_oauth.php');

// Rutas de directorios
define('DIR_ROOT', dirname(__DIR__));
define('DIR_UPLOADS', DIR_ROOT . '/uploads');
define('DIR_UPLOADS_CVS', DIR_UPLOADS . '/cvs');
define('DIR_UPLOADS_FOTOS', DIR_UPLOADS . '/fotos');
define('DIR_UPLOADS_LOGOS', DIR_UPLOADS . '/logos');
define('DIR_UPLOADS_SESSIONS', DIR_UPLOADS . '/sessions');

// Asegurar existencia de directorios de subida
$uploadDirs = [DIR_UPLOADS, DIR_UPLOADS_CVS, DIR_UPLOADS_FOTOS, DIR_UPLOADS_LOGOS, DIR_UPLOADS_SESSIONS];
foreach ($uploadDirs as $dir) {
    if (!file_exists($dir)) {
        @mkdir($dir, 0777, true);
    }
}

// Generación y verificación de Token CSRF
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function getCsrfToken(): string {
    return $_SESSION['csrf_token'] ?? '';
}

function verifyCsrfToken(?string $token): bool {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}
