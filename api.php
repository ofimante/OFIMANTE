<?php
/**
 * OFIMANTE - API REST BACKEND EN PHP
 * Ciudad Mante, Tamaulipas
 * 
 * Endpoints didácticos para el sistema de empleo:
 * - /api.php?action=login
 * - /api.php?action=register
 * - /api.php?action=save_cv
 * - /api.php?action=save_company
 * - /api.php?action=post_job (con tarifa de servicio de $100 pesos)
 * - /api.php?action=apply_job
 * - /api.php?action=admin_approve_candidate
 * - /api.php?action=admin_approve_company
 * - /api.php?action=admin_approve_job
 * - /api.php?action=admin_ban_user
 * - /api.php?action=admin_delete_user
 * - /api.php?action=get_all_data
 */

require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Leer cuerpo de la petición (JSON)
$inputJSON = file_get_contents('php://input');
$body = json_decode($inputJSON, true) ?: [];

$db = getDatabase();

switch ($action) {

    // 1. OBTENER ESTADO COMPLETO DEL SISTEMA
    case 'get_all_data':
        respond(200, $db);
        break;

    // 2. REGISTRO DE USUARIO (Candidato, Empresa o Admin)
    case 'register':
        $email = trim($body['email'] ?? '');
        $password = trim($body['password'] ?? '');
        $nombre = trim($body['nombre'] ?? '');
        $rol = trim($body['rol'] ?? 'candidato');

        if (!$email || !$nombre) {
            respond(400, ['error' => 'Nombre y correo son obligatorios']);
        }

        // Verificar si ya existe
        foreach ($db['users'] as $u) {
            if ($u['email'] === $email) {
                respond(400, ['error' => 'Este correo ya se encuentra registrado']);
            }
        }

        $newId = count($db['users']) > 0 ? max(array_column($db['users'], 'id')) + 1 : 1;
        $newUser = [
            'id' => $newId,
            'nombre' => $nombre,
            'email' => $email,
            'password' => $password, // En producción usar password_hash()
            'rol' => $rol,
            'estado' => 'activo',
            'aprobado' => ($rol === 'admin') // Admin aprobado por defecto, los demás requieren aprobación
        ];

        $db['users'][] = $newUser;
        saveDatabase($db);

        respond(201, ['success' => true, 'message' => 'Usuario registrado exitosamente', 'user' => $newUser]);
        break;

    // 3. INICIO DE SESIÓN (Convencional o con Google)
    case 'login':
        $email = trim($body['email'] ?? '');
        $isGoogle = !empty($body['isGoogle']);

        if (!$email) {
            respond(400, ['error' => 'El correo es requerido']);
        }

        $found = null;
        foreach ($db['users'] as &$u) {
            if ($u['email'] === $email) {
                $found = $u;
                break;
            }
        }

        if (!$found) {
            if ($isGoogle) {
                // Auto-registro para usuarios de Google
                $newId = count($db['users']) > 0 ? max(array_column($db['users'], 'id')) + 1 : 1;
                $found = [
                    'id' => $newId,
                    'nombre' => $body['nombre'] ?? 'Usuario de Google',
                    'email' => $email,
                    'rol' => $body['rol'] ?? 'candidato',
                    'estado' => 'activo',
                    'aprobado' => ($body['rol'] ?? '') === 'admin'
                ];
                $db['users'][] = $found;
                saveDatabase($db);
            } else {
                respond(404, ['error' => 'Usuario no encontrado']);
            }
        }

        if ($found['estado'] === 'baneado') {
            respond(403, ['error' => 'Esta cuenta se encuentra suspendida/baneada por el Administrador']);
        }

        respond(200, ['success' => true, 'user' => $found]);
        break;

    // 4. GUARDAR O ACTUALIZAR CV DE CANDIDATO
    case 'save_cv':
        $userId = $body['userId'] ?? 1;
        $cvData = [
            'userId' => $userId,
            'nombreCompleto' => $body['nombreCompleto'] ?? '',
            'puestoSolicitado' => $body['puestoSolicitado'] ?? '',
            'edad' => $body['edad'] ?? '',
            'telefono' => $body['telefono'] ?? '',
            'correo' => $body['correo'] ?? '',
            'direccion' => $body['direccion'] ?? '',
            'escolaridad' => $body['escolaridad'] ?? '',
            'experiencia' => $body['experiencia'] ?? '',
            'habilidades' => $body['habilidades'] ?? '',
            'fotoUrl' => $body['fotoUrl'] ?? 'logo.png',
            'estadoAprobacion' => 'pendiente', // Requiere aprobación del administrador
            'fechaRegistro' => date('Y-m-d H:i:s')
        ];

        // Buscar si ya existe para actualizarlo
        $updated = false;
        if (!isset($db['candidates'])) $db['candidates'] = [];
        foreach ($db['candidates'] as &$c) {
            if ($c['userId'] == $userId) {
                $c = array_merge($c, $cvData);
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $db['candidates'][] = $cvData;
        }

        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'CV guardado. Esperando aprobación del Administrador.', 'candidate' => $cvData]);
        break;

    // 5. GUARDAR DATOS DE LA EMPRESA
    case 'save_company':
        $userId = $body['userId'] ?? 2;
        $compData = [
            'userId' => $userId,
            'razonSocial' => $body['razonSocial'] ?? '',
            'nombreComercial' => $body['nombreComercial'] ?? '',
            'rfc' => $body['rfc'] ?? '',
            'giro' => $body['giro'] ?? 'Comercio / Servicios',
            'direccion' => $body['direccion'] ?? 'Cd. Mante, Tam.',
            'telefono' => $body['telefono'] ?? '',
            'correo' => $body['correo'] ?? '',
            'estadoAprobacion' => 'pendiente', // Requiere aprobación del administrador
            'fechaRegistro' => date('Y-m-d H:i:s')
        ];

        $updated = false;
        if (!isset($db['companies'])) $db['companies'] = [];
        foreach ($db['companies'] as &$comp) {
            if ($comp['userId'] == $userId) {
                $comp = array_merge($comp, $compData);
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            $db['companies'][] = $compData;
        }

        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Datos de empresa guardados. Esperando aprobación del Administrador.', 'company' => $compData]);
        break;

    // 6. PUBLICAR VACANTE (CON TARIFA DE SERVICIO DE $100 PESOS)
    case 'post_job':
        $empresaNombre = $body['empresaNombre'] ?? 'Negocio de El Mante';
        $puesto = $body['puesto'] ?? '';
        $descripcion = $body['descripcion'] ?? '';
        $sueldo = $body['sueldo'] ?? '';
        $beneficios = $body['beneficios'] ?? '';
        $tarifaPagada = $body['tarifaPagada'] ?? true; // Tarifa de $100 pesos

        if (!$puesto || !$sueldo) {
            respond(400, ['error' => 'El puesto y el sueldo son obligatorios']);
        }

        if (!isset($db['jobs'])) $db['jobs'] = [];
        $newJobId = count($db['jobs']) > 0 ? max(array_column($db['jobs'], 'id')) + 1 : 1;

        $newJob = [
            'id' => $newJobId,
            'puesto' => $puesto,
            'empresa' => $empresaNombre,
            'ubicacion' => $body['ubicacion'] ?? 'Zona Centro, Cd. Mante',
            'descripcion' => $descripcion,
            'sueldo' => $sueldo,
            'beneficios' => $beneficios,
            'contacto' => $body['contacto'] ?? 'Contacto local',
            'tarifaServicio' => 100, // $100 pesos por publicación
            'tarifaEstado' => 'pagada',
            'estado' => 'pendiente', // El admin debe aprobarla
            'fechaPublicacion' => date('Y-m-d H:i:s')
        ];

        $db['jobs'][] = $newJob;
        saveDatabase($db);

        respond(201, ['success' => true, 'message' => 'Vacante registrada con tarifa de $100 MXN. En espera de aprobación.', 'job' => $newJob]);
        break;

    // 7. POSTULACIÓN DE CANDIDATO A VACANTE (CON FECHA Y HORA EXACTA)
    case 'apply_job':
        $jobId = $body['jobId'] ?? 0;
        $candidatoNombre = $body['candidatoNombre'] ?? 'Candidato de El Mante';
        $candidatoEmail = $body['candidatoEmail'] ?? '';
        $candidatoTelefono = $body['candidatoTelefono'] ?? '';
        $empresaNombre = $body['empresaNombre'] ?? '';

        if (!isset($db['applications'])) $db['applications'] = [];

        $newAppId = count($db['applications']) > 0 ? max(array_column($db['applications'], 'id')) + 1 : 1;
        $newApp = [
            'id' => $newAppId,
            'jobId' => $jobId,
            'puesto' => $body['puesto'] ?? 'Vacante',
            'empresaNombre' => $empresaNombre,
            'candidatoNombre' => $candidatoNombre,
            'candidatoEmail' => $candidatoEmail,
            'candidatoTelefono' => $candidatoTelefono,
            'fotoUrl' => $body['fotoUrl'] ?? 'logo.png',
            'fecha' => date('Y-m-d'),
            'hora' => date('H:i:s'),
            'timestamp' => time(), // Para ordenamiento cronológico exacto
            'estado' => 'pendiente' // 'pendiente' | 'aceptada' | 'rechazada'
        ];

        $db['applications'][] = $newApp;
        saveDatabase($db);

        respond(201, ['success' => true, 'message' => 'Postulación enviada correctamente a la empresa', 'application' => $newApp]);
        break;

    // 8. EMPRESA: ACEPTAR O RECHAZAR SOLICITUD
    case 'update_application_status':
        $appId = $body['applicationId'] ?? 0;
        $nuevoEstado = $body['estado'] ?? 'aceptada'; // 'aceptada' o 'rechazada'

        if (!isset($db['applications'])) $db['applications'] = [];
        $found = false;
        foreach ($db['applications'] as &$app) {
            if ($app['id'] == $appId) {
                $app['estado'] = $nuevoEstado;
                $found = true;
                break;
            }
        }

        if ($found) {
            saveDatabase($db);
            respond(200, ['success' => true, 'message' => 'Estado de la solicitud actualizado']);
        } else {
            respond(404, ['error' => 'Solicitud no encontrada']);
        }
        break;

    // 9. ADMINISTRADOR: APROBAR CANDIDATO
    case 'admin_approve_candidate':
        $userId = $body['userId'] ?? 0;
        if (!isset($db['candidates'])) $db['candidates'] = [];
        foreach ($db['candidates'] as &$c) {
            if ($c['userId'] == $userId) {
                $c['estadoAprobacion'] = 'aprobado';
                break;
            }
        }
        foreach ($db['users'] as &$u) {
            if ($u['id'] == $userId) {
                $u['aprobado'] = true;
                break;
            }
        }
        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Candidato aprobado con éxito']);
        break;

    // 10. ADMINISTRADOR: APROBAR EMPRESA
    case 'admin_approve_company':
        $userId = $body['userId'] ?? 0;
        if (!isset($db['companies'])) $db['companies'] = [];
        foreach ($db['companies'] as &$comp) {
            if ($comp['userId'] == $userId) {
                $comp['estadoAprobacion'] = 'aprobado';
                break;
            }
        }
        foreach ($db['users'] as &$u) {
            if ($u['id'] == $userId) {
                $u['aprobado'] = true;
                break;
            }
        }
        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Empresa aprobada con éxito']);
        break;

    // 11. ADMINISTRADOR: APROBAR VACANTE
    case 'admin_approve_job':
        $jobId = $body['jobId'] ?? 0;
        if (!isset($db['jobs'])) $db['jobs'] = [];
        foreach ($db['jobs'] as &$j) {
            if ($j['id'] == $jobId) {
                $j['estado'] = 'aprobada';
                break;
            }
        }
        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Vacante aprobada y activada']);
        break;

    // 12. ADMINISTRADOR: EDITAR VACANTE
    case 'admin_edit_job':
        $jobId = $body['jobId'] ?? 0;
        if (!isset($db['jobs'])) $db['jobs'] = [];
        foreach ($db['jobs'] as &$j) {
            if ($j['id'] == $jobId) {
                $j['puesto'] = $body['puesto'] ?? $j['puesto'];
                $j['sueldo'] = $body['sueldo'] ?? $j['sueldo'];
                $j['beneficios'] = $body['beneficios'] ?? $j['beneficios'];
                $j['descripcion'] = $body['descripcion'] ?? $j['descripcion'];
                $j['ubicacion'] = $body['ubicacion'] ?? $j['ubicacion'];
                break;
            }
        }
        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Vacante modificada exitosamente']);
        break;

    // 13. ADMINISTRADOR: ELIMINAR VACANTE
    case 'admin_delete_job':
        $jobId = $body['jobId'] ?? 0;
        if (!isset($db['jobs'])) $db['jobs'] = [];
        $db['jobs'] = array_values(array_filter($db['jobs'], function($j) use ($jobId) {
            return $j['id'] != $jobId;
        }));
        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Vacante eliminada']);
        break;

    // 14. ADMINISTRADOR: BANEAR / DESBANEAR USUARIO
    case 'admin_toggle_ban':
        $userId = $body['userId'] ?? 0;
        foreach ($db['users'] as &$u) {
            if ($u['id'] == $userId) {
                $u['estado'] = ($u['estado'] === 'baneado') ? 'activo' : 'baneado';
                break;
            }
        }
        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Estado de usuario actualizado']);
        break;

    // 15. ADMINISTRADOR: ELIMINAR USUARIO
    case 'admin_delete_user':
        $userId = $body['userId'] ?? 0;
        $db['users'] = array_values(array_filter($db['users'], function($u) use ($userId) {
            return $u['id'] != $userId;
        }));
        if (isset($db['candidates'])) {
            $db['candidates'] = array_values(array_filter($db['candidates'], function($c) use ($userId) {
                return $c['userId'] != $userId;
            }));
        }
        if (isset($db['companies'])) {
            $db['companies'] = array_values(array_filter($db['companies'], function($comp) use ($userId) {
                return $comp['userId'] != $userId;
            }));
        }
        saveDatabase($db);
        respond(200, ['success' => true, 'message' => 'Usuario eliminado del sistema']);
        break;

    default:
        respond(400, ['error' => 'Acción no reconocida en la API de OFIMANTE']);
        break;
}

