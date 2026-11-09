# OFIMANTE 🌾
### Plataforma de Búsqueda de Empleo y Agenda Virtual Interactiva
**Ciudad Mante, Tamaulipas, México**

![OFIMANTE Logo](logo.png)

---

## 📋 Descripción del Proyecto

**OFIMANTE** es una aplicación web integral diseñada específicamente para vincular a estudiantes de nivel superior (UAT UAM Mante, Instituto Tecnológico Superior de El Mante, etc.), profesionistas egresados y empresas comerciales, de salud, agroindustriales y de software en **Ciudad Mante, Tamaulipas**.

La plataforma combina dos núcleos funcionales principales:
1. **Bolsa de Empleo Regional Filtrable:** Búsqueda precisa de vacantes según requisitos técnicos, zona de la ciudad (Centro, Norte, Sur, Parque Industrial, Zona Cañera), giro y expectativas salariales.
2. **Agenda Virtual Interactiva de Programación:** Módulo tipo cronograma/calendario para agendar entrevistas laborales presenciales o virtuales, entregas de solicitudes y sesiones de asesoría en programación para estudiantes.

---

## 🚀 Cómo Ejecutar la Aplicación

El proyecto está diseñado bajo una arquitectura flexible y didáctica que permite dos modos de ejecución sin configuraciones complejas:

### Opción A: Modo Directo en Navegador (Sin dependencias)
1. Simplemente haz **doble clic en el archivo `index.html`** para abrirlo en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Firefox, Brave).
2. La aplicación detectará automáticamente el entorno y activará la persistencia de datos mediante **LocalStorage**, permitiendo que todas las altas, bajas, postulaciones y eventos de agenda se guarden en tu navegador de forma persistente.

### Opción B: Modo Servidor Local (Backend REST con Node.js)
1. Abre tu terminal o consola de comandos en la carpeta del proyecto.
2. Ejecuta el comando:
   ```bash
   node server.js
   ```
3. Abre tu navegador web en:
   ```text
   http://localhost:3000
   ```
4. Los datos se almacenarán y sincronizarán en tiempo real en el archivo `database.json`.

---

## 🛠️ Tecnologías Empleadas

- **HTML5 Semántico:** Estructura limpia y accesible de vistas Single Page Application (SPA).
- **CSS3 Moderno:** Diseño responsivo con enfoque **médico-tecnológico y creativo**, paleta de azul oscuro profundo (`#071324`, `#0b1e36`), toques cian clínicos (`#06b6d4`), verde menta (`#10b981`), botones grandes y tarjetas de elevación suave.
- **JavaScript Moderno (ES6+):** Código didáctico, sin frameworks pesados, fácil de explicar en clases de programación universitaria (manipulación de DOM, eventos, promesas y consumo de API).
- **Backend Node.js:** Servidor HTTP nativo con arquitectura RESTful (`/api/jobs`, `/api/candidates`, `/api/companies`, `/api/agenda`, `/api/sync`, `/api/stats`).
- **Base de Datos:** Persistencia dual mediante archivo `database.json` en backend y sincronización con `LocalStorage` en el navegador.
- **Google Sign-In:** Integración estilizada del botón oficial de Google Identity con modal de selección de cuentas institucionales (`@alumnos.uat.edu.mx` y personales `@gmail.com`).

---

## 👥 Perfiles y Roles del Sistema

### 1. 🎓 Perfil "Candidato"
Cuenta con un formulario completo de **7 secciones obligatorias**:
1. **Encabezado y objetivos:** Puesto solicitado, sueldo mensual deseado y fecha de entrega.
2. **Datos personales y de contacto:** Nombre completo (según INE), edad, fecha de nacimiento, dirección completa en Cd. Mante, teléfonos celular y de recados, correo profesional y fotografía.
3. **Documentación oficial:** CURP, RFC, NSS del IMSS y Folio del INE.
4. **Escolaridad:** Nivel máximo alcanzado, institución educativa, períodos cursados y estatus de titulación.
5. **Experiencia laboral:** Nombre de empresa, puesto, periodo laborado, principales logros y referencias de jefes anteriores.
6. **Conocimientos y habilidades:** Idiomas y nivel, software y herramientas tecnológicas o de oficina.
7. **Referencias personales:** Nombres, teléfonos y relación no familiar.

*Funcionalidades adicionales:*
- Postulación con 1 clic a vacantes de empleo.
- Visualización y generación de CV oficial para imprimir o guardar en PDF.
- Consulta de citas y entrevistas programadas en la Agenda Virtual.

---

### 2. 🏢 Perfil "Empresa"
Cuenta con el registro estructurado en **3 secciones oficiales**:
1. **Identificación legal y fiscal:** Razón social, nombre comercial, RFC, actividad económica/giro y representante legal.
2. **Contacto y localización:** Dirección fiscal en El Mante, teléfonos, correos corporativos, web y redes sociales.
3. **Datos operacionales y firmográficos:** Tamaño/empleados, datos bancarios para facturación y tecnologías que utiliza.

*Funcionalidades adicionales:*
- Publicar ofertas laborales (quedan en revisión por el Administrador).
- Ver candidatos postulados con acceso a su expediente curricular.
- Agendar entrevistas en la Agenda Virtual con fecha, hora y modalidad (presencial en Mante o por Google Meet).

---

### 3. 🛡️ Perfil "Administrador"
- **Gestión de Vacantes:** Revisión de solicitudes pendientes, aprobación con 1 clic, modificación de campos y eliminación.
- **Gestión de Candidatos:** Visualización de aspirantes, suspensión/baneo y baja del sistema.
- **Gestión de Empresas:** Moderación de empresas, control de estados (Activa / Suspendida) y eliminación.
- **Métricas del Sistema (KPIs):** Conteo de vacantes activas, pendientes, candidatos y empresas registradas.

---

### 4. 📅 Agenda Virtual Interactiva de Programación
- Organización visual de entrevistas laborales, entregas de solicitud y sesiones de asesoría en programación para estudiantes.
- Filtro por tipo de cita y estado (Programada, Confirmada, Concluida).
- Creación rápida de nuevas citas con fecha, hora, modalidad y enlace de videoconferencia.

---

## 📍 Identidad Cultural de Ciudad Mante

La aplicación resalta el orgullo regional mantense a través de una galería interactiva con monumentos y parajes emblemáticos:
- **El Cerro del Bernal de Horcasitas:** Símbolo natural y guardián de la región.
- **El Nacimiento del Río Mante:** Aguas turquesas y manantial subterráneo de la Sierra de Cucharas.
- **El Cañón de la Servilleta:** Belleza ecológica sobre el Río Boquillas.
- **Plaza Principal y Centro Histórico:** Corazón cívico y comercial de El Mante.

---

## 📁 Estructura del Código

```text
OFIMANTE/
├── index.html       # Estructura semántica de todas las vistas (SPA)
├── style.css        # Hoja de estilos con paleta azul oscuro, cian y diseño responsivo
├── script.js        # Lógica didáctica de frontend, roles, filtros y agenda
├── server.js        # Servidor backend REST en Node.js (cero dependencias externas)
├── database.json    # Base de datos persistente inicial con datos semilla de Cd. Mante
├── logo.png         # Logotipo oficial de OFIMANTE proporcionado
└── README.md        # Documentación técnica del proyecto
```

---
*OFIMANTE © 2026 • Vinculación Académica y Laboral de Ciudad Mante, Tamaulipas.*

