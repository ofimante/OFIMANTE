# OFIMANTE 🌾
### Plataforma de Empleo y Conexión Laboral en Ciudad Mante, Tamaulipas
**Conectando personas sin empleo con empresas y locales de la región**

![OFIMANTE Logo](logo.png)

---

## 📋 Descripción del Proyecto

**OFIMANTE** es una aplicación web integral enfocada a **Ciudad Mante, Tamaulipas**, cuyo objetivo primordial es conectar a personas sin empleo con comercios, clínicas, locales y empresas de la localidad que ofrecen vacantes laborales.

La plataforma opera bajo un flujo de **verificación y aceptación administrativa**, asegurando que los perfiles curriculares de los candidatos y los registros comerciales de las empresas sean validados antes de interactuar en la bolsa de trabajo.

---

## 🚀 Arquitectura y Tecnologías

- **Frontend:** HTML5, CSS3 moderno (paleta azul oscuro con acentos cian y verde menta clínico/creativo, botones grandes y diseño responsivo) y JavaScript (ES6+).
- **Backend & Base de Datos:**
  - **PHP:** Archivos [`db.php`](file:///c:/Users/ismae/OneDrive/Escritorio/OFIMANTE/db.php) y [`api.php`](file:///c:/Users/ismae/OneDrive/Escritorio/OFIMANTE/api.php) con API REST y persistencia en base de datos JSON / SQLite, ideal para entornos con XAMPP / WampServer.
  - **Node.js:** Servidor alternativo [`server.js`](file:///c:/Users/ismae/OneDrive/Escritorio/OFIMANTE/server.js) nativo.
  - **Modo Local Autónomo (LocalStorage):** Permite ejecutar la aplicación directamente haciendo doble clic en [`index.html`](file:///c:/Users/ismae/OneDrive/Escritorio/OFIMANTE/index.html) en cualquier navegador sin necesidad de servidores externos.
- **Inicio de Sesión con Google:** Botón estilizado con Google Identity y soporte para autenticación de candidatos, empresas y administradores.

---

## 🖥️ Flujo de las 5 Pantallas Oficiales

### 1. Pantalla Inicial (Home / Presentación)
- **Logotipo e Identidad:** Marca oficial de OFIMANTE con los colores azul oscuro y verde médico-creativo.
- **Información de la Plataforma:** Explicación de la misión de vincular a personas desempleadas con fuentes de trabajo en El Mante.
- **Botón de Acción:** Acceso directo a **"Iniciar Sesión o Registrarse"** (lleva a la Segunda Pantalla).
- **Galería de Ciudad Mante:** Fotografías representativas del *Cerro del Bernal*, *El Nacimiento*, *Cañón de la Servilleta* y la *Plaza Principal*.

---

### 2. Segunda Pantalla (Registro / Inicio de Sesión)
- **Selector de Rol Obligatorio:**
  - 🎓 **Candidato:** Busca empleo.
  - 🏢 **Empresa / Local:** Ofrece empleo.
  - 🛡️ **Administrador:** Control y moderación de la página.
- **Inicio de Sesión con Google:** Botón oficial para ingresar con cuentas institucionales o de Google.
- **Pestañas de Formulario:** Iniciar sesión con credenciales o crear una cuenta nueva.
- **Redirección Automática:**
  - Si ingresas como Candidato -> Redirige a la **Pantalla 3**.
  - Si ingresas como Empresa -> Redirige a la **Pantalla 4**.
  - Si ingresas como Administrador -> Redirige a la **Pantalla 5**.

---

### 3. Tercera Pantalla (Candidato & CV & Vacantes)
- **Elaboración de Currículum Vitae (CV):** Datos personales completos, puesto solicitado, edad, teléfonos, correo, dirección en Ciudad Mante, escolaridad, experiencia y fotografía personal.
- **Flujo de Aprobación por Administrador:**
  - Al enviar los datos, se muestra el aviso: **"⏳ En espera de validación por el Administrador"**.
  - Una vez que el Administrador acepta sus datos en la Pantalla 5, se desbloquea la sección de **Empleos Disponibles**.
- **Postulación a Empleos:** Lista de vacantes verificadas en Ciudad Mante con botón **"📨 Mandar mi CV"** en 1 clic.

---

### 4. Cuarta Pantalla (Empresa & Tarifa $100 & Solicitudes)
- **Registro de la Empresa:** Razón social, nombre comercial, RFC, giro, dirección en El Mante y contacto.
- **Flujo de Aprobación por Administrador:**
  - Tras registrar los datos, se muestra el estado: **"⏳ Empresa en proceso de aprobación por el Administrador"**.
- **Opciones de la Empresa Aprobada:**
  1. **➕ Agregar una Vacante de Empleo:**
     - Anuncio exacto de las necesidades de la empresa.
     - Sueldo ofrecido y **Beneficios** (prestaciones de ley, bonos, etc.).
     - **Tarifa de Servicio Obligatoria:** Cobro de **$100 pesos** por cada vacante publicada.
  2. **📋 Ver las Solicitudes de los Candidatos:**
     - Lista completa clasificada exactamente por **día y hora** de la solicitud.
     - Botones de acción: **✓ Aceptar** o **✕ Rechazar**.
     - Al presionar **Aceptar**, se despliega el modal con los datos de contacto del candidato (teléfono, correo y dirección) para llamarlo o citarlo.

---

### 5. Quinta Pantalla (Administrador & Control Total)
Panel de control con las funciones clave solicitadas:
- **Aceptar Candidatos:** Validación y activación de los datos de los candidatos para permitirles ver vacantes.
- **Aceptar Empresas:** Autorización de empresas para publicar ofertas y revisar aspirantes.
- **Aceptar Solicitudes de Vacantes:** Aprobación de vacantes creadas con tarifa de $100 antes de salir a la bolsa de trabajo.
- **Modificar Vacantes:** Edición de sueldos, puestos, requisitos y beneficios.
- **Eliminar Vacantes:** Baja definitiva de ofertas vencidas o inapropiadas.
- **Banear / Suspender Usuarios:** Bloqueo de acceso a candidatos o empresas infractoras.
- **Eliminar Usuarios:** Eliminación completa de registros del sistema.

---

## 📁 Archivos del Proyecto

```text
OFIMANTE/
├── index.html       # Estructura semántica de las 5 Pantallas (SPA)
├── style.css        # Hoja de estilos (azul oscuro, grandes botones, responsivo)
├── script.js        # Lógica frontend explicada y modular (roles, $100 pesos, aprobación)
├── OFIMANTE.js      # Réplica sincronizada para compatibilidad
├── api.php          # Backend REST en PHP
├── db.php           # Conexión y gestión de base de datos en PHP
├── server.js        # Backend alternativo en Node.js
├── database.json    # Base de datos persistente inicial
├── logo.png         # Logotipo oficial de OFIMANTE
└── README.md        # Documentación oficial
```

---
*OFIMANTE © 2026 • Vinculación Laboral y Desarrollo Productivo en Ciudad Mante, Tamaulipas.*
