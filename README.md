# OFIMANTE 🌾
### Plataforma Web de Conexión Laboral y Empleo
**Ciudad Mante, Tamaulipas, México**

![OFIMANTE Logo](logo.png)

---

## 📋 1. Descripción del Proyecto

**OFIMANTE** es una plataforma web integral desarrollada específicamente para **Ciudad Mante, Tamaulipas**, cuyo propósito fundamental es conectar a personas en búsqueda de empleo con comercios, consultorios, talleres, clínicas, despachos y empresas locales que ofrecen oportunidades de trabajo en la región cañera y sus alrededores.

La plataforma cuenta con tres tipos de perfiles con flujos y permisos independientes:
1. **Candidatos:** Personas que elaboran su Currículum Vitae (CV) interactivo, suben opcionalmente su archivo PDF, dan seguimiento a sus postulaciones y consultan ofertas laborales una vez que su perfil ha sido validado.
2. **Empresas:** Comercios y negocios locales que registran sus datos fiscales/comerciales, publican vacantes con sueldo y prestaciones destacadas pagando una **tarifa de servicio de $100 MXN**, y administran las solicitudes de aspirantes ordenadas cronológicamente de la más reciente a la más antigua.
3. **Administradores:** Personal encargado de supervisar, moderar y auditar la plataforma: validar o rechazar con motivo candidatos y empresas, autorizar vacantes pagadas, editar ofertas, suspender infractores y monitorear las métricas de ingresos generados por publicaciones.

---

## 🛠️ 2. Tecnologías Empleadas

El proyecto está diseñado bajo una arquitectura limpia, profesional y didáctica para estudiantes y desarrolladores web:

- **Frontend:**
  - **HTML5 Semántico:** Estructura modular dividida en 5 pantallas principales interactivas (Single Page Application - SPA).
  - **CSS3 Moderno:** Paleta institucional azul oscuro profundo (`#071324`, `#0b1e36`, `#102a4c`), cian eléctrico (`#06b6d4`) y verde menta clínico/productivo (`#10b981`), tarjetas con sombras suaves, modales accesibles y diseño responsivo para móviles, tablets y PC.
  - **JavaScript (ES6+):** Controlador reactivo (`script.js` / `OFIMANTE.js`) con soporte de doble motor: comunicación asíncrona mediante `fetch()` contra la API en PHP y fallback automático en `LocalStorage` para ejecución directa en el navegador.
- **Backend & Sesiones:**
  - **PHP 7.4+ / 8.x:** API RESTful modular (`api.php`), arquitectura orientada a servicios (`config/auth.php`, `config/google_oauth.php`).
  - **PHP Sessions:** Manejo seguro de sesiones en servidor con cookies `HttpOnly`, `SameSite=Lax` y regeneración de ID (`session_regenerate_id`) para prevenir *Session Fixation*.
  - **Google OAuth 2.0:** Flujo de autenticación federada con Google Identity Services y endpoint de intercambio de tokens en servidor.
- **Base de Datos:**
  - **MySQL (InnoDB / UTF8MB4):** Esquema relacional optimizado (`database.sql`) con 8 tablas, llaves foráneas (`CASCADE`/`SET NULL`), índices de búsqueda y datos semilla (seeders) realistas de Ciudad Mante.
  - **PDO (PHP Data Objects):** Consultas preparadas parametrizadas en el 100% de los endpoints para prevenir inyección SQL (SQLi).
- **Seguridad:**
  - Hashing criptográfico BCRYPT con `password_hash()` y `password_verify()`.
  - Protección contra ataques de falsificación de peticiones en sitios cruzados (CSRF) mediante tokens criptográficos aleatorios (`bin2hex(random_bytes(32))`).
  - Control de acceso basado en roles (RBAC): Candidato, Empresa, Administrador.
  - Bloqueo de escalamiento de privilegios: El rol de `admin` **nunca** es seleccionable en el registro público.

---

## 🖥️ 3. Estructura y Flujo de las 5 Pantallas

```
[ Pantalla 1: Home ] ───> [ Pantalla 2: Auth ]
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
   [ Pantalla 3: ]    [ Pantalla 4: ]    [ Pantalla 5: ]
     Candidato          Empresa            Admin
   (CV & Vacantes)   (Tarifa $100 &     (Moderación &
                      Solicitudes)         Métricas)
```

### 3.1. Pantalla 1: Inicio y Presentación
- **Identidad Mantense:** Logotipo oficial de OFIMANTE y tipografía corporativa.
- **Propósito y Funcionamiento:** Explicación en 3 sencillos pasos de cómo conectar el talento local con las empresas cañeras.
- **Llamados a la Acción:** Botones de "Iniciar Sesión" y "Crear Cuenta".
- **Beneficios:** Tarjetas diferenciales de ventajas para Candidatos (gratuito, validado, postulaciones ágiles) y para Empresas (alcance directo en El Mante, filtro de candidatos, tablero cronológico).
- **Bolsa Destacada:** Vista previa de vacantes activas en la ciudad.
- **Galería Turística y Cultural de El Mante:** Fotografías representativas del *Cerro del Bernal*, *El Nacimiento*, *Cañón de la Servilleta* y la *Plaza Principal Plutarco Elías Calles*.

### 3.2. Pantalla 2: Registro e Inicio de Sesión
- **Selector de Rol en Registro:** Pestaña pública que permite seleccionar únicamente entre **Candidato** y **Empresa** (el rol Administrador está protegido).
- **Google Sign-In:** Botón oficial con el branding de Google para inicio de sesión en un solo clic.
- **Acceso Administrativo Directo:** Enlace discreto para personal de moderación con validación de credenciales encriptadas.
- **Redirección Contextual:** Tras autenticarse, el sistema conduce automáticamente al panel correspondiente según el rol del usuario.

### 3.3. Pantalla 3: Panel del Candidato
- **Currículum Vitae (CV) Integral:**
  - Puesto solicitado, sueldo deseado y fecha de presentación.
  - Datos personales: Nombre idéntico a INE, edad, fecha de nacimiento, teléfonos, correo y dirección completa en Cd. Mante.
  - Documentación oficial: CURP, RFC, NSS e identificación.
  - Escolaridad y nivel académico (UAT, IT Mante, COBAT, CBTis, etc.).
  - Experiencia laboral previa, conocimientos técnicos y habilidades blandas.
  - Fotografía de perfil y opción de subir archivo PDF de su currículum.
- **Semáforo de Aprobación Administrativa:**
  - `Pendiente`: Aviso preventivo *"En espera de validación por el Administrador"*.
  - `Aprobado`: Desbloqueo total de la bolsa de trabajo y capacidad de postulación.
  - `Rechazado`: Alerta roja con el motivo específico dictado por el administrador y botón para corregir datos.
- **Buscador Reactivo de Empleos:** Filtrado por palabra clave, categoría (Administración, Comercio, Salud, Tecnología, Oficios) y sueldo mínimo.
- **Seguimiento de Postulaciones:** Tabla con fecha/hora de envío, estado (`Pendiente`, `Aceptada`, `Rechazada`) y notas/retroalimentación enviadas por la empresa.

### 3.4. Pantalla 4: Panel de la Empresa
- **Registro Comercial:** Nombre comercial, razón social, RFC, titular responsable, teléfono, dirección física en Mante y logotipo.
- **Estado de Validación:** Notificación visual del estado de aprobación de la empresa por parte del administrador.
- **Publicación de Vacantes con Tarifa de $100 MXN:**
  - Puesto, requisitos detallados, nivel de estudios y horario.
  - **Sueldo y Beneficios con Especial Visibilidad:** Tarjetas destacadas en color cian y verde con el salario mensual neto y prestaciones (IMSS, Infonavit, aguinaldo, vales, bonos).
  - **Pasarela de Cobro de $100 MXN:** Modal de confirmación y cobro simulado de la tarifa de publicación, generando una referencia de pago registrada en la base de datos (`pagos`).
- **Administración Cronológica de Postulaciones:**
  - Clasificación estricta de aspirantes desde el más reciente hasta el más antiguo con fecha y hora exacta (`YYYY-MM-DD HH:MM:SS`).
  - Botones de acción: **✓ Aceptar** o **✕ Rechazar**.
  - Modal de decisión con campo obligatorio para enviar mensaje o fecha de entrevista al aspirante.
  - Acceso inmediato a la información de contacto (teléfono, email, domicilio y visualización/descarga de CV).

### 3.5. Pantalla 5: Panel de Administrador
- **Dashboard de Métricas Generales:**
  - Total de candidatos registrados.
  - Total de empresas registradas.
  - Aprobaciones pendientes de revisión.
  - Vacantes activas y solicitudes procesadas.
  - **Recaudación Total de Tarifas:** Cálculo exacto del dinero ingresado ($100 MXN por cada vacante publicada pagada).
- **Gestión y Moderación de Candidatos:**
  - Botón de Aprobación rápida.
  - Botón de Rechazo con modal obligatorio para redactar el motivo.
  - Acceso a ver currículum completo en modal imprimible.
- **Gestión y Moderación de Empresas:**
  - Validación de establecimientos comerciales de Ciudad Mante.
  - Aprobación o rechazo con retroalimentación.
- **Gestión de Vacantes:**
  - Autorización de ofertas que cuenten con su tarifa cubierta.
  - Modal de **Edición** para corregir sueldos, requisitos o beneficios.
  - Botón para **Eliminar** vacantes inactivas o fraudulentas.
- **Control de Usuarios:** Suspender, reactivar o eliminar cuentas infractoras.

---

## 🚀 4. Guía de Instalación y Puesta en Marcha

### Opción A: Despliegue Completo con XAMPP (Apache + PHP + MySQL) [Recomendado]

1. **Copiar el proyecto a htdocs:**
   Copia la carpeta del proyecto dentro del directorio de publicación de XAMPP:
   ```text
   C:\xampp\htdocs\OFIMANTE
   ```

2. **Iniciar Servicios en XAMPP:**
   - Abre el **XAMPP Control Panel**.
   - Inicia los módulos de **Apache** y **MySQL** (ambos deben mostrarse en verde).

3. **Importar la Base de Datos:**
   - Abre tu navegador y dirígete a: `http://localhost/phpmyadmin`
   - Haz clic en la pestaña **Importar** (o crea una base de datos llamada `ofimante_db`).
   - Selecciona el archivo [`database.sql`](database.sql) ubicado en la raíz del proyecto y presiona **Continuar**.
   - Se crearán las 8 tablas con sus índices, llaves foráneas y datos semilla iniciales.

4. **Verificar Configuración (`config/config.php`):**
   Abre el archivo [`config/config.php`](config/config.php) y corrobora las credenciales de MySQL (por defecto en XAMPP):
   ```php
   define('DB_HOST', 'localhost');
   define('DB_PORT', '3306');
   define('DB_NAME', 'ofimante_db');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

5. **Abrir la Aplicación:**
   Accede en tu navegador a:
   ```text
   http://localhost/OFIMANTE
   ```

---

### Opción B: Ejecución Autónoma en Navegador (Modo Local / Doble Clic)

Si no cuentas con XAMPP instalado en el equipo o deseas mostrar la plataforma en una computadora sin servidor web:
1. Haz doble clic en el archivo [`index.html`](index.html).
2. El sistema detectará automáticamente la ausencia de backend PHP y activará el motor de persistencia local en `LocalStorage`.
3. Todas las funciones (creación de CV, publicación de ofertas con cobro demo de $100, postulaciones y moderación administrativa) operarán de manera inmediata y fluida.

---

## 🔑 5. Cuentas y Credenciales de Prueba

La base de datos incluye cuentas pre-cargadas para evaluar de inmediato los 3 roles:

| Rol | Correo Electrónico | Contraseña | Estado Inicial |
| :--- | :--- | :--- | :--- |
| **🛡️ Administrador** | `admin@ofimante.com` | `Admin1234!` | Activo (Acceso Total) |
| **🎓 Candidato (Aprobado)** | `carlos.garza@alumnos.uat.edu.mx` | `Candidato123!` | Aprobado (Puede postularse) |
| **🎓 Candidato (Pendiente)** | `ana.mendez@gmail.com` | `Candidato123!` | Pendiente de aprobación |
| **🏢 Empresa (Aprobada)** | `contacto@solucionesmante.com.mx` | `Empresa123!` | Aprobada (3 vacantes activas) |
| **🏢 Empresa (Clínica Santa Fe)**| `recepcion@clinicasantafe.com` | `Empresa123!` | Aprobada (Vacante de recepción) |

> [!TIP]
> También puedes utilizar el botón **"Acceso Rápido Administrador"** en la pantalla de autenticación para autocompletar las credenciales directas de administración.

---

## 🌐 6. Configuración de Google OAuth 2.0

Para habilitar el inicio de sesión con cuentas reales de Google en un entorno de producción:

1. Ingresa a la [Consola de Desarrolladores de Google Cloud](https://console.cloud.google.com/).
2. Crea un proyecto nuevo denominado `OFIMANTE`.
3. Ve a **APIs & Services > Credentials** y crea un nuevo **OAuth 2.0 Client ID** de tipo *Web Application*.
4. Agrega los siguientes URIs autorizados:
   - **Authorized JavaScript origins:** `http://localhost`
   - **Authorized redirect URIs:** `http://localhost/OFIMANTE/config/google_oauth.php`
5. Copia tu `Client ID` y `Client Secret` en el archivo [`config/config.php`](config/config.php):
   ```php
   define('GOOGLE_CLIENT_ID', 'TU_ID_CLIENTE.apps.googleusercontent.com');
   define('GOOGLE_CLIENT_SECRET', 'TU_CLIENT_SECRET');
   define('GOOGLE_REDIRECT_URI', 'http://localhost/OFIMANTE/config/google_oauth.php');
   ```

---

## 📁 7. Estructura de Archivos del Proyecto

```text
OFIMANTE/
├── config/
│   ├── config.php          # Configuración global, constantes, sesiones y CSRF
│   ├── database.php        # Conexión PDO a MySQL con manejo de excepciones
│   ├── auth.php            # Métodos de autenticación, hash BCRYPT y roles
│   └── google_oauth.php    # Manejador del flujo de autorización de Google OAuth 2.0
├── api.php                 # API RESTful en PHP con 19 endpoints y consultas preparadas
├── database.sql            # Script SQL oficial para creación de BD, tablas y seeds
├── database.json           # Persistencia JSON auxiliar de respaldo
├── index.html              # Estructura semántica de las 5 pantallas, modales y layouts
├── style.css               # Estilos modernos (Navy `#071324`, Cyan `#06b6d4`, Mint `#10b981`)
├── script.js               # Controlador reactivo frontend con sincronización dual
├── OFIMANTE.js             # Espejo idéntico de script.js para compatibilidad de rutas
├── logo.png                # Logotipo oficial del proyecto OFIMANTE
├── uploads/                # Directorio de almacenamiento para PDFs de CV y fotos
└── README.md               # Documentación técnica, manual de uso e instalación
```

---

## 🔒 8. Principios de Seguridad Implementados

1. **Protección contra Inyección SQL:** Todas las consultas en `api.php` y `config/database.php` utilizan parámetros vinculados (`prepare` y `execute`) de PDO.
2. **Encriptación de Contraseñas:** Algoritmo BCRYPT mediante `password_hash()` con costo computacional óptimo para servidores web.
3. **Defensa contra Fijación de Sesión:** Invocación de `session_regenerate_id(true)` al validar credenciales para invalidar el identificador previo.
4. **Protección CSRF:** Generación y validación de tokens pseudoaleatorios de 256 bits (`bin2hex(random_bytes(32))`) adjuntados en cabeceras HTTP.
5. **Sanitización de Subidas:** Validación de extensión, tipo MIME y tamaño máximo en la subida de currículums en formato PDF y fotografías.
6. **Políticas de Rol Estrictas:** Verificación en backend del rol del usuario antes de permitir operaciones administrativas o de publicación de vacantes.

---

*OFIMANTE © 2026 • Vinculación Laboral y Desarrollo Productivo en Ciudad Mante, Tamaulipas, México.*
