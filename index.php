<?php
/**
 * OFIMANTE - ENTRADA PRINCIPAL EN PHP PARA SERVIDOR APACHE / XAMPP
 * Ciudad Mante, Tamaulipas, México
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth.php';

// Leer el archivo HTML maestro
$html = file_get_contents(__DIR__ . '/index.html');

// Inyectar el token CSRF activo de la sesión PHP para sincronización directa
$csrfScript = '<script>window.OFIMANTE_PHP_SESSION = { csrf_token: "' . getCsrfToken() . '", logged_in: ' . (Auth::check() ? 'true' : 'false') . ' };</script>';
$html = str_replace('</head>', $csrfScript . "\n</head>", $html);

echo $html;

