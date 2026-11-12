<?php
/**
 * OFIMANTE - CONTROLADOR DE AUTENTICACIÓN, SESIONES Y ROLES (RBAC)
 * Ciudad Mante, Tamaulipas
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

class Auth {

    /**
     * Encripta contraseñas con BCRYPT (PASSWORD_BCRYPT) de forma segura.
     */
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    /**
     * Comprueba si la contraseña ingresada coincide con el hash almacenado.
     */
    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }

    /**
     * Inicia sesión del usuario y regenera el ID de sesión para prevenir Session Fixation.
     */
    public static function loginSession(array $user): void {
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_nombre'] = $user['nombre'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_rol'] = $user['rol'];
        $_SESSION['user_avatar'] = $user['avatar'] ?? 'logo.png';
        $_SESSION['logged_in_time'] = time();

        // Registrar en historial de actividad
        self::logActivity((int)$user['id'], 'INICIO_SESION', 'Inicio de sesión exitoso en OFIMANTE.');
    }

    /**
     * Cierra la sesión activa y elimina las cookies correspondientes.
     */
    public static function logout(): void {
        if (self::check()) {
            self::logActivity((int)$_SESSION['user_id'], 'CIERRE_SESION', 'Cierre de sesión de usuario.');
        }
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
     * Indica si hay un usuario autenticado en la sesión activa.
     */
    public static function check(): bool {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }

    /**
     * Obtiene los datos del usuario en sesión.
     */
    public static function user(): ?array {
        if (!self::check()) {
            return null;
        }
        return [
            'id'     => $_SESSION['user_id'],
            'nombre' => $_SESSION['user_nombre'] ?? '',
            'email'  => $_SESSION['user_email'] ?? '',
            'rol'    => $_SESSION['user_rol'] ?? '',
            'avatar' => $_SESSION['user_avatar'] ?? 'logo.png'
        ];
    }

    /**
     * Verifica si el usuario actual cuenta con un rol determinado.
     */
    public static function hasRole(string $role): bool {
        return self::check() && ($_SESSION['user_rol'] === $role);
    }

    /**
     * Exige que el usuario posea un rol específico; de lo contrario aborta con 403.
     */
    public static function requireRole(string $role): void {
        if (!self::hasRole($role)) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Acceso no autorizado para este rol.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    /**
     * Registra eventos en la tabla `historial_actividad`.
     */
    public static function logActivity(?int $userId, string $action, string $description): void {
        $pdo = Database::getConnection();
        if ($pdo) {
            try {
                $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
                $stmt = $pdo->prepare("INSERT INTO `historial_actividad` (`usuario_id`, `accion`, `descripcion`, `direccion_ip`) VALUES (?, ?, ?, ?)");
                $stmt->execute([$userId, $action, $description, $ip]);
            } catch (Exception $e) {
                error_log("Error al registrar actividad: " . $e->getMessage());
            }
        }
    }
}

