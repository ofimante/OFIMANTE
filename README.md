# OFIMANTE 🌾
### Plataforma Web de Empleo y Conexión Laboral
**Ciudad Mante, Tamaulipas, México**

![OFIMANTE Logo](logo.png)

---

## 📋 1. Descripción del Proyecto

**OFIMANTE** es una plataforma web desarrollada desde cero para **Ciudad Mante, Tamaulipas**, cuyo objetivo principal es conectar de manera transparente, ágil y profesional a personas que buscan empleo con empresas, negocios, comercios, clínicas y locales de la región cañera.

La plataforma cuenta con 3 tipos de usuarios con roles y permisos protegidos:
1. **Candidatos:** Buscadores de empleo que completan su perfil y Currículum Vitae interactivo, adjuntan su archivo PDF opcional, se postulan en 1 clic a vacantes verificadas y dan seguimiento a sus solicitudes.
2. **Empresas:** Comercios y negocios locales que registran su información fiscal y comercial, publican oportunidades laborales con sueldo y beneficios transparentes cubriendo una **tarifa de servicio de $100 MXN**, y administran solicitudes clasificadas cronológicamente de la más reciente a la más antigua con opciones de aceptación/rechazo y contacto directo.
3. **Administradores:** Personal responsable de moderar y autorizar perfiles de candidatos y empresas, validar vacantes pagadas, supervisar el historial de actividad y consultar métricas de recaudación acumulada ($100 MXN por vacante pagada).

> [!NOTE]
> Cumpliendo con los requerimientos de diseño, la plataforma no incluye galerías turísticas ni carruseles de paisajes de Ciudad Mante, concentrando el 100% de la interfaz y experiencia de usuario en la vinculación y gestión laboral.

---

## 🛠️ 2. Tecnologías Empleadas

- **Frontend:**
  - **HTML5:** Estructura semántica organizada en vistas SPA (Single Page Application).
  - **CSS3:** Paleta oficial azul oscuro (`#071324`, `#0b1e36`, `#102a4c`), cian (`#06b6d4`, `#0ea5e9`), verde menta (`#10b981`), diseño responsivo para móviles, tabletas y computadoras de escritorio, y reglas `@media print` para imprimir currículums.
  - **JavaScript (ES6+):** Controlador modular (`assets/js/app.js` / `script.js`) con soporte asíncrono para `fetch()` y fallback automático en `LocalStorage` para que funcione tanto en servidores XAMPP como abriendo directamente el navegador.
- **Backend:**
  - **PHP 7.4+ / 8.x:** API RESTful orientada a servicios (`backend/api.php`), con manejo de excepciones y respuestas estructuradas en formato JSON.
  - **PHP Sessions:** Manejo seguro de sesiones (`session_regenerate_id(true)`, cookies `HttpOnly`, `SameSite=Lax`).
  - **Google OAuth 2.0:** Flujo de autenticación federada con Google Identity Services (`config/google_oauth.php`).
- **Base de Datos:**
  - **MySQL (InnoDB / UTF8MB4):** Esquema relacional (`database/schema.sql`) compuesto por 9 tablas con llaves foráneas (`ON DELETE CASCADE`), restricciones de unicidad e índices para optimización de consultas.
  - **PDO (PHP Data Objects):** Consultas preparadas parametrizadas en el 100% de las operaciones para prevenir inyección SQL (SQLi).
- **Seguridad:**
  - Encriptación de contraseñas con BCRYPT mediante `password_hash()` y `password_verify()`.
  - Protección CSRF con tokens aleatorios (`bin2hex(random_bytes(32))`).
  - Control de acceso basado en roles (RBAC). El rol de Administrador no puede crearse desde el registro público.
  - Sanitización y validación de archivos PDF y fotografías.
  - Tabla de auditoría e historial administrativo (`historial_actividad`).

---

## 📁 3. Estructura Completa del Proyecto

```text
OFIMANTE/
├── assets/
│   ├── css/
│   │   └── style.css            # Hoja de estilos principal (Azul oscuro, cian, menta)
│   └── js/
│       └── app.js               # Controlador reactivo frontend en JavaScript
├── backend/
│   └── api.php                  # API REST en PHP con 21 acciones y consultas preparadas
├── config/
│   ├── config.php               # Constantes globales, tarifa $100 MXN, sesiones y CSRF
│   ├── database.php             # Conexión PDO singleton a MySQL
│   ├── auth.php                 # Clase de autenticación, hash BCRYPT, RBAC y auditoría
│   └── google_oauth.php         # Manejador del flujo de autorización de Google OAuth 2.0
├── database/
│   └── schema.sql               # Script SQL de creación de la base de datos y seeders
├── uploads/
│   ├── cvs/                     # Almacenamiento de archivos PDF de currículums
│   ├── fotos/                   # Fotografías de candidatos
│   └── logos/                   # Logotipos de empresas
├── api.php                      # Enlace directo de conveniencia a backend/api.php
├── database.sql                 # Copia en raíz del script SQL para phpMyAdmin
├── index.html                   # Interfaz de usuario completa (SPA con las 5 pantallas)
├── index.php                    # Entrada en PHP con inyección de sesión y CSRF
├── logo.png                     # Logotipo oficial de OFIMANTE
├── OFIMANTE.js                  # Espejo sincronizado de app.js para compatibilidad
├── script.js                    # Espejo sincronizado de app.js
├── style.css                    # Espejo sincronizado de style.css en raíz
└── README.md                    # Documentación técnica y manual de instalación
```

---

## 🗄️ 4. Base de Datos MySQL (Esquema de 9 Tablas)

El script SQL ubicado en [`database/schema.sql`](database/schema.sql) y [`database.sql`](database.sql) crea la base de datos `ofimante_db` con las siguientes 9 tablas:

1. **`usuarios`:** Identificadores, nombres, emails, contraseñas encriptadas con BCRYPT, Google ID, rol (`candidato`, `empresa`, `admin`) y estado (`activo`, `suspendido`, `eliminado`).
2. **`candidatos`:** Información personal completa (nombre idéntico a INE, fecha de nacimiento, edad, teléfono, correo, domicilio en Ciudad Mante, nivel académico, experiencia laboral, habilidades, conocimientos, descripción personal, disponibilidad, expectativa salarial, archivo PDF y estado de aprobación).
3. **`curriculums`:** Formato estructurado del CV para visualización en pantalla e impresión.
4. **`empresas`:** Información del negocio (nombre comercial, razón social, RFC, titular responsable, teléfono, correo, dirección en Ciudad Mante, giro, descripción, logotipo y estado de validación).
5. **`vacantes`:** Ofertas de empleo con puesto, descripción, vacantes solicitadas, requisitos, experiencia, escolaridad, horario, contratación, sueldo y beneficios destacados, categoría, ubicación, fecha de cierre, registro de tarifa ($100.00 MXN) y estado de aprobación.
6. **`solicitudes`:** Postulaciones de candidatos ordenadas cronológicamente con fecha y hora exacta (`YYYY-MM-DD HH:MM:SS`), estado (`pendiente`, `aceptada`, `rechazada`) y notas/respuestas de la empresa.
7. **`pagos`:** Registro formal de la tarifa de servicio de **$100 MXN** por vacante con referencia de transacción y estado.
8. **`notificaciones`:** Sistema de alertas internas con contador de no leídas para candidatos, empresas y administradores.
9. **`historial_actividad`:** Auditoría de acciones administrativas (aprobaciones, rechazos, publicaciones, inicio de sesión) con dirección IP.

---

## 🚀 5. Instrucciones de Instalación y Ejecución en XAMPP

1. **Copiar los Archivos:**
   Copia la carpeta del proyecto a la ruta web de XAMPP:
   ```text
   C:\xampp\htdocs\OFIMANTE
   ```

2. **Iniciar Servicios:**
   - Abre el **XAMPP Control Panel**.
   - Inicia los servicios de **Apache** y **MySQL** (ambos deben estar en verde).

3. **Importar la Base de Datos:**
   - Abre en tu navegador: `http://localhost/phpmyadmin`
   - Haz clic en la pestaña **Importar**.
   - Selecciona el archivo [`database.sql`](database.sql) ubicado en la raíz del proyecto y haz clic en **Continuar**.
   - Se creará la base de datos `ofimante_db` con las 9 tablas y los datos semilla listos para probar.

4. **Verificar Parámetros de Conexión (`config/config.php`):**
   Corrobora que las credenciales coincidan con las de tu servidor MySQL (configuración predeterminada de XAMPP):
   ```php
   define('DB_HOST', 'localhost');
   define('DB_PORT', '3306');
   define('DB_NAME', 'ofimante_db');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

5. **Abrir la Aplicación en el Navegador:**
   Ingresa a cualquiera de las siguientes direcciones:
   ```text
   http://localhost/OFIMANTE/
   ```
   *(También puedes abrir directamente [`index.html`](index.html) haciendo doble clic en cualquier navegador; el sistema activará automáticamente el motor de persistencia local autónomo).*

---

## 🔑 6. Credenciales de Prueba para Cada Rol

El script SQL incluye cuentas listas con contraseñas encriptadas con BCRYPT para evaluar cada rol de inmediato:

| Rol | Correo Electrónico | Contraseña | Estado y Función |
| :--- | :--- | :--- | :--- |
| **🛡️ Administrador** | `admin@ofimante.com` | `Admin1234!` | Acceso al panel de control, métricas, recaudación ($100 MXN * vacantes), aprobación de candidatos/empresas/vacantes y auditoría. |
| **🎓 Candidato (Aprobado)** | `carlos.garza@alumnos.uat.edu.mx` | `Candidato123!` | Perfil aprobado; puede ver ofertas, postularse y revisar sus postulaciones. |
| **🎓 Candidato (Pendiente)** | `ana.mendez@gmail.com` | `Candidato123!` | Perfil en revisión para evaluar la aprobación del administrador. |
| **🏢 Empresa (Aprobada)** | `contacto@solucionesmante.com.mx` | `Empresa123!` | Empresa verificada; cuenta con vacantes activas y bandeja de solicitudes. |
| **🏢 Empresa (Clínica Santa Fe)**| `recepcion@clinicasantafe.com` | `Empresa123!` | Empresa médica aprobada para publicar ofertas con tarifa de $100 MXN. |

> [!TIP]
> En la pestaña de Inicio de Sesión puedes usar los botones de **"Accesos Rápidos de Prueba"** para autocompletar las credenciales en 1 clic.

---

## 🌐 7. Configuración de Google OAuth 2.0 (Opcional)

La aplicación cuenta con simulación oficial demostrativa de Google OAuth. Para conectarla con credenciales reales en producción:
1. Accede a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto nuevo y genera un **ID de Cliente de OAuth 2.0** de tipo *Aplicación Web*.
3. En **URIs de redireccionamiento autorizados**, añade:
   ```text
   http://localhost/OFIMANTE/config/google_oauth.php
   ```
4. Pega tus claves en el archivo [`config/config.php`](config/config.php):
   ```php
   define('GOOGLE_CLIENT_ID', 'TU_ID_DE_CLIENTE.apps.googleusercontent.com');
   define('GOOGLE_CLIENT_SECRET', 'TU_CLIENT_SECRET');
   define('GOOGLE_REDIRECT_URI', APP_URL . '/config/google_oauth.php');
   ```

---

## ✨ 8. Lista de Funcionalidades Implementadas

- [x] **Página de Inicio:** Identidad oficial con logotipo, propuesta de valor, sección de cómo funciona en 4 pasos, beneficios diferenciados para candidatos y empresas, empleos recientes con sueldo resaltado, acordeón de preguntas frecuentes (FAQ) y footer con datos de contacto de Ciudad Mante. *(Sin galerías de fotos turísticas).*
- [x] **Registro e Inicio de Sesión:** Selector estricto entre Candidato y Empresa, validación de contraseñas coincidentes, botón oficial de Google OAuth, protección contra escalamiento de rol y acceso directo protegido para administradores.
- [x] **Panel del Candidato:** Currículum Vitae exhaustivo (datos personales idénticos a INE, teléfonos, fecha de nacimiento, escolaridad, experiencia, habilidades, disponibilidad y expectativa salarial), subida de archivo PDF, semáforo de aprobación con aviso explicativo y motivo de rechazo, buscador de empleos con filtros por categoría y palabra clave, postulación con confirmación que evita duplicados y seguimiento en "Mis Postulaciones".
- [x] **Panel de Empresas:** Registro de datos comerciales con RFC y dirección en El Mante, semáforo de validación con insignia de Empresa Verificada, publicación de vacantes con sueldo y beneficios de alta visibilidad, sistema de cobro demostrativo de tarifa de $100 MXN con registro en base de datos, y bandeja cronológica de candidatos recibidos (de más reciente a más antigua) con opciones de Aceptar (con mensaje/cita a entrevista) y Rechazar.
- [x] **Panel de Administrador:** Dashboard con KPIs numéricos, recaudación acumulada por cobro de tarifas ($100 MXN por vacante), moderación de candidatos con modal para motivo de rechazo, validación de empresas, aprobación, edición y eliminación de vacantes, y registro de auditoría en `historial_actividad`.
- [x] **Sistema de Notificaciones:** Notificaciones internas con campana y contador de no leídas para avisos de aprobación, respuestas a solicitudes y nuevas vacantes.
- [x] **Seguridad y Resiliencia:** Contraseñas con BCRYPT, consultas PDO preparadas, control de sesiones seguro, protección CSRF y compatibilidad dual (Servidor MySQL + LocalStorage).

---

*OFIMANTE © 2026 • Desarrollado para Ciudad Mante, Tamaulipas, México.*

