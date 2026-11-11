<?php
/**
 * OFIMANTE - CONEXIÓN A BASE DE DATOS MYSQL CON PDO
 * Ciudad Mante, Tamaulipas
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;
    private static bool $isMySQL = false;

    /**
     * Obtiene una instancia única de conexión PDO a MySQL.
     * Utiliza consultas preparadas y modo de errores por excepciones.
     */
    public static function getConnection(): ?PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                self::$isMySQL = true;
            } catch (PDOException $e) {
                // Si MySQL no está iniciado en XAMPP o la BD no existe, registrar advertencia
                self::$isMySQL = false;
                error_log("Aviso OFIMANTE (MySQL): " . $e->getMessage());
                return null;
            }
        }
        return self::$instance;
    }

    /**
     * Verifica si MySQL está actualmente conectado y operativo.
     */
    public static function isConnected(): bool {
        return self::getConnection() !== null;
    }
}

