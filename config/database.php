<?php
/**
 * OFIMANTE - CONEXIÓN SEGURA A MYSQL CON PDO
 * Ciudad Mante, Tamaulipas
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;
    private static bool $connected = false;

    /**
     * Retorna la instancia única de conexión PDO a MySQL.
     * Utiliza consultas preparadas reales para prevenir inyecciones SQL.
     */
    public static function getConnection(): ?PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                self::$connected = true;
            } catch (PDOException $e) {
                self::$connected = false;
                error_log("Aviso de Conexión MySQL OFIMANTE: " . $e->getMessage());
                return null;
            }
        }
        return self::$instance;
    }

    public static function isConnected(): bool {
        return self::getConnection() !== null;
    }
}

