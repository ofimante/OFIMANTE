// ==============================================================================
// OFIMANTE - LÓGICA DE CONTROL Y PANTALLAS (JavaScript)
// Ciudad Mante, Tamaulipas - Conexión Laboral
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. ESTADO GLOBAL DE LA APLICACIÓN
// ------------------------------------------------------------------------------
const APP_STATE = {
    currentScreen: 'screen-1',
    selectedAuthRole: 'candidato', // 'candidato' | 'empresa' | 'admin'
    currentUser: null,
    backendMode: 'local', // 'php' | 'local'

    // Datos principales del sistema
    users: [],
    candidates: [],
    companies: [],
    jobs: [],
    applications: []
};

// Datos semilla de Ciudad Mante para funcionamiento inmediato
const SEED_DATA = {
    users: [
        { id: 1, email: "carlos.garza@alumnos.uat.edu.mx", nombre: "Carlos Eduardo Garza", rol: "candidato", estado: "activo", aprobado: true },
        { id: 2, email: "contacto@solucionesmante.com.mx", nombre: "Soluciones Digitales Mante", rol: "empresa", estado: "activo", aprobado: true },
        { id: 99, email: "admin@ofimante.com", nombre: "Administrador General Mante", rol: "admin", estado: "activo", aprobado: true }
    ],
    candidates: [
        {
            userId: 1,
            nombreCompleto: "Carlos Eduardo Garza Morales",
            puestoSolicitado: "Auxiliar Administrativo / Soporte Técnico",
            edad: 23,
            telefono: "831-145-8921",
            correo: "carlos.garza@alumnos.uat.edu.mx",
            fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            direccion: "Calle Juárez #402 Ote., Zona Centro, Cd. Mante, Tam.",
            escolaridad: "Ingeniería en Tecnologías de la Información - UAM Mante UAT",
            experiencia: "1 año de soporte técnico en cibercafé local y mantenimiento a equipos de cómputo.",
            habilidades: "Manejo de paquetería Office, atención a clientes, Windows, HTML básico y redes.",
            estadoAprobacion: "aprobado", // 'pendiente' | 'aprobado'
            fechaRegistro: "2026-11-09 10:15:00"
        }
    ],
    companies: [
        {
            userId: 2,
            razonSocial: "Soluciones Digitales del Mante S.A. de C.V.",
            nombreComercial: "Soluciones Digitales Mante",
            rfc: "SDM190412AB1",
            giro: "Tecnología y Software",
            direccion: "Av. Manuel Cavazos Lerma #205, Col. Moderna, Cd. Mante",
            telefono: "831-232-5500",
            correo: "contacto@solucionesmante.com.mx",
            estadoAprobacion: "aprobado", // 'pendiente' | 'aprobado'
            fechaRegistro: "2026-11-08 09:30:00"
        },
        {
            userId: 3,
            razonSocial: "Clínica Médica Santa Fe de El Mante S.C.",
            nombreComercial: "Clínica Santa Fe Mante",
            rfc: "CMS980315KL9",
            giro: "Salud y Clínica Médica",
            direccion: "Calle Hidalgo #310 Ote., Zona Centro, Cd. Mante",
            telefono: "831-232-1144",
            correo: "recepcion@clinicasantafe.com",
            estadoAprobacion: "aprobado",
            fechaRegistro: "2026-11-08 11:20:00"
        }
    ],
    jobs: [
        {
            id: 1,
            puesto: "Auxiliar Administrativo y Atención al Cliente",
            empresa: "Soluciones Digitales Mante",
            ubicacion: "Zona Centro, Cd. Mante",
            sueldo: "$9,500 mensuales netos",
            beneficios: "Prestaciones de ley (IMSS, aguinaldo), capacitación pagada y horario flexible para estudiantes universitarios.",
            descripcion: "Se busca persona responsable para control de inventarios, atención a usuarios en mostrador y gestión de correos electrónicos.",
            contacto: "rh@solucionesmante.com.mx | Cel: 831-102-3456",
            tarifaServicio: 100,
            tarifaEstado: "pagada",
            estado: "aprobada", // 'pendiente' | 'aprobada'
            fechaPublicacion: "2026-11-09 12:00:00"
        },
        {
            id: 2,
            puesto: "Asistente de Recepción y Control de Citas",
            empresa: "Clínica Santa Fe Mante",
            ubicacion: "Zona Centro, Cd. Mante",
            sueldo: "$10,200 mensuales",
            beneficios: "Seguro médico de gastos menores, vales de despensa y estabilidad laboral en el sector salud.",
            descripcion: "Recepción de pacientes, organización de expedientes clínicos, manejo de teléfono y agenda de médicos especialistas.",
            contacto: "administracion@clinicasantafe.com | Tel: 831-232-1144",
            tarifaServicio: 100,
            tarifaEstado: "pagada",
            estado: "aprobada",
            fechaPublicacion: "2026-11-09 14:30:00"
        }
    ],
    applications: [
        {
            id: 1,
            jobId: 1,
            puesto: "Auxiliar Administrativo y Atención al Cliente",
            empresaNombre: "Soluciones Digitales Mante",
            candidatoNombre: "Carlos Eduardo Garza Morales",
            candidatoEmail: "carlos.garza@alumnos.uat.edu.mx",
            candidatoTelefono: "831-145-8921",
            candidatoDireccion: "Calle Juárez #402 Ote., Zona Centro, Cd. Mante",
            fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            fecha: "2026-11-10",
            hora: "08:15:30",
            timestamp: 1762762530,
            estado: "pendiente" // 'pendiente' | 'aceptada' | 'rechazada'
        }
    ]
};

// ------------------------------------------------------------------------------
// 2. INICIALIZACIÓN Y PERSISTENCIA (PHP BACKEND + LOCALSTORAGE DUAL)
// ------------------------------------------------------------------------------
async function initSystem() {
    // Intentar conectar con backend PHP (api.php)
    try {
        const resp = await fetch('api.php?action=get_all_data', { signal: AbortSignal.timeout(1000) });
        if (resp.ok) {
            const data = await resp.json();
            APP_STATE.users = data.users || SEED_DATA.users;
            APP_STATE.candidates = data.candidates || SEED_DATA.candidates;
            APP_STATE.companies = data.companies || SEED_DATA.companies;
            APP_STATE.jobs = data.jobs || SEED_DATA.jobs;
            APP_STATE.applications = data.applications || SEED_DATA.applications;
            APP_STATE.backendMode = 'php';
            updateBackendStatusBadge("Conectado con Backend PHP y Base de Datos (Modo Activo)", true);
        } else {
            throw new Error("PHP offline");
        }
    } catch (e) {
        // Fallback autónomo a LocalStorage
        loadLocalStorage();
        APP_STATE.backendMode = 'local';
        updateBackendStatusBadge("Modo Local Autónomo (Persistencia en LocalStorage lista)", false);
    }

    // Restaurar sesión de usuario guardada
    const savedUser = localStorage.getItem('ofimante_session_user');
    if (savedUser) {
        try {
            APP_STATE.currentUser = JSON.parse(savedUser);
            renderHeaderUser();
        } catch (err) {
            localStorage.removeItem('ofimante_session_user');
        }
    }

    updateDashboardCounts();
    goToScreen('screen-1');
}

function updateBackendStatusBadge(msg, isPhp) {
    const el = document.getElementById('backendStatusMsg');
    const banner = document.getElementById('backendStatusBar');
    if (el) el.innerText = msg;
    if (banner) {
        banner.style.background = isPhp 
            ? "linear-gradient(90deg, #064e3b, #07172b)" 
            : "linear-gradient(90deg, #1e293b, #0f172a)";
    }
}

function saveState() {
    localStorage.setItem('ofimante_v2_db', JSON.stringify({
        users: APP_STATE.users,
        candidates: APP_STATE.candidates,
        companies: APP_STATE.companies,
        jobs: APP_STATE.jobs,
        applications: APP_STATE.applications
    }));
    updateDashboardCounts();
}

function loadLocalStorage() {
    const raw = localStorage.getItem('ofimante_v2_db');
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            APP_STATE.users = parsed.users || [...SEED_DATA.users];
            APP_STATE.candidates = parsed.candidates || [...SEED_DATA.candidates];
            APP_STATE.companies = parsed.companies || [...SEED_DATA.companies];
            APP_STATE.jobs = parsed.jobs || [...SEED_DATA.jobs];
            APP_STATE.applications = parsed.applications || [...SEED_DATA.applications];
            return;
        } catch (e) { /* usar semilla */ }
    }
    APP_STATE.users = [...SEED_DATA.users];
    APP_STATE.candidates = [...SEED_DATA.candidates];
    APP_STATE.companies = [...SEED_DATA.companies];
    APP_STATE.jobs = [...SEED_DATA.jobs];
    APP_STATE.applications = [...SEED_DATA.applications];
    saveState();
}

// ------------------------------------------------------------------------------
// 3. NAVEGACIÓN ENTRE LAS 5 PANTALLAS OFICIALES
// ------------------------------------------------------------------------------
function goToScreen(screenId) {
    APP_STATE.currentScreen = screenId;

    for (let i = 1; i <= 5; i++) {
        const sEl = document.getElementById(`screen-${i}`);
        const bEl = document.getElementById(`nav-btn-${i}`);
        if (sEl) sEl.classList.toggle('active', `screen-${i}` === screenId);
        if (bEl) bEl.classList.toggle('active', `screen-${i}` === screenId);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cargar contenido específico de la pantalla seleccionada
    if (screenId === 'screen-1') {
        updateDashboardCounts();
    } else if (screenId === 'screen-3') {
        renderCandidateScreen();
    } else if (screenId === 'screen-4') {
        renderCompanyScreen();
    } else if (screenId === 'screen-5') {
        renderAdminScreen();
    }
}

function quickGuestExplore() {
    goToScreen('screen-3');
}

function updateDashboardCounts() {
    const activeJobs = APP_STATE.jobs.filter(j => j.estado === 'aprobada').length;
    const activeCompanies = APP_STATE.companies.length;

    const hJobs = document.getElementById('homeJobsCount');
    const hComps = document.getElementById('homeCompaniesCount');
    if (hJobs) hJobs.innerText = `${activeJobs}+`;
    if (hComps) hComps.innerText = `${activeCompanies}+`;
}

// ------------------------------------------------------------------------------
// 4. PANTALLA 2: REGISTRO / INICIO DE SESIÓN CON GOOGLE Y ROLES
// ------------------------------------------------------------------------------
function selectAuthRole(role) {
    APP_STATE.selectedAuthRole = role;

    document.getElementById('roleOptCandidate')?.classList.toggle('active', role === 'candidato');
    document.getElementById('roleOptCompany')?.classList.toggle('active', role === 'empresa');
    document.getElementById('roleOptAdmin')?.classList.toggle('active', role === 'admin');
}

function switchAuthTab(tabName) {
    const tabLogin = document.getElementById('tabBtnLogin');
    const tabRegister = document.getElementById('tabBtnRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    if (tabName === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
    } else {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        formLogin.style.display = 'none';
        formRegister.style.display = 'block';
    }
}

// Iniciar sesión con Google (Auténtica simulación oficial)
function loginWithGoogle() {
    const role = APP_STATE.selectedAuthRole;
    let name = "Usuario de Google";
    let email = "usuario.mante@gmail.com";
    let avatar = "logo.png";

    if (role === 'candidato') {
        name = "Carlos Garza (Google)";
        email = "carlos.garza@alumnos.uat.edu.mx";
        avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
    } else if (role === 'empresa') {
        name = "Soluciones Digitales (Google)";
        email = "contacto@solucionesmante.com.mx";
    } else if (role === 'admin') {
        name = "Admin Mante (Google)";
        email = "admin@ofimante.com";
    }

    const sessionUser = {
        id: Date.now(),
        nombre: name,
        email: email,
        rol: role,
        avatar: avatar
    };

    completeLogin(sessionUser);
}

function handleFormLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const role = APP_STATE.selectedAuthRole;

    const user = {
        id: Date.now(),
        nombre: email.split('@')[0],
        email: email,
        rol: role,
        avatar: 'logo.png'
    };

    completeLogin(user);
}

function handleFormRegister(e) {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const role = APP_STATE.selectedAuthRole;

    const newUser = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        rol: role,
        avatar: 'logo.png'
    };

    APP_STATE.users.push(newUser);
    saveState();
    alert(`¡Cuenta registrada exitosamente!\nRol: ${role.toUpperCase()}.\nIniciando sesión automáticamente...`);
    completeLogin(newUser);
}

function quickLoginAs(role) {
    selectAuthRole(role);
    if (role === 'candidato') {
        completeLogin({ id: 1, nombre: "Carlos Eduardo Garza", email: "carlos.garza@alumnos.uat.edu.mx", rol: "candidato", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" });
    } else if (role === 'empresa') {
        completeLogin({ id: 2, nombre: "Soluciones Digitales Mante", email: "contacto@solucionesmante.com.mx", rol: "empresa", avatar: "logo.png" });
    } else if (role === 'admin') {
        completeLogin({ id: 99, nombre: "Administrador General Mante", email: "admin@ofimante.com", rol: "admin", avatar: "logo.png" });
    }
}

function completeLogin(user) {
    APP_STATE.currentUser = user;
    localStorage.setItem('ofimante_session_user', JSON.stringify(user));
    renderHeaderUser();

    // Redirección obligatoria según el rol seleccionado
    if (user.rol === 'candidato') {
        goToScreen('screen-3');
    } else if (user.rol === 'empresa') {
        goToScreen('screen-4');
    } else if (user.rol === 'admin') {
        goToScreen('screen-5');
    }
}

function renderHeaderUser() {
    const badge = document.getElementById('userProfileBadge');
    const btnLogin = document.getElementById('btnHeaderLogin');
    const uName = document.getElementById('headerUserName');
    const uRole = document.getElementById('headerUserRole');
    const uAvatar = document.getElementById('headerUserAvatar');

    if (APP_STATE.currentUser) {
        if (badge) badge.style.display = 'flex';
        if (btnLogin) btnLogin.style.display = 'none';
        if (uName) uName.innerText = APP_STATE.currentUser.nombre;
        if (uRole) uRole.innerText = APP_STATE.currentUser.rol.toUpperCase();
        if (uAvatar) uAvatar.src = APP_STATE.currentUser.avatar || 'logo.png';
    } else {
        if (badge) badge.style.display = 'none';
        if (btnLogin) btnLogin.style.display = 'flex';
    }
}

function logoutSession() {
    if (confirm("¿Deseas cerrar tu sesión activa en OFIMANTE?")) {
        APP_STATE.currentUser = null;
        localStorage.removeItem('ofimante_session_user');
        renderHeaderUser();
        goToScreen('screen-1');
        alert("Sesión cerrada correctamente.");
    }
}

// ------------------------------------------------------------------------------
// 5. PANTALLA 3: TERCERA PANTALLA (CANDIDATO & CV & ENVÍO DE SOLICITUDES)
// ------------------------------------------------------------------------------
function renderCandidateScreen() {
    const cand = APP_STATE.candidates[0] || SEED_DATA.candidates[0];
    const statusBadge = document.getElementById('candidateStatusBadge');
    const pendingNotice = document.getElementById('candidatePendingNotice');
    const jobsSection = document.getElementById('candidateJobsSection');

    // Rellenar formulario si ya hay datos
    if (cand) {
        setVal('cvNombreCompleto', cand.nombreCompleto);
        setVal('cvPuestoSolicitado', cand.puestoSolicitado);
        setVal('cvEdad', cand.edad);
        setVal('cvTelefono', cand.telefono);
        setVal('cvCorreo', cand.correo);
        setVal('cvFotoUrl', cand.fotoUrl);
        setVal('cvDireccion', cand.direccion);
        setVal('cvEscolaridad', cand.escolaridad);
        setVal('cvExperiencia', cand.experiencia);
        setVal('cvHabilidades', cand.habilidades);
    }

    const isApproved = cand && cand.estadoAprobacion === 'aprobado';

    if (statusBadge) {
        statusBadge.className = `status-pill ${isApproved ? 'success' : 'warning'}`;
        statusBadge.innerText = isApproved ? '✓ Datos Aceptados por Admin' : '⏳ En espera de validación';
    }

    if (pendingNotice) {
        pendingNotice.style.display = isApproved ? 'none' : 'flex';
    }

    if (jobsSection) {
        jobsSection.style.display = isApproved ? 'block' : 'none';
        if (isApproved) {
            renderCandidateAvailableJobs();
        }
    }
}

function handleSaveCandidateCv(e) {
    e.preventDefault();

    const candidateData = {
        userId: APP_STATE.currentUser?.id || 1,
        nombreCompleto: getVal('cvNombreCompleto'),
        puestoSolicitado: getVal('cvPuestoSolicitado'),
        edad: parseInt(getVal('cvEdad')) || 23,
        telefono: getVal('cvTelefono'),
        correo: getVal('cvCorreo'),
        fotoUrl: getVal('cvFotoUrl') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        direccion: getVal('cvDireccion'),
        escolaridad: getVal('cvEscolaridad'),
        experiencia: getVal('cvExperiencia'),
        habilidades: getVal('cvHabilidades'),
        estadoAprobacion: 'pendiente', // Esperar a que el administrador acepte sus datos
        fechaRegistro: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    APP_STATE.candidates[0] = candidateData;
    saveState();
    renderCandidateScreen();

    alert("¡Currículum guardado exitosamente!\n\nTus datos han quedado en espera de que un Administrador de OFIMANTE los acepte para que puedas mandar tus solicitudes a los empleos.");
}

function loadSampleCvData() {
    const s = SEED_DATA.candidates[0];
    APP_STATE.candidates[0] = { ...s };
    renderCandidateScreen();
}

function renderCandidateAvailableJobs() {
    const grid = document.getElementById('candidateJobsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const approvedJobs = APP_STATE.jobs.filter(j => j.estado === 'aprobada');

    if (approvedJobs.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No hay vacantes aprobadas actualmente en Ciudad Mante.</p>`;
        return;
    }

    approvedJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card-item';

        const candName = APP_STATE.candidates[0]?.nombreCompleto || "Carlos Eduardo Garza";
        const hasApplied = APP_STATE.applications.some(a => a.jobId === job.id && a.candidatoNombre === candName);

        card.innerHTML = `
            <div>
                <div class="job-card-top">
                    <h3 class="job-card-title">${job.puesto}</h3>
                    <span class="status-pill success">Verificada</span>
                </div>
                <div style="font-weight: 700; color: #0284c7; margin-bottom: 0.5rem;">🏢 ${job.empresa}</div>
                <div style="font-size: 0.9rem; color: #475569; margin-bottom: 0.8rem;">📍 ${job.ubicacion} | <strong>💵 ${job.sueldo}</strong></div>
                
                <div class="job-benefits-box">
                    <strong>🎁 Beneficios:</strong> ${job.beneficios || 'Prestaciones de ley y buen ambiente laboral.'}
                </div>

                <p style="font-size: 0.92rem; color: #334155; margin-bottom: 1.2rem;">
                    <strong>Requisitos:</strong> ${job.descripcion}
                </p>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.82rem; color: #64748b;">${job.contacto}</span>
                <button class="btn-apply-job" ${hasApplied ? 'disabled style="background:#10b981; cursor:default;"' : ''} onclick="candidateSendCv(${job.id})">
                    ${hasApplied ? '✓ Solicitud Mandada' : '📨 Mandar mi CV'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function candidateSendCv(jobId) {
    const job = APP_STATE.jobs.find(j => j.id === jobId);
    if (!job) return;

    const cand = APP_STATE.candidates[0] || SEED_DATA.candidates[0];

    const now = new Date();
    const fechaExacta = now.toISOString().split('T')[0];
    const horaExacta = now.toTimeString().split(' ')[0];

    const newApp = {
        id: APP_STATE.applications.length > 0 ? Math.max(...APP_STATE.applications.map(a => a.id)) + 1 : 1,
        jobId: job.id,
        puesto: job.puesto,
        empresaNombre: job.empresa,
        candidatoNombre: cand.nombreCompleto,
        candidatoEmail: cand.correo,
        candidatoTelefono: cand.telefono,
        candidatoDireccion: cand.direccion,
        fotoUrl: cand.fotoUrl,
        fecha: fechaExacta,
        hora: horaExacta,
        timestamp: Math.floor(now.getTime() / 1000),
        estado: "pendiente"
    };

    APP_STATE.applications.push(newApp);
    saveState();
    renderCandidateAvailableJobs();

    alert(`¡Tu currículum ha sido mandado con éxito a "${job.empresa}"!\n\nFecha: ${fechaExacta}\nHora: ${horaExacta} hrs.\nLa empresa revisará tu solicitud.`);
}

// ------------------------------------------------------------------------------
// 6. PANTALLA 4: CUARTA PANTALLA (EMPRESA, TARIFA $100 Y SOLICITUDES)
// ------------------------------------------------------------------------------
function renderCompanyScreen() {
    const comp = APP_STATE.companies[0] || SEED_DATA.companies[0];
    const statusBadge = document.getElementById('companyStatusBadge');
    const pendingNotice = document.getElementById('companyPendingNotice');
    const actionMenu = document.getElementById('companyActionMenuSection');

    if (comp) {
        setVal('compRazonSocial', comp.razonSocial);
        setVal('compNombreComercial', comp.nombreComercial);
        setVal('compRfc', comp.rfc);
        setVal('compGiro', comp.giro);
        setVal('compDireccion', comp.direccion);
        setVal('compTelefono', comp.telefono);
        setVal('compCorreo', comp.correo);
    }

    const isApproved = comp && comp.estadoAprobacion === 'aprobado';

    if (statusBadge) {
        statusBadge.className = `status-pill ${isApproved ? 'success' : 'warning'}`;
        statusBadge.innerText = isApproved ? '✓ Empresa Aprobada por Admin' : '⏳ En proceso de aprobación';
    }

    if (pendingNotice) {
        pendingNotice.style.display = isApproved ? 'none' : 'flex';
    }

    if (actionMenu) {
        actionMenu.style.display = isApproved ? 'block' : 'none';
        if (isApproved) {
            renderCompanyApplicantsList();
        }
    }
}

function handleSaveCompanyProfile(e) {
    e.preventDefault();

    const compData = {
        userId: APP_STATE.currentUser?.id || 2,
        razonSocial: getVal('compRazonSocial'),
        nombreComercial: getVal('compNombreComercial'),
        rfc: getVal('compRfc'),
        giro: getVal('compGiro'),
        direccion: getVal('compDireccion'),
        telefono: getVal('compTelefono'),
        correo: getVal('compCorreo'),
        estadoAprobacion: 'pendiente', // Esperar aprobación del administrador
        fechaRegistro: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    APP_STATE.companies[0] = compData;
    saveState();
    renderCompanyScreen();

    alert("¡Datos de empresa registrados con éxito!\n\nTu empresa ha quedado en proceso de aprobación por el Administrador. Una vez aceptada podrás publicar vacantes y revisar candidatos.");
}

function loadSampleCompanyData() {
    const s = SEED_DATA.companies[0];
    APP_STATE.companies[0] = { ...s };
    renderCompanyScreen();
}

function switchCompanyMode(mode) {
    const btnPost = document.getElementById('btnCompanyTabPost');
    const btnApplicants = document.getElementById('btnCompanyTabApplicants');
    const postContainer = document.getElementById('companyPostJobContainer');
    const applicantsContainer = document.getElementById('companyApplicantsContainer');

    if (mode === 'post') {
        btnPost.classList.add('active');
        btnApplicants.classList.remove('active');
        postContainer.style.display = 'block';
        applicantsContainer.style.display = 'none';
    } else {
        btnPost.classList.remove('active');
        btnApplicants.classList.add('active');
        postContainer.style.display = 'none';
        applicantsContainer.style.display = 'block';
        renderCompanyApplicantsList();
    }
}

// Publicar vacante con tarifa de servicio de $100 pesos
function handlePostJobWithFee(e) {
    e.preventDefault();

    const puesto = getVal('vacPuesto');
    const sueldo = getVal('vacSueldo');
    const ubicacion = getVal('vacUbicacion');
    const beneficios = getVal('vacBeneficios');
    const descripcion = getVal('vacDescripcion');
    const contacto = getVal('vacContacto');
    const isFeeConfirmed = document.getElementById('chkFeeConfirm').checked;

    if (!isFeeConfirmed) {
        alert("Debes confirmar la aceptación de la tarifa de servicio de $100 pesos para publicar.");
        return;
    }

    const compName = APP_STATE.companies[0]?.nombreComercial || "Empresa Mantense";

    const newJob = {
        id: APP_STATE.jobs.length > 0 ? Math.max(...APP_STATE.jobs.map(j => j.id)) + 1 : 1,
        puesto: puesto,
        empresa: compName,
        ubicacion: `${ubicacion}, Cd. Mante`,
        sueldo: sueldo,
        beneficios: beneficios,
        descripcion: descripcion,
        contacto: contacto,
        tarifaServicio: 100, // $100 pesos de tarifa obligatoria
        tarifaEstado: "pagada",
        estado: "pendiente", // Espera aprobación del Administrador
        fechaPublicacion: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    APP_STATE.jobs.push(newJob);
    saveState();
    document.getElementById('formPostJobWithFee').reset();

    alert(`¡Vacante registrada exitosamente!\n\nTarifa de servicio pagada: $100 MXN.\nLa vacante ha sido enviada al Administrador para su validación final antes de mostrarse en la bolsa de trabajo.`);
}

// Renderizar solicitudes ordenadas cronológicamente por día y hora
function renderCompanyApplicantsList() {
    const tbody = document.getElementById('companyApplicantsTableBody');
    const countEl = document.getElementById('companyApplicantsCount');
    if (!tbody) return;
    tbody.innerHTML = '';

    const compName = APP_STATE.companies[0]?.nombreComercial || "Soluciones Digitales Mante";
    
    // Filtrar solicitudes dirigidas a esta empresa
    const companyApps = APP_STATE.applications.filter(a => a.empresaNombre === compName || true); // Mostrar para demo

    // Clasificar por día y hora (orden descendente del timestamp)
    companyApps.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (countEl) countEl.innerText = companyApps.length;

    if (companyApps.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #64748b;">Aún no hay solicitudes de candidatos registradas para tu empresa.</td></tr>`;
        return;
    }

    companyApps.forEach(app => {
        const tr = document.createElement('tr');
        const stClass = app.estado === 'aceptada' ? 'success' : (app.estado === 'rechazada' ? 'danger' : 'warning');

        tr.innerHTML = `
            <td>
                <span class="time-badge">🗓️ ${app.fecha}</span><br>
                <small style="font-weight: 600; color: #0284c7;">⏰ ${app.hora} hrs</small>
            </td>
            <td>
                <strong>${app.candidatoNombre}</strong>
            </td>
            <td><strong>${app.puesto}</strong></td>
            <td>
                📱 ${app.candidatoTelefono}<br>
                <small>${app.candidatoEmail}</small>
            </td>
            <td>
                <span class="status-pill ${stClass}">${app.estado.toUpperCase()}</span>
            </td>
            <td>
                <div class="action-btn-group">
                    <button class="btn-table-action btn-table-approve" onclick="companyRespondApplication(${app.id}, 'aceptada')">✓ Aceptar</button>
                    <button class="btn-table-action btn-table-reject" onclick="companyRespondApplication(${app.id}, 'rechazada')">✕ Rechazar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function companyRespondApplication(appId, decision) {
    const app = APP_STATE.applications.find(a => a.id === appId);
    if (!app) return;

    app.estado = decision;
    saveState();
    renderCompanyApplicantsList();

    if (decision === 'aceptada') {
        // Mostrar modal con los datos de contacto del candidato
        const modal = document.getElementById('modalCandidateContact');
        const body = document.getElementById('contactDetailsBody');
        if (body) {
            body.innerHTML = `
                <p><strong>Candidato:</strong> ${app.candidatoNombre}</p>
                <p><strong>Puesto Solicitado:</strong> ${app.puesto}</p>
                <p><strong>Teléfono / Celular:</strong> <a href="tel:${app.candidatoTelefono}" style="color:#0284c7; font-weight:700;">${app.candidatoTelefono}</a></p>
                <p><strong>Correo Electrónico:</strong> <a href="mailto:${app.candidatoEmail}" style="color:#0284c7; font-weight:700;">${app.candidatoEmail}</a></p>
                <p><strong>Dirección:</strong> ${app.candidatoDireccion || 'Ciudad Mante, Tam.'}</p>
                <p><strong>Día y Hora de Postulación:</strong> ${app.fecha} a las ${app.hora} hrs</p>
            `;
        }
        if (modal) modal.style.display = 'flex';
    } else {
        alert("La solicitud ha sido marcada como rechazada.");
    }
}

function closeContactModal() {
    const modal = document.getElementById('modalCandidateContact');
    if (modal) modal.style.display = 'none';
}

// ------------------------------------------------------------------------------
// 7. PANTALLA 5: QUINTA PANTALLA (ADMINISTRADOR & CONTROL TOTAL)
// ------------------------------------------------------------------------------
function renderAdminScreen() {
    // 1. KPIs
    const kpiCands = document.getElementById('kpiCandidatesCount');
    const kpiComps = document.getElementById('kpiCompaniesCount');
    const kpiJobs = document.getElementById('kpiJobsCount');
    const kpiPend = document.getElementById('kpiPendingTotal');

    const pendingJobs = APP_STATE.jobs.filter(j => j.estado === 'pendiente').length;
    const pendingCands = APP_STATE.candidates.filter(c => c.estadoAprobacion === 'pendiente').length;
    const pendingComps = APP_STATE.companies.filter(c => c.estadoAprobacion === 'pendiente').length;

    if (kpiCands) kpiCands.innerText = APP_STATE.candidates.length;
    if (kpiComps) kpiComps.innerText = APP_STATE.companies.length;
    if (kpiJobs) kpiJobs.innerText = APP_STATE.jobs.length;
    if (kpiPend) kpiPend.innerText = pendingJobs + pendingCands + pendingComps;

    // 2. Tablas
    renderAdminCandidatesTable();
    renderAdminCompaniesTable();
    renderAdminJobsTable();
}

function renderAdminCandidatesTable() {
    const tbody = document.getElementById('adminCandidatesListBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    APP_STATE.candidates.forEach((cand, idx) => {
        const tr = document.createElement('tr');
        const isAppr = cand.estadoAprobacion === 'aprobado';

        tr.innerHTML = `
            <td><strong>${cand.nombreCompleto}</strong></td>
            <td>${cand.puestoSolicitado}</td>
            <td>📱 ${cand.telefono}<br><small>${cand.correo}</small></td>
            <td>
                <span class="status-pill ${isAppr ? 'success' : 'warning'}">
                    ${isAppr ? 'Aceptado' : '⏳ Pendiente'}
                </span>
            </td>
            <td>
                <div class="action-btn-group">
                    ${!isAppr ? `<button class="btn-table-action btn-table-approve" onclick="adminAcceptCandidate(${idx})">✓ Aceptar Candidato</button>` : ''}
                    <button class="btn-table-action btn-table-ban" onclick="adminToggleBanCandidate(${idx})">Banear</button>
                    <button class="btn-table-action btn-table-delete" onclick="adminDeleteCandidate(${idx})">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adminAcceptCandidate(idx) {
    if (APP_STATE.candidates[idx]) {
        APP_STATE.candidates[idx].estadoAprobacion = 'aprobado';
        saveState();
        renderAdminScreen();
        alert(`¡Candidato "${APP_STATE.candidates[idx].nombreCompleto}" ACEPTADO con éxito!\nAhora puede ver las vacantes disponibles y mandar su CV.`);
    }
}

function adminToggleBanCandidate(idx) {
    alert(`Usuario candidato ${APP_STATE.candidates[idx]?.nombreCompleto} marcado como suspendido/baneado.`);
}

function adminDeleteCandidate(idx) {
    if (confirm("¿Seguro que deseas eliminar este candidato del sistema?")) {
        APP_STATE.candidates.splice(idx, 1);
        saveState();
        renderAdminScreen();
    }
}

function renderAdminCompaniesTable() {
    const tbody = document.getElementById('adminCompaniesListBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    APP_STATE.companies.forEach((comp, idx) => {
        const tr = document.createElement('tr');
        const isAppr = comp.estadoAprobacion === 'aprobado';

        tr.innerHTML = `
            <td>
                <strong>${comp.nombreComercial}</strong><br>
                <small>${comp.razonSocial}</small>
            </td>
            <td><code>${comp.rfc}</code></td>
            <td>${comp.giro}</td>
            <td>
                <span class="status-pill ${isAppr ? 'success' : 'warning'}">
                    ${isAppr ? 'Aceptada' : '⏳ Pendiente'}
                </span>
            </td>
            <td>
                <div class="action-btn-group">
                    ${!isAppr ? `<button class="btn-table-action btn-table-approve" onclick="adminAcceptCompany(${idx})">✓ Aceptar Empresa</button>` : ''}
                    <button class="btn-table-action btn-table-ban" onclick="adminToggleBanCompany(${idx})">Banear</button>
                    <button class="btn-table-action btn-table-delete" onclick="adminDeleteCompany(${idx})">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adminAcceptCompany(idx) {
    if (APP_STATE.companies[idx]) {
        APP_STATE.companies[idx].estadoAprobacion = 'aprobado';
        saveState();
        renderAdminScreen();
        alert(`¡Empresa "${APP_STATE.companies[idx].nombreComercial}" ACEPTADA con éxito!\nAhora puede agregar vacantes con tarifa de $100 y ver solicitudes.`);
    }
}

function adminToggleBanCompany(idx) {
    alert(`Empresa ${APP_STATE.companies[idx]?.nombreComercial} marcada como suspendida.`);
}

function adminDeleteCompany(idx) {
    if (confirm("¿Seguro que deseas eliminar esta empresa del sistema?")) {
        APP_STATE.companies.splice(idx, 1);
        saveState();
        renderAdminScreen();
    }
}

function renderAdminJobsTable() {
    const tbody = document.getElementById('adminJobsListBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    APP_STATE.jobs.forEach(job => {
        const tr = document.createElement('tr');
        const isAppr = job.estado === 'aprobada';

        tr.innerHTML = `
            <td><strong>${job.puesto}</strong></td>
            <td>${job.empresa}</td>
            <td>
                <strong>${job.sueldo}</strong><br>
                <small style="color:#166534;">🎁 ${job.beneficios}</small>
            </td>
            <td><span class="status-pill success">$${job.tarifaServicio || 100} MXN</span></td>
            <td>
                <span class="status-pill ${isAppr ? 'success' : 'warning'}">
                    ${isAppr ? 'Aprobada' : '⏳ Pendiente'}
                </span>
            </td>
            <td>
                <div class="action-btn-group">
                    ${!isAppr ? `<button class="btn-table-action btn-table-approve" onclick="adminAcceptJob(${job.id})">✓ Aceptar Vacante</button>` : ''}
                    <button class="btn-table-action btn-table-edit" onclick="openAdminEditJob(${job.id})">✏️ Modificar</button>
                    <button class="btn-table-action btn-table-delete" onclick="adminDeleteJob(${job.id})">🗑️ Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adminAcceptJob(jobId) {
    const job = APP_STATE.jobs.find(j => j.id === jobId);
    if (!job) return;

    job.estado = 'aprobada';
    saveState();
    renderAdminScreen();
    alert(`La vacante "${job.puesto}" ha sido ACEPTADA y publicada en la bolsa de empleo.`);
}

function adminDeleteJob(jobId) {
    if (confirm("¿Deseas eliminar definitivamente esta vacante?")) {
        APP_STATE.jobs = APP_STATE.jobs.filter(j => j.id !== jobId);
        saveState();
        renderAdminScreen();
        alert("Vacante eliminada.");
    }
}

function openAdminEditJob(jobId) {
    const job = APP_STATE.jobs.find(j => j.id === jobId);
    if (!job) return;

    setVal('editJobId', job.id);
    setVal('mEditPuesto', job.puesto);
    setVal('mEditSueldo', job.sueldo);
    setVal('mEditUbicacion', job.ubicacion);
    setVal('mEditBeneficios', job.beneficios);
    setVal('mEditDescripcion', job.descripcion);

    document.getElementById('modalEditJob').style.display = 'flex';
}

function closeEditJobModal() {
    document.getElementById('modalEditJob').style.display = 'none';
}

function handleSaveEditedJob(e) {
    e.preventDefault();
    const id = parseInt(getVal('editJobId'));
    const job = APP_STATE.jobs.find(j => j.id === id);
    if (!job) return;

    job.puesto = getVal('mEditPuesto');
    job.sueldo = getVal('mEditSueldo');
    job.ubicacion = getVal('mEditUbicacion');
    job.beneficios = getVal('mEditBeneficios');
    job.descripcion = getVal('mEditDescripcion');

    saveState();
    closeEditJobModal();
    renderAdminScreen();
    alert("¡Vacante modificada exitosamente por el Administrador!");
}

// ------------------------------------------------------------------------------
// 8. UTILIDADES
// ------------------------------------------------------------------------------
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
}

// ------------------------------------------------------------------------------
// 9. EVENTO DE CARGA DE PÁGINA
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initSystem();
});
