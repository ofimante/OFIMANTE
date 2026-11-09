// ==============================================================================
// OFIMANTE - LÓGICA PRINCIPAL DE LA APLICACIÓN WEB (Frontend JavaScript)
// Ciudad Mante, Tamaulipas - Vinculación de Empleo y Agenda Virtual
// Diseñado con un enfoque didáctico y modular para estudiantes de nivel superior
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. ESTADO GLOBAL DE LA APLICACIÓN
// ------------------------------------------------------------------------------
const STATE = {
    currentRole: 'candidato', // 'candidato' | 'empresa' | 'admin'
    currentUser: null,       // Usuario autenticado (ej. vía Google)
    isBackendOnline: false,  // Indica si el backend Node.js está respondiendo
    jobs: [],                // Listado de vacantes de empleo
    candidates: [],          // Listado de perfiles de candidatos
    companies: [],           // Listado de perfiles de empresas
    agenda: []               // Citas y eventos de la agenda interactiva
};

// Semilla de datos iniciales en caso de ejecutar directamente en el navegador sin backend
const FALLBACK_DATA = {
    jobs: [
        {
            id: 1,
            puesto: "Desarrollador Web Jr. / Soporte de Sistemas",
            empresa: "Soluciones Digitales del Mante",
            giro: "Tecnología y Software",
            rfcEmpresa: "SDM190412AB1",
            ubicacion: "Zona Centro",
            sueldo: "$12,000 - $15,000 mensuales",
            sueldoNum: 13500,
            modalidad: "Presencial / Híbrida",
            tipo: "Tiempo Completo",
            requisitos: "Conocimientos en HTML, CSS, JavaScript y bases de datos. Estudiante o graduado de UAM Mante o IT Mante.",
            escolaridadMinima: "Licenciatura / Ingeniería en Sistemas",
            contacto: "rh@solucionesmante.com.mx | Cel: 831-102-3456",
            estado: "aprobada",
            fechaPublicacion: "2026-11-01",
            postulados: [1]
        },
        {
            id: 2,
            puesto: "Auxiliar Administrativo y Control de Agenda",
            empresa: "Clínica Médica Santa Fe Mante",
            giro: "Salud y Servicios Médicos",
            rfcEmpresa: "CMS980315KL9",
            ubicacion: "Zona Centro (Frente a Plaza Principal)",
            sueldo: "$9,500 mensuales",
            sueldoNum: 9500,
            modalidad: "Presencial",
            tipo: "Tiempo Completo",
            requisitos: "Manejo de equipo de cómputo, paquetería Office y atención a pacientes. Organización y empatía.",
            escolaridadMinima: "Técnico Superior Universitario / Trunca",
            contacto: "administracion@clinicasantafe.com | Tel: 831-232-1144",
            estado: "aprobada",
            fechaPublicacion: "2026-11-03",
            postulados: []
        },
        {
            id: 3,
            puesto: "Supervisor de Tecnologías y Redes Industriales",
            empresa: "Agroservicios Cañeros del Mante S.A. de C.V.",
            giro: "Agroindustria y Manufactura",
            rfcEmpresa: "ACM050720XX3",
            ubicacion: "Zona Industrial / Libramiento Mante",
            sueldo: "$16,000 - $18,000 mensuales",
            sueldoNum: 17000,
            modalidad: "Presencial",
            tipo: "Tiempo Completo",
            requisitos: "Configuración de redes LAN, cableado estructurado, respaldo de servidores y básculas cañeras.",
            escolaridadMinima: "Ingeniería en Sistemas / Electrónica",
            contacto: "bolsadetrabajo@agrocanerosmante.com | Tel: 831-233-9000",
            estado: "aprobada",
            fechaPublicacion: "2026-11-05",
            postulados: []
        },
        {
            id: 4,
            puesto: "Diseñador Gráfico & Community Manager Jr.",
            empresa: "Publicidad Mante Creativa",
            giro: "Publicidad y Mercadotecnia",
            rfcEmpresa: "PMC210801TR8",
            ubicacion: "Zona Norte",
            sueldo: "$8,000 - $10,000 mensuales",
            sueldoNum: 9000,
            modalidad: "Medio Tiempo / Flexible para Estudiantes",
            tipo: "Medio Tiempo",
            requisitos: "Manejo de herramientas de diseño. Creación de contenido para comercios locales de Cd. Mante.",
            escolaridadMinima: "Licenciatura en Diseño / Mercadotecnia",
            contacto: "contacto@mantecreativa.com | Cel: 831-155-7890",
            estado: "pendiente",
            fechaPublicacion: "2026-11-08",
            postulados: []
        }
    ],
    candidates: [
        {
            id: 1,
            // 1. Encabezado y objetivos
            puestoSolicitado: "Desarrollador Web Jr. o Analista de Sistemas",
            sueldoDeseado: "$14,000 mensuales",
            fechaEntrega: "2026-11-09",
            // 2. Datos personales y de contacto
            nombreCompleto: "Carlos Eduardo Garza Morales",
            edad: 23,
            fechaNacimiento: "2003-05-18",
            direccion: "Calle Juárez #402 Ote, Col. Centro, CP 89800, El Mante, Tamaulipas",
            telefonoCelular: "831-145-8921",
            telefonoRecados: "831-232-0987",
            correo: "carlos.garza.dev@gmail.com",
            fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            // 3. Documentación oficial
            curp: "GAMC030518HTSMRL04",
            rfc: "GAMC0305189T1",
            nss: "45090312458",
            ineFolio: "0345092147812",
            // 4. Escolaridad
            nivelEstudios: "Ingeniería en Tecnologías de la Información",
            institucion: "Universidad Autónoma de Tamaulipas - UAM Mante",
            institucionDireccion: "Blvd. Enrique Cárdenas González S/N, Cd. Mante, Tam.",
            periodos: "2021 - 2025",
            tieneTitulo: "Carta de Pasante / Título en trámite",
            // 5. Experiencia laboral
            empresaAnterior: "Cyber & Papelería El Cañero",
            puestoAnterior: "Encargado de Soporte y Atención Técnica",
            periodoLaborado: "Enero 2024 - Diciembre 2024 (1 año)",
            funcionesLogros: "Mantenimiento preventivo a 20 equipos de cómputo, desarrollo de página de catálogo web e inventario.",
            contactoJefe: "Ing. Roberto M. - Cel: 831-110-5544",
            // 6. Conocimientos y habilidades
            idiomas: "Español (Nativo), Inglés (Intermedio Técnico B2)",
            softwareHerramientas: "HTML5, CSS3, JavaScript, Node.js, SQL Server, Git, Mantenimiento PC.",
            // 7. Referencias personales
            referencias: "Lic. Miguel Ángel Torres (Ex-Catedrático UAMM) - Tel: 831-234-9988 | Ing. Patricia Méndez (Compañera de proyectos) - Tel: 831-180-2211",
            estado: "activo",
            rol: "candidato"
        }
    ],
    companies: [
        {
            id: 1,
            // 1. Identificación legal y fiscal
            razonSocial: "Soluciones Digitales del Mante S.A. de C.V.",
            nombreComercial: "Soluciones Digitales del Mante",
            rfc: "SDM190412AB1",
            actividadGiro: "Servicios de Tecnologías de Información y Software",
            representanteLegal: "Lic. Andrea Guadalupe Ruiz Peña (INE: 08941257912)",
            // 2. Contacto y localización
            direccionFiscal: "Av. Manuel Cavazos Lerma #205, Col. Moderna, Cd. Mante, Tamaulipas",
            telefonos: "831-232-5500 / 831-102-3456",
            correos: "contacto@solucionesmante.com.mx, rh@solucionesmante.com.mx",
            sitioWeb: "https://solucionesmante.com.mx",
            redesSociales: "Facebook: @SolucionesDigitalesMante | LinkedIn: /company/solucionesmante",
            // 3. Datos operacionales y firmográficos
            tamanoEstructura: "Mediana (18 colaboradores: desarrollo, redes y gestión)",
            datosBancarios: "BBVA Bancomer - Cuenta CLABE: 012813001234567890",
            datosTecnograficos: "Linux Ubuntu Server, PostgreSQL, Docker, AWS, Node.js, Windows 11 Pro",
            estado: "activo",
            rol: "empresa"
        },
        {
            id: 2,
            // 1. Identificación legal y fiscal
            razonSocial: "Clínica Médica Santa Fe de El Mante S.C.",
            nombreComercial: "Clínica Santa Fe Mante",
            rfc: "CMS980315KL9",
            actividadGiro: "Salud, Especialidades Médicas y Hospitalización",
            representanteLegal: "Dr. Héctor Manuel Treviño Salinas (Cédula: 4591283)",
            // 2. Contacto y localización
            direccionFiscal: "Calle Hidalgo #310 Ote., Zona Centro, Cd. Mante, Tamaulipas",
            telefonos: "831-232-1144 / 831-232-1145",
            correos: "recepcion@clinicasantafe.com, direccion@clinicasantafe.com",
            sitioWeb: "https://clinicasantafe.com.mx",
            redesSociales: "Facebook: @ClinicaSantaFeMante",
            // 3. Datos operacionales y firmográficos
            tamanoEstructura: "Mediana (45 colaboradores en turnos matutino, vespertino y nocturno)",
            datosBancarios: "Banorte - Cuenta CLABE: 072813009876543210",
            datosTecnograficos: "Expediente Clínico Electrónico, Sistema MedicoPro, Red 500Mbps",
            estado: "activo",
            rol: "empresa"
        }
    ],
    agenda: [
        {
            id: 1,
            titulo: "Entrevista Técnica: Desarrollador Web Jr.",
            tipo: "Entrevista Laboral",
            candidatoId: 1,
            candidatoNombre: "Carlos Eduardo Garza Morales",
            empresaId: 1,
            empresaNombre: "Soluciones Digitales del Mante",
            fecha: "2026-11-12",
            hora: "10:30",
            modalidad: "Presencial (Cd. Mante)",
            lugarEnlace: "Av. Manuel Cavazos Lerma #205, Col. Moderna",
            notas: "Llevar laptop y proyectos escolares realizados en JavaScript y bases de datos.",
            estado: "Confirmada"
        },
        {
            id: 2,
            titulo: "Sesión de Asesoría de Programación y Portafolio Web",
            tipo: "Sesión de Programación Estudiantil",
            candidatoId: 1,
            candidatoNombre: "Carlos Eduardo Garza Morales",
            empresaId: 1,
            empresaNombre: "UAT UAMM / Club de Programación",
            fecha: "2026-11-14",
            hora: "16:00",
            modalidad: "Virtual (Google Meet)",
            lugarEnlace: "https://meet.google.com/ofi-mante-demo",
            notas: "Revisión de arquitectura para estudiantes recién graduados en sistemas.",
            estado: "Programada"
        }
    ]
};

// ------------------------------------------------------------------------------
// 2. SINCRONIZACIÓN Y PERSISTENCIA (BACKEND API + LOCALSTORAGE FALLBACK)
// ------------------------------------------------------------------------------

/**
 * Inicializa la persistencia: comprueba si el backend Node.js está activo.
 * Si responde en /api/sync, sincroniza los datos del servidor.
 * Si no está disponible (ej. ejecutado directo por doble clic en index.html),
 * usa localStorage en el navegador para que funcione al 100%.
 */
async function initDataSync() {
    try {
        const response = await fetch('/api/sync', { signal: AbortSignal.timeout(1200) });
        if (response.ok) {
            const serverData = await response.json();
            STATE.jobs = serverData.jobs || [];
            STATE.candidates = serverData.candidates || [];
            STATE.companies = serverData.companies || [];
            STATE.agenda = serverData.agenda || [];
            STATE.isBackendOnline = true;
            updateSyncStatus(true, "Servidor Node.js Conectado (Persistencia en base de datos JSON)");
        } else {
            throw new Error("Respuesta no OK del backend");
        }
    } catch (err) {
        // Fallback a localStorage
        STATE.isBackendOnline = false;
        loadFromLocalStorage();
        updateSyncStatus(false, "Modo Local Autónomo (Persistencia activa en LocalStorage)");
    }

    // Cargar sesión de usuario previamente guardada si existe
    const savedUser = localStorage.getItem('ofimante_user');
    if (savedUser) {
        try {
            STATE.currentUser = JSON.parse(savedUser);
            renderUserSession();
        } catch (e) {
            localStorage.removeItem('ofimante_user');
        }
    }

    refreshAllViews();
}

function updateSyncStatus(online, message) {
    const banner = document.getElementById('syncStatusBar');
    const text = document.getElementById('syncStatusText');
    if (banner && text) {
        text.innerText = message;
        banner.style.background = online 
            ? "linear-gradient(90deg, #093322, #07172b)" 
            : "linear-gradient(90deg, #1e293b, #0f172a)";
    }
}

function saveToLocalStorage() {
    localStorage.setItem('ofimante_data', JSON.stringify({
        jobs: STATE.jobs,
        candidates: STATE.candidates,
        companies: STATE.companies,
        agenda: STATE.agenda
    }));
}

function loadFromLocalStorage() {
    const raw = localStorage.getItem('ofimante_data');
    if (raw) {
        try {
            const data = JSON.parse(raw);
            STATE.jobs = data.jobs || FALLBACK_DATA.jobs;
            STATE.candidates = data.candidates || FALLBACK_DATA.candidates;
            STATE.companies = data.companies || FALLBACK_DATA.companies;
            STATE.agenda = data.agenda || FALLBACK_DATA.agenda;
            return;
        } catch (e) { /* error en parseo, usar semilla */ }
    }
    // Si no existía nada en localStorage, usar datos semilla
    STATE.jobs = [...FALLBACK_DATA.jobs];
    STATE.candidates = [...FALLBACK_DATA.candidates];
    STATE.companies = [...FALLBACK_DATA.companies];
    STATE.agenda = [...FALLBACK_DATA.agenda];
    saveToLocalStorage();
}

/**
 * Envía cambios al backend si está disponible, o a localStorage en fallback.
 */
async function syncDatabaseChanges() {
    saveToLocalStorage();
    if (!STATE.isBackendOnline) return;

    // Si el backend está activo, las operaciones REST ya se enviaron por fetch puntual.
}

// ------------------------------------------------------------------------------
// 3. GESTIÓN DE ROLES (CANDIDATO, EMPRESA, ADMINISTRADOR)
// ------------------------------------------------------------------------------
function setUserRole(role) {
    STATE.currentRole = role;

    // Actualizar botones de selector de rol en la barra superior
    document.getElementById('btnRoleCandidate').classList.toggle('active', role === 'candidato');
    document.getElementById('btnRoleCompany').classList.toggle('active', role === 'empresa');
    document.getElementById('btnRoleAdmin').classList.toggle('active', role === 'admin');

    // Notificación en interfaz
    const roleNames = {
        'candidato': '🎓 Candidato / Estudiante',
        'empresa': '🏢 Empresa de El Mante',
        'admin': '🛡️ Administrador del Sistema'
    };

    console.log(`[OFIMANTE] Perfil cambiado a: ${roleNames[role]}`);

    // Si cambia de rol, actualizar vistas correspondientes
    if (role === 'admin') {
        renderAdminDashboard();
    } else if (role === 'empresa') {
        renderCompanyApplicants();
    }
}

// ------------------------------------------------------------------------------
// 4. NAVEGACIÓN ENTRE VISTAS (SINGLE PAGE APPLICATION)
// ------------------------------------------------------------------------------
function switchView(viewName) {
    const views = ['landing', 'jobs', 'candidate', 'company', 'admin', 'agenda'];
    
    views.forEach(v => {
        const viewEl = document.getElementById(`view-${v}`);
        const navBtn = document.getElementById(`nav-${v}`);
        if (viewEl) {
            viewEl.classList.toggle('active', v === viewName);
        }
        if (navBtn) {
            navBtn.classList.toggle('active', v === viewName);
        }
    });

    // Desplazar suavemente arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Actualizar datos de la vista a la que se entra
    if (viewName === 'jobs') {
        applyJobFilters();
    } else if (viewName === 'admin') {
        renderAdminDashboard();
    } else if (viewName === 'company') {
        renderCompanyApplicants();
        loadCompanyProfile();
    } else if (viewName === 'candidate') {
        loadCandidateProfile();
    } else if (viewName === 'agenda') {
        renderAgendaEvents();
    }
}

function refreshAllViews() {
    renderJobs(STATE.jobs);
    renderAgendaEvents();
    renderAdminDashboard();
    renderCompanyApplicants();
    updateLandingStats();
}

function updateLandingStats() {
    const statJobs = document.getElementById('landingStatJobs');
    if (statJobs) {
        const activeCount = STATE.jobs.filter(j => j.estado === 'aprobada').length;
        statJobs.innerText = `${activeCount}+`;
    }
}

// ------------------------------------------------------------------------------
// 5. INICIO DE SESIÓN CON GOOGLE (SIMULACIÓN AUTÉNTICA Y ELEGANTE)
// ------------------------------------------------------------------------------
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function triggerGoogleLogin(profileType) {
    let user = null;

    if (profileType === 'candidato_carlos') {
        user = {
            id: 1,
            name: "Carlos Garza Morales",
            email: "carlos.garza@alumnos.uat.edu.mx",
            role: "candidato",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        };
        setUserRole('candidato');
    } else if (profileType === 'empresa_soluciones') {
        user = {
            id: 1,
            name: "Soluciones Digitales Mante",
            email: "contacto@solucionesmante.com.mx",
            role: "empresa",
            avatar: "logo.png"
        };
        setUserRole('empresa');
    } else if (profileType === 'admin_general') {
        user = {
            id: 99,
            name: "Admin General Mante",
            email: "admin.ofimante@mante.tam.gob.mx",
            role: "admin",
            avatar: "logo.png"
        };
        setUserRole('admin');
    } else {
        // Estudiante genérico logueado con Google
        user = {
            id: Date.now(),
            name: "Estudiante Universitario",
            email: "usuario.google@gmail.com",
            role: STATE.currentRole,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
        };
    }

    STATE.currentUser = user;
    localStorage.setItem('ofimante_user', JSON.stringify(user));
    closeAuthModal();
    renderUserSession();

    alert(`¡Bienvenido a OFIMANTE, ${user.name}!\nSesión iniciada correctamente con Google.`);
}

function renderUserSession() {
    const loggedWidget = document.getElementById('loggedUserWidget');
    const btnOpenAuth = document.getElementById('btnOpenAuth');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    const userAvatarImg = document.getElementById('userAvatarImg');

    if (STATE.currentUser) {
        loggedWidget.style.display = 'flex';
        btnOpenAuth.style.display = 'none';
        userNameDisplay.innerText = STATE.currentUser.name;
        userRoleDisplay.innerText = STATE.currentUser.role;
        userAvatarImg.src = STATE.currentUser.avatar || 'logo.png';
    } else {
        loggedWidget.style.display = 'none';
        btnOpenAuth.style.display = 'flex';
    }
}

function logoutUser() {
    if (confirm("¿Deseas cerrar tu sesión actual en OFIMANTE?")) {
        STATE.currentUser = null;
        localStorage.removeItem('ofimante_user');
        renderUserSession();
        setUserRole('candidato');
        switchView('landing');
        alert("Sesión finalizada con éxito.");
    }
}

// ------------------------------------------------------------------------------
// 6. BOLSA DE EMPLEOS (BUSCADOR, FILTROS Y POSTULACIONES)
// ------------------------------------------------------------------------------
function renderJobs(jobsList) {
    const grid = document.getElementById('jobsGrid');
    const countDisplay = document.getElementById('jobResultsCount');
    if (!grid) return;

    grid.innerHTML = '';

    // Filtrar solo las vacantes aprobadas para la bolsa general (o todas si es admin)
    const visibleJobs = STATE.currentRole === 'admin' 
        ? jobsList 
        : jobsList.filter(j => j.estado === 'aprobada');

    if (countDisplay) {
        countDisplay.innerText = `Mostrando ${visibleJobs.length} vacante(s) disponible(s)`;
    }

    if (visibleJobs.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px dashed #cbd5e1;">
                <p style="font-size: 1.2rem; color: #64748b; margin-bottom: 0.5rem;">🔍 No se encontraron vacantes con los criterios seleccionados.</p>
                <p style="font-size: 0.9rem; color: #94a3b8;">Prueba ajustando el texto de búsqueda o cambiando la zona de Ciudad Mante.</p>
                <button class="btn-secondary-large" style="margin-top: 1rem;" onclick="resetJobFilters()">Restablecer Filtros</button>
            </div>
        `;
        return;
    }

    visibleJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card-item';

        const isApplied = job.postulados && job.postulados.includes(1);

        card.innerHTML = `
            <div>
                <div class="job-card-top">
                    <h3 class="job-card-title">${job.puesto}</h3>
                    <span class="job-status-pill ${job.estado}">${job.estado === 'aprobada' ? 'Verificada' : 'En Revisión'}</span>
                </div>

                <div class="job-company-row">
                    <span>🏢 ${job.empresa}</span>
                </div>

                <div class="job-meta-tags">
                    <span class="meta-tag location">📍 ${job.ubicacion}</span>
                    <span class="meta-tag salary">${job.sueldo}</span>
                    <span class="meta-tag">💼 ${job.modalidad || 'Presencial'}</span>
                    <span class="meta-tag">🎓 ${job.escolaridadMinima || 'Universidad'}</span>
                </div>

                <div class="job-card-body">
                    <p><strong>Requisitos:</strong> ${job.requisitos}</p>
                </div>
            </div>

            <div class="job-card-bottom">
                <span class="job-contact-info">📞 ${job.contacto}</span>
                <button class="btn-apply-job ${isApplied ? 'applied' : ''}" onclick="applyToJob(${job.id})">
                    ${isApplied ? '✓ Ya te postulaste' : 'Postularme'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function applyJobFilters() {
    const searchText = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const zoneFilter = document.getElementById('filterZone')?.value || '';
    const giroFilter = document.getElementById('filterGiro')?.value || '';
    const minSalary = Number(document.getElementById('filterSalary')?.value || 0);

    const filtered = STATE.jobs.filter(job => {
        const matchText = !searchText || 
            job.puesto.toLowerCase().includes(searchText) ||
            job.empresa.toLowerCase().includes(searchText) ||
            (job.requisitos && job.requisitos.toLowerCase().includes(searchText)) ||
            (job.giro && job.giro.toLowerCase().includes(searchText));

        const matchZone = !zoneFilter || (job.ubicacion && job.ubicacion.includes(zoneFilter));
        const matchGiro = !giroFilter || (job.giro && job.giro.includes(giroFilter));
        const matchSalary = minSalary === 0 || (job.sueldoNum && job.sueldoNum >= minSalary);

        return matchText && matchZone && matchGiro && matchSalary;
    });

    renderJobs(filtered);
}

function resetJobFilters() {
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
    if (document.getElementById('filterZone')) document.getElementById('filterZone').value = '';
    if (document.getElementById('filterGiro')) document.getElementById('filterGiro').value = '';
    if (document.getElementById('filterSalary')) document.getElementById('filterSalary').value = '0';
    renderJobs(STATE.jobs);
}

function applyToJob(jobId) {
    const job = STATE.jobs.find(j => j.id === jobId);
    if (!job) return;

    if (!job.postulados) job.postulados = [];

    const candidateId = STATE.currentUser ? STATE.currentUser.id : 1;

    if (job.postulados.includes(candidateId)) {
        alert("Ya has enviado tu solicitud a esta vacante anteriormente.");
        return;
    }

    job.postulados.push(candidateId);
    syncDatabaseChanges();
    renderJobs(STATE.jobs);
    renderCompanyApplicants();

    alert(`¡Felicidades! Te has postulado exitosamente a:\n"${job.puesto}" en ${job.empresa}.\n\nTu expediente completo ha sido compartido con la empresa para revisión.`);
}

function handleNewJobPrompt() {
    setUserRole('empresa');
    switchView('company');
    alert("Te hemos redirigido al formulario para Publicar Nueva Oferta de Empleo en tu panel de empresa.");
}

// ------------------------------------------------------------------------------
// 7. EXPEDIENTE DEL CANDIDATO (LAS 7 SECCIONES COMPLETAS)
// ------------------------------------------------------------------------------
function loadCandidateProfile() {
    const c = STATE.candidates[0] || FALLBACK_DATA.candidates[0];
    if (!c) return;

    // 1. Encabezado y objetivos
    setVal('c_puestoSolicitado', c.puestoSolicitado);
    setVal('c_sueldoDeseado', c.sueldoDeseado);
    setVal('c_fechaEntrega', c.fechaEntrega);

    // 2. Datos personales y de contacto
    setVal('c_nombreCompleto', c.nombreCompleto);
    setVal('c_edad', c.edad);
    setVal('c_fechaNacimiento', c.fechaNacimiento);
    setVal('c_direccion', c.direccion);
    setVal('c_telefonoCelular', c.telefonoCelular);
    setVal('c_telefonoRecados', c.telefonoRecados);
    setVal('c_correo', c.correo);
    setVal('c_fotoUrl', c.fotoUrl);

    // 3. Documentación oficial
    setVal('c_curp', c.curp);
    setVal('c_rfc', c.rfc);
    setVal('c_nss', c.nss);
    setVal('c_ineFolio', c.ineFolio);

    // 4. Escolaridad
    setVal('c_nivelEstudios', c.nivelEstudios);
    setVal('c_tieneTitulo', c.tieneTitulo);
    setVal('c_institucion', c.institucion);
    setVal('c_periodos', c.periodos);
    setVal('c_institucionDireccion', c.institucionDireccion);

    // 5. Experiencia laboral
    setVal('c_empresaAnterior', c.empresaAnterior);
    setVal('c_puestoAnterior', c.puestoAnterior);
    setVal('c_periodoLaborado', c.periodoLaborado);
    setVal('c_funcionesLogros', c.funcionesLogros);
    setVal('c_contactoJefe', c.contactoJefe);

    // 6. Conocimientos y habilidades
    setVal('c_idiomas', c.idiomas);
    setVal('c_softwareHerramientas', c.softwareHerramientas);

    // 7. Referencias personales
    setVal('c_referencias', c.referencias);
}

function saveCandidateProfile() {
    const candidateData = {
        id: 1,
        // 1. Encabezado y objetivos
        puestoSolicitado: getVal('c_puestoSolicitado'),
        sueldoDeseado: getVal('c_sueldoDeseado'),
        fechaEntrega: getVal('c_fechaEntrega'),
        // 2. Datos personales y contacto
        nombreCompleto: getVal('c_nombreCompleto'),
        edad: parseInt(getVal('c_edad')) || 23,
        fechaNacimiento: getVal('c_fechaNacimiento'),
        direccion: getVal('c_direccion'),
        telefonoCelular: getVal('c_telefonoCelular'),
        telefonoRecados: getVal('c_telefonoRecados'),
        correo: getVal('c_correo'),
        fotoUrl: getVal('c_fotoUrl') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        // 3. Documentación oficial
        curp: getVal('c_curp'),
        rfc: getVal('c_rfc'),
        nss: getVal('c_nss'),
        ineFolio: getVal('c_ineFolio'),
        // 4. Escolaridad
        nivelEstudios: getVal('c_nivelEstudios'),
        tieneTitulo: getVal('c_tieneTitulo'),
        institucion: getVal('c_institucion'),
        periodos: getVal('c_periodos'),
        institucionDireccion: getVal('c_institucionDireccion'),
        // 5. Experiencia laboral
        empresaAnterior: getVal('c_empresaAnterior'),
        puestoAnterior: getVal('c_puestoAnterior'),
        periodoLaborado: getVal('c_periodoLaborado'),
        funcionesLogros: getVal('c_funcionesLogros'),
        contactoJefe: getVal('c_contactoJefe'),
        // 6. Conocimientos y habilidades
        idiomas: getVal('c_idiomas'),
        softwareHerramientas: getVal('c_softwareHerramientas'),
        // 7. Referencias personales
        referencias: getVal('c_referencias'),
        estado: 'activo',
        rol: 'candidato'
    };

    STATE.candidates[0] = candidateData;
    syncDatabaseChanges();
    renderAdminDashboard();

    alert("¡Tu expediente profesional de candidato ha sido guardado y actualizado con éxito en OFIMANTE!");
}

function loadSampleCandidateData() {
    const sample = FALLBACK_DATA.candidates[0];
    STATE.candidates[0] = { ...sample };
    loadCandidateProfile();
    alert("Datos de demostración del candidato de UAT Mante cargados.");
}

function previewFullCV() {
    const c = STATE.candidates[0] || FALLBACK_DATA.candidates[0];
    const container = document.getElementById('cvPreviewContent');
    if (!container) return;

    container.innerHTML = `
        <div class="cv-header-banner">
            <img src="${c.fotoUrl || 'logo.png'}" alt="Foto" class="cv-photo">
            <div>
                <h2 style="font-size: 1.8rem; color: #0b1e36;">${c.nombreCompleto}</h2>
                <p style="font-size: 1.1rem; color: #0284c7; font-weight: 700;">${c.puestoSolicitado}</p>
                <p style="font-size: 0.9rem; color: #64748b;">${c.correo} | 📱 ${c.telefonoCelular} | 📍 ${c.direccion}</p>
            </div>
        </div>

        <div class="cv-section-block">
            <h4>1. Objetivos y Solicitud</h4>
            <p><strong>Puesto Solicitado:</strong> ${c.puestoSolicitado} | <strong>Sueldo Deseado:</strong> ${c.sueldoDeseado} | <strong>Fecha de Entrega:</strong> ${c.fechaEntrega}</p>
        </div>

        <div class="cv-section-block">
            <h4>2. Datos Personales y Documentación Oficial</h4>
            <p><strong>Edad:</strong> ${c.edad} años | <strong>Fecha de Nacimiento:</strong> ${c.fechaNacimiento}</p>
            <p><strong>CURP:</strong> ${c.curp} | <strong>RFC:</strong> ${c.rfc} | <strong>NSS (IMSS):</strong> ${c.nss} | <strong>Folio INE:</strong> ${c.ineFolio}</p>
        </div>

        <div class="cv-section-block">
            <h4>3. Escolaridad y Formación Superior</h4>
            <p><strong>${c.nivelEstudios}</strong> - ${c.institucion}</p>
            <p><strong>Periodo:</strong> ${c.periodos} | <strong>Estatus:</strong> ${c.tieneTitulo}</p>
            <p><strong>Ubicación de la institución:</strong> ${c.institucionDireccion}</p>
        </div>

        <div class="cv-section-block">
            <h4>4. Experiencia Laboral</h4>
            <p><strong>${c.puestoAnterior}</strong> en ${c.empresaAnterior} (${c.periodoLaborado})</p>
            <p><strong>Funciones y Logros:</strong> ${c.funcionesLogros}</p>
            <p><strong>Referencia laboral:</strong> ${c.contactoJefe}</p>
        </div>

        <div class="cv-section-block">
            <h4>5. Conocimientos y Habilidades Tecnológicas</h4>
            <p><strong>Idiomas:</strong> ${c.idiomas}</p>
            <p><strong>Software y Herramientas:</strong> ${c.softwareHerramientas}</p>
        </div>

        <div class="cv-section-block">
            <h4>6. Referencias Personales</h4>
            <p>${c.referencias}</p>
        </div>
    `;

    document.getElementById('cvPreviewModal').style.display = 'flex';
}

function closeCvPreviewModal() {
    document.getElementById('cvPreviewModal').style.display = 'none';
}

// ------------------------------------------------------------------------------
// 8. REGISTRO Y PANEL DE EMPRESA (LAS 3 SECCIONES OBLIGATORIAS)
// ------------------------------------------------------------------------------
function loadCompanyProfile() {
    const comp = STATE.companies[0] || FALLBACK_DATA.companies[0];
    if (!comp) return;

    // 1. Identificación legal y fiscal
    setVal('e_razonSocial', comp.razonSocial);
    setVal('e_nombreComercial', comp.nombreComercial);
    setVal('e_rfc', comp.rfc);
    setVal('e_actividadGiro', comp.actividadGiro);
    setVal('e_representanteLegal', comp.representanteLegal);

    // 2. Contacto y localización
    setVal('e_direccionFiscal', comp.direccionFiscal);
    setVal('e_telefonos', comp.telefonos);
    setVal('e_correos', comp.correos);
    setVal('e_sitioWeb', comp.sitioWeb);
    setVal('e_redesSociales', comp.redesSociales);

    // 3. Datos operacionales y firmográficos
    setVal('e_tamanoEstructura', comp.tamanoEstructura);
    setVal('e_datosBancarios', comp.datosBancarios);
    setVal('e_datosTecnograficos', comp.datosTecnograficos);
}

function saveCompanyProfile() {
    const compData = {
        id: 1,
        // 1. Identificación legal y fiscal
        razonSocial: getVal('e_razonSocial'),
        nombreComercial: getVal('e_nombreComercial'),
        rfc: getVal('e_rfc'),
        actividadGiro: getVal('e_actividadGiro'),
        representanteLegal: getVal('e_representanteLegal'),
        // 2. Contacto y localización
        direccionFiscal: getVal('e_direccionFiscal'),
        telefonos: getVal('e_telefonos'),
        correos: getVal('e_correos'),
        sitioWeb: getVal('e_sitioWeb'),
        redesSociales: getVal('e_redesSociales'),
        // 3. Datos operacionales y firmográficos
        tamanoEstructura: getVal('e_tamanoEstructura'),
        datosBancarios: getVal('e_datosBancarios'),
        datosTecnograficos: getVal('e_datosTecnograficos'),
        estado: 'activo',
        rol: 'empresa'
    };

    STATE.companies[0] = compData;
    syncDatabaseChanges();
    renderAdminDashboard();

    alert("¡Perfil de empresa actualizado exitosamente en OFIMANTE!");
}

function loadSampleCompanyData() {
    const sample = FALLBACK_DATA.companies[0];
    STATE.companies[0] = { ...sample };
    loadCompanyProfile();
    alert("Datos de empresa demostrativa de Ciudad Mante cargados.");
}

function handleCompanyPostJob(event) {
    event.preventDefault();

    const puesto = getVal('p_puesto');
    const giro = getVal('p_giro');
    const ubicacion = getVal('p_ubicacion');
    const sueldo = getVal('p_sueldo');
    const modalidad = getVal('p_modalidad');
    const escolaridad = getVal('p_escolaridad');
    const requisitos = getVal('p_requisitos');
    const contacto = getVal('p_contacto');

    if (!puesto || !requisitos || !contacto) {
        alert("Por favor completa los campos requeridos.");
        return;
    }

    const newJob = {
        id: STATE.jobs.length > 0 ? Math.max(...STATE.jobs.map(j => j.id)) + 1 : 1,
        puesto: puesto,
        empresa: STATE.companies[0]?.nombreComercial || "Empresa Mantense",
        giro: giro,
        ubicacion: ubicacion,
        sueldo: sueldo,
        sueldoNum: parseInt(sueldo.replace(/\D/g, '')) || 10000,
        modalidad: modalidad,
        escolaridadMinima: escolaridad,
        requisitos: requisitos,
        contacto: contacto,
        estado: "pendiente", // Pasa a revisión del administrador
        fechaPublicacion: new Date().toISOString().split('T')[0],
        postulados: []
    };

    STATE.jobs.unshift(newJob);
    syncDatabaseChanges();
    document.getElementById('postJobForm')?.reset();
    renderJobs(STATE.jobs);
    renderAdminDashboard();

    alert("¡Vacante enviada con éxito!\nHa sido enviada al Administrador para su revisión y activación en la bolsa de empleo.");
}

function renderCompanyApplicants() {
    const tbody = document.getElementById('companyApplicantsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Buscar vacantes con postulados
    const myJobs = STATE.jobs.filter(j => j.postulados && j.postulados.length > 0);

    if (myJobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 1.5rem; color: #64748b;">No hay postulaciones registradas en este momento.</td></tr>`;
        return;
    }

    myJobs.forEach(job => {
        job.postulados.forEach(candId => {
            const cand = STATE.candidates.find(c => c.id === candId) || STATE.candidates[0];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong>${cand.nombreCompleto}</strong><br>
                    <small style="color: #64748b;">${cand.correo}</small>
                </td>
                <td><strong>${job.puesto}</strong></td>
                <td>${cand.nivelEstudios}</td>
                <td>📱 ${cand.telefonoCelular}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-table-action btn-table-view" onclick="previewFullCV()">Ver CV</button>
                        <button class="btn-table-action btn-table-approve" onclick="openScheduleModalForApplicant('${cand.nombreCompleto}', '${job.puesto}')">Agendar Cita</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function openScheduleModalForApplicant(candidateName, jobTitle) {
    document.getElementById('ev_titulo').value = `Entrevista para ${jobTitle}`;
    document.getElementById('ev_candidatoNombre').value = candidateName;
    document.getElementById('ev_empresaNombre').value = STATE.companies[0]?.nombreComercial || "Soluciones Digitales Mante";
    document.getElementById('ev_tipo').value = "Entrevista Laboral";
    document.getElementById('agendaEventModal').style.display = 'flex';
}

// ------------------------------------------------------------------------------
// 9. PANEL DE ADMINISTRADOR (MODERACIÓN Y CONTROL TOTAL)
// ------------------------------------------------------------------------------
function renderAdminDashboard() {
    // 1. Actualizar KPIs
    const totalJobsEl = document.getElementById('kpiTotalJobs');
    const pendingJobsEl = document.getElementById('kpiPendingJobs');
    const candidatesEl = document.getElementById('kpiCandidates');
    const companiesEl = document.getElementById('kpiCompanies');

    if (totalJobsEl) totalJobsEl.innerText = STATE.jobs.length;
    if (pendingJobsEl) pendingJobsEl.innerText = STATE.jobs.filter(j => j.estado === 'pendiente').length;
    if (candidatesEl) candidatesEl.innerText = STATE.candidates.length;
    if (companiesEl) companiesEl.innerText = STATE.companies.length;

    // 2. Renderizar tabla de vacantes de admin
    renderAdminJobsTable();

    // 3. Renderizar tabla de candidatos de admin
    renderAdminCandidatesTable();

    // 4. Renderizar tabla de empresas de admin
    renderAdminCompaniesTable();
}

function renderAdminJobsTable() {
    const tbody = document.getElementById('adminJobsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    STATE.jobs.forEach(job => {
        const tr = document.createElement('tr');
        const isPending = job.estado === 'pendiente';

        tr.innerHTML = `
            <td>#${job.id}</td>
            <td><strong>${job.puesto}</strong></td>
            <td>${job.empresa}</td>
            <td>${job.ubicacion}</td>
            <td>${job.sueldo}</td>
            <td>
                <span class="job-status-pill ${job.estado}">
                    ${isPending ? 'Pendiente' : 'Aprobada'}
                </span>
            </td>
            <td>
                <div class="action-btn-group">
                    ${isPending ? `<button class="btn-table-action btn-table-approve" onclick="adminApproveJob(${job.id})" title="Aprobar vacante">✓ Aceptar</button>` : ''}
                    <button class="btn-table-action btn-table-edit" onclick="openEditJobModal(${job.id})" title="Editar datos">✏️ Editar</button>
                    <button class="btn-table-action btn-table-delete" onclick="adminDeleteJob(${job.id})" title="Eliminar del sistema">🗑️ Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adminApproveJob(id) {
    const job = STATE.jobs.find(j => j.id === id);
    if (!job) return;

    job.estado = 'aprobada';
    syncDatabaseChanges();
    renderAdminDashboard();
    renderJobs(STATE.jobs);
    alert(`La vacante "${job.puesto}" ha sido APROBADA y ya es visible para todos los estudiantes.`);
}

function adminDeleteJob(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta vacante de forma definitiva?")) {
        STATE.jobs = STATE.jobs.filter(j => j.id !== id);
        syncDatabaseChanges();
        renderAdminDashboard();
        renderJobs(STATE.jobs);
        alert("Vacante eliminada del sistema.");
    }
}

function renderAdminCandidatesTable() {
    const tbody = document.getElementById('adminCandidatesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    STATE.candidates.forEach(c => {
        const tr = document.createElement('tr');
        const isBanned = c.estado === 'baneado';

        tr.innerHTML = `
            <td>#${c.id}</td>
            <td><strong>${c.nombreCompleto}</strong></td>
            <td>${c.puestoSolicitado}</td>
            <td>${c.telefonoCelular}<br><small>${c.correo}</small></td>
            <td>
                <span class="job-status-pill ${isBanned ? 'pendiente' : 'aprobada'}">
                    ${isBanned ? '🚫 Baneado' : 'Activo'}
                </span>
            </td>
            <td>
                <div class="action-btn-group">
                    <button class="btn-table-action btn-table-view" onclick="previewFullCV()">CV</button>
                    <button class="btn-table-action btn-table-ban" onclick="adminToggleBanCandidate(${c.id})">
                        ${isBanned ? 'Desbanear' : 'Banear'}
                    </button>
                    <button class="btn-table-action btn-table-delete" onclick="adminDeleteCandidate(${c.id})">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adminToggleBanCandidate(id) {
    const c = STATE.candidates.find(cand => cand.id === id);
    if (!c) return;

    c.estado = c.estado === 'baneado' ? 'activo' : 'baneado';
    syncDatabaseChanges();
    renderAdminCandidatesTable();
    alert(`El estado del candidato ${c.nombreCompleto} cambió a: ${c.estado.toUpperCase()}`);
}

function adminDeleteCandidate(id) {
    if (confirm("¿Eliminar usuario candidato? Esta acción no se puede deshacer.")) {
        STATE.candidates = STATE.candidates.filter(c => c.id !== id);
        syncDatabaseChanges();
        renderAdminDashboard();
        alert("Candidato eliminado del sistema.");
    }
}

function renderAdminCompaniesTable() {
    const tbody = document.getElementById('adminCompaniesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    STATE.companies.forEach(comp => {
        const tr = document.createElement('tr');
        const isBanned = comp.estado === 'baneado';

        tr.innerHTML = `
            <td>#${comp.id}</td>
            <td><strong>${comp.nombreComercial}</strong><br><small>${comp.razonSocial}</small></td>
            <td><code>${comp.rfc}</code></td>
            <td>${comp.actividadGiro}</td>
            <td>
                <span class="job-status-pill ${isBanned ? 'pendiente' : 'aprobada'}">
                    ${isBanned ? '🚫 Suspendida' : 'Activa'}
                </span>
            </td>
            <td>
                <div class="action-btn-group">
                    <button class="btn-table-action btn-table-ban" onclick="adminToggleBanCompany(${comp.id})">
                        ${isBanned ? 'Reactivar' : 'Banear / Suspender'}
                    </button>
                    <button class="btn-table-action btn-table-delete" onclick="adminDeleteCompany(${comp.id})">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adminToggleBanCompany(id) {
    const comp = STATE.companies.find(c => c.id === id);
    if (!comp) return;

    comp.estado = comp.estado === 'baneado' ? 'activo' : 'baneado';
    syncDatabaseChanges();
    renderAdminCompaniesTable();
    alert(`La empresa "${comp.nombreComercial}" ahora está: ${comp.estado.toUpperCase()}`);
}

function adminDeleteCompany(id) {
    if (confirm("¿Estás seguro de eliminar esta empresa y sus registros del sistema?")) {
        STATE.companies = STATE.companies.filter(c => c.id !== id);
        syncDatabaseChanges();
        renderAdminDashboard();
        alert("Empresa eliminada del sistema.");
    }
}

// ------------------------------------------------------------------------------
// 10. MODAL DE EDICIÓN DE VACANTES (ADMIN Y EMPRESA)
// ------------------------------------------------------------------------------
function openEditJobModal(id) {
    const job = STATE.jobs.find(j => j.id === id);
    if (!job) return;

    setVal('editJobId', job.id);
    setVal('editPuesto', job.puesto);
    setVal('editEmpresa', job.empresa);
    setVal('editUbicacion', job.ubicacion);
    setVal('editSueldo', job.sueldo);
    setVal('editModalidad', job.modalidad);
    setVal('editRequisitos', job.requisitos);
    setVal('editContacto', job.contacto);

    document.getElementById('editJobModal').style.display = 'flex';
}

function closeEditJobModal() {
    document.getElementById('editJobModal').style.display = 'none';
}

function handleSaveEditedJob(event) {
    event.preventDefault();

    const id = parseInt(getVal('editJobId'));
    const job = STATE.jobs.find(j => j.id === id);
    if (!job) return;

    job.puesto = getVal('editPuesto');
    job.empresa = getVal('editEmpresa');
    job.ubicacion = getVal('editUbicacion');
    job.sueldo = getVal('editSueldo');
    job.modalidad = getVal('editModalidad');
    job.requisitos = getVal('editRequisitos');
    job.contacto = getVal('editContacto');

    syncDatabaseChanges();
    closeEditJobModal();
    renderJobs(STATE.jobs);
    renderAdminDashboard();

    alert("¡Vacante actualizada correctamente!");
}

// ------------------------------------------------------------------------------
// 11. AGENDA VIRTUAL INTERACTIVA DE PROGRAMACIÓN
// ------------------------------------------------------------------------------
function renderAgendaEvents() {
    const grid = document.getElementById('agendaGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const typeFilter = document.getElementById('agendaFilterType')?.value || '';
    const statusFilter = document.getElementById('agendaFilterStatus')?.value || '';

    const filtered = STATE.agenda.filter(ev => {
        const matchType = !typeFilter || ev.tipo === typeFilter;
        const matchStatus = !statusFilter || ev.estado === statusFilter;
        return matchType && matchStatus;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px dashed #cbd5e1;">
                <p style="font-size: 1.2rem; color: #64748b;">📅 No hay eventos programados en este momento.</p>
                <p style="font-size: 0.9rem; color: #94a3b8;">Programa una entrevista o sesión con el botón superior.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(ev => {
        const card = document.createElement('div');
        const stLower = ev.estado.toLowerCase();
        card.className = `agenda-card ${stLower}`;

        card.innerHTML = `
            <div>
                <div class="agenda-card-top">
                    <span class="agenda-type-badge">${ev.tipo}</span>
                    <span class="agenda-status-badge ${stLower}">${ev.estado}</span>
                </div>

                <h3 class="agenda-title">${ev.titulo}</h3>

                <div class="agenda-datetime-box">
                    <span>🗓️ ${ev.fecha}</span>
                    <span>⏰ ${ev.hora} hrs</span>
                </div>

                <div class="agenda-details">
                    <p><strong>Candidato:</strong> ${ev.candidatoNombre}</p>
                    <p><strong>Empresa / Entidad:</strong> ${ev.empresaNombre}</p>
                    <p><strong>Modalidad:</strong> ${ev.modalidad}</p>
                    <p><strong>Lugar / Enlace:</strong> <a href="${ev.lugarEnlace.startsWith('http') ? ev.lugarEnlace : '#'}" target="_blank" style="color:#0284c7;">${ev.lugarEnlace}</a></p>
                    ${ev.notas ? `<p style="margin-top:0.4rem; font-style:italic; color:#475569;">" ${ev.notas} "</p>` : ''}
                </div>
            </div>

            <div class="agenda-actions">
                ${ev.estado !== 'Confirmada' ? `<button class="btn-table-action btn-table-approve" onclick="updateAgendaStatus(${ev.id}, 'Confirmada')">✓ Confirmar</button>` : ''}
                ${ev.estado !== 'Concluida' ? `<button class="btn-table-action btn-table-edit" onclick="updateAgendaStatus(${ev.id}, 'Concluida')">Concluir</button>` : ''}
                <button class="btn-table-action btn-table-delete" onclick="deleteAgendaEvent(${ev.id})">Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openNewEventModal() {
    document.getElementById('newEventForm')?.reset();
    document.getElementById('ev_fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('ev_hora').value = "10:00";
    document.getElementById('ev_candidatoNombre').value = STATE.candidates[0]?.nombreCompleto || "Carlos Garza Morales";
    document.getElementById('ev_empresaNombre').value = STATE.companies[0]?.nombreComercial || "Soluciones Digitales Mante";
    document.getElementById('agendaEventModal').style.display = 'flex';
}

function closeNewEventModal() {
    document.getElementById('agendaEventModal').style.display = 'none';
}

function handleSaveAgendaEvent(event) {
    event.preventDefault();

    const newEv = {
        id: STATE.agenda.length > 0 ? Math.max(...STATE.agenda.map(a => a.id)) + 1 : 1,
        titulo: getVal('ev_titulo'),
        tipo: getVal('ev_tipo'),
        modalidad: getVal('ev_modalidad'),
        fecha: getVal('ev_fecha'),
        hora: getVal('ev_hora'),
        candidatoNombre: getVal('ev_candidatoNombre'),
        empresaNombre: getVal('ev_empresaNombre'),
        lugarEnlace: getVal('ev_lugarEnlace'),
        notas: getVal('ev_notas'),
        estado: 'Programada'
    };

    STATE.agenda.unshift(newEv);
    syncDatabaseChanges();
    closeNewEventModal();
    renderAgendaEvents();

    alert(`¡Cita programada con éxito en la Agenda Virtual!\n"${newEv.titulo}" agendada para el ${newEv.fecha} a las ${newEv.hora} hrs.`);
}

function updateAgendaStatus(id, newStatus) {
    const ev = STATE.agenda.find(a => a.id === id);
    if (!ev) return;

    ev.estado = newStatus;
    syncDatabaseChanges();
    renderAgendaEvents();
}

function deleteAgendaEvent(id) {
    if (confirm("¿Deseas eliminar este evento de la agenda?")) {
        STATE.agenda = STATE.agenda.filter(a => a.id !== id);
        syncDatabaseChanges();
        renderAgendaEvents();
    }
}

// ------------------------------------------------------------------------------
// 12. UTILIDADES GENERALES
// ------------------------------------------------------------------------------
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined) {
        el.value = value;
    }
}

// ------------------------------------------------------------------------------
// 13. INICIALIZACIÓN AL CARGAR EL DOCUMENTO
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log("-> [OFIMANTE] Inicializando sistema de empleo y agenda para Ciudad Mante...");
    initDataSync();
    setUserRole('candidato');
    switchView('landing');
});

