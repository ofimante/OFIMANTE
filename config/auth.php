<?php
/**
 * OFIMANTE - GESTOR DE AUTENTICACIÓN Y SESIONES
 * Ciudad Mante, Tamaulipas
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

class Auth {

    /**
     * Encripta una contraseña con BCRYPT de forma segura.
     */
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    /**
     * Comprueba si una contraseña coincide con el hash almacenado.
     */
    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }

    /**
     * Inicia sesión del usuario en PHP Sessions y regenera el ID de sesión para prevenir Session Fixation.
     */
    public static function loginSession(array $user): void {
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_nombre'] = $user['nombre'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_rol'] = $user['rol'];
        $_SESSION['user_foto'] = $user['foto'] ?? 'logo.png';
        $_SESSION['logged_in_time'] = time();
    }

    /**
     * Cierra la sesión activa y destruye cookies de sesión.
     */
    public static function logout(): void {
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }

    /**
     * Retorna si hay un usuario autenticado en la sesión.
     */
    public static function check(): bool {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }

    /**
     * Retorna los datos del usuario autenticado en sesión.
     */
    public static function user(): ?array {
        if (!self::check()) {
            return null;
        }
        return [
            'id'     => $_SESSION['user_id'],
            'nombre' => $_SESSION['user_nombre'] ?? '',
            'email'  => $_SESSION['user_email'] ?? '',
            'rol'    => $_SESSION['user_rol'] ?? 'candidato',
            'foto'   => $_SESSION['user_foto'] ?? 'logo.png'
        ];
    }

    /**
     * Verifica si el usuario actual tiene un rol específico.
     */
    public static function hasRole(string $role): bool {
        return self::check() && ($_SESSION['user_rol'] ?? '') === $role;
    }

    /**
     * Requiere que el usuario esté autenticado con un rol permitido.
     */
    public static function requireRole(array $allowedRoles): void {
        if (!self::check() || !in_array($_SESSION['user_rol'] ?? '', $allowedRoles, true)) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error'   => 'Acceso restringido: no cuentas con los permisos requeridos.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}

