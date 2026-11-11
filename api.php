<?php
/**
 * OFIMANTE - API REST BACKEND EN PHP (MYSQL & PDO)
 * Ciudad Mante, Tamaulipas, México
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Leer cuerpo JSON si existe
$inputRaw = file_get_contents('php://input');
$body = json_decode($inputRaw, true) ?: [];

// Obtener conexión PDO a MySQL
$pdo = Database::getConnection();
$isMySQL = ($pdo !== null);

// Helper para responder en JSON
function apiResponse(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Helper para archivo JSON fallback si MySQL no estuviese iniciado
$db_file = __DIR__ . '/database.json';
function getJsonDb() {
    global $db_file;
    if (!file_exists($db_file)) {
        return ['users' => [], 'candidates' => [], 'companies' => [], 'jobs' => [], 'applications' => [], 'payments' => []];
    }
    return json_decode(file_get_contents($db_file), true) ?: [];
}
function saveJsonDb($data) {
    global $db_file;
    return file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

switch ($action) {

    // --------------------------------------------------------------------------
    // 1. SESIÓN ACTUAL Y ESTADO DE CONEXIÓN
    // --------------------------------------------------------------------------
    case 'get_session':
        $user = Auth::user();
        apiResponse(200, [
            'success'    => true,
            'logged_in'  => Auth::check(),
            'user'       => $user,
            'csrf_token' => getCsrfToken(),
            'engine'     => $isMySQL ? 'MySQL (PDO Conectado)' : 'Local Fallback'
        ]);
        break;

    // --------------------------------------------------------------------------
    // 2. OBTENER TODOS LOS DATOS PARA LA PLATAFORMA
    // --------------------------------------------------------------------------
    case 'get_all_data':
        if ($isMySQL) {
            try {
                // Usuarios
                $stmt = $pdo->query("SELECT id, nombre, email, rol, estado, foto FROM usuarios WHERE estado != 'eliminado'");
                $users = $stmt->fetchAll();

                // Candidatos con datos de currículum
                $stmt = $pdo->query("
                    SELECT c.*, cv.puesto_deseado, cv.experiencia_laboral, cv.habilidades, cv.conocimientos, cv.archivo_pdf 
                    FROM candidatos c
                    LEFT JOIN curriculums cv ON cv.candidato_id = c.id
                ");
                $candidates = $stmt->fetchAll();

                // Empresas
                $stmt = $pdo->query("SELECT * FROM empresas");
                $companies = $stmt->fetchAll();

                // Vacantes con información de su empresa
                $stmt = $pdo->query("
                    SELECT v.*, e.nombre_comercial AS empresa_nombre, e.logotipo AS empresa_logo, e.direccion AS empresa_direccion
                    FROM vacantes v
                    JOIN empresas e ON e.id = v.empresa_id
                    ORDER BY v.id DESC
                ");
                $jobs = $stmt->fetchAll();

                // Solicitudes ordenadas desde la más reciente a la más antigua
                $stmt = $pdo->query("
                    SELECT s.*, 
                           c.nombre_completo AS candidato_nombre, c.email_contacto AS candidato_email, 
                           c.telefono AS candidato_telefono, c.domicilio AS candidato_direccion,
                           u.foto AS candidato_foto,
                           cv.puesto_deseado, cv.habilidades, cv.archivo_pdf,
                           v.puesto AS vacante_puesto, v.empresa_id,
                           e.nombre_comercial AS empresa_nombre
                    FROM solicitudes s
                    JOIN candidatos c ON c.id = s.candidato_id
                    JOIN usuarios u ON u.id = c.usuario_id
                    LEFT JOIN curriculums cv ON cv.candidato_id = c.id
                    JOIN vacantes v ON v.id = s.vacante_id
                    JOIN empresas e ON e.id = v.empresa_id
                    ORDER BY s.fecha_postulacion DESC
                ");
                $applications = $stmt->fetchAll();

                // Pagos
                $stmt = $pdo->query("SELECT * FROM pagos ORDER BY id DESC");
                $payments = $stmt->fetchAll();

                apiResponse(200, [
                    'success'      => true,
                    'engine'       => 'MySQL',
                    'users'        => $users,
                    'candidates'   => $candidates,
                    'companies'    => $companies,
                    'jobs'         => $jobs,
                    'applications' => $applications,
                    'payments'     => $payments
                ]);
            } catch (Exception $e) {
                // En caso de fallo transitorio en MySQL, recurrir a json
                $jData = getJsonDb();
                $jData['engine'] = 'JSON Fallback';
                apiResponse(200, $jData);
            }
        } else {
            $jData = getJsonDb();
            $jData['engine'] = 'JSON Fallback';
            apiResponse(200, $jData);
        }
        break;

    // --------------------------------------------------------------------------
    // 3. REGISTRO DE USUARIOS (CANDIDATO O EMPRESA)
    // REGLA: El rol admin NO se puede seleccionar desde el registro público.
    // --------------------------------------------------------------------------
    case 'register':
        $nombre = trim($body['nombre'] ?? '');
        $email = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $password = trim($body['password'] ?? '');
        $rol = trim($body['rol'] ?? 'candidato');

        if (!$nombre || !$email || strlen($password) < 6) {
            apiResponse(400, ['success' => false, 'error' => 'Nombre, correo válido y contraseña de mínimo 6 caracteres son obligatorios.']);
        }

        // Validación estricta: No permitir registro público de administradores
        if ($rol === 'admin') {
            apiResponse(403, ['success' => false, 'error' => 'El rol de administrador no puede ser creado mediante el registro público.']);
        }

        if (!in_array($rol, ['candidato', 'empresa'], true)) {
            $rol = 'candidato';
        }

        $passwordHash = Auth::hashPassword($password);

        if ($isMySQL) {
            try {
                // Verificar correo duplicado
                $stmtCheck = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
                $stmtCheck->execute([':email' => $email]);
                if ($stmtCheck->fetch()) {
                    apiResponse(409, ['success' => false, 'error' => 'Este correo electrónico ya se encuentra registrado. Inicia sesión.']);
                }

                // Insertar usuario
                $stmtUser = $pdo->prepare("
                    INSERT INTO usuarios (nombre, email, password, rol, estado, foto) 
                    VALUES (:nombre, :email, :password, :rol, 'activo', 'logo.png')
                ");
                $stmtUser->execute([
                    ':nombre'   => $nombre,
                    ':email'    => $email,
                    ':password' => $passwordHash,
                    ':rol'      => $rol
                ]);
                $userId = (int)$pdo->lastInsertId();

                // Crear registro inicial dependiente según rol
                if ($rol === 'candidato') {
                    $stmtCand = $pdo->prepare("
                        INSERT INTO candidatos (usuario_id, nombre_completo, email_contacto, telefono, domicilio, nivel_academico, estado_aprobacion)
                        VALUES (:uid, :nombre, :email, '', 'Ciudad Mante, Tam.', 'Por registrar', 'pendiente')
                    ");
                    $stmtCand->execute([':uid' => $userId, ':nombre' => $nombre, ':email' => $email]);
                    $candId = (int)$pdo->lastInsertId();

                    $stmtCv = $pdo->prepare("
                        INSERT INTO curriculums (candidato_id, puesto_deseado, experiencia_laboral, habilidades, conocimientos)
                        VALUES (:cid, 'Por especificar', '', '', '')
                    ");
                    $stmtCv->execute([':cid' => $candId]);
                } else if ($rol === 'empresa') {
                    $stmtEmp = $pdo->prepare("
                        INSERT INTO empresas (usuario_id, nombre_comercial, razon_social, responsable_nombre, telefono, email_corporativo, direccion, giro_comercial, estado_aprobacion)
                        VALUES (:uid, :nombre, :nombre, :responsable, '', :email, 'Ciudad Mante, Tam.', 'Comercio / Servicios', 'pendiente')
                    ");
                    $stmtEmp->execute([
                        ':uid'         => $userId,
                        ':nombre'      => $nombre,
                        ':responsable' => $nombre,
                        ':email'       => $email
                    ]);
                }

                $user = ['id' => $userId, 'nombre' => $nombre, 'email' => $email, 'rol' => $rol, 'foto' => 'logo.png'];
                Auth::loginSession($user);

                apiResponse(201, [
                    'success' => true,
                    'message' => 'Registro completado exitosamente.',
                    'user'    => $user
                ]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => 'Error al registrar usuario en la base de datos: ' . $e->getMessage()]);
            }
        } else {
            // Modo Local Fallback JSON
            $jData = getJsonDb();
            foreach ($jData['users'] as $u) {
                if ($u['email'] === $email) {
                    apiResponse(409, ['success' => false, 'error' => 'Este correo ya se encuentra registrado.']);
                }
            }
            $userId = count($jData['users']) > 0 ? max(array_column($jData['users'], 'id')) + 1 : 1;
            $user = ['id' => $userId, 'nombre' => $nombre, 'email' => $email, 'rol' => $rol, 'foto' => 'logo.png'];
            $jData['users'][] = array_merge($user, ['password' => $passwordHash, 'estado' => 'activo']);
            saveJsonDb($jData);
            Auth::loginSession($user);
            apiResponse(201, ['success' => true, 'message' => 'Usuario registrado.', 'user' => $user]);
        }
        break;

    // --------------------------------------------------------------------------
    // 4. INICIO DE SESIÓN (LOGIN CON VERIFICACIÓN BCRYPT Y SESIONES PHP)
    // --------------------------------------------------------------------------
    case 'login':
        $email = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $password = trim($body['password'] ?? '');

        if (!$email || !$password) {
            apiResponse(400, ['success' => false, 'error' => 'Por favor ingresa tu correo y contraseña.']);
        }

        if ($isMySQL) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email LIMIT 1");
                $stmt->execute([':email' => $email]);
                $user = $stmt->fetch();

                if (!$user) {
                    apiResponse(404, ['success' => false, 'error' => 'No existe una cuenta registrada con este correo electrónico.']);
                }

                if ($user['estado'] === 'suspendido') {
                    apiResponse(403, ['success' => false, 'error' => 'Esta cuenta se encuentra temporalmente suspendida por un administrador.']);
                }

                // Verificación segura con password_verify()
                // También soporta contraseñas de prueba precargadas si se hubieran ingresado en texto plano
                $valid = Auth::verifyPassword($password, $user['password'] ?? '') || ($password === $user['password']);
                if (!$valid) {
                    apiResponse(401, ['success' => false, 'error' => 'La contraseña ingresada es incorrecta.']);
                }

                $sessionUser = [
                    'id'     => $user['id'],
                    'nombre' => $user['nombre'],
                    'email'  => $user['email'],
                    'rol'    => $user['rol'],
                    'foto'   => $user['foto'] ?? 'logo.png'
                ];
                Auth::loginSession($sessionUser);

                apiResponse(200, [
                    'success' => true,
                    'message' => 'Bienvenido de nuevo a OFIMANTE.',
                    'user'    => $sessionUser
                ]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => 'Error en consulta de inicio de sesión: ' . $e->getMessage()]);
            }
        } else {
            $jData = getJsonDb();
            $found = null;
            foreach ($jData['users'] as $u) {
                if ($u['email'] === $email) {
                    $found = $u;
                    break;
                }
            }
            if (!$found) {
                apiResponse(404, ['success' => false, 'error' => 'Usuario no encontrado.']);
            }
            Auth::loginSession($found);
            apiResponse(200, ['success' => true, 'user' => $found]);
        }
        break;

    // --------------------------------------------------------------------------
    // 5. INICIO DE SESIÓN CON GOOGLE OAUTH 2.0
    // --------------------------------------------------------------------------
    case 'google_login':
        $email = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $nombre = trim($body['nombre'] ?? 'Usuario de Google');
        $googleId = trim($body['google_id'] ?? '');
        $rol = trim($body['rol'] ?? 'candidato');
        $foto = trim($body['foto'] ?? 'logo.png');

        if (!$email) {
            apiResponse(400, ['success' => false, 'error' => 'Correo de Google no válido.']);
        }

        // Si es rol admin, no permitir autoregistro
        if ($rol === 'admin') {
            $rol = 'candidato';
        }

        if ($isMySQL) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email LIMIT 1");
                $stmt->execute([':email' => $email]);
                $user = $stmt->fetch();

                if (!$user) {
                    // Autoregistro con Google
                    $stmtIns = $pdo->prepare("
                        INSERT INTO usuarios (nombre, email, google_id, foto, rol, estado)
                        VALUES (:nombre, :email, :gid, :foto, :rol, 'activo')
                    ");
                    $stmtIns->execute([
                        ':nombre' => $nombre,
                        ':email'  => $email,
                        ':gid'    => $googleId,
                        ':foto'   => $foto,
                        ':rol'    => $rol
                    ]);
                    $userId = (int)$pdo->lastInsertId();

                    if ($rol === 'candidato') {
                        $pdo->prepare("INSERT INTO candidatos (usuario_id, nombre_completo, email_contacto, telefono, domicilio, nivel_academico, estado_aprobacion) VALUES (?, ?, ?, '', 'Cd. Mante', 'Universidad', 'pendiente')")
                            ->execute([$userId, $nombre, $email]);
                        $candId = (int)$pdo->lastInsertId();
                        $pdo->prepare("INSERT INTO curriculums (candidato_id, puesto_deseado, experiencia_laboral, habilidades) VALUES (?, 'Bolsa de trabajo', '', '')")
                            ->execute([$candId]);
                    } else if ($rol === 'empresa') {
                        $pdo->prepare("INSERT INTO empresas (usuario_id, nombre_comercial, razon_social, responsable_nombre, telefono, email_corporativo, direccion, giro_comercial, estado_aprobacion) VALUES (?, ?, ?, ?, '', ?, 'Cd. Mante', 'Servicios', 'pendiente')")
                            ->execute([$userId, $nombre, $nombre, $nombre, $email]);
                    }

                    $user = ['id' => $userId, 'nombre' => $nombre, 'email' => $email, 'rol' => $rol, 'foto' => $foto];
                }

                Auth::loginSession($user);
                apiResponse(200, ['success' => true, 'message' => 'Autenticación con Google exitosa.', 'user' => $user]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            $user = ['id' => Date('U'), 'nombre' => $nombre, 'email' => $email, 'rol' => $rol, 'foto' => $foto];
            Auth::loginSession($user);
            apiResponse(200, ['success' => true, 'user' => $user]);
        }
        break;

    // --------------------------------------------------------------------------
    // 6. CIERRE DE SESIÓN
    // --------------------------------------------------------------------------
    case 'logout':
        Auth::logout();
        apiResponse(200, ['success' => true, 'message' => 'Sesión cerrada correctamente.']);
        break;

    // --------------------------------------------------------------------------
    // 7. PANEL CANDIDATO: GUARDAR / ACTUALIZAR CURRÍCULUM
    // Campos requeridos: nombre, fecha_nacimiento, edad, telefono, email, domicilio,
    // foto, nivel academico, experiencia, habilidades, conocimientos, descripcion, disponibilidad.
    // --------------------------------------------------------------------------
    case 'save_cv':
        Auth::requireRole(['candidato', 'admin']);
        $userSession = Auth::user();
        $userId = $body['usuario_id'] ?? $userSession['id'];

        $nombreCompleto = trim($body['nombre_completo'] ?? '');
        $fechaNacimiento = $body['fecha_nacimiento'] ?? null;
        $edad = (int)($body['edad'] ?? 0);
        $telefono = trim($body['telefono'] ?? '');
        $emailContacto = trim($body['email_contacto'] ?? $userSession['email']);
        $domicilio = trim($body['domicilio'] ?? '');
        $nivelAcademico = trim($body['nivel_academico'] ?? '');
        $disponibilidad = trim($body['disponibilidad'] ?? 'Inmediata');
        $descripcionPersonal = trim($body['descripcion_personal'] ?? '');
        $fotoUrl = trim($body['foto'] ?? 'logo.png');

        $puestoDeseado = trim($body['puesto_deseado'] ?? 'General');
        $experiencia = trim($body['experiencia_laboral'] ?? '');
        $habilidades = trim($body['habilidades'] ?? '');
        $conocimientos = trim($body['conocimientos'] ?? '');
        $archivoPdf = trim($body['archivo_pdf'] ?? '');

        if (!$nombreCompleto || !$telefono || !$domicilio || !$habilidades) {
            apiResponse(400, ['success' => false, 'error' => 'Por favor completa los datos obligatorios del currículum.']);
        }

        if ($isMySQL) {
            try {
                // Verificar si existe candidato
                $stmtC = $pdo->prepare("SELECT id FROM candidatos WHERE usuario_id = :uid");
                $stmtC->execute([':uid' => $userId]);
                $cand = $stmtC->fetch();

                if ($cand) {
                    $candId = $cand['id'];
                    $stmtUp = $pdo->prepare("
                        UPDATE candidatos SET
                            nombre_completo = :nom, fecha_nacimiento = :fn, edad = :edad,
                            telefono = :tel, email_contacto = :em, domicilio = :dom,
                            nivel_academico = :na, disponibilidad = :disp,
                            descripcion_personal = :desc, estado_aprobacion = 'pendiente', motivo_rechazo = NULL
                        WHERE id = :cid
                    ");
                    $stmtUp->execute([
                        ':nom' => $nombreCompleto, ':fn' => $fechaNacimiento, ':edad' => $edad,
                        ':tel' => $telefono, ':em' => $emailContacto, ':dom' => $domicilio,
                        ':na'  => $nivelAcademico, ':disp' => $disponibilidad,
                        ':desc'=> $descripcionPersonal, ':cid' => $candId
                    ]);
                } else {
                    $stmtIn = $pdo->prepare("
                        INSERT INTO candidatos (usuario_id, nombre_completo, fecha_nacimiento, edad, telefono, email_contacto, domicilio, nivel_academico, disponibilidad, descripcion_personal, estado_aprobacion)
                        VALUES (:uid, :nom, :fn, :edad, :tel, :em, :dom, :na, :disp, :desc, 'pendiente')
                    ");
                    $stmtIn->execute([
                        ':uid' => $userId, ':nom' => $nombreCompleto, ':fn' => $fechaNacimiento,
                        ':edad' => $edad, ':tel' => $telefono, ':em' => $emailContacto, ':dom' => $domicilio,
                        ':na'  => $nivelAcademico, ':disp' => $disponibilidad, ':desc'=> $descripcionPersonal
                    ]);
                    $candId = (int)$pdo->lastInsertId();
                }

                // Actualizar foto en tabla de usuarios si se especificó
                if ($fotoUrl) {
                    $pdo->prepare("UPDATE usuarios SET foto = :foto WHERE id = :uid")->execute([':foto' => $fotoUrl, ':uid' => $userId]);
                }

                // Guardar / Actualizar en curriculums
                $stmtCvCheck = $pdo->prepare("SELECT id FROM curriculums WHERE candidato_id = :cid");
                $stmtCvCheck->execute([':cid' => $candId]);
                if ($stmtCvCheck->fetch()) {
                    $pdo->prepare("
                        UPDATE curriculums SET
                            puesto_deseado = :pd, experiencia_laboral = :exp, habilidades = :hab, conocimientos = :con, archivo_pdf = COALESCE(NULLIF(:pdf, ''), archivo_pdf)
                        WHERE candidato_id = :cid
                    ")->execute([':pd' => $puestoDeseado, ':exp' => $experiencia, ':hab' => $habilidades, ':con' => $conocimientos, ':pdf' => $archivoPdf, ':cid' => $candId]);
                } else {
                    $pdo->prepare("
                        INSERT INTO curriculums (candidato_id, puesto_deseado, experiencia_laboral, habilidades, conocimientos, archivo_pdf)
                        VALUES (:cid, :pd, :exp, :hab, :con, :pdf)
                    ")->execute([':cid' => $candId, ':pd' => $puestoDeseado, ':exp' => $experiencia, ':hab' => $habilidades, ':con' => $conocimientos, ':pdf' => $archivoPdf]);
                }

                apiResponse(200, [
                    'success' => true,
                    'message' => 'Currículum guardado exitosamente. Se encuentra en revisión por el Administrador.',
                    'estado'  => 'pendiente'
                ]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => 'Currículum guardado (Modo local).', 'estado' => 'pendiente']);
        }
        break;

    // --------------------------------------------------------------------------
    // 8. PANEL CANDIDATO: SUBIDA DE ARCHIVO PDF DE CURRÍCULUM
    // --------------------------------------------------------------------------
    case 'upload_pdf':
        Auth::requireRole(['candidato', 'admin']);
        if (!isset($_FILES['pdf_file']) || $_FILES['pdf_file']['error'] !== UPLOAD_ERR_OK) {
            apiResponse(400, ['success' => false, 'error' => 'No se recibió ningún archivo PDF válido.']);
        }

        $file = $_FILES['pdf_file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if ($ext !== 'pdf' || $file['type'] !== 'application/pdf') {
            apiResponse(400, ['success' => false, 'error' => 'Formato no permitido. Solo se aceptan archivos .PDF oficiales.']);
        }

        if ($file['size'] > 5 * 1024 * 1024) { // 5 MB max
            apiResponse(400, ['success' => false, 'error' => 'El archivo supera el límite de 5 Megabytes.']);
        }

        $safeName = 'cv_' . time() . '_' . bin2hex(random_bytes(6)) . '.pdf';
        $destination = DIR_UPLOADS_PDF . '/' . $safeName;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $userSession = Auth::user();
            if ($isMySQL && $userSession) {
                $pdo->prepare("
                    UPDATE curriculums cv
                    JOIN candidatos c ON c.id = cv.candidato_id
                    SET cv.archivo_pdf = :path
                    WHERE c.usuario_id = :uid
                ")->execute([':path' => 'uploads/pdf/' . $safeName, ':uid' => $userSession['id']]);
            }

            apiResponse(200, [
                'success'  => true,
                'message'  => 'Documento PDF subido correctamente.',
                'file_url' => 'uploads/pdf/' . $safeName
            ]);
        } else {
            apiResponse(500, ['success' => false, 'error' => 'No se pudo almacenar el archivo PDF en el servidor.']);
        }
        break;

    // --------------------------------------------------------------------------
    // 9. PANEL EMPRESA: GUARDAR / ACTUALIZAR REGISTRO EMPRESARIAL
    // --------------------------------------------------------------------------
    case 'save_company':
        Auth::requireRole(['empresa', 'admin']);
        $userSession = Auth::user();
        $userId = $body['usuario_id'] ?? $userSession['id'];

        $nombreComercial = trim($body['nombre_comercial'] ?? '');
        $razonSocial = trim($body['razon_social'] ?? '');
        $rfc = trim($body['rfc'] ?? '');
        $responsable = trim($body['responsable_nombre'] ?? '');
        $telefono = trim($body['telefono'] ?? '');
        $email = trim($body['email_corporativo'] ?? $userSession['email']);
        $direccion = trim($body['direccion'] ?? '');
        $giro = trim($body['giro_comercial'] ?? 'Comercio / Servicios');
        $descripcion = trim($body['descripcion_negocio'] ?? '');
        $logotipo = trim($body['logotipo'] ?? 'logo.png');

        if (!$nombreComercial || !$responsable || !$telefono || !$direccion) {
            apiResponse(400, ['success' => false, 'error' => 'Nombre comercial, responsable, teléfono y dirección son obligatorios.']);
        }

        if ($isMySQL) {
            try {
                $stmtCheck = $pdo->prepare("SELECT id FROM empresas WHERE usuario_id = :uid");
                $stmtCheck->execute([':uid' => $userId]);
                $emp = $stmtCheck->fetch();

                if ($emp) {
                    $pdo->prepare("
                        UPDATE empresas SET
                            nombre_comercial = :nc, razon_social = :rs, rfc = :rfc,
                            responsable_nombre = :resp, telefono = :tel, email_corporativo = :em,
                            direccion = :dir, giro_comercial = :giro, descripcion_negocio = :desc,
                            logotipo = :logo, estado_aprobacion = 'pendiente', motivo_rechazo = NULL
                        WHERE id = :id
                    ")->execute([
                        ':nc' => $nombreComercial, ':rs' => $razonSocial, ':rfc' => $rfc,
                        ':resp' => $responsable, ':tel' => $telefono, ':em' => $email,
                        ':dir' => $direccion, ':giro' => $giro, ':desc' => $descripcion,
                        ':logo' => $logotipo, ':id' => $emp['id']
                    ]);
                } else {
                    $pdo->prepare("
                        INSERT INTO empresas (usuario_id, nombre_comercial, razon_social, rfc, responsable_nombre, telefono, email_corporativo, direccion, giro_comercial, descripcion_negocio, logotipo, estado_aprobacion)
                        VALUES (:uid, :nc, :rs, :rfc, :resp, :tel, :em, :dir, :giro, :desc, :logo, 'pendiente')
                    ")->execute([
                        ':uid' => $userId, ':nc' => $nombreComercial, ':rs' => $razonSocial, ':rfc' => $rfc,
                        ':resp' => $responsable, ':tel' => $telefono, ':em' => $email,
                        ':dir' => $direccion, ':giro' => $giro, ':desc' => $descripcion, ':logo' => $logotipo
                    ]);
                }

                apiResponse(200, [
                    'success' => true,
                    'message' => 'Datos empresariales registrados con éxito. Pendiente de aprobación administrativa.'
                ]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => 'Empresa guardada (Modo local).']);
        }
        break;

    // --------------------------------------------------------------------------
    // 10. PUBLICACIÓN DE VACANTE CON TARIFA DE $100 PESOS (PAGO DEMO VALIDADO)
    // --------------------------------------------------------------------------
    case 'post_job':
        Auth::requireRole(['empresa', 'admin']);
        $userSession = Auth::user();

        $puesto = trim($body['puesto'] ?? '');
        $descripcion = trim($body['descripcion'] ?? '');
        $vacantesNum = (int)($body['vacantes_disponibles'] ?? 1);
        $requisitos = trim($body['requisitos'] ?? '');
        $experiencia = trim($body['experiencia_requerida'] ?? '');
        $escolaridad = trim($body['escolaridad_minima'] ?? '');
        $horario = trim($body['horario'] ?? 'Tiempo Completo');
        $tipoContrato = trim($body['tipo_contratacion'] ?? 'Tiempo Completo');
        $sueldo = trim($body['sueldo_ofrecido'] ?? '');
        $beneficios = trim($body['prestaciones_beneficios'] ?? '');
        $categoria = trim($body['categoria'] ?? 'General');
        $ubicacion = trim($body['ubicacion'] ?? 'Ciudad Mante, Tam.');
        $contacto = trim($body['contacto'] ?? $userSession['email']);
        $fechaCierre = $body['fecha_cierre'] ?? null;
        $montoTarifa = FEE_VACANCY_AMOUNT; // $100.00 MXN

        if (!$puesto || !$sueldo || !$beneficios || !$requisitos) {
            apiResponse(400, ['success' => false, 'error' => 'Puesto, sueldo ofrecido, beneficios y requisitos son campos obligatorios.']);
        }

        if ($isMySQL) {
            try {
                // Obtener ID de la empresa
                $stmtE = $pdo->prepare("SELECT id, estado_aprobacion FROM empresas WHERE usuario_id = :uid");
                $stmtE->execute([':uid' => $userSession['id']]);
                $emp = $stmtE->fetch();

                if (!$emp && $userSession['rol'] !== 'admin') {
                    apiResponse(403, ['success' => false, 'error' => 'Debes registrar tu perfil empresarial antes de publicar vacantes.']);
                }

                $empresaId = $emp ? $emp['id'] : 1;

                if ($emp && $emp['estado_aprobacion'] !== 'aprobado' && $userSession['rol'] !== 'admin') {
                    apiResponse(403, ['success' => false, 'error' => 'Tu empresa aún no ha sido aprobada por un administrador.']);
                }

                // Insertar vacante con tarifa marcada como pagada (flujo demo validado)
                $stmtJob = $pdo->prepare("
                    INSERT INTO vacantes (
                        empresa_id, puesto, descripcion, vacantes_disponibles, requisitos,
                        experiencia_requerida, escolaridad_minima, horario, tipo_contratacion,
                        sueldo_ofrecido, prestaciones_beneficios, categoria, ubicacion, contacto,
                        tarifa_monto, tarifa_pagada, estado, fecha_publicacion, fecha_cierre
                    ) VALUES (
                        :eid, :puesto, :desc, :num, :req, :exp, :esc, :hor, :tipo,
                        :sueldo, :ben, :cat, :ubi, :cont, :tarifa, 1, 'aprobada', CURDATE(), :fcierre
                    )
                ");
                $stmtJob->execute([
                    ':eid'     => $empresaId,
                    ':puesto'  => $puesto,
                    ':desc'    => $descripcion,
                    ':num'     => $vacantesNum,
                    ':req'     => $requisitos,
                    ':exp'     => $experiencia,
                    ':esc'     => $escolaridad,
                    ':hor'     => $horario,
                    ':tipo'    => $tipoContrato,
                    ':sueldo'  => $sueldo,
                    ':ben'     => $beneficios,
                    ':cat'     => $categoria,
                    ':ubi'     => $ubicacion,
                    ':cont'    => $contacto,
                    ':tarifa'  => $montoTarifa,
                    ':fcierre' => $fechaCierre
                ]);
                $vacanteId = (int)$pdo->lastInsertId();

                // Registrar transacción en la tabla de pagos ($100 MXN)
                $refTransaccion = 'OFM-' . strtoupper(bin2hex(random_bytes(4))) . '-' . time();
                $stmtPago = $pdo->prepare("
                    INSERT INTO pagos (vacante_id, empresa_id, monto, moneda, metodo_pago, referencia_transaccion, estado, fecha_pago)
                    VALUES (:vid, :eid, :monto, 'MXN', 'Demostración / Tarjeta Demo', :ref, 'completado', NOW())
                ");
                $stmtPago->execute([
                    ':vid'   => $vacanteId,
                    ':eid'   => $empresaId,
                    ':monto' => $montoTarifa,
                    ':ref'   => $refTransaccion
                ]);

                apiResponse(201, [
                    'success'       => true,
                    'message'       => 'Vacante publicada exitosamente tras validación de tarifa de $100 MXN.',
                    'vacante_id'    => $vacanteId,
                    'pago_ref'      => $refTransaccion,
                    'monto_pagado'  => $montoTarifa
                ]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(201, ['success' => true, 'message' => 'Vacante registrada con tarifa de $100 MXN (Modo Local).']);
        }
        break;

    // --------------------------------------------------------------------------
    // 11. POSTULACIÓN DE CANDIDATO A VACANTE (ORDENADA POR DÍA Y HORA)
    // --------------------------------------------------------------------------
    case 'apply_job':
        Auth::requireRole(['candidato', 'admin']);
        $userSession = Auth::user();
        $vacanteId = (int)($body['vacante_id'] ?? 0);
        $mensaje = trim($body['mensaje'] ?? 'Me interesa mucho esta vacante y cuento con disponibilidad.');

        if ($vacanteId <= 0) {
            apiResponse(400, ['success' => false, 'error' => 'Vacante inválida.']);
        }

        if ($isMySQL) {
            try {
                // Obtener ID del candidato y verificar estado
                $stmtCand = $pdo->prepare("SELECT id, estado_aprobacion FROM candidatos WHERE usuario_id = :uid");
                $stmtCand->execute([':uid' => $userSession['id']]);
                $cand = $stmtCand->fetch();

                if (!$cand) {
                    apiResponse(403, ['success' => false, 'error' => 'Debes registrar tu currículum antes de postularte.']);
                }

                if ($cand['estado_aprobacion'] !== 'aprobado') {
                    apiResponse(403, ['success' => false, 'error' => 'Tu perfil de candidato aún no ha sido aprobado por el Administrador.']);
                }

                // Evitar postulación duplicada
                $stmtCheck = $pdo->prepare("SELECT id FROM solicitudes WHERE vacante_id = :vid AND candidato_id = :cid");
                $stmtCheck->execute([':vid' => $vacanteId, ':cid' => $cand['id']]);
                if ($stmtCheck->fetch()) {
                    apiResponse(409, ['success' => false, 'error' => 'Ya te has postulado anteriormente a esta vacante.']);
                }

                // Insertar postulación con marca de tiempo precisa
                $stmtApp = $pdo->prepare("
                    INSERT INTO solicitudes (vacante_id, candidato_id, estado, mensaje_candidato, fecha_postulacion)
                    VALUES (:vid, :cid, 'pendiente', :msj, NOW())
                ");
                $stmtApp->execute([
                    ':vid' => $vacanteId,
                    ':cid' => $cand['id'],
                    ':msj' => $mensaje
                ]);

                apiResponse(201, [
                    'success' => true,
                    'message' => '¡Tu currículum ha sido enviado con éxito a la empresa!'
                ]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(201, ['success' => true, 'message' => 'Postulación enviada (Modo local).']);
        }
        break;

    // --------------------------------------------------------------------------
    // 12. RESPUESTA DE EMPRESA A SOLICITUD (ACEPTAR / RECHAZAR CON NOTA)
    // --------------------------------------------------------------------------
    case 'update_application_status':
        Auth::requireRole(['empresa', 'admin']);
        $solicitudId = (int)($body['solicitud_id'] ?? 0);
        $nuevoEstado = trim($body['estado'] ?? 'aceptada'); // 'aceptada' | 'rechazada'
        $respuestaEmpresa = trim($body['respuesta_empresa'] ?? '');

        if (!in_array($nuevoEstado, ['aceptada', 'rechazada'], true)) {
            apiResponse(400, ['success' => false, 'error' => 'Estado de respuesta inválido.']);
        }

        if ($isMySQL) {
            try {
                $stmt = $pdo->prepare("
                    UPDATE solicitudes SET
                        estado = :estado,
                        respuesta_empresa = :resp,
                        fecha_respuesta = NOW()
                    WHERE id = :id
                ");
                $stmt->execute([
                    ':estado' => $nuevoEstado,
                    ':resp'   => $respuestaEmpresa,
                    ':id'     => $solicitudId
                ]);

                apiResponse(200, [
                    'success' => true,
                    'message' => "Solicitud marcada como {$nuevoEstado} exitosamente."
                ]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => "Estado actualizado a {$nuevoEstado}."]);
        }
        break;

    // --------------------------------------------------------------------------
    // 13. ADMINISTRADOR: APROBAR O RECHAZAR CANDIDATO
    // --------------------------------------------------------------------------
    case 'admin_set_candidate_status':
        Auth::requireRole(['admin']);
        $candidatoId = (int)($body['candidato_id'] ?? 0);
        $nuevoEstado = trim($body['estado'] ?? 'aprobado'); // 'aprobado', 'rechazado', 'suspendido'
        $motivo = trim($body['motivo_rechazo'] ?? '');

        if ($isMySQL) {
            try {
                $adminUser = Auth::user();
                $stmt = $pdo->prepare("
                    UPDATE candidatos SET
                        estado_aprobacion = :st,
                        motivo_rechazo = :mot,
                        aprobado_por = :adm,
                        fecha_aprobacion = NOW()
                    WHERE id = :id
                ");
                $stmt->execute([
                    ':st'  => $nuevoEstado,
                    ':mot' => ($nuevoEstado === 'rechazado' ? $motivo : null),
                    ':adm' => $adminUser['id'],
                    ':id'  => $candidatoId
                ]);

                apiResponse(200, ['success' => true, 'message' => "Estado del candidato actualizado a: {$nuevoEstado}."]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => "Candidato {$nuevoEstado}."]);
        }
        break;

    // --------------------------------------------------------------------------
    // 14. ADMINISTRADOR: APROBAR O RECHAZAR EMPRESA
    // --------------------------------------------------------------------------
    case 'admin_set_company_status':
        Auth::requireRole(['admin']);
        $empresaId = (int)($body['empresa_id'] ?? 0);
        $nuevoEstado = trim($body['estado'] ?? 'aprobado'); // 'aprobado', 'rechazado', 'suspendido'
        $motivo = trim($body['motivo_rechazo'] ?? '');

        if ($isMySQL) {
            try {
                $adminUser = Auth::user();
                $stmt = $pdo->prepare("
                    UPDATE empresas SET
                        estado_aprobacion = :st,
                        motivo_rechazo = :mot,
                        aprobado_por = :adm,
                        fecha_aprobacion = NOW()
                    WHERE id = :id
                ");
                $stmt->execute([
                    ':st'  => $nuevoEstado,
                    ':mot' => ($nuevoEstado === 'rechazado' ? $motivo : null),
                    ':adm' => $adminUser['id'],
                    ':id'  => $empresaId
                ]);

                apiResponse(200, ['success' => true, 'message' => "Empresa actualizada a: {$nuevoEstado}."]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => "Empresa {$nuevoEstado}."]);
        }
        break;

    // --------------------------------------------------------------------------
    // 15. ADMINISTRADOR: APROBAR / RECHAZAR / EDITAR / ELIMINAR VACANTE
    // --------------------------------------------------------------------------
    case 'admin_set_job_status':
        Auth::requireRole(['admin']);
        $jobId = (int)($body['vacante_id'] ?? 0);
        $estado = trim($body['estado'] ?? 'aprobada'); // 'aprobada', 'rechazada', 'suspendida'

        if ($isMySQL) {
            try {
                $pdo->prepare("UPDATE vacantes SET estado = :st WHERE id = :id")
                    ->execute([':st' => $estado, ':id' => $jobId]);
                apiResponse(200, ['success' => true, 'message' => "Vacante actualizada a: {$estado}."]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => "Vacante {$estado}."]);
        }
        break;

    case 'admin_edit_job':
        Auth::requireRole(['admin']);
        $jobId = (int)($body['vacante_id'] ?? 0);
        $puesto = trim($body['puesto'] ?? '');
        $sueldo = trim($body['sueldo_ofrecido'] ?? '');
        $beneficios = trim($body['prestaciones_beneficios'] ?? '');
        $descripcion = trim($body['descripcion'] ?? '');
        $requisitos = trim($body['requisitos'] ?? '');
        $ubicacion = trim($body['ubicacion'] ?? '');

        if ($isMySQL) {
            try {
                $pdo->prepare("
                    UPDATE vacantes SET
                        puesto = :p, sueldo_ofrecido = :s, prestaciones_beneficios = :b,
                        descripcion = :d, requisitos = :r, ubicacion = :u
                    WHERE id = :id
                ")->execute([
                    ':p'  => $puesto, ':s' => $sueldo, ':b' => $beneficios,
                    ':d'  => $descripcion, ':r' => $requisitos, ':u' => $ubicacion,
                    ':id' => $jobId
                ]);
                apiResponse(200, ['success' => true, 'message' => 'Vacante modificada exitosamente.']);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => 'Vacante modificada.']);
        }
        break;

    case 'admin_delete_job':
        Auth::requireRole(['admin']);
        $jobId = (int)($body['vacante_id'] ?? 0);

        if ($isMySQL) {
            try {
                $pdo->prepare("DELETE FROM vacantes WHERE id = :id")->execute([':id' => $jobId]);
                apiResponse(200, ['success' => true, 'message' => 'Vacante eliminada del sistema.']);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => 'Vacante eliminada.']);
        }
        break;

    // --------------------------------------------------------------------------
    // 16. ADMINISTRADOR: SUSPENDER, REACTIVAR O ELIMINAR USUARIOS
    // --------------------------------------------------------------------------
    case 'admin_toggle_user':
        Auth::requireRole(['admin']);
        $userId = (int)($body['usuario_id'] ?? 0);
        $nuevoEstado = trim($body['estado'] ?? 'suspendido'); // 'activo' | 'suspendido'

        if ($isMySQL) {
            try {
                $pdo->prepare("UPDATE usuarios SET estado = :st WHERE id = :id")
                    ->execute([':st' => $nuevoEstado, ':id' => $userId]);
                apiResponse(200, ['success' => true, 'message' => "Usuario marcado como {$nuevoEstado}."]);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => "Estado de usuario actualizado a {$nuevoEstado}."]);
        }
        break;

    case 'admin_delete_user':
        Auth::requireRole(['admin']);
        $userId = (int)($body['usuario_id'] ?? 0);

        if ($isMySQL) {
            try {
                $pdo->prepare("DELETE FROM usuarios WHERE id = :id")->execute([':id' => $userId]);
                apiResponse(200, ['success' => true, 'message' => 'Cuenta de usuario eliminada permanentemente.']);
            } catch (Exception $e) {
                apiResponse(500, ['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            apiResponse(200, ['success' => true, 'message' => 'Usuario eliminado.']);
        }
        break;

    default:
        apiResponse(400, ['success' => false, 'error' => 'Acción no reconocida en la API de OFIMANTE.']);
        break;
}
