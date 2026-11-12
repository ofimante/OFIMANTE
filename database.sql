-- ==============================================================================
-- OFIMANTE - BASE DE DATOS RELACIONAL EN MYSQL
-- Plataforma de Empleo y Conexión Laboral
-- Ciudad Mante, Tamaulipas, México
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `ofimante_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `ofimante_db`;

-- Desactivar llaves foráneas para reinicio limpio
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `historial_actividad`;
DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `pagos`;
DROP TABLE IF EXISTS `solicitudes`;
DROP TABLE IF EXISTS `vacantes`;
DROP TABLE IF EXISTS `curriculums`;
DROP TABLE IF EXISTS `empresas`;
DROP TABLE IF EXISTS `candidatos`;
DROP TABLE IF EXISTS `usuarios`;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. TABLA: usuarios
-- Gestión de cuentas y credenciales. El rol 'admin' no puede registrarse públicamente.
-- ------------------------------------------------------------------------------
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NULL, -- Encriptada con BCRYPT (password_hash)
  `google_id` VARCHAR(100) NULL UNIQUE,
  `rol` ENUM('candidato', 'empresa', 'admin') NOT NULL DEFAULT 'candidato',
  `estado` ENUM('activo', 'suspendido', 'eliminado') NOT NULL DEFAULT 'activo',
  `avatar` VARCHAR(255) DEFAULT 'logo.png',
  `token_recuperacion` VARCHAR(100) NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_usuario_email` (`email`),
  INDEX `idx_usuario_rol` (`rol`),
  INDEX `idx_usuario_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TABLA: candidatos
-- Perfil personal y profesional de personas en búsqueda de empleo.
-- ------------------------------------------------------------------------------
CREATE TABLE `candidatos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL UNIQUE,
  `nombre_completo` VARCHAR(180) NOT NULL,
  `fecha_nacimiento` DATE NULL,
  `edad` INT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `email_contacto` VARCHAR(120) NOT NULL,
  `domicilio_zona` VARCHAR(255) NOT NULL,
  `nivel_academico` VARCHAR(120) NOT NULL,
  `experiencia_laboral` TEXT NOT NULL,
  `habilidades` TEXT NOT NULL,
  `conocimientos` TEXT NULL,
  `descripcion_personal` TEXT NULL,
  `disponibilidad` VARCHAR(100) DEFAULT 'Inmediata - Tiempo Completo',
  `expectativa_salarial` VARCHAR(100) DEFAULT '$8,000 - $12,000 mensuales',
  `archivo_cv_pdf` VARCHAR(255) NULL,
  `foto_url` VARCHAR(255) DEFAULT 'logo.png',
  `estado_aprobacion` ENUM('pendiente', 'aprobado', 'rechazado', 'suspendido') NOT NULL DEFAULT 'pendiente',
  `motivo_rechazo` TEXT NULL,
  `aprobado_por` INT NULL,
  `fecha_aprobacion` DATETIME NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_candidato_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_candidato_admin` FOREIGN KEY (`aprobado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  INDEX `idx_cand_estado` (`estado_aprobacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABLA: curriculums
-- Información complementaria del CV para presentación visual e impresión.
-- ------------------------------------------------------------------------------
CREATE TABLE `curriculums` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidato_id` INT NOT NULL UNIQUE,
  `puesto_deseado` VARCHAR(150) NOT NULL,
  `resumen_ejecutivo` TEXT NOT NULL,
  `detalles_academicos` TEXT NOT NULL,
  `trayectoria_laboral` TEXT NOT NULL,
  `competencias_tecnicas` TEXT NOT NULL,
  `idiomas` VARCHAR(150) DEFAULT 'Español (Nativo)',
  `referencias_laborales` TEXT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cv_candidato` FOREIGN KEY (`candidato_id`) REFERENCES `candidatos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABLA: empresas
-- Perfil de negocios, locales, comercios y empresas de Ciudad Mante.
-- ------------------------------------------------------------------------------
CREATE TABLE `empresas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL UNIQUE,
  `nombre_comercial` VARCHAR(180) NOT NULL,
  `razon_social` VARCHAR(200) NULL,
  `rfc` VARCHAR(20) NULL,
  `nombre_responsable` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `email_contacto` VARCHAR(120) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `giro_actividad` VARCHAR(120) NOT NULL,
  `descripcion_empresa` TEXT NULL,
  `logotipo_url` VARCHAR(255) DEFAULT 'logo.png',
  `estado_aprobacion` ENUM('pendiente', 'aprobada', 'rechazada', 'suspendida') NOT NULL DEFAULT 'pendiente',
  `motivo_rechazo` TEXT NULL,
  `aprobado_por` INT NULL,
  `fecha_aprobacion` DATETIME NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_empresa_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_empresa_admin` FOREIGN KEY (`aprobado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  INDEX `idx_emp_estado` (`estado_aprobacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABLA: vacantes
-- Oportunidades laborales publicadas con tarifa de servicio de $100 MXN.
-- ------------------------------------------------------------------------------
CREATE TABLE `vacantes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `empresa_id` INT NOT NULL,
  `puesto` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `vacantes_disponibles` INT NOT NULL DEFAULT 1,
  `requisitos` TEXT NOT NULL,
  `experiencia_requerida` VARCHAR(120) NOT NULL,
  `escolaridad_minima` VARCHAR(120) NOT NULL,
  `horario` VARCHAR(120) NOT NULL,
  `tipo_contratacion` VARCHAR(100) NOT NULL DEFAULT 'Tiempo Completo',
  `sueldo_ofrecido` VARCHAR(100) NOT NULL, -- Destacado con alta visibilidad
  `sueldo_numerico` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `prestaciones` TEXT NOT NULL, -- Destacado con alta visibilidad
  `beneficios` TEXT NOT NULL, -- Destacado con alta visibilidad
  `categoria` VARCHAR(100) NOT NULL DEFAULT 'General',
  `ubicacion` VARCHAR(180) NOT NULL DEFAULT 'Zona Centro, Cd. Mante',
  `fecha_publicacion` DATE NOT NULL,
  `fecha_cierre` DATE NULL,
  `tarifa_monto` DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  `tarifa_pagada` TINYINT(1) NOT NULL DEFAULT 0,
  `estado` ENUM('pendiente', 'aprobada', 'rechazada', 'suspendida', 'cerrada') NOT NULL DEFAULT 'pendiente',
  `motivo_rechazo` TEXT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_vacante_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  INDEX `idx_vac_estado` (`estado`),
  INDEX `idx_vac_categoria` (`categoria`),
  INDEX `idx_vac_tarifa` (`tarifa_pagada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABLA: solicitudes
-- Postulaciones de candidatos. Ordenadas cronológicamente (más reciente primero).
-- ------------------------------------------------------------------------------
CREATE TABLE `solicitudes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vacante_id` INT NOT NULL,
  `candidato_id` INT NOT NULL,
  `estado` ENUM('pendiente', 'aceptada', 'rechazada') NOT NULL DEFAULT 'pendiente',
  `mensaje_candidato` TEXT NULL,
  `respuesta_empresa` TEXT NULL,
  `fecha_postulacion` DATETIME NOT NULL,
  `fecha_respuesta` DATETIME NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sol_vacante` FOREIGN KEY (`vacante_id`) REFERENCES `vacantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sol_candidato` FOREIGN KEY (`candidato_id`) REFERENCES `candidatos` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_postulacion_unica` (`vacante_id`, `candidato_id`),
  INDEX `idx_sol_fecha` (`fecha_postulacion` DESC),
  INDEX `idx_sol_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABLA: pagos
-- Registro de tarifas de servicio ($100 MXN) por publicación de vacantes.
-- ------------------------------------------------------------------------------
CREATE TABLE `pagos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vacante_id` INT NOT NULL,
  `empresa_id` INT NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  `moneda` VARCHAR(10) NOT NULL DEFAULT 'MXN',
  `metodo_pago` VARCHAR(80) NOT NULL DEFAULT 'Demostración / Simulación de Tarjeta',
  `referencia_transaccion` VARCHAR(100) NOT NULL,
  `estado` ENUM('pendiente', 'completado', 'fallido', 'reembolsado') NOT NULL DEFAULT 'completado',
  `fecha_pago` DATETIME NOT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pago_vacante` FOREIGN KEY (`vacante_id`) REFERENCES `vacantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pago_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  INDEX `idx_pago_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABLA: notificaciones
-- Sistema interno de notificaciones para los 3 roles con contador no leídas.
-- ------------------------------------------------------------------------------
CREATE TABLE `notificaciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `tipo` ENUM('aprobacion', 'postulacion', 'respuesta', 'pago', 'sistema') NOT NULL DEFAULT 'sistema',
  `leida` TINYINT(1) NOT NULL DEFAULT 0,
  `enlace` VARCHAR(150) NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_leida` (`usuario_id`, `leida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. TABLA: historial_actividad
-- Auditoría de operaciones clave realizadas por administradores y usuarios.
-- ------------------------------------------------------------------------------
CREATE TABLE `historial_actividad` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NULL,
  `accion` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `direccion_ip` VARCHAR(50) DEFAULT '127.0.0.1',
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hist_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  INDEX `idx_hist_fecha` (`creado_en` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DATOS SEMILLA (SEED DATA) DE DEMOSTRACIÓN PARA CIUDAD MANTE
-- Contraseñas con BCRYPT verificado con password_verify():
-- Admin1234!    => $2y$10$sgu/pCTGZqfiMgzFzVEoe.uLYvnC7JriYyE/om18D4QMldnjT46W6
-- Candidato123! => $2y$10$mLPAzbYeXeOEw5hX3VrfmeIzQDA0aEV2wHihmC2rF7Wk07gX8ZzLy
-- Empresa123!   => $2y$10$sqIFzN8qk19iK5YaYMTpXeSuN0Ie7uIP1H37F20ooPCqByEp7.eJu
-- ==============================================================================

-- 1. Usuarios
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `estado`, `avatar`) VALUES
(1, 'Administrador General Mante', 'admin@ofimante.com', '$2y$10$sgu/pCTGZqfiMgzFzVEoe.uLYvnC7JriYyE/om18D4QMldnjT46W6', 'admin', 'activo', 'logo.png'),
(2, 'Carlos Eduardo Garza Morales', 'carlos.garza@alumnos.uat.edu.mx', '$2y$10$mLPAzbYeXeOEw5hX3VrfmeIzQDA0aEV2wHihmC2rF7Wk07gX8ZzLy', 'candidato', 'activo', 'logo.png'),
(3, 'Soluciones Digitales del Mante', 'contacto@solucionesmante.com.mx', '$2y$10$sqIFzN8qk19iK5YaYMTpXeSuN0Ie7uIP1H37F20ooPCqByEp7.eJu', 'empresa', 'activo', 'logo.png'),
(4, 'Clínica Médica Santa Fe Mante', 'recepcion@clinicasantafe.com', '$2y$10$sqIFzN8qk19iK5YaYMTpXeSuN0Ie7uIP1H37F20ooPCqByEp7.eJu', 'empresa', 'activo', 'logo.png'),
(5, 'Ana Patricia Méndez Torres', 'ana.mendez@gmail.com', '$2y$10$mLPAzbYeXeOEw5hX3VrfmeIzQDA0aEV2wHihmC2rF7Wk07gX8ZzLy', 'candidato', 'activo', 'logo.png');

-- 2. Candidatos
INSERT INTO `candidatos` (`id`, `usuario_id`, `nombre_completo`, `fecha_nacimiento`, `edad`, `telefono`, `email_contacto`, `domicilio_zona`, `nivel_academico`, `experiencia_laboral`, `habilidades`, `conocimientos`, `descripcion_personal`, `disponibilidad`, `expectativa_salarial`, `archivo_cv_pdf`, `foto_url`, `estado_aprobacion`, `aprobado_por`, `fecha_aprobacion`) VALUES
(1, 2, 'Carlos Eduardo Garza Morales', '2001-05-18', 23, '831-145-8921', 'carlos.garza@alumnos.uat.edu.mx', 'Calle Juárez #402 Ote., Zona Centro, Cd. Mante', 'Ingeniería en Tecnologías de la Información (UAMM UAT)', '1 año en soporte preventivo, mantenimiento de hardware y ensamblaje de computadoras en comercio local.', 'Atención a clientes, paquetería Office 365, diagnóstico de hardware, configuración de redes y Windows.', 'HTML5, CSS3, JavaScript básico, MySQL y soporte técnico a usuarios.', 'Joven profesionista comprometido con la mejora tecnológica continua de los negocios en El Mante.', 'Inmediata - Tiempo Completo', '$9,000 - $11,000 mensuales', 'cv_carlos_garza.pdf', 'logo.png', 'aprobado', 1, '2026-11-10 10:00:00'),
(2, 5, 'Ana Patricia Méndez Torres', '2002-09-12', 22, '831-234-8899', 'ana.mendez@gmail.com', 'Colonia Tamaulipas, Cd. Mante', 'Licenciatura en Administración (7mo Semestre)', 'Prácticas profesionales en consultorio médico privado, manejo de caja chica y archivo de expedientes.', 'Facilidad de palabra, proactividad, redacción formal y manejo de conmutador.', 'Excel administrativo, facturación y atención en mostrador.', 'Estudiante responsable con alto sentido de servicio al cliente y vocación de superación.', 'Vespertino / Medio Tiempo', '$7,000 - $8,500 mensuales', NULL, 'logo.png', 'pendiente', NULL, NULL);

-- 3. Curriculums
INSERT INTO `curriculums` (`id`, `candidato_id`, `puesto_deseado`, `resumen_ejecutivo`, `detalles_academicos`, `trayectoria_laboral`, `competencias_tecnicas`, `idiomas`, `referencias_laborales`) VALUES
(1, 1, 'Auxiliar de Sistemas / Soporte Técnico Web', 'Egresado de TI con sólidos conocimientos en soporte a computadoras, infraestructura básica y desarrollo web.', 'Unidad Académica Multidisciplinaria Mante (UAT) - Generación 2020-2024.', '2023-2024: Encargado técnico en Cyber El Cañero (Cd. Mante). 2022: Soporte en papelería escolar.', 'Mantenimiento de PC, Redes Ethernet, Office 365, Reparación de impresoras, JavaScript, PHP básico.', 'Español (Nativo), Inglés Técnico (Intermedio)', 'Ing. Juan Carlos Rivas - UAMM UAT (Tel: 831-232-1000)'),
(2, 2, 'Recepcionista / Asistente de Oficina', 'Estudiante avanzada de administración con experiencia en registro de clientes y control documental.', 'Universidad Autónoma de Tamaulipas - Licenciatura en Administración en curso.', '2023: Recepcionista en Consultorio Dental San José (Cd. Mante).', 'Agenda electrónica, conmutador telefónico, control de caja y archivo físico/digital.', 'Español (Nativo)', 'Dra. María Elena Garza (Tel: 831-232-4411)');

-- 4. Empresas
INSERT INTO `empresas` (`id`, `usuario_id`, `nombre_comercial`, `razon_social`, `rfc`, `nombre_responsable`, `telefono`, `email_contacto`, `direccion`, `giro_actividad`, `descripcion_empresa`, `logotipo_url`, `estado_aprobacion`, `aprobado_por`, `fecha_aprobacion`) VALUES
(1, 3, 'Soluciones Digitales Mante', 'Soluciones Digitales del Mante S.A. de C.V.', 'SDM190412AB1', 'Lic. Andrea Guadalupe Ruiz', '831-232-5500', 'contacto@solucionesmante.com.mx', 'Av. Manuel Cavazos Lerma #205, Col. Moderna, Cd. Mante', 'Tecnología y Software', 'Empresa mantense líder en comercialización de equipo de cómputo, desarrollo de software a la medida y soporte tecnológico.', 'logo.png', 'aprobada', 1, '2026-11-09 09:30:00'),
(2, 4, 'Clínica Santa Fe Mante', 'Clínica Médica Santa Fe de El Mante S.C.', 'CMS980315KL9', 'Dr. Héctor Manuel Treviño', '831-232-1144', 'recepcion@clinicasantafe.com', 'Calle Hidalgo #310 Ote., Zona Centro, Cd. Mante', 'Salud y Clínica Médica', 'Centro médico de especialidades con más de 20 años brindando atención integral a las familias de la región cañera.', 'logo.png', 'aprobada', 1, '2026-11-09 11:15:00');

-- 5. Vacantes con tarifa de $100 MXN cubierta
INSERT INTO `vacantes` (`id`, `empresa_id`, `puesto`, `descripcion`, `vacantes_disponibles`, `requisitos`, `experiencia_requerida`, `escolaridad_minima`, `horario`, `tipo_contratacion`, `sueldo_ofrecido`, `sueldo_numerico`, `prestaciones`, `beneficios`, `categoria`, `ubicacion`, `fecha_publicacion`, `fecha_cierre`, `tarifa_monto`, `tarifa_pagada`, `estado`) VALUES
(1, 1, 'Auxiliar de Soporte Técnico y Redes', 'Se busca personal con ganas de aprender para dar mantenimiento preventivo y correctivo a equipos en locales de El Mante.', 1, 'Conocimientos de hardware, Windows, cableado y trato amable con clientes.', 'Mínimo 6 meses en puestos afines o servicio social comprobable', 'Técnico Superior / Pasante de Ing. en Sistemas o TI', 'Lunes a Viernes 8:30 am a 5:30 pm, Sábado 9:00 am a 1:00 pm', 'Tiempo Completo', '$10,500 mensuales netos', 10500.00, 'Prestaciones de ley completas (IMSS, Infonavit, aguinaldo de 15 días, prima vacacional).', 'Capacitación técnica pagada, bonos de productividad bimestral y excelente ambiente de trabajo.', 'Tecnología e Informática', 'Zona Centro, Cd. Mante', '2026-11-10', '2026-12-15', 100.00, 1, 'aprobada'),
(2, 2, 'Recepcionista y Control de Citas Médicas', 'Atención y orientación a pacientes, recepción de llamadas para agenda médica y archivo de expedientes.', 1, 'Excelente presentación, puntualidad, manejo básico de computadora y trato cálido con pacientes.', 'No indispensable (se capacita)', 'Bachillerato terminado o Licenciatura trunca', 'Lunes a Viernes 8:00 am a 4:00 pm, Sábado 8:00 am a 1:00 pm', 'Tiempo Completo', '$9,800 mensuales netos', 9800.00, 'Seguro social (IMSS), aguinaldo, vacaciones y días festivos de ley.', 'Vales de despensa mensuales ($800), descuentos médicos familiares y estabilidad laboral.', 'Salud y Administración', 'Zona Centro (Frente a Plaza Principal), Cd. Mante', '2026-11-10', '2026-12-20', 100.00, 1, 'aprobada'),
(3, 1, 'Asistente de Facturación y Ventas Mostrador', 'Atención cordial al cliente en mostrador, emisión de notas de venta, control de inventario y pedidos.', 1, 'Facilidad de palabra, manejo de paquetería Office y responsabilidad en manejo de valores.', '1 año en ventas o atención a clientes', 'Preparatoria terminada', 'Lunes a Viernes 9:00 am a 2:00 pm (Medio Tiempo)', 'Medio Tiempo', '$6,800 mensuales netos', 6800.00, 'IMSS, aguinaldo proporcional y prima dominical en su caso.', 'Horario ideal para estudiantes universitarios y apoyo para transporte.', 'Comercio y Ventas', 'Av. Cavazos Lerma #205, Cd. Mante', '2026-11-11', '2026-12-30', 100.00, 1, 'aprobada');

-- 6. Solicitudes de candidatos ordenadas cronológicamente
INSERT INTO `solicitudes` (`id`, `vacante_id`, `candidato_id`, `estado`, `mensaje_candidato`, `respuesta_empresa`, `fecha_postulacion`, `fecha_respuesta`) VALUES
(1, 1, 1, 'aceptada', 'Hola, vivo a 10 minutos de su sucursal y cuento con disponibilidad inmediata para iniciar.', 'Estimado Carlos, revisamos tu currículum y tu perfil cumple con lo que buscamos. Te citamos a entrevista este jueves 10:30 am.', '2026-11-11 08:30:15', '2026-11-11 11:20:00');

-- 7. Pagos registrados de tarifa de $100 pesos
INSERT INTO `pagos` (`id`, `vacante_id`, `empresa_id`, `monto`, `moneda`, `metodo_pago`, `referencia_transaccion`, `estado`, `fecha_pago`) VALUES
(1, 1, 1, 100.00, 'MXN', 'Demostración / Simulación de Tarjeta', 'OFM-PAY-2026-001', 'completado', '2026-11-10 11:45:00'),
(2, 2, 2, 100.00, 'MXN', 'Demostración / Simulación de Tarjeta', 'OFM-PAY-2026-002', 'completado', '2026-11-10 14:10:00'),
(3, 3, 1, 100.00, 'MXN', 'Demostración / Simulación de Tarjeta', 'OFM-PAY-2026-003', 'completado', '2026-11-11 09:15:00');

-- 8. Notificaciones
INSERT INTO `notificaciones` (`id`, `usuario_id`, `titulo`, `mensaje`, `tipo`, `leida`, `enlace`) VALUES
(1, 2, '¡Postulación Aceptada!', 'Soluciones Digitales Mante ha aceptado tu postulación para Auxiliar de Soporte Técnico. Revisa el mensaje y la fecha de entrevista.', 'respuesta', 0, '#solicitudes'),
(2, 3, 'Nueva Postulación Recibida', 'Carlos Eduardo Garza Morales se ha postulado a la vacante Auxiliar de Soporte Técnico.', 'postulacion', 1, '#postulaciones'),
(3, 1, 'Nueva Empresa Registrada', 'La empresa Clínica Santa Fe Mante ha completado su registro y solicita validación.', 'aprobacion', 1, '#empresas');

-- 9. Historial administrativo
INSERT INTO `historial_actividad` (`id`, `usuario_id`, `accion`, `descripcion`, `direccion_ip`) VALUES
(1, 1, 'APROBACION_CANDIDATO', 'El administrador aprobó el perfil del candidato Carlos Eduardo Garza Morales (ID: 1).', '127.0.0.1'),
(2, 1, 'APROBACION_EMPRESA', 'El administrador aprobó a la empresa Soluciones Digitales Mante (ID: 1).', '127.0.0.1'),
(3, 1, 'VALIDACION_PAGO', 'Verificación de tarifa de $100 MXN para la vacante Auxiliar de Soporte Técnico.', '127.0.0.1');
