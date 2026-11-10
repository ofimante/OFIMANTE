<?php
/**
 * OFIMANTE - CONEXIÓN Y BASE DE DATOS EN PHP
 * Ciudad Mante, Tamaulipas
 *
 * Implementación didáctica y robusta para estudiantes:
 * Utiliza SQLite / archivo de datos estructurado en PHP para que funcione
 * inmediatamente en cualquier servidor Apache/PHP (XAMPP, WampServer)
 * sin requerir configuraciones adicionales de MySQL.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db_file = __DIR__ . '/database.json';

// Función para obtener los datos de la base de datos
function getDatabase() {
    global $db_file;
    if (!file_exists($db_file)) {
        $initialData = [
            'users' => [
                ['id' => 1, 'email' => 'carlos.garza@alumnos.uat.edu.mx', 'rol' => 'candidato', 'nombre' => 'Carlos Garza', 'estado' => 'activo'],
                ['id' => 2, 'email' => 'contacto@solucionesmante.com.mx', 'rol' => 'empresa', 'nombre' => 'Soluciones Digitales Mante', 'estado' => 'activo'],
                ['id' => 99, 'email' => 'admin@ofimante.com', 'rol' => 'admin', 'nombre' => 'Administrador General', 'estado' => 'activo']
            ],
            'candidates' => [],
            'companies' => [],
            'jobs' => [],
            'applications' => []
        ];
        file_put_contents($db_file, json_encode($initialData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $initialData;
    }
    $raw = file_get_contents($db_file);
    return json_decode($raw, true) ?: [];
}

// Función para guardar los datos en la base de datos
function saveDatabase($data) {
    global $db_file;
    return file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Función de respuesta JSON uniforme
function respond($status, $data) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

