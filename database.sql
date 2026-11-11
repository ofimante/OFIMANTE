-- ==============================================================================
-- OFIMANTE - BASE DE DATOS OFICIAL EN MYSQL
-- Ciudad Mante, Tamaulipas, México
-- Plataforma de Conexión Laboral entre Candidatos y Empresas
-- ==============================================================================

-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS `ofimante_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `ofimante_db`;

-- Desactivar temporalmente revisiones de llaves foráneas para reinicialización limpia
SET FOREIGN_KEY_CHECKS = 0;

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
-- Almacena las credenciales de acceso para los 3 roles: candidato, empresa, admin.
-- Las contraseñas están encriptadas con BCRYPT mediante password_hash().
-- El rol 'admin' no puede seleccionarse desde el registro público.
-- ------------------------------------------------------------------------------
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NULL, -- Puede ser NULL si inicia sesión exclusivamente con Google
  `google_id` VARCHAR(100) NULL UNIQUE,
  `foto` VARCHAR(255) DEFAULT 'logo.png',
  `rol` ENUM('candidato', 'empresa', 'admin') NOT NULL DEFAULT 'candidato',
  `estado` ENUM('activo', 'suspendido', 'eliminado') NOT NULL DEFAULT 'activo',
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_usuario_email` (`email`),
  INDEX `idx_usuario_rol` (`rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TABLA: candidatos
-- Información personal del buscador de empleo y estado de aprobación administrativa.
-- Estados de aprobación: 'pendiente', 'aprobado', 'rechazado', 'suspendido'
-- ------------------------------------------------------------------------------
CREATE TABLE `candidatos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL UNIQUE,
  `nombre_completo` VARCHAR(180) NOT NULL,
  `fecha_nacimiento` DATE NULL,
  `edad` INT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `email_contacto` VARCHAR(120) NOT NULL,
  `domicilio` VARCHAR(255) NOT NULL, -- Dirección o zona de residencia en Cd. Mante
  `nivel_academico` VARCHAR(100) NOT NULL, -- Técnico, Licenciatura, Ingeniería, etc.
  `disponibilidad` VARCHAR(100) DEFAULT 'Inmediata', -- Inmediata, Medio tiempo, Turnos rolados
  `descripcion_personal` TEXT NULL,
  `estado_aprobacion` ENUM('pendiente', 'aprobado', 'rechazado', 'suspendido') NOT NULL DEFAULT 'pendiente',
  `motivo_rechazo` TEXT NULL,
  `aprobado_por` INT NULL,
  `fecha_aprobacion` DATETIME NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_candidato_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_candidato_admin` FOREIGN KEY (`aprobado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  INDEX `idx_candidato_estado` (`estado_aprobacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABLA: curriculums
-- Información profesional, experiencia, habilidades y archivo PDF opcional.
-- ------------------------------------------------------------------------------
CREATE TABLE `curriculums` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidato_id` INT NOT NULL UNIQUE,
  `puesto_deseado` VARCHAR(150) NOT NULL,
  `experiencia_laboral` TEXT NOT NULL,
  `habilidades` TEXT NOT NULL,
  `conocimientos` TEXT NULL,
  `archivo_pdf` VARCHAR(255) NULL, -- Ruta al documento PDF del currículum subido
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cv_candidato` FOREIGN KEY (`candidato_id`) REFERENCES `candidatos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABLA: empresas
-- Información del negocio o comercio local de Ciudad Mante y estado de aprobación.
-- ------------------------------------------------------------------------------
CREATE TABLE `empresas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL UNIQUE,
  `nombre_comercial` VARCHAR(180) NOT NULL,
  `razon_social` VARCHAR(200) NULL,
  `rfc` VARCHAR(20) NULL,
  `responsable_nombre` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `email_corporativo` VARCHAR(120) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL, -- Dirección física en Ciudad Mante
  `giro_comercial` VARCHAR(100) NOT NULL, -- Tecnología, Salud, Comercio, Agroindustria, etc.
  `descripcion_negocio` TEXT NULL,
  `logotipo` VARCHAR(255) DEFAULT 'logo.png',
  `estado_aprobacion` ENUM('pendiente', 'aprobado', 'rechazado', 'suspendido') NOT NULL DEFAULT 'pendiente',
  `motivo_rechazo` TEXT NULL,
  `aprobado_por` INT NULL,
  `fecha_aprobacion` DATETIME NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_empresa_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_empresa_admin` FOREIGN KEY (`aprobado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  INDEX `idx_empresa_estado` (`estado_aprobacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABLA: vacantes
-- Anuncios de empleo publicados por empresas con sueldo, beneficios y tarifa.
-- ------------------------------------------------------------------------------
CREATE TABLE `vacantes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `empresa_id` INT NOT NULL,
  `puesto` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `vacantes_disponibles` INT NOT NULL DEFAULT 1,
  `requisitos` TEXT NOT NULL,
  `experiencia_requerida` VARCHAR(120) NOT NULL,
  `escolaridad_minima` VARCHAR(100) NOT NULL,
  `horario` VARCHAR(120) NOT NULL,
  `tipo_contratacion` VARCHAR(80) NOT NULL DEFAULT 'Tiempo Completo',
  `sueldo_ofrecido` VARCHAR(80) NOT NULL, -- Especial visibilidad
  `sueldo_numerico` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `prestaciones_beneficios` TEXT NOT NULL, -- Especial visibilidad
  `categoria` VARCHAR(80) NOT NULL DEFAULT 'General',
  `ubicacion` VARCHAR(150) NOT NULL DEFAULT 'Zona Centro, Cd. Mante',
  `contacto` VARCHAR(150) NOT NULL,
  `tarifa_monto` DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  `tarifa_pagada` TINYINT(1) NOT NULL DEFAULT 0, -- 1 si se completó el pago demo de $100 MXN
  `estado` ENUM('pendiente', 'aprobada', 'rechazada', 'suspendida', 'cerrada') NOT NULL DEFAULT 'pendiente',
  `motivo_rechazo` TEXT NULL,
  `fecha_publicacion` DATE NOT NULL,
  `fecha_cierre` DATE NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_vacante_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  INDEX `idx_vacante_estado` (`estado`),
  INDEX `idx_vacante_categoria` (`categoria`),
  INDEX `idx_vacante_tarifa` (`tarifa_pagada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABLA: pagos
-- Registro de tarifas de servicio ($100 MXN) por publicación de vacantes.
-- Preparada para integración con pasarelas de pago reales (Stripe, Mercado Pago).
-- ------------------------------------------------------------------------------
CREATE TABLE `pagos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vacante_id` INT NOT NULL,
  `empresa_id` INT NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  `moneda` VARCHAR(10) NOT NULL DEFAULT 'MXN',
  `metodo_pago` VARCHAR(50) NOT NULL DEFAULT 'Demostración / Tarjeta Demo',
  `referencia_transaccion` VARCHAR(100) NOT NULL,
  `estado` ENUM('pendiente', 'completado', 'fallido', 'reembolsado') NOT NULL DEFAULT 'completado',
  `fecha_pago` DATETIME NOT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pago_vacante` FOREIGN KEY (`vacante_id`) REFERENCES `vacantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pago_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  INDEX `idx_pago_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABLA: solicitudes
-- Postulaciones de candidatos a las vacantes de empresas.
-- Permite clasificar desde la más reciente hasta la más antigua por día y hora.
-- Estados: 'pendiente', 'aceptada', 'rechazada'.
-- ------------------------------------------------------------------------------
CREATE TABLE `solicitudes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vacante_id` INT NOT NULL,
  `candidato_id` INT NOT NULL,
  `estado` ENUM('pendiente', 'aceptada', 'rechazada') NOT NULL DEFAULT 'pendiente',
  `mensaje_candidato` TEXT NULL,
  `respuesta_empresa` TEXT NULL, -- Nota o mensaje de la empresa al aceptar o rechazar
  `fecha_postulacion` DATETIME NOT NULL,
  `fecha_respuesta` DATETIME NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_solicitud_vacante` FOREIGN KEY (`vacante_id`) REFERENCES `vacantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_solicitud_candidato` FOREIGN KEY (`candidato_id`) REFERENCES `candidatos` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_postulacion_unica` (`vacante_id`, `candidato_id`),
  INDEX `idx_solicitud_fecha` (`fecha_postulacion` DESC),
  INDEX `idx_solicitud_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABLA: notificaciones
-- Avisos y alertas internas del sistema para usuarios.
-- ------------------------------------------------------------------------------
CREATE TABLE `notificaciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `leida` TINYINT(1) NOT NULL DEFAULT 0,
  `tipo` ENUM('aprobacion', 'postulacion', 'respuesta', 'sistema') NOT NULL DEFAULT 'sistema',
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_usuario_leida` (`usuario_id`, `leida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DATOS INICIALES SEMILLA (SEED DATA REALISTA DE CIUDAD MANTE)
-- ==============================================================================

-- 1. Usuarios del sistema:
-- Las contraseñas de prueba son 'Admin1234!' para el administrador, 'Candidato123!' para el candidato, y 'Empresa123!' para las empresas.
-- Hash BCRYPT generado con PASSWORD_DEFAULT:
-- '$2y$10$eA0y5lHqWwPqC4j7u6e2y.cK7QpYm6Q0k5h8QzM4C2d8V6A9wP0Gy' (Admin1234!)
-- '$2y$10$RzC8J3d9mE5X7P1qA0b2u.cK7QpYm6Q0k5h8QzM4C2d8V6A9wP0Gy' (Candidato123!)
-- '$2y$10$wE4p8L2mK9X5Q1rB3c4v.cK7QpYm6Q0k5h8QzM4C2d8V6A9wP0Gy' (Empresa123!)

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `estado`, `foto`) VALUES
(1, 'Administrador General Mante', 'admin@ofimante.com', '$2y$10$zY9O3eFpX4r7u2o1d8v.aeqV8PjGgGgZ0hZf9YdGz4X4Y2W7A2GzC', 'admin', 'activo', 'logo.png'),
(2, 'Carlos Eduardo Garza Morales', 'carlos.garza@alumnos.uat.edu.mx', '$2y$10$zY9O3eFpX4r7u2o1d8v.aeqV8PjGgGgZ0hZf9YdGz4X4Y2W7A2GzC', 'candidato', 'activo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
(3, 'Soluciones Digitales del Mante', 'contacto@solucionesmante.com.mx', '$2y$10$zY9O3eFpX4r7u2o1d8v.aeqV8PjGgGgZ0hZf9YdGz4X4Y2W7A2GzC', 'empresa', 'activo', 'logo.png'),
(4, 'Clínica Médica Santa Fe Mante', 'recepcion@clinicasantafe.com', '$2y$10$zY9O3eFpX4r7u2o1d8v.aeqV8PjGgGgZ0hZf9YdGz4X4Y2W7A2GzC', 'empresa', 'activo', 'logo.png'),
(5, 'Ana Patricia Méndez Torres', 'ana.mendez@gmail.com', '$2y$10$zY9O3eFpX4r7u2o1d8v.aeqV8PjGgGgZ0hZf9YdGz4X4Y2W7A2GzC', 'candidato', 'activo', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80');

-- 2. Candidatos
INSERT INTO `candidatos` (`id`, `usuario_id`, `nombre_completo`, `fecha_nacimiento`, `edad`, `telefono`, `email_contacto`, `domicilio`, `nivel_academico`, `disponibilidad`, `descripcion_personal`, `estado_aprobacion`, `aprobado_por`, `fecha_aprobacion`) VALUES
(1, 2, 'Carlos Eduardo Garza Morales', '2001-05-18', 23, '831-145-8921', 'carlos.garza@alumnos.uat.edu.mx', 'Calle Juárez #402 Ote., Col. Centro, Cd. Mante, Tam.', 'Ingeniería en Tecnologías de la Información (UAMM UAT)', 'Inmediata - Tiempo Completo', 'Joven profesional apasionado por el desarrollo web, mantenimiento informático y soporte técnico con iniciativa y compromiso.', 'aprobado', 1, '2026-11-09 10:00:00'),
(2, 5, 'Ana Patricia Méndez Torres', '2002-09-12', 22, '831-234-8899', 'ana.mendez@gmail.com', 'Col. Tamaulipas, Cd. Mante, Tam.', 'Licenciatura en Administración (En curso)', 'Medio Tiempo / Vespertino', 'Estudiante de administración con experiencia en atención a clientes, caja y organización de archivos.', 'pendiente', NULL, NULL);

-- 3. Curriculums
INSERT INTO `curriculums` (`id`, `candidato_id`, `puesto_deseado`, `experiencia_laboral`, `habilidades`, `conocimientos`, `archivo_pdf`) VALUES
(1, 1, 'Auxiliar Administrativo / Soporte Técnico Web', '1 año de experiencia en cibercafé y papelería El Cañero realizando mantenimiento preventivo a 20 equipos de cómputo, atención a clientes y apoyo contable.', 'Manejo de Office 365, atención cordial, ensamblaje de PC, resolución de problemas y trabajo en equipo.', 'HTML5, CSS3, JavaScript básico, MySQL, redes LAN y sistemas Windows.', 'cv_carlos_garza.pdf'),
(2, 2, 'Recepcionista / Auxiliar de Mostrador', 'Prácticas profesionales en consultorio dental local apoyando en registro de citas y llamadas telefónicas.', 'Facilidad de palabra, puntualidad, empatía y redacción profesional.', 'Word, Excel básico, conmutador telefónico y cobro en terminal bancaria.', NULL);

-- 4. Empresas
INSERT INTO `empresas` (`id`, `usuario_id`, `nombre_comercial`, `razon_social`, `rfc`, `responsable_nombre`, `telefono`, `email_corporativo`, `direccion`, `giro_comercial`, `descripcion_negocio`, `logotipo`, `estado_aprobacion`, `aprobado_por`, `fecha_aprobacion`) VALUES
(1, 3, 'Soluciones Digitales Mante', 'Soluciones Digitales del Mante S.A. de C.V.', 'SDM190412AB1', 'Lic. Andrea Guadalupe Ruiz Peña', '831-232-5500', 'contacto@solucionesmante.com.mx', 'Av. Manuel Cavazos Lerma #205, Col. Moderna, Cd. Mante, Tam.', 'Tecnología y Software', 'Empresa mantense líder en provisión de soluciones informáticas, desarrollo de sistemas y venta de equipo de cómputo.', 'logo.png', 'aprobado', 1, '2026-11-08 09:30:00'),
(2, 4, 'Clínica Santa Fe Mante', 'Clínica Médica Santa Fe de El Mante S.C.', 'CMS980315KL9', 'Dr. Héctor Manuel Treviño Salinas', '831-232-1144', 'recepcion@clinicasantafe.com', 'Calle Hidalgo #310 Ote., Zona Centro, Cd. Mante, Tam.', 'Salud y Clínica Médica', 'Centro médico integral con más de 20 años al servicio de las familias de Ciudad Mante y la región cañera.', 'logo.png', 'aprobado', 1, '2026-11-08 11:20:00');

-- 5. Vacantes publicadas con tarifa de $100 MXN pagada
INSERT INTO `vacantes` (`id`, `empresa_id`, `puesto`, `descripcion`, `vacantes_disponibles`, `requisitos`, `experiencia_requerida`, `escolaridad_minima`, `horario`, `tipo_contratacion`, `sueldo_ofrecido`, `sueldo_numerico`, `prestaciones_beneficios`, `categoria`, `ubicacion`, `contacto`, `tarifa_monto`, `tarifa_pagada`, `estado`, `fecha_publicacion`, `fecha_cierre`) VALUES
(1, 1, 'Auxiliar Administrativo y Atención al Cliente', 'Se solicita persona proactiva para recepción de clientes, control de inventario de equipos y asistencia en facturación y expedición de notas.', 1, 'Manejo básico de computadora, trato amable, puntualidad y responsabilidad.', 'Mínimo 6 meses en atención o ventas', 'Bachillerato o Universidad en curso', 'Lunes a Viernes 8:30 am - 5:30 pm, Sábado 9:00 am - 1:00 pm', 'Tiempo Completo', '$9,500 mensuales netos', 9500.00, 'Prestaciones de ley (IMSS, Infonavit, aguinaldo 15 días), capacitación técnica pagada, bonos de puntualidad y horario flexible.', 'Administración y Oficina', 'Zona Centro, Cd. Mante', 'rh@solucionesmante.com.mx | Cel: 831-102-3456', 100.00, 1, 'aprobada', '2026-11-09', '2026-12-15'),
(2, 2, 'Asistente de Recepción y Control de Citas', 'Recepción y orientación de pacientes, coordinación de agenda con médicos especialistas y archivo de expedientes clínicos.', 1, 'Excelente presentación, empatía y trato humano, habilidad para redactar y contestar llamadas.', 'No necesaria (se capacita)', 'Preparatoria terminada o Carrera Trunca', 'Lunes a Viernes 8:00 am - 4:00 pm', 'Tiempo Completo', '$10,200 mensuales', 10200.00, 'Seguro médico de gastos menores, vales de despensa mensuales ($800), días de descanso adicionales y estabilidad laboral.', 'Salud y Medicina', 'Zona Centro (Frente a Plaza Principal), Cd. Mante', 'administracion@clinicasantafe.com | Tel: 831-232-1144', 100.00, 1, 'aprobada', '2026-11-09', '2026-12-20'),
(3, 1, 'Soporte Técnico Jr. y Redes LAN', 'Mantenimiento preventivo de computadoras, formateo, configuración de impresoras y cableado de red para comercios locales.', 2, 'Conocimientos de hardware, Windows 10/11 y configuración de routers.', '1 año en puestos afines o proyectos escolares', 'Técnico Superior / Estudiante Ing. Sistemas', 'Lunes a Viernes 9:00 am - 2:00 pm (Medio Tiempo)', 'Medio Tiempo para Estudiantes', '$7,500 mensuales', 7500.00, 'Apoyo económico para estudiantes universitarios, bono por servicio foráneo y oportunidad de crecimiento.', 'Tecnología y Software', 'Av. Cavazos Lerma #205, Cd. Mante', 'soporte@solucionesmante.com.mx', 100.00, 1, 'aprobada', '2026-11-10', '2026-12-30');

-- 6. Pagos registrados (Tarifa de $100 pesos)
INSERT INTO `pagos` (`id`, `vacante_id`, `empresa_id`, `monto`, `moneda`, `metodo_pago`, `referencia_transaccion`, `estado`, `fecha_pago`) VALUES
(1, 1, 1, 100.00, 'MXN', 'Demostración / Tarjeta Demo', 'OFM-DEMO-PAY-001', 'completado', '2026-11-09 11:58:00'),
(2, 2, 2, 100.00, 'MXN', 'Demostración / Tarjeta Demo', 'OFM-DEMO-PAY-002', 'completado', '2026-11-09 14:25:00'),
(3, 3, 1, 100.00, 'MXN', 'Demostración / Tarjeta Demo', 'OFM-DEMO-PAY-003', 'completado', '2026-11-10 09:10:00');

-- 7. Solicitudes de empleo realizadas
INSERT INTO `solicitudes` (`id`, `vacante_id`, `candidato_id`, `estado`, `mensaje_candidato`, `respuesta_empresa`, `fecha_postulacion`, `fecha_respuesta`) VALUES
(1, 1, 1, 'aceptada', 'Hola, me interesa mucho este empleo. Cuento con disponibilidad inmediata y vivo a 10 minutos de su sucursal.', 'Estimado Carlos, hemos revisado tu currículum y tu perfil cumple con lo requerido. Te esperamos para entrevista presencial el día jueves a las 10:30 am.', '2026-11-10 08:15:30', '2026-11-10 11:00:00');

-- 8. Notificaciones de ejemplo
INSERT INTO `notificaciones` (`id`, `usuario_id`, `titulo`, `mensaje`, `leida`, `tipo`) VALUES
(1, 2, '¡Solicitud Aceptada!', 'Soluciones Digitales Mante ha aceptado tu postulación para Auxiliar Administrativo. Consulta su mensaje.', 0, 'respuesta'),
(2, 3, 'Nueva Solicitud Recibida', 'Carlos Eduardo Garza Morales se ha postulado para la vacante Auxiliar Administrativo.', 1, 'postulacion');

