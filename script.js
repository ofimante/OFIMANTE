// ==============================================================================
// OFIMANTE - LÓGICA PRINCIPAL (JAVASCRIPT)
// Ciudad Mante, Tamaulipas, México
// ==============================================================================

    const OFIMANTE = {
        state: {
            currentView: 'view-home',
            authMode: 'login', // 'login' | 'register'
            registerRole: 'candidato', // 'candidato' | 'empresa' (Admin no es registrable)
            currentUser: null,
            csrfToken: '',
            backendEngine: 'Iniciando...',

            // Datos principales del sistema
            users: [],
            candidates: [],
            companies: [],
            jobs: [],
            applications: []
        };
        // Colecciones en memoria
        users: [],
        candidates: [],
        companies: [],
        jobs: [],
        applications: [],
        payments: []
    },

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
    // --------------------------------------------------------------------------
    // 1. INICIALIZACIÓN Y SINCRONIZACIÓN DE DATOS
    // --------------------------------------------------------------------------
    init: async function () {
                    console.log("-> [OFIMANTE] Inicializando plataforma de empleo...");
                    await this.checkSession();
                    await this.syncData();
                    this.renderAll();
                    this.setupEventListeners();
                },

                checkSession: async function () {
                    try {
                        const resp = await fetch('api.php?action=get_session', { signal: AbortSignal.timeout(1500) });
                        if (resp.ok) {
                            const data = await resp.json();
                            this.state.csrfToken = data.csrf_token || '';
                            this.state.backendEngine = data.engine || 'PHP/MySQL';
                            if (data.logged_in && data.user) {
                                this.state.currentUser = data.user;
                            }
                        }
                    } catch (e) {
                        // Modo local autónomo
                        const localUser = localStorage.getItem('ofimante_active_user');
                        if (localUser) {
                            try { this.state.currentUser = JSON.parse(localUser); } catch (err) { }
                        }
                        this.state.backendEngine = 'Modo Local Autónomo (LocalStorage)';
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
        this.updateBackendBadge();
            },

            syncData: async function () {
                try {
                    const resp = await fetch('api.php?action=get_all_data', { signal: AbortSignal.timeout(2000) });
                    if (resp.ok) {
                        const data = await resp.json();
                        this.state.users = data.users || [];
                        this.state.candidates = data.candidates || [];
                        this.state.companies = data.companies || [];
                        this.state.jobs = data.jobs || [];
                        this.state.applications = data.applications || [];
                        this.state.payments = data.payments || [];
                        this.saveToLocalCache();
                        return;
                    }
                } catch (e) {
                    console.log("-> [OFIMANTE] Servidor PHP no detectado, usando almacenamiento local.");
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

        // Cargar desde LocalStorage si la API no estuviera disponible
        this.loadFromLocalCache();
            },

            saveToLocalCache: function () {
                localStorage.setItem('ofimante_cache', JSON.stringify({
                    users: this.state.users,
                    candidates: this.state.candidates,
                    companies: this.state.companies,
                    jobs: this.state.jobs,
                    applications: this.state.applications,
                    payments: this.state.payments
                }));
            },

            loadFromLocalCache: function () {
                const raw = localStorage.getItem('ofimante_cache');
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        this.state.users = parsed.users || [];
                        this.state.candidates = parsed.candidates || [];
                        this.state.companies = parsed.companies || [];
                        this.state.jobs = parsed.jobs || [];
                        this.state.applications = parsed.applications || [];
                        this.state.payments = parsed.payments || [];
                        return;
                    } catch (e) { }
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
        // Semilla mínima de demostración inicial de Cd. Mante
        this.initDemoSeed();
            },

            initDemoSeed: function () {
                this.state.users = [
                    { id: 1, nombre: "Administrador General Mante", email: "admin@ofimante.com", rol: "admin", estado: "activo", foto: "logo.png" },
                    { id: 2, nombre: "Carlos Eduardo Garza Morales", email: "carlos.garza@alumnos.uat.edu.mx", rol: "candidato", estado: "activo", foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
                    { id: 3, nombre: "Soluciones Digitales Mante", email: "contacto@solucionesmante.com.mx", rol: "empresa", estado: "activo", foto: "logo.png" }
                ];

                this.state.candidates = [
                    {
                        id: 1,
                        usuario_id: 2,
                        nombre_completo: "Carlos Eduardo Garza Morales",
                        fecha_nacimiento: "2001-05-18",
                        edad: 23,
                        telefono: "831-145-8921",
                        email_contacto: "carlos.garza@alumnos.uat.edu.mx",
                        domicilio: "Calle Juárez #402 Ote., Col. Centro, Cd. Mante, Tam.",
                        nivel_academico: "Ingeniería en Tecnologías de la Información (UAMM UAT)",
                        disponibilidad: "Inmediata - Tiempo Completo",
                        descripcion_personal: "Profesionista entusiasta del soporte informático y desarrollo web en Ciudad Mante.",
                        puesto_deseado: "Auxiliar Administrativo / Soporte Técnico Web",
                        experiencia_laboral: "1 año en cibercafé y papelería local en mantenimiento de cómputo y atención a clientes.",
                        habilidades: "Office 365, atención cordial, ensamblaje de PC y trabajo en equipo.",
                        conocimientos: "HTML5, CSS, redes LAN y Windows.",
                        archivo_pdf: "cv_carlos_garza.pdf",
                        estado_aprobacion: "aprobado"
                    }
                ];

                this.state.companies = [
                    {
                        id: 1,
                        usuario_id: 3,
                        nombre_comercial: "Soluciones Digitales Mante",
                        razon_social: "Soluciones Digitales del Mante S.A. de C.V.",
                        rfc: "SDM190412AB1",
                        responsable_nombre: "Lic. Andrea Guadalupe Ruiz Peña",
                        telefono: "831-232-5500",
                        email_corporativo: "contacto@solucionesmante.com.mx",
                        direccion: "Av. Manuel Cavazos Lerma #205, Col. Moderna, Cd. Mante, Tam.",
                        giro_comercial: "Tecnología y Software",
                        descripcion_negocio: "Comercio de soluciones informáticas y equipo de cómputo en Ciudad Mante.",
                        logotipo: "logo.png",
                        estado_aprobacion: "aprobado"
                    }
                ];

                this.state.jobs = [
                    {
                        id: 1,
                        empresa_id: 1,
                        empresa_nombre: "Soluciones Digitales Mante",
                        puesto: "Auxiliar Administrativo y Atención al Cliente",
                        categoria: "Administración y Oficina",
                        vacantes_disponibles: 1,
                        tipo_contratacion: "Tiempo Completo",
                        sueldo_ofrecido: "$9,500 mensuales netos",
                        prestaciones_beneficios: "Prestaciones de ley (IMSS, aguinaldo), capacitación pagada y horario flexible para universitarios.",
                        horario: "Lunes a Viernes 8:30 am - 5:30 pm, Sábado 9:00 am - 1:00 pm",
                        escolaridad_minima: "Bachillerato o Universidad en curso",
                        experiencia_requerida: "6 meses en atención o ventas",
                        ubicacion: "Zona Centro, Cd. Mante",
                        descripcion: "Control de inventarios, atención a usuarios en mostrador y gestión de notas y facturación.",
                        requisitos: "Manejo de equipo de cómputo, puntualidad y trato amable.",
                        contacto: "rh@solucionesmante.com.mx | Cel: 831-102-3456",
                        tarifa_monto: 100.00,
                        tarifa_pagada: 1,
                        estado: "aprobada",
                        fecha_publicacion: "2026-11-09",
                        fecha_cierre: "2026-12-15"
                    }
                ];

                this.state.applications = [
                    {
                        id: 1,
                        vacante_id: 1,
                        candidato_id: 1,
                        vacante_puesto: "Auxiliar Administrativo y Atención al Cliente",
                        empresa_nombre: "Soluciones Digitales Mante",
                        candidato_nombre: "Carlos Eduardo Garza Morales",
                        candidato_email: "carlos.garza@alumnos.uat.edu.mx",
                        candidato_telefono: "831-145-8921",
                        candidato_direccion: "Calle Juárez #402 Ote., Zona Centro, Cd. Mante",
                        candidato_foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                        puesto_deseado: "Auxiliar Administrativo / Soporte Técnico Web",
                        habilidades: "Office 365, atención cordial, ensamblaje de PC",
                        archivo_pdf: "cv_carlos_garza.pdf",
                        fecha_postulacion: "2026-11-10 08:15:30",
                        estado: "aceptada",
                        respuesta_empresa: "Estimado Carlos, tu perfil cumple con lo requerido. Te esperamos para entrevista presencial este jueves a las 10:30 am."
                    }
                ];

                this.state.payments = [
                    { id: 1, vacante_id: 1, empresa_id: 1, monto: 100.00, referencia_transaccion: "OFM-DEMO-PAY-001", estado: "completado", fecha_pago: "2026-11-09 11:58:00" }
                ];

                this.saveToLocalCache();
            },

            updateBackendBadge: function () {
                const msgEl = document.getElementById('backendStatusMsg');
                const barEl = document.getElementById('backendStatusBar');
                if (msgEl) {
                    msgEl.innerText = `Motor Activo: ${this.state.backendEngine} | Ciudad Mante, Tam.`;
                }
    ]
    };
    if(barEl) {
        const isLocal = this.state.backendEngine.includes('Local');
        barEl.style.background = isLocal
            ? "linear-gradient(90deg, #1e293b, #0f172a)"
            : "linear-gradient(90deg, #064e3b, #07172b)";
    }
},

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
                // --------------------------------------------------------------------------
                // 2. NAVEGACIÓN Y VISTAS
                // --------------------------------------------------------------------------
                navigateTo: function(viewId) {
                    this.state.currentView = viewId;

                    document.querySelectorAll('.spa-view').forEach(v => {
                        v.classList.remove('active');
                    });

                    const target = document.getElementById(viewId);
                    if (target) {
                        target.classList.add('active');
                    }

                    // Actualizar botones de navegación
                    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                    if (viewId === 'view-home') document.getElementById('navHome')?.classList.add('active');
                    if (viewId === 'view-job-search') document.getElementById('navJobs')?.classList.add('active');
                    if (viewId === 'view-candidate') document.getElementById('navCandidate')?.classList.add('active');
                    if (viewId === 'view-company') document.getElementById('navCompany')?.classList.add('active');
                    if (viewId === 'view-admin') document.getElementById('navAdmin')?.classList.add('active');
                    if (viewId === 'view-auth') document.getElementById('navAuth')?.classList.add('active');

                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.renderAll();
                },

                renderAll: function() {
                    this.renderNavbarSession();
                    this.renderHomeStats();
                    this.renderFeaturedJobs();
                    this.renderPublicJobs();

                    if (this.state.currentView === 'view-candidate') {
                        this.renderCandidatePanel();
                    } else if (this.state.currentView === 'view-company') {
                        this.renderCompanyPanel();
                    } else if (this.state.currentView === 'view-admin') {
                        this.renderAdminPanel();
                    }
                },

                renderNavbarSession: function() {
                    const u = this.state.currentUser;
                    const badge = document.getElementById('userProfileBadge');
                    const btnAuth = document.getElementById('btnHeaderAuth');
                    const navAuth = document.getElementById('navAuth');
                    const navCand = document.getElementById('navCandidate');
                    const navComp = document.getElementById('navCompany');
                    const navAdmin = document.getElementById('navAdmin');

                    if (u) {
                        if (badge) badge.style.display = 'flex';
                        if (btnAuth) btnAuth.style.display = 'none';
                        if (navAuth) navAuth.style.display = 'none';

                        document.getElementById('headerUserName').innerText = u.nombre.split(' ')[0];
                        document.getElementById('headerUserRole').innerText = u.rol.toUpperCase();
                        document.getElementById('headerUserAvatar').src = u.foto || 'logo.png';

                        // Mostrar enlace a su panel según rol
                        if (navCand) navCand.style.display = (u.rol === 'candidato') ? 'inline-block' : 'none';
                        if (navComp) navComp.style.display = (u.rol === 'empresa') ? 'inline-block' : 'none';
                        if (navAdmin) navAdmin.style.display = (u.rol === 'admin') ? 'inline-block' : 'none';
                    } else {
                        throw new Error("PHP offline");
                        if (badge) badge.style.display = 'none';
                        if (btnAuth) btnAuth.style.display = 'flex';
                        if (navAuth) navAuth.style.display = 'inline-block';
                        if (navCand) navCand.style.display = 'none';
                        if (navComp) navComp.style.display = 'none';
                        if (navAdmin) navAdmin.style.display = 'none';
                    }
                } catch (e) {
                    // Fallback autónomo a LocalStorage
                    loadLocalStorage();
                    APP_STATE.backendMode = 'local';
                    updateBackendStatusBadge("Modo Local Autónomo (Persistencia en LocalStorage lista)", false);
                }
            },

            // Restaurar sesión de usuario guardada
            const savedUser = localStorage.getItem('ofimante_session_user');
            if (savedUser) {
                renderHomeStats: function() {
                    const jobsApproved = this.state.jobs.filter(j => j.estado === 'aprobada').length;
                    const compsApproved = this.state.companies.length;
                    const candsApproved = this.state.candidates.length;

                    if (document.getElementById('homeJobsCount')) document.getElementById('homeJobsCount').innerText = `${jobsApproved}+`;
                    if (document.getElementById('homeCompaniesCount')) document.getElementById('homeCompaniesCount').innerText = `${compsApproved}+`;
                    if (document.getElementById('homeCandidatesCount')) document.getElementById('homeCandidatesCount').innerText = `${candsApproved}+`;
                },

                // --------------------------------------------------------------------------
                // 3. RENDERIZADO DE VACANTES DESTACADAS Y BOLSA DE TRABAJO
                // --------------------------------------------------------------------------
                renderFeaturedJobs: function() {
                    const grid = document.getElementById('featuredJobsGrid');
                    if (!grid) return;

                    const approved = this.state.jobs.filter(j => j.estado === 'aprobada').slice(0, 3);
                    grid.innerHTML = approved.map(job => this.buildJobCardHtml(job)).join('');
                },

                renderPublicJobs: function() {
                    const grid = document.getElementById('publicJobsGrid');
                    if (!grid) return;

                    const kw = (document.getElementById('filterKeyword')?.value || '').toLowerCase().trim();
                    const cat = document.getElementById('filterCategory')?.value || '';
                    const loc = document.getElementById('filterLocation')?.value || '';
                    const minSal = Number(document.getElementById('filterSalaryMin')?.value || 0);

                    const filtered = this.state.jobs.filter(job => {
                        if (job.estado !== 'aprobada') return false;

                        const matchKw = !kw || job.puesto.toLowerCase().includes(kw) ||
                            job.empresa_nombre.toLowerCase().includes(kw) ||
                            (job.requisitos && job.requisitos.toLowerCase().includes(kw)) ||
                            (job.descripcion && job.descripcion.toLowerCase().includes(kw));

                        const matchCat = !cat || job.categoria === cat;
                        const matchLoc = !loc || job.ubicacion.includes(loc);
                        const numSal = Number(job.sueldo_numerico) || 0;
                        const matchSal = minSal === 0 || numSal >= minSal || (parseInt(job.sueldo_ofrecido.replace(/\D/g, '')) || 0) >= minSal;

                        return matchKw && matchCat && matchLoc && matchSal;
                    });

                    const countEl = document.getElementById('jobResultsCount');
                    if (countEl) countEl.innerText = `Mostrando ${filtered.length} vacante(s) disponible(s)`;

                    if (filtered.length === 0) {
                        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; background:white; border-radius:12px; border:1px dashed #cbd5e1;">
                <p style="font-size:1.1rem; color:#64748b;">No se encontraron empleos con los filtros seleccionados.</p>
                <button class="btn-secondary-large mt-3" onclick="OFIMANTE.resetFilters()">Restablecer Filtros</button>
            </div>`;
                        return;
                    }

                    grid.innerHTML = filtered.map(job => this.buildJobCardHtml(job)).join('');
                },

                buildJobCardHtml: function(job) {
                    const u = this.state.currentUser;
                    const cand = this.getCurrentCandidate();
                    const isCandApproved = cand && cand.estado_aprobacion === 'aprobado';

                    // Verificar si ya se postuló
                    const alreadyApplied = cand && this.state.applications.some(a => Number(a.vacante_id) === Number(job.id) && Number(a.candidato_id) === Number(cand.id));

                    return `
            <div class="job-card-item">
                <div>
                    <div class="job-card-top">
                        <h3 class="job-card-title">${job.puesto}</h3>
                        <span class="status-pill success">Verificada</span>
                    </div>
                    <div style="font-weight: 700; color: #0284c7; margin-bottom: 0.4rem;">🏢 ${job.empresa_nombre || 'Empresa Mantense'}</div>
                    <div style="font-size: 0.88rem; color: #64748b; margin-bottom: 0.6rem;">📍 ${job.ubicacion} | 💼 ${job.tipo_contratacion}</div>

                    <!-- ESPECIAL VISIBILIDAD DE SUELDO Y BENEFICIOS -->
                    <div style="margin: 0.8rem 0;">
                        <span class="job-salary-tag">💵 Sueldo: ${job.sueldo_ofrecido}</span>
                    </div>

                    <div class="job-benefits-box">
                        <strong>🎁 Prestaciones y Beneficios:</strong> ${job.prestaciones_beneficios}
                    </div>

                    <p style="font-size: 0.92rem; color: #334155; margin-bottom: 0.8rem; line-height: 1.5;">
                        <strong>Requisitos:</strong> ${job.requisitos || job.descripcion}
                    </p>
                    <div style="font-size: 0.82rem; color: #64748b;">⏰ Horario: ${job.horario || 'Lunes a Viernes'}</div>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 1rem; margin-top: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
                    <span style="font-size: 0.8rem; color: #64748b;">${job.contacto || 'Contacto directo en panel'}</span>
                    <button class="btn-apply-job" ${alreadyApplied ? 'disabled style="background:#10b981; cursor:default;"' : ''} onclick="OFIMANTE.applyToJob(${job.id})">
                        ${alreadyApplied ? '✓ Solicitud Enviada' : '📨 Mandar mi CV'}
                    </button>
                </div>
            </div>
        `;
                },

                // --------------------------------------------------------------------------
                // 4. AUTENTICACIÓN (LOGIN, REGISTRO, GOOGLE SIGN-IN)
                // --------------------------------------------------------------------------
                openAuth: function(role) {
                    this.navigateTo('view-auth');
                    if (role) {
                        this.setAuthMode('register');
                        this.setRegisterRole(role);
                    } else {
                        this.setAuthMode('login');
                    }
                },

                setAuthMode: function(mode) {
                    this.state.authMode = mode;
                    const btnLogin = document.getElementById('btnSwitchLogin');
                    const btnReg = document.getElementById('btnSwitchRegister');
                    const formLogin = document.getElementById('formAuthLogin');
                    const formReg = document.getElementById('formAuthRegister');
                    const roleBox = document.getElementById('registerRoleBox');
                    const heading = document.getElementById('authHeading');
                    const sub = document.getElementById('authSubheading');

                    if (mode === 'login') {
                        btnLogin?.classList.add('active');
                        btnReg?.classList.remove('active');
                        if (formLogin) formLogin.style.display = 'block';
                        if (formReg) formReg.style.display = 'none';
                        if (roleBox) roleBox.style.display = 'none';
                        if (heading) heading.innerText = 'Iniciar Sesión en OFIMANTE';
                        if (sub) sub.innerText = 'Accede a tu cuenta para continuar tus actividades laborales en El Mante.';
                    } else {
                        btnLogin?.classList.remove('active');
                        btnReg?.classList.add('active');
                        if (formLogin) formLogin.style.display = 'none';
                        if (formReg) formReg.style.display = 'block';
                        if (roleBox) roleBox.style.display = 'block';
                        if (heading) heading.innerText = 'Crear Cuenta en OFIMANTE';
                        if (sub) sub.innerText = 'Regístrate como Candidato o Empresa. Sin comisiones ocultas.';
                    }
                },

                setRegisterRole: function(role) {
                    if (role === 'admin') {
                        alert("Por seguridad, las cuentas administrativas no pueden crearse mediante el registro público.");
                        return;
                    }
                    this.state.registerRole = role;
                    document.getElementById('optRoleCandidate')?.classList.toggle('active', role === 'candidato');
                    document.getElementById('optRoleCompany')?.classList.toggle('active', role === 'empresa');

                    const lbl = document.getElementById('lblRegNombre');
                    if (lbl) {
                        lbl.innerText = (role === 'empresa') ? 'Nombre Comercial de la Empresa: *' : 'Nombre Completo: *';
                    }
                },

                login: async function(e) {
                    e.preventDefault();
                    const email = document.getElementById('inputLoginEmail').value.trim();
                    const password = document.getElementById('inputLoginPassword').value;

                    try {
                        APP_STATE.currentUser = JSON.parse(savedUser);
                        renderHeaderUser();
                        const resp = await fetch('api.php?action=login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password })
                        });
                        const data = await resp.json();
                        if (data.success && data.user) {
                            this.state.currentUser = data.user;
                            localStorage.setItem('ofimante_active_user', JSON.stringify(data.user));
                            this.afterLoginRedirect();
                            return;
                        } else {
                            alert(data.error || "Credenciales incorrectas.");
                            return;
                        }
                    } catch (err) {
                        localStorage.removeItem('ofimante_session_user');
                        // Fallback modo local
                        const u = this.state.users.find(usr => usr.email.toLowerCase() === email.toLowerCase());
                        if (u) {
                            this.state.currentUser = u;
                            localStorage.setItem('ofimante_active_user', JSON.stringify(u));
                            this.afterLoginRedirect();
                            return;
                        }
                        alert("No se encontró el usuario en el sistema local.");
                    }
                }
            },

            updateDashboardCounts();
            goToScreen('screen-1');
        }
    register: async function(e) {
            e.preventDefault();
            const nombre = document.getElementById('inputRegNombre').value.trim();
            const email = document.getElementById('inputRegEmail').value.trim();
            const password = document.getElementById('inputRegPassword').value;
            const rol = this.state.registerRole;

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
            try {
                const resp = await fetch('api.php?action=register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password, rol })
                });
                const data = await resp.json();
                if (data.success && data.user) {
                    this.state.currentUser = data.user;
                    localStorage.setItem('ofimante_active_user', JSON.stringify(data.user));
                    await this.syncData();
                    alert(`¡Registro completado como ${rol.toUpperCase()}!\nBienvenido a OFIMANTE.`);
                    this.afterLoginRedirect();
                    return;
                } else {
                    alert(data.error || "Error al registrar la cuenta.");
                    return;
                }
            } catch (err) {
                // Local fallback
                const newId = this.state.users.length + 1;
                const newUser = { id: newId, nombre, email, rol, estado: "activo", foto: "logo.png" };
                this.state.users.push(newUser);

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
                if (rol === 'candidato') {
                    this.state.candidates.push({
                        id: this.state.candidates.length + 1,
                        usuario_id: newId,
                        nombre_completo: nombre,
                        email_contacto: email,
                        telefono: "",
                        domicilio: "Ciudad Mante, Tam.",
                        nivel_academico: "Por registrar",
                        estado_aprobacion: "pendiente"
                    });
                } else if (rol === 'empresa') {
                    this.state.companies.push({
                        id: this.state.companies.length + 1,
                        usuario_id: newId,
                        nombre_comercial: nombre,
                        responsable_nombre: nombre,
                        email_corporativo: email,
                        telefono: "",
                        direccion: "Ciudad Mante, Tam.",
                        giro_comercial: "Comercio",
                        estado_aprobacion: "pendiente"
                    });
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
                this.state.currentUser = newUser;
                localStorage.setItem('ofimante_active_user', JSON.stringify(newUser));
                this.saveToLocalCache();
                alert(`¡Registro exitoso como ${rol.toUpperCase()} (Modo Local)!`);
                this.afterLoginRedirect();
            }
        },

        // ------------------------------------------------------------------------------
        // 3. NAVEGACIÓN ENTRE LAS 5 PANTALLAS OFICIALES
        // ------------------------------------------------------------------------------
        function goToScreen(screenId) {
            APP_STATE.currentScreen = screenId;
            googleSignIn: async function() {
                const role = (this.state.authMode === 'register') ? this.state.registerRole : 'candidato';
                const simulatedEmail = (role === 'empresa') ? "contacto.empresa.mante@gmail.com" : "candidato.mante@gmail.com";
                const simulatedName = (role === 'empresa') ? "Comercial Mantense (Google)" : "Estudiante Mante (Google)";

                for (let i = 1; i <= 5; i++) {
                    const sEl = document.getElementById(`screen-${i}`);
                    const bEl = document.getElementById(`nav-btn-${i}`);
                    if (sEl) sEl.classList.toggle('active', `screen-${i}` === screenId);
                    if (bEl) bEl.classList.toggle('active', `screen-${i}` === screenId);
                }
                try {
                    const resp = await fetch('api.php?action=google_login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: simulatedEmail,
                            nombre: simulatedName,
                            rol: role,
                            google_id: "goog_1029384756",
                            foto: "logo.png"
                        })
                    });
                    const data = await resp.json();
                    if (data.success && data.user) {
                        this.state.currentUser = data.user;
                        localStorage.setItem('ofimante_active_user', JSON.stringify(data.user));
                        await this.syncData();
                        this.afterLoginRedirect();
                        return;
                    }
                } catch (e) { }

                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Fallback simulación local
                const user = { id: 88, nombre: simulatedName, email: simulatedEmail, rol: role, estado: "activo", foto: "logo.png" };
                this.state.currentUser = user;
                localStorage.setItem('ofimante_active_user', JSON.stringify(user));
                this.afterLoginRedirect();
            },

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
        logout: async function() {
            if (confirm("¿Deseas cerrar tu sesión en OFIMANTE?")) {
                try { await fetch('api.php?action=logout'); } catch (e) { }
                this.state.currentUser = null;
                localStorage.removeItem('ofimante_active_user');
                this.renderNavbarSession();
                this.navigateTo('view-home');
                alert("Has cerrado sesión exitosamente.");
            }
        },

        function quickGuestExplore() {
            goToScreen('screen-3');
        }
        quickAdminLogin: function() {
            document.getElementById('inputLoginEmail').value = 'admin@ofimante.com';
            document.getElementById('inputLoginPassword').value = 'Admin1234!';
            this.setAuthMode('login');
            alert("Credenciales administrativas precargadas. Haz clic en 'Ingresar a la Plataforma'.");
        },

        function updateDashboardCounts() {
            const activeJobs = APP_STATE.jobs.filter(j => j.estado === 'aprobada').length;
            const activeCompanies = APP_STATE.companies.length;
            afterLoginRedirect: function() {
                const u = this.state.currentUser;
                if (!u) return;

                const hJobs = document.getElementById('homeJobsCount');
                const hComps = document.getElementById('homeCompaniesCount');
                if (hJobs) hJobs.innerText = `${activeJobs}+`;
                if (hComps) hComps.innerText = `${activeCompanies}+`;
            }
            this.renderNavbarSession();
            if (u.rol === 'candidato') {
                this.navigateTo('view-candidate');
            } else if (u.rol === 'empresa') {
                this.navigateTo('view-company');
            } else if (u.rol === 'admin') {
                this.navigateTo('view-admin');
            } else {
                this.navigateTo('view-home');
            }
        },

        // ------------------------------------------------------------------------------
        // 4. PANTALLA 2: REGISTRO / INICIO DE SESIÓN CON GOOGLE Y ROLES
        // ------------------------------------------------------------------------------
        function selectAuthRole(role) {
            APP_STATE.selectedAuthRole = role;
            // --------------------------------------------------------------------------
            // 5. PANEL CANDIDATO: CV, ESTADO Y POSTULACIONES
            // --------------------------------------------------------------------------
            getCurrentCandidate: function() {
                const u = this.state.currentUser;
                if (!u) return this.state.candidates[0] || null;
                return this.state.candidates.find(c => Number(c.usuario_id) === Number(u.id)) || this.state.candidates[0] || null;
            },

            document.getElementById('roleOptCandidate')?.classList.toggle('active', role === 'candidato');
            document.getElementById('roleOptCompany')?.classList.toggle('active', role === 'empresa');
            document.getElementById('roleOptAdmin')?.classList.toggle('active', role === 'admin');
        }
        renderCandidatePanel: function() {
            const cand = this.getCurrentCandidate();
            const pill = document.getElementById('candidateApprovalPill');
            const bPending = document.getElementById('bannerCandidatePending');
            const bRejected = document.getElementById('bannerCandidateRejected');
            const bApproved = document.getElementById('bannerCandidateApproved');

            function switchAuthTab(tabName) {
                const tabLogin = document.getElementById('tabBtnLogin');
                const tabRegister = document.getElementById('tabBtnRegister');
                const formLogin = document.getElementById('formLogin');
                const formRegister = document.getElementById('formRegister');
                if (!cand) return;

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
            // Cargar campos del formulario
            setVal('candNombre', cand.nombre_completo || '');
            setVal('candPuesto', cand.puesto_deseado || '');
            setVal('candFechaNac', cand.fecha_nacimiento || '');
            setVal('candEdad', cand.edad || 23);
            setVal('candTelefono', cand.telefono || '');
            setVal('candEmail', cand.email_contacto || this.state.currentUser?.email || '');
            setVal('candDomicilio', cand.domicilio || '');
            setVal('candNivelAcademico', cand.nivel_academico || 'Licenciatura / Ingeniería (En curso)');
            setVal('candDisponibilidad', cand.disponibilidad || 'Inmediata - Tiempo Completo');
            setVal('candDescripcion', cand.descripcion_personal || '');
            setVal('candExperiencia', cand.experiencia_laboral || '');
            setVal('candHabilidades', cand.habilidades || '');
            setVal('candConocimientos', cand.conocimientos || '');

            // Iniciar sesión con Google (Auténtica simulación oficial)
            function loginWithGoogle() {
                const role = APP_STATE.selectedAuthRole;
                let name = "Usuario de Google";
                let email = "usuario.mante@gmail.com";
                let avatar = "logo.png";
                const status = cand.estado_aprobacion || 'pendiente';

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
                if (pill) {
                    pill.className = `status-pill ${status === 'aprobado' ? 'success' : (status === 'rechazado' ? 'danger' : 'warning')}`;
                    pill.innerText = (status === 'aprobado') ? '✓ Aprobado por Administrador' : ((status === 'rechazado') ? '✕ Rechazado' : '⏳ En Revisión por Admin');
                }

                const sessionUser = {
                    id: Date.now(),
                    nombre: name,
                    email: email,
                    rol: role,
                    avatar: avatar
                };
                if (bPending) bPending.style.display = (status === 'pendiente') ? 'flex' : 'none';
                if (bRejected) {
                    bRejected.style.display = (status === 'rechazado') ? 'flex' : 'none';
                    if (document.getElementById('txtCandidateRejectionReason')) {
                        document.getElementById('txtCandidateRejectionReason').innerText = cand.motivo_rechazo || 'Datos incompletos o pendientes de corrección.';
                    }
                }
                if (bApproved) bApproved.style.display = (status === 'aprobado') ? 'flex' : 'none';

                completeLogin(sessionUser);
            }
            // Renderizar postulaciones del candidato
            this.renderCandidateApplicationsList(cand.id);

            function handleFormLogin(e) {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const role = APP_STATE.selectedAuthRole;
                // Renderizar vacantes en la subpestaña del candidato
                const candJobsGrid = document.getElementById('candidateJobsGrid');
                if (candJobsGrid) {
                    candJobsGrid.innerHTML = this.state.jobs
                        .filter(j => j.estado === 'aprobada')
                        .map(j => this.buildJobCardHtml(j))
                        .join('');
                }
            },

            const user = {
                id: Date.now(),
                nombre: email.split('@')[0],
                email: email,
                rol: role,
                avatar: 'logo.png'
            };
            switchCandidateTab: function(tab) {
                document.getElementById('btnCandTabCv')?.classList.toggle('active', tab === 'cv');
                document.getElementById('btnCandTabApplications')?.classList.toggle('active', tab === 'applications');
                document.getElementById('btnCandTabJobs')?.classList.toggle('active', tab === 'jobs');

                completeLogin(user);
            }
            document.getElementById('tabContentCandCv').style.display = (tab === 'cv') ? 'block' : 'none';
            document.getElementById('tabContentCandApplications').style.display = (tab === 'applications') ? 'block' : 'none';
            document.getElementById('tabContentCandJobs').style.display = (tab === 'jobs') ? 'block' : 'none';
        },

        function handleFormRegister(e) {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const role = APP_STATE.selectedAuthRole;
            saveCandidateCv: async function(e) {
                e.preventDefault();
                const cand = this.getCurrentCandidate();
                const payload = {
                    usuario_id: this.state.currentUser?.id || 2,
                    nombre_completo: getVal('candNombre'),
                    puesto_deseado: getVal('candPuesto'),
                    fecha_nacimiento: getVal('candFechaNac'),
                    edad: parseInt(getVal('candEdad')) || 23,
                    telefono: getVal('candTelefono'),
                    email_contacto: getVal('candEmail'),
                    domicilio: getVal('candDomicilio'),
                    nivel_academico: getVal('candNivelAcademico'),
                    disponibilidad: getVal('candDisponibilidad'),
                    descripcion_personal: getVal('candDescripcion'),
                    experiencia_laboral: getVal('candExperiencia'),
                    habilidades: getVal('candHabilidades'),
                    conocimientos: getVal('candConocimientos'),
                    foto: getVal('candFoto') || 'logo.png'
                };

                const newUser = {
                    id: Date.now(),
                    nombre: nombre,
                    email: email,
                    rol: role,
                    avatar: 'logo.png'
                };
                try {
                    const resp = await fetch('api.php?action=save_cv', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await resp.json();
                    if (data.success) {
                        alert("¡Tu currículum ha sido guardado exitosamente!\nHa sido enviado al Administrador para revisión.");
                        await this.syncData();
                        this.renderCandidatePanel();
                        return;
                    }
                } catch (err) { }

                APP_STATE.users.push(newUser);
                saveState();
                alert(`¡Cuenta registrada exitosamente!\nRol: ${role.toUpperCase()}.\nIniciando sesión automáticamente...`);
                completeLogin(newUser);
            }
            // Fallback local
            if (cand) {
                Object.assign(cand, payload, { estado_aprobacion: 'pendiente', motivo_rechazo: null });
            }
            this.saveToLocalCache();
            this.renderCandidatePanel();
            alert("¡Currículum guardado!\nEn revisión por el Administrador.");
        },

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
        uploadPdf: async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            function completeLogin(user) {
                APP_STATE.currentUser = user;
                localStorage.setItem('ofimante_session_user', JSON.stringify(user));
                renderHeaderUser();
                if (file.type !== 'application/pdf') {
                    alert("Solo se admiten documentos en formato PDF.");
                    return;
                }

                // Redirección obligatoria según el rol seleccionado
                if (user.rol === 'candidato') {
                    goToScreen('screen-3');
                } else if (user.rol === 'empresa') {
                    goToScreen('screen-4');
                } else if (user.rol === 'admin') {
                    goToScreen('screen-5');
                }
            }
            const formData = new FormData();
            formData.append('pdf_file', file);

            function renderHeaderUser() {
                const badge = document.getElementById('userProfileBadge');
                const btnLogin = document.getElementById('btnHeaderLogin');
                const uName = document.getElementById('headerUserName');
                const uRole = document.getElementById('headerUserRole');
                const uAvatar = document.getElementById('headerUserAvatar');
                const statusEl = document.getElementById('pdfUploadStatus');
                if (statusEl) statusEl.innerText = 'Subiendo archivo...';

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
            try {
                const resp = await fetch('api.php?action=upload_pdf', {
                    method: 'POST',
                    body: formData
                });
                const data = await resp.json();
                if (data.success) {
                    if (statusEl) statusEl.innerText = `✓ Archivo cargado: ${file.name}`;
                    alert("¡Currículum en PDF subido y adjuntado con éxito!");
                    return;
                }
            } catch (err) { }

            function logoutSession() {
                if (confirm("¿Deseas cerrar tu sesión activa en OFIMANTE?")) {
                    APP_STATE.currentUser = null;
                    localStorage.removeItem('ofimante_session_user');
                    renderHeaderUser();
                    goToScreen('screen-1');
                    alert("Sesión cerrada correctamente.");
                }
            }
            if (statusEl) statusEl.innerText = `✓ Archivo PDF seleccionado: ${file.name}`;
            alert("Archivo PDF seleccionado correctamente.");
        },

        // ------------------------------------------------------------------------------
        // 5. PANTALLA 3: TERCERA PANTALLA (CANDIDATO & CV & ENVÍO DE SOLICITUDES)
        // ------------------------------------------------------------------------------
        function renderCandidateScreen() {
            const cand = APP_STATE.candidates[0] || SEED_DATA.candidates[0];
            const statusBadge = document.getElementById('candidateStatusBadge');
            const pendingNotice = document.getElementById('candidatePendingNotice');
            const jobsSection = document.getElementById('candidateJobsSection');
            renderCandidateApplicationsList: function(candidatoId) {
                const tbody = document.getElementById('candidateApplicationsTableBody');
                const badge = document.getElementById('candAppsCount');
                if (!tbody) return;

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
                const myApps = this.state.applications.filter(a => Number(a.candidato_id) === Number(candidatoId));
                if (badge) badge.innerText = myApps.length;

                const isApproved = cand && cand.estadoAprobacion === 'aprobado';
                if (myApps.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:#64748b;">Aún no te has postulado a ninguna vacante.</td></tr>`;
                    return;
                }

                if (statusBadge) {
                    statusBadge.className = `status-pill ${isApproved ? 'success' : 'warning'}`;
                    statusBadge.innerText = isApproved ? '✓ Datos Aceptados por Admin' : '⏳ En espera de validación';
                }
                tbody.innerHTML = myApps.map(a => {
                    const stClass = (a.estado === 'aceptada') ? 'success' : ((a.estado === 'rechazada') ? 'danger' : 'warning');
                    return `
                <tr>
                    <td><strong>${a.vacante_puesto || 'Puesto Solicitado'}</strong></td>
                    <td>${a.empresa_nombre || 'Empresa Mantense'}</td>
                    <td>${a.fecha_postulacion || 'Hoy'}</td>
                    <td><span class="status-pill ${stClass}">${a.estado.toUpperCase()}</span></td>
                    <td>${a.respuesta_empresa || '<em>Pendiente de respuesta por la empresa</em>'}</td>
                </tr>
            `;
                }).join('');
            },

            if (pendingNotice) {
                pendingNotice.style.display = isApproved ? 'none' : 'flex';
            }
            applyToJob: async function(jobId) {
                const cand = this.getCurrentCandidate();
                if (!this.state.currentUser) {
                    alert("Debes iniciar sesión como Candidato para poder postularte a las vacantes.");
                    this.openAuth('candidato');
                    return;
                }

                if (jobsSection) {
                    jobsSection.style.display = isApproved ? 'block' : 'none';
                    if (isApproved) {
                        renderCandidateAvailableJobs();
                        if (cand && cand.estado_aprobacion !== 'aprobado') {
                            alert("Tu cuenta aún está en revisión por el Administrador. Podrás postularte en cuanto sea aprobada.");
                            return;
                        }
                    }
                }

                function handleSaveCandidateCv(e) {
                    e.preventDefault();
                    try {
                        const resp = await fetch('api.php?action=apply_job', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ vacante_id: jobId })
                        });
                        const data = await resp.json();
                        if (data.success) {
                            alert("¡Tu currículum ha sido enviado a la empresa con éxito!");
                            await this.syncData();
                            this.renderAll();
                            return;
                        } else {
                            alert(data.error || "No fue posible enviar la postulación.");
                            return;
                        }
                    } catch (e) { }

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
                    // Fallback local
                    const job = this.state.jobs.find(j => Number(j.id) === Number(jobId));
                    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
                    this.state.applications.unshift({
                        id: this.state.applications.length + 1,
                        vacante_id: jobId,
                        candidato_id: cand.id,
                        vacante_puesto: job?.puesto || 'Puesto',
                        empresa_nombre: job?.empresa_nombre || 'Empresa',
                        candidato_nombre: cand.nombre_completo,
                        candidato_email: cand.email_contacto,
                        candidato_telefono: cand.telefono,
                        candidato_direccion: cand.domicilio,
                        candidato_foto: cand.fotoUrl || 'logo.png',
                        fecha_postulacion: now,
                        estado: 'pendiente'
                    });
                    this.saveToLocalCache();
                    this.renderAll();
                    alert("¡Currículum enviado con éxito a la empresa!");
                },

                APP_STATE.candidates[0] = candidateData;
                saveState();
                renderCandidateScreen();
                // --------------------------------------------------------------------------
                // 6. PANEL EMPRESA: REGISTRO, TARIFA $100 Y SOLICITUDES
                // --------------------------------------------------------------------------
                getCurrentCompany: function() {
                    const u = this.state.currentUser;
                    if (!u) return this.state.companies[0] || null;
                    return this.state.companies.find(c => Number(c.usuario_id) === Number(u.id)) || this.state.companies[0] || null;
                },

                alert("¡Currículum guardado exitosamente!\n\nTus datos han quedado en espera de que un Administrador de OFIMANTE los acepte para que puedas mandar tus solicitudes a los empleos.");
            }
            renderCompanyPanel: function() {
                const comp = this.getCurrentCompany();
                const pill = document.getElementById('companyApprovalPill');
                const bPending = document.getElementById('bannerCompanyPending');
                const bRejected = document.getElementById('bannerCompanyRejected');
                const tabsNav = document.getElementById('companyTabsNav');

                function loadSampleCvData() {
                    const s = SEED_DATA.candidates[0];
                    APP_STATE.candidates[0] = { ...s };
                    renderCandidateScreen();
                }
                if (!comp) return;

                function renderCandidateAvailableJobs() {
                    const grid = document.getElementById('candidateJobsGrid');
                    if (!grid) return;
                    grid.innerHTML = '';
                    setVal('compNombreComercial', comp.nombre_comercial || '');
                    setVal('compRazonSocial', comp.razon_social || '');
                    setVal('compRfc', comp.rfc || '');
                    setVal('compResponsable', comp.responsable_nombre || '');
                    setVal('compTelefono', comp.telefono || '');
                    setVal('compEmail', comp.email_corporativo || this.state.currentUser?.email || '');
                    setVal('compDireccion', comp.direccion || '');
                    setVal('compGiro', comp.giro_comercial || 'Comercio / Tienda');
                    setVal('compDescripcion', comp.descripcion_negocio || '');

                    const approvedJobs = APP_STATE.jobs.filter(j => j.estado === 'aprobada');
                    const status = comp.estado_aprobacion || 'pendiente';
                    const isApproved = (status === 'aprobado');

                    if (approvedJobs.length === 0) {
                        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No hay vacantes aprobadas actualmente en Ciudad Mante.</p>`;
                        return;
                    }
                    if (pill) {
                        pill.className = `status-pill ${isApproved ? 'success' : (status === 'rechazado' ? 'danger' : 'warning')}`;
                        pill.innerText = isApproved ? '✓ Empresa Aprobada' : ((status === 'rechazado') ? '✕ Rechazada' : '⏳ En Revisión por Admin');
                    }

                    approvedJobs.forEach(job => {
                        const card = document.createElement('div');
                        card.className = 'job-card-item';
                        if (bPending) bPending.style.display = (status === 'pendiente') ? 'flex' : 'none';
                        if (bRejected) {
                            bRejected.style.display = (status === 'rechazado') ? 'flex' : 'none';
                            if (document.getElementById('txtCompanyRejectionReason')) {
                                document.getElementById('txtCompanyRejectionReason').innerText = comp.motivo_rechazo || 'Datos incompletos o requieren verificación.';
                            }
                        }

                        const candName = APP_STATE.candidates[0]?.nombreCompleto || "Carlos Eduardo Garza";
                        const hasApplied = APP_STATE.applications.some(a => a.jobId === job.id && a.candidatoNombre === candName);
                        if (tabsNav) tabsNav.style.display = isApproved ? 'flex' : 'none';

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
        if (isApproved) {
            this.switchCompanyTab('post');
            this.renderCompanyApplicantsList(comp.id);
        } else {
            this.switchCompanyTab('profile');
        }
    },

                <p style="font-size: 0.92rem; color: #334155; margin-bottom: 1.2rem;">
                    <strong>Requisitos:</strong> ${job.descripcion}
                </p>
            </div>
    switchCompanyTab: function(tab) {
        document.getElementById('btnCompTabPost')?.classList.toggle('active', tab === 'post');
        document.getElementById('btnCompTabApplicants')?.classList.toggle('active', tab === 'applicants');
        document.getElementById('btnCompTabProfile')?.classList.toggle('active', tab === 'profile');

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
                document.getElementById('tabContentCompPost').style.display = (tab === 'post') ? 'block' : 'none';
                document.getElementById('tabContentCompApplicants').style.display = (tab === 'applicants') ? 'block' : 'none';
                document.getElementById('tabContentCompProfile').style.display = (tab === 'profile') ? 'block' : 'none';
            },

            function candidateSendCv(jobId) {
                const job = APP_STATE.jobs.find(j => j.id === jobId);
                if (!job) return;
                saveCompanyProfile: async function(e) {
                    e.preventDefault();
                    const payload = {
                        usuario_id: this.state.currentUser?.id || 3,
                        nombre_comercial: getVal('compNombreComercial'),
                        razon_social: getVal('compRazonSocial'),
                        rfc: getVal('compRfc'),
                        responsable_nombre: getVal('compResponsable'),
                        telefono: getVal('compTelefono'),
                        email_corporativo: getVal('compEmail'),
                        direccion: getVal('compDireccion'),
                        giro_comercial: getVal('compGiro'),
                        descripcion_negocio: getVal('compDescripcion')
                    };

                    const cand = APP_STATE.candidates[0] || SEED_DATA.candidates[0];
                    try {
                        const resp = await fetch('api.php?action=save_company', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        const data = await resp.json();
                        if (data.success) {
                            alert("¡Datos empresariales guardados!\nEstán en proceso de validación por un Administrador.");
                            await this.syncData();
                            this.renderCompanyPanel();
                            return;
                        }
                    } catch (e) { }

                    const now = new Date();
                    const fechaExacta = now.toISOString().split('T')[0];
                    const horaExacta = now.toTimeString().split(' ')[0];
                    const comp = this.getCurrentCompany();
                    if (comp) Object.assign(comp, payload, { estado_aprobacion: 'pendiente', motivo_rechazo: null });
                    this.saveToLocalCache();
                    this.renderCompanyPanel();
                    alert("¡Datos guardados con éxito!\nEn revisión administrativa.");
                },

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
                // Flujo de Tarifa $100 MXN para vacantes
                openPaymentModal: function(e) {
                    e.preventDefault();
                    document.getElementById('modalPaymentFee').style.display = 'flex';
                },

                APP_STATE.applications.push(newApp);
                saveState();
                renderCandidateAvailableJobs();
                closePaymentModal: function() {
                    document.getElementById('modalPaymentFee').style.display = 'none';
                },

                alert(`¡Tu currículum ha sido mandado con éxito a "${job.empresa}"!\n\nFecha: ${fechaExacta}\nHora: ${horaExacta} hrs.\nLa empresa revisará tu solicitud.`);
            }
            confirmDemoPayment: async function() {
                const comp = this.getCurrentCompany();
                const payload = {
                    puesto: getVal('vacPuesto'),
                    categoria: getVal('vacCategoria'),
                    vacantes_disponibles: parseInt(getVal('vacNumEmpleados')) || 1,
                    tipo_contratacion: getVal('vacTipoContrato'),
                    sueldo_ofrecido: getVal('vacSueldo'),
                    horario: getVal('vacHorario'),
                    escolaridad_minima: getVal('vacEscolaridad'),
                    experiencia_requerida: getVal('vacExperiencia'),
                    ubicacion: getVal('vacUbicacion'),
                    fecha_cierre: getVal('vacFechaCierre'),
                    prestaciones_beneficios: getVal('vacBeneficios'),
                    descripcion: getVal('vacDescripcion'),
                    requisitos: getVal('vacRequisitos'),
                    contacto: getVal('vacContacto')
                };

                // ------------------------------------------------------------------------------
                // 6. PANTALLA 4: CUARTA PANTALLA (EMPRESA, TARIFA $100 Y SOLICITUDES)
                // ------------------------------------------------------------------------------
                function renderCompanyScreen() {
                    const comp = APP_STATE.companies[0] || SEED_DATA.companies[0];
                    const statusBadge = document.getElementById('companyStatusBadge');
                    const pendingNotice = document.getElementById('companyPendingNotice');
                    const actionMenu = document.getElementById('companyActionMenuSection');
                    try {
                        const resp = await fetch('api.php?action=post_job', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        const data = await resp.json();
                        if (data.success) {
                            this.closePaymentModal();
                            alert(`¡Pago de Demostración de $100 MXN Validado!\nReferencia: ${data.pago_ref || 'OFM-DEMO-001'}\n\nTu vacante ha sido publicada exitosamente con sueldo y beneficios destacados.`);
                            document.getElementById('formPostVacancy').reset();
                            await this.syncData();
                            this.renderAll();
                            return;
                        }
                    } catch (e) { }

                    if (comp) {
                        setVal('compRazonSocial', comp.razonSocial);
                        setVal('compNombreComercial', comp.nombreComercial);
                        setVal('compRfc', comp.rfc);
                        setVal('compGiro', comp.giro);
                        setVal('compDireccion', comp.direccion);
                        setVal('compTelefono', comp.telefono);
                        setVal('compCorreo', comp.correo);
                    }
                    // Fallback local
                    const newJob = Object.assign({
                        id: this.state.jobs.length + 1,
                        empresa_id: comp ? comp.id : 1,
                        empresa_nombre: comp ? comp.nombre_comercial : "Empresa Mantense",
                        tarifa_monto: 100.00,
                        tarifa_pagada: 1,
                        estado: "aprobada",
                        fecha_publicacion: new Date().toISOString().split('T')[0]
                    }, payload);

                    const isApproved = comp && comp.estadoAprobacion === 'aprobado';
                    this.state.jobs.unshift(newJob);
                    this.state.payments.unshift({
                        id: this.state.payments.length + 1,
                        vacante_id: newJob.id,
                        empresa_id: newJob.empresa_id,
                        monto: 100.00,
                        referencia_transaccion: "OFM-DEMO-" + Date.now(),
                        estado: "completado",
                        fecha_pago: new Date().toISOString().replace('T', ' ').substring(0, 19)
                    });

                    if (statusBadge) {
                        statusBadge.className = `status-pill ${isApproved ? 'success' : 'warning'}`;
                        statusBadge.innerText = isApproved ? '✓ Empresa Aprobada por Admin' : '⏳ En proceso de aprobación';
                    }
                    this.saveToLocalCache();
                    this.closePaymentModal();
                    document.getElementById('formPostVacancy').reset();
                    this.renderAll();
                    alert("¡Pago demo de $100 MXN validado y vacante publicada con éxito!");
                },

                if (pendingNotice) {
                    pendingNotice.style.display = isApproved ? 'none' : 'flex';
                }
                // Lista de solicitudes recibidas por la empresa ordenadas cronológicamente
                renderCompanyApplicantsList: function(empresaId) {
                    const tbody = document.getElementById('companyApplicantsTableBody');
                    const badge = document.getElementById('companyAppsBadge');
                    if (!tbody) return;

                    if (actionMenu) {
                        actionMenu.style.display = isApproved ? 'block' : 'none';
                        if (isApproved) {
                            renderCompanyApplicantsList();
                            // Filtrar solicitudes de las vacantes de esta empresa
                            const compApps = this.state.applications.filter(a => {
                                const j = this.state.jobs.find(jb => Number(jb.id) === Number(a.vacante_id));
                                return j && Number(j.empresa_id) === Number(empresaId);
                            });

                            // Ordenar estrictamente desde la más reciente hasta la más antigua por día y hora
                            compApps.sort((a, b) => new Date(b.fecha_postulacion || 0) - new Date(a.fecha_postulacion || 0));

                            if (badge) badge.innerText = compApps.length;

                            if (compApps.length === 0) {
                                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#64748b;">Aún no se han recibido solicitudes de candidatos para tus vacantes.</td></tr>`;
                                return;
                            }
                        }
                    }

                    function handleSaveCompanyProfile(e) {
                        e.preventDefault();
                        tbody.innerHTML = compApps.map(a => {
                            const stClass = (a.estado === 'aceptada') ? 'success' : ((a.estado === 'rechazada') ? 'danger' : 'warning');
                            return `
                <tr>
                    <td>
                        <span class="time-badge">🗓️ ${a.fecha_postulacion}</span>
                    </td>
                    <td>
                        <strong>${a.candidato_nombre}</strong><br>
                        <small style="color:#0284c7;">📱 ${a.candidato_telefono || 'Sin teléfono'}</small>
                    </td>
                    <td><strong>${a.vacante_puesto}</strong></td>
                    <td>
                        <button class="btn-table-action btn-table-edit" onclick="OFIMANTE.viewCandidateCvModal(${a.candidato_id})">👁️ Ver CV</button>
                    </td>
                    <td>
                        <span class="status-pill ${stClass}">${a.estado.toUpperCase()}</span>
                    </td>
                    <td>
                        <div class="action-btn-group">
                            <button class="btn-table-action btn-table-approve" onclick="OFIMANTE.openDecisionModal(${a.id}, 'aceptada', '${a.candidato_nombre}')">✓ Aceptar</button>
                            <button class="btn-table-action btn-table-reject" onclick="OFIMANTE.openDecisionModal(${a.id}, 'rechazada', '${a.candidato_nombre}')">✕ Rechazar</button>
                        </div>
                    </td>
                </tr>
            `;
                        }).join('');
                    },

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
                    openDecisionModal: function(appId, decision, candidateName) {
                        document.getElementById('decisionAppId').value = appId;
                        document.getElementById('decisionType').value = decision;
                        document.getElementById('modalDecisionTitle').innerText = (decision === 'aceptada')
                            ? `Aceptar Solicitud de ${candidateName}`
                            : `Rechazar Solicitud de ${candidateName}`;

                        APP_STATE.companies[0] = compData;
                        saveState();
                        renderCompanyScreen();
                        const summary = document.getElementById('modalDecisionSummary');
                        if (summary) {
                            summary.innerHTML = (decision === 'aceptada')
                                ? `<p>Has decidido <strong>ACEPTAR</strong> al candidato. Redacta a continuación una nota con la fecha, hora y lugar de entrevista o indicaciones de contratación:</p>`
                                : `<p>Has decidido <strong>RECHAZAR</strong> la postulación. Puedes redactar un mensaje cordial de agradecimiento por su interés.</p>`;
                        }

                        alert("¡Datos de empresa registrados con éxito!\n\nTu empresa ha quedado en proceso de aprobación por el Administrador. Una vez aceptada podrás publicar vacantes y revisar candidatos.");
                    }
                    document.getElementById('txtDecisionMessage').value = (decision === 'aceptada')
                        ? "Estimado candidato, revisamos tu currículum y nos interesa tu perfil. Te esperamos en nuestras oficinas para entrevista el día..."
                        : "Agradecemos tu tiempo y postulación. En esta ocasión continuaremos con otros perfiles pero conservamos tu CV para futuras oportunidades.";

                    function loadSampleCompanyData() {
                        const s = SEED_DATA.companies[0];
                        APP_STATE.companies[0] = { ...s };
                        renderCompanyScreen();
                    }
                    document.getElementById('modalApplicationDecision').style.display = 'flex';
                },

                function switchCompanyMode(mode) {
                    const btnPost = document.getElementById('btnCompanyTabPost');
                    const btnApplicants = document.getElementById('btnCompanyTabApplicants');
                    const postContainer = document.getElementById('companyPostJobContainer');
                    const applicantsContainer = document.getElementById('companyApplicantsContainer');
                    confirmApplicationDecision: async function() {
                        const appId = document.getElementById('decisionAppId').value;
                        const decision = document.getElementById('decisionType').value;
                        const message = document.getElementById('txtDecisionMessage').value.trim();

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
                    try {
                        const resp = await fetch('api.php?action=update_application_status', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                solicitud_id: appId,
                                estado: decision,
                                respuesta_empresa: message
                            })
                        });
                        const data = await resp.json();
                        if (data.success) {
                            document.getElementById('modalApplicationDecision').style.display = 'none';
                            alert(`Solicitud ${decision.toUpperCase()} con éxito.`);
                            await this.syncData();
                            this.renderAll();
                            return;
                        }
                    } catch (e) { }

                    // Publicar vacante con tarifa de servicio de $100 pesos
                    function handlePostJobWithFee(e) {
                        e.preventDefault();
                        const app = this.state.applications.find(a => Number(a.id) === Number(appId));
                        if (app) {
                            app.estado = decision;
                            app.respuesta_empresa = message;
                        }
                        this.saveToLocalCache();
                        document.getElementById('modalApplicationDecision').style.display = 'none';
                        this.renderAll();
                        alert(`Solicitud ${decision.toUpperCase()} exitosamente.`);
                    },

                    const puesto = getVal('vacPuesto');
                    const sueldo = getVal('vacSueldo');
                    const ubicacion = getVal('vacUbicacion');
                    const beneficios = getVal('vacBeneficios');
                    const descripcion = getVal('vacDescripcion');
                    const contacto = getVal('vacContacto');
                    const isFeeConfirmed = document.getElementById('chkFeeConfirm').checked;
                    // --------------------------------------------------------------------------
                    // 7. PANEL ADMINISTRADOR: DASHBOARD, USUARIOS, VACANTES Y MODERACIÓN
                    // --------------------------------------------------------------------------
                    renderAdminPanel: function() {
                        // Métricas
                        const totalCands = this.state.candidates.length;
                        const totalComps = this.state.companies.length;
                        const pendCands = this.state.candidates.filter(c => c.estado_aprobacion === 'pendiente').length;
                        const pendComps = this.state.companies.filter(c => c.estado_aprobacion === 'pendiente').length;
                        const totalJobs = this.state.jobs.length;
                        const totalApps = this.state.applications.length;

                        if (!isFeeConfirmed) {
                            alert("Debes confirmar la aceptación de la tarifa de servicio de $100 pesos para publicar.");
                            return;
                        }
                        // Total recaudado de publicaciones ($100 MXN por vacante pagada)
                        const totalRevenue = this.state.payments.reduce((acc, p) => acc + (Number(p.monto) || 100), 0);

                        const compName = APP_STATE.companies[0]?.nombreComercial || "Empresa Mantense";
                        if (document.getElementById('kpiTotalCandidates')) document.getElementById('kpiTotalCandidates').innerText = totalCands;
                        if (document.getElementById('kpiTotalCompanies')) document.getElementById('kpiTotalCompanies').innerText = totalComps;
                        if (document.getElementById('kpiPendingTotal')) document.getElementById('kpiPendingTotal').innerText = pendCands + pendComps;
                        if (document.getElementById('kpiTotalVacancies')) document.getElementById('kpiTotalVacancies').innerText = totalJobs;
                        if (document.getElementById('kpiTotalApplications')) document.getElementById('kpiTotalApplications').innerText = totalApps;
                        if (document.getElementById('kpiTotalRevenue')) document.getElementById('kpiTotalRevenue').innerText = `$${totalRevenue.toLocaleString()} MXN`;

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
                        this.renderAdminCandidatesTable();
                        this.renderAdminCompaniesTable();
                        this.renderAdminVacanciesTable();
                        this.renderAdminApplicationsTable();
                    },

                    APP_STATE.jobs.push(newJob);
                    saveState();
                    document.getElementById('formPostJobWithFee').reset();
                    switchAdminTab: function(tab) {
                        document.getElementById('btnAdminTabCandidates')?.classList.toggle('active', tab === 'candidates');
                        document.getElementById('btnAdminTabCompanies')?.classList.toggle('active', tab === 'companies');
                        document.getElementById('btnAdminTabVacancies')?.classList.toggle('active', tab === 'vacancies');
                        document.getElementById('btnAdminTabApplications')?.classList.toggle('active', tab === 'applications');

                        alert(`¡Vacante registrada exitosamente!\n\nTarifa de servicio pagada: $100 MXN.\nLa vacante ha sido enviada al Administrador para su validación final antes de mostrarse en la bolsa de trabajo.`);
                    }
                    document.getElementById('tabContentAdminCandidates').style.display = (tab === 'candidates') ? 'block' : 'none';
                    document.getElementById('tabContentAdminCompanies').style.display = (tab === 'companies') ? 'block' : 'none';
                    document.getElementById('tabContentAdminVacancies').style.display = (tab === 'vacancies') ? 'block' : 'none';
                    document.getElementById('tabContentAdminApplications').style.display = (tab === 'applications') ? 'block' : 'none';
                },

                // Renderizar solicitudes ordenadas cronológicamente por día y hora
                function renderCompanyApplicantsList() {
                    const tbody = document.getElementById('companyApplicantsTableBody');
                    const countEl = document.getElementById('companyApplicantsCount');
                    if (!tbody) return;
                    tbody.innerHTML = '';
                    renderAdminCandidatesTable: function() {
                        const tbody = document.getElementById('adminCandidatesTableBody');
                        if (!tbody) return;

                        const compName = APP_STATE.companies[0]?.nombreComercial || "Soluciones Digitales Mante";

                        // Filtrar solicitudes dirigidas a esta empresa
                        const companyApps = APP_STATE.applications.filter(a => a.empresaNombre === compName || true); // Mostrar para demo
                        tbody.innerHTML = this.state.candidates.map(c => {
                            const st = c.estado_aprobacion || 'pendiente';
                            const stClass = (st === 'aprobado') ? 'success' : ((st === 'rechazado') ? 'danger' : 'warning');

                            // Clasificar por día y hora (orden descendente del timestamp)
                            companyApps.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                            return `
                <tr>
                    <td><strong>${c.nombre_completo}</strong></td>
                    <td>${c.puesto_deseado || 'Bolsa general'}</td>
                    <td>📱 ${c.telefono}<br><small>${c.email_contacto}</small></td>
                    <td><span class="status-pill ${stClass}">${st.toUpperCase()}</span></td>
                    <td>
                        <div class="action-btn-group">
                            <button class="btn-table-action btn-table-approve" onclick="OFIMANTE.adminSetCandidateStatus(${c.id}, 'aprobado')">✓ Aprobar</button>
                            <button class="btn-table-action btn-table-reject" onclick="OFIMANTE.openAdminRejectModal(${c.id}, 'candidato')">✕ Rechazar con Motivo</button>
                            <button class="btn-table-action btn-table-edit" onclick="OFIMANTE.viewCandidateCvModal(${c.id})">👁️ Ver CV</button>
                            <button class="btn-table-action btn-table-delete" onclick="OFIMANTE.adminDeleteUser(${c.usuario_id})">🗑️ Eliminar</button>
                        </div>
                    </td>
                </tr>
            `;
                        }).join('');
                    },

                    if (countEl) countEl.innerText = companyApps.length;
                    renderAdminCompaniesTable: function() {
                        const tbody = document.getElementById('adminCompaniesTableBody');
                        if (!tbody) return;

                        if (companyApps.length === 0) {
                            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #64748b;">Aún no hay solicitudes de candidatos registradas para tu empresa.</td></tr>`;
                            return;
                        }
                        tbody.innerHTML = this.state.companies.map(c => {
                            const st = c.estado_aprobacion || 'pendiente';
                            const stClass = (st === 'aprobado') ? 'success' : ((st === 'rechazado') ? 'danger' : 'warning');

                            companyApps.forEach(app => {
                                const tr = document.createElement('tr');
                                const stClass = app.estado === 'aceptada' ? 'success' : (app.estado === 'rechazada' ? 'danger' : 'warning');
                                return `
                <tr>
                    <td><strong>${c.nombre_comercial}</strong></td>
                    <td><code>${c.rfc || 'S/N'}</code><br><small>${c.razon_social || ''}</small></td>
                    <td>${c.giro_comercial}<br><small>${c.direccion}</small></td>
                    <td><span class="status-pill ${stClass}">${st.toUpperCase()}</span></td>
                    <td>
                        <div class="action-btn-group">
                            <button class="btn-table-action btn-table-approve" onclick="OFIMANTE.adminSetCompanyStatus(${c.id}, 'aprobado')">✓ Aprobar</button>
                            <button class="btn-table-action btn-table-reject" onclick="OFIMANTE.openAdminRejectModal(${c.id}, 'empresa')">✕ Rechazar con Motivo</button>
                            <button class="btn-table-action btn-table-delete" onclick="OFIMANTE.adminDeleteUser(${c.usuario_id})">🗑️ Eliminar</button>
                        </div>
                    </td>
                </tr>
            `;
                            }).join('');
                        },

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
                renderAdminVacanciesTable: function() {
                    const tbody = document.getElementById('adminVacanciesTableBody');
                    if (!tbody) return;

                    function companyRespondApplication(appId, decision) {
                        const app = APP_STATE.applications.find(a => a.id === appId);
                        if (!app) return;
                        tbody.innerHTML = this.state.jobs.map(j => {
                            const st = j.estado || 'pendiente';
                            const stClass = (st === 'aprobada') ? 'success' : 'warning';

                            app.estado = decision;
                            saveState();
                            renderCompanyApplicantsList();
                            return `
                <tr>
                    <td><strong>${j.puesto}</strong></td>
                    <td>${j.empresa_nombre}</td>
                    <td><strong>${j.sueldo_ofrecido}</strong></td>
                    <td><span class="status-pill success">$100 MXN (Pagada)</span></td>
                    <td><span class="status-pill ${stClass}">${st.toUpperCase()}</span></td>
                    <td>
                        <div class="action-btn-group">
                            ${st !== 'aprobada' ? `<button class="btn-table-action btn-table-approve" onclick="OFIMANTE.adminSetJobStatus(${j.id}, 'aprobada')">✓ Aprobar</button>` : ''}
                            <button class="btn-table-action btn-table-edit" onclick="OFIMANTE.openAdminEditJob(${j.id})">✏️ Modificar</button>
                            <button class="btn-table-action btn-table-ban" onclick="OFIMANTE.adminSetJobStatus(${j.id}, 'suspendida')">Suspender</button>
                            <button class="btn-table-action btn-table-delete" onclick="OFIMANTE.adminDeleteJob(${j.id})">🗑️ Eliminar</button>
                        </div>
                    </td>
                </tr>
            `;
                        }).join('');
                    },

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
    renderAdminApplicationsTable: function() {
        const tbody = document.getElementById('adminApplicationsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.state.applications.map(a => {
            const stClass = (a.estado === 'aceptada') ? 'success' : ((a.estado === 'rechazada') ? 'danger' : 'warning');
            return `
                                < tr >
                    <td><span class="time-badge">${a.fecha_postulacion}</span></td>
                    <td><strong>${a.candidato_nombre}</strong></td>
                    <td>${a.vacante_puesto}</td>
                    <td>${a.empresa_nombre}</td>
                    <td><span class="status-pill ${stClass}">${a.estado.toUpperCase()}</span></td>
                    <td>${a.respuesta_empresa || '<em>Pendiente</em>'}</td>
                </tr >
                                `;
        }).join('');
    },

    adminSetCandidateStatus: async function(candId, status, reason = '') {
        try {
            await fetch('api.php?action=admin_set_candidate_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidato_id: candId, estado: status, motivo_rechazo: reason })
            });
        } catch (e) {}

        const cand = this.state.candidates.find(c => Number(c.id) === Number(candId));
        if (cand) {
            cand.estado_aprobacion = status;
            cand.motivo_rechazo = reason;
        }
        if (modal) modal.style.display = 'flex';
    } else {
        alert("La solicitud ha sido marcada como rechazada.");
    }
}
        this.saveToLocalCache();
        this.renderAll();
        alert(`Candidato actualizado a: ${ status.toUpperCase() } `);
    },

function closeContactModal() {
    const modal = document.getElementById('modalCandidateContact');
    if (modal) modal.style.display = 'none';
}
    adminSetCompanyStatus: async function(empId, status, reason = '') {
        try {
            await fetch('api.php?action=admin_set_company_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empresa_id: empId, estado: status, motivo_rechazo: reason })
            });
        } catch (e) {}

// ------------------------------------------------------------------------------
// 7. PANTALLA 5: QUINTA PANTALLA (ADMINISTRADOR & CONTROL TOTAL)
// ------------------------------------------------------------------------------
function renderAdminScreen() {
    // 1. KPIs
    const kpiCands = document.getElementById('kpiCandidatesCount');
    const kpiComps = document.getElementById('kpiCompaniesCount');
    const kpiJobs = document.getElementById('kpiJobsCount');
    const kpiPend = document.getElementById('kpiPendingTotal');
        const emp = this.state.companies.find(c => Number(c.id) === Number(empId));
        if (emp) {
            emp.estado_aprobacion = status;
            emp.motivo_rechazo = reason;
        }
        this.saveToLocalCache();
        this.renderAll();
        alert(`Empresa actualizada a: ${ status.toUpperCase() } `);
    },

    const pendingJobs = APP_STATE.jobs.filter(j => j.estado === 'pendiente').length;
    const pendingCands = APP_STATE.candidates.filter(c => c.estadoAprobacion === 'pendiente').length;
    const pendingComps = APP_STATE.companies.filter(c => c.estadoAprobacion === 'pendiente').length;
    adminSetJobStatus: async function(jobId, status) {
        try {
            await fetch('api.php?action=admin_set_job_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vacante_id: jobId, estado: status })
            });
        } catch (e) {}

    if (kpiCands) kpiCands.innerText = APP_STATE.candidates.length;
    if (kpiComps) kpiComps.innerText = APP_STATE.companies.length;
    if (kpiJobs) kpiJobs.innerText = APP_STATE.jobs.length;
    if (kpiPend) kpiPend.innerText = pendingJobs + pendingCands + pendingComps;
        const job = this.state.jobs.find(j => Number(j.id) === Number(jobId));
        if (job) job.estado = status;
        this.saveToLocalCache();
        this.renderAll();
        alert(`Vacante actualizada a: ${ status.toUpperCase() } `);
    },

    // 2. Tablas
    renderAdminCandidatesTable();
    renderAdminCompaniesTable();
    renderAdminJobsTable();
}
    adminDeleteJob: async function(jobId) {
        if (!confirm("¿Deseas eliminar definitivamente esta vacante?")) return;
        try {
            await fetch('api.php?action=admin_delete_job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vacante_id: jobId })
            });
        } catch (e) {}

function renderAdminCandidatesTable() {
    const tbody = document.getElementById('adminCandidatesListBody');
    if (!tbody) return;
    tbody.innerHTML = '';
        this.state.jobs = this.state.jobs.filter(j => Number(j.id) !== Number(jobId));
        this.saveToLocalCache();
        this.renderAll();
        alert("Vacante eliminada del sistema.");
    },

    APP_STATE.candidates.forEach((cand, idx) => {
        const tr = document.createElement('tr');
        const isAppr = cand.estadoAprobacion === 'aprobado';
    adminDeleteUser: async function(userId) {
        if (!confirm("¿Eliminar usuario y registros asociados permanentemente?")) return;
        try {
            await fetch('api.php?action=admin_delete_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId })
            });
        } catch (e) {}

        tr.innerHTML = `
                                < td > <strong>${cand.nombreCompleto}</strong></td >
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
        this.state.users = this.state.users.filter(u => Number(u.id) !== Number(userId));
        this.state.candidates = this.state.candidates.filter(c => Number(c.usuario_id) !== Number(userId));
        this.state.companies = this.state.companies.filter(c => Number(c.usuario_id) !== Number(userId));
        this.saveToLocalCache();
        this.renderAll();
        alert("Usuario eliminado correctamente.");
    },

function adminAcceptCandidate(idx) {
    if (APP_STATE.candidates[idx]) {
        APP_STATE.candidates[idx].estadoAprobacion = 'aprobado';
        saveState();
        renderAdminScreen();
        alert(`¡Candidato "${APP_STATE.candidates[idx].nombreCompleto}" ACEPTADO con éxito!\nAhora puede ver las vacantes disponibles y mandar su CV.`);
    }
}
    // Modal Rechazo con Motivo
    openAdminRejectModal: function(entityId, type) {
        document.getElementById('rejectEntityId').value = entityId;
        document.getElementById('rejectEntityType').value = type;
        document.getElementById('txtAdminRejectReason').value = '';
        document.getElementById('modalAdminRejectReason').style.display = 'flex';
    },

function adminToggleBanCandidate(idx) {
    alert(`Usuario candidato ${ APP_STATE.candidates[idx]?.nombreCompleto } marcado como suspendido / baneado.`);
}
    closeAdminRejectModal: function() {
        document.getElementById('modalAdminRejectReason').style.display = 'none';
    },

function adminDeleteCandidate(idx) {
    if (confirm("¿Seguro que deseas eliminar este candidato del sistema?")) {
        APP_STATE.candidates.splice(idx, 1);
        saveState();
        renderAdminScreen();
    }
}
    confirmAdminReject: function() {
        const id = document.getElementById('rejectEntityId').value;
        const type = document.getElementById('rejectEntityType').value;
        const reason = document.getElementById('txtAdminRejectReason').value.trim();

function renderAdminCompaniesTable() {
    const tbody = document.getElementById('adminCompaniesListBody');
    if (!tbody) return;
    tbody.innerHTML = '';
        if (!reason) {
            alert("Debes escribir el motivo del rechazo para que el usuario pueda corregirlo.");
            return;
        }

    APP_STATE.companies.forEach((comp, idx) => {
        const tr = document.createElement('tr');
        const isAppr = comp.estadoAprobacion === 'aprobado';
        if (type === 'candidato') {
            this.adminSetCandidateStatus(id, 'rechazado', reason);
        } else {
            this.adminSetCompanyStatus(id, 'rechazado', reason);
        }
        this.closeAdminRejectModal();
    },

        tr.innerHTML = `
                                < td >
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
    // Modal Modificar Vacante (Admin)
    openAdminEditJob: function(jobId) {
        const job = this.state.jobs.find(j => Number(j.id) === Number(jobId));
        if (!job) return;

function adminAcceptCompany(idx) {
    if (APP_STATE.companies[idx]) {
        APP_STATE.companies[idx].estadoAprobacion = 'aprobado';
        saveState();
        renderAdminScreen();
        alert(`¡Empresa "${APP_STATE.companies[idx].nombreComercial}" ACEPTADA con éxito!\nAhora puede agregar vacantes con tarifa de $100 y ver solicitudes.`);
    }
}
        setVal('adminEditJobId', job.id);
        setVal('adminEditPuesto', job.puesto);
        setVal('adminEditSueldo', job.sueldo_ofrecido);
        setVal('adminEditUbicacion', job.ubicacion);
        setVal('adminEditBeneficios', job.prestaciones_beneficios);
        setVal('adminEditDescripcion', job.descripcion);
        setVal('adminEditRequisitos', job.requisitos);

function adminToggleBanCompany(idx) {
    alert(`Empresa ${ APP_STATE.companies[idx]?.nombreComercial } marcada como suspendida.`);
}
        document.getElementById('modalAdminEditJob').style.display = 'flex';
    },

function adminDeleteCompany(idx) {
    if (confirm("¿Seguro que deseas eliminar esta empresa del sistema?")) {
        APP_STATE.companies.splice(idx, 1);
        saveState();
        renderAdminScreen();
    }
}
    closeAdminEditModal: function() {
        document.getElementById('modalAdminEditJob').style.display = 'none';
    },

function renderAdminJobsTable() {
    const tbody = document.getElementById('adminJobsListBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    submitAdminEditJob: async function(e) {
        e.preventDefault();
        const id = document.getElementById('adminEditJobId').value;
        const payload = {
            vacante_id: id,
            puesto: getVal('adminEditPuesto'),
            sueldo_ofrecido: getVal('adminEditSueldo'),
            ubicacion: getVal('adminEditUbicacion'),
            prestaciones_beneficios: getVal('adminEditBeneficios'),
            descripcion: getVal('adminEditDescripcion'),
            requisitos: getVal('adminEditRequisitos')
        };

    APP_STATE.jobs.forEach(job => {
        const tr = document.createElement('tr');
        const isAppr = job.estado === 'aprobada';
        try {
            await fetch('api.php?action=admin_edit_job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (err) {}

        tr.innerHTML = `
        const job = this.state.jobs.find(j => Number(j.id) === Number(id));
        if (job) Object.assign(job, payload);
        this.saveToLocalCache();
        this.closeAdminEditModal();
        this.renderAll();
        alert("¡Vacante modificada exitosamente!");
    },

    // Modal Ver CV Completo
    viewCandidateCvModal: function(candId) {
        const cand = this.state.candidates.find(c => Number(c.id) === Number(candId));
        if (!cand) return;

        const container = document.getElementById('cvDocumentContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="cv-header-row">
                <img src="${cand.fotoUrl || 'logo.png'}" alt="Foto" class="cv-avatar-large">
                <div>
                    <h2 style="font-size: 1.8rem; color: #0b1e36;">${cand.nombre_completo}</h2>
                    <p style="font-size: 1.1rem; color: #0284c7; font-weight: 700;">${cand.puesto_deseado || 'Bolsa de trabajo'}</p>
                    <p style="font-size: 0.9rem; color: #64748b;">${cand.email_contacto} | 📱 ${cand.telefono} | 📍 ${cand.domicilio}</p>
                </div>
            </div>

            <div style="margin-bottom: 1.2rem;">
                <h4 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; color: #0b1e36;">1. DATOS PERSONALES & DISPONIBILIDAD</h4>
                <p><strong>Edad:</strong> ${cand.edad || 23} años | <strong>Fecha de Nacimiento:</strong> ${cand.fecha_nacimiento || 'No registrada'}</p>
                <p><strong>Disponibilidad:</strong> ${cand.disponibilidad || 'Inmediata'}</p>
                <p><strong>Descripción:</strong> ${cand.descripcion_personal || 'Sin descripción'}</p>
            </div>

            <div style="margin-bottom: 1.2rem;">
                <h4 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; color: #0b1e36;">2. FORMACIÓN ACADÉMICA</h4>
                <p><strong>Nivel Académico:</strong> ${cand.nivel_academico}</p>
            </div>

            <div style="margin-bottom: 1.2rem;">
                <h4 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; color: #0b1e36;">3. EXPERIENCIA LABORAL</h4>
                <p>${cand.experiencia_laboral || 'Sin experiencia registrada.'}</p>
            </div>

            <div style="margin-bottom: 1.2rem;">
                <h4 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; color: #0b1e36;">4. HABILIDADES Y CONOCIMIENTOS</h4>
                <p><strong>Habilidades:</strong> ${cand.habilidades}</p>
                <p><strong>Conocimientos técnicos:</strong> ${cand.conocimientos || 'Paquetería estándar'}</p>
            </div>

            ${cand.archivo_pdf ? `
                <div style="background:#eff6ff; padding:1rem; border-radius:8px; border:1px solid #38bdf8;">
                    <strong>📄 Currículum en PDF Adjunto:</strong> <a href="${cand.archivo_pdf}" target="_blank" style="color:#0284c7; font-weight:700;">Descargar / Ver PDF Oficial</a>
                </div>
            ` : ''}
        `;

        document.getElementById('modalViewCandidateCv').style.display = 'flex';
    },

    closeCvViewModal: function() {
        document.getElementById('modalViewCandidateCv').style.display = 'none';
    },

    // --------------------------------------------------------------------------
    // 8. FILTROS Y EVENTOS GLOBALES
    // --------------------------------------------------------------------------
    resetFilters: function() {
        if (document.getElementById('filterKeyword')) document.getElementById('filterKeyword').value = '';
        if (document.getElementById('filterCategory')) document.getElementById('filterCategory').value = '';
        if (document.getElementById('filterLocation')) document.getElementById('filterLocation').value = '';
        if (document.getElementById('filterSalaryMin')) document.getElementById('filterSalaryMin').value = '0';
        this.renderPublicJobs();
    },

    setupEventListeners: function() {
        // Exponer helpers globales para llamadas directas desde HTML
        window.navigateTo = (viewId) => this.navigateTo(viewId);
        window.openAuthModal = (role) => this.openAuth(role);
        window.setAuthMode = (mode) => this.setAuthMode(mode);
        window.setRegisterRole = (role) => this.setRegisterRole(role);
        window.handleGoogleSignIn = () => this.googleSignIn();
        window.submitLogin = (e) => this.login(e);
        window.submitRegister = (e) => this.register(e);
        window.handleLogout = () => this.logout();
        window.openAdminQuickLogin = () => this.quickAdminLogin();

        window.switchCandidateTab = (t) => this.switchCandidateTab(t);
        window.submitCandidateCv = (e) => this.saveCandidateCv(e);
        window.handlePdfUpload = (e) => this.uploadPdf(e);
        window.calcCandidateAge = () => {
            const val = document.getElementById('candFechaNac')?.value;
            if (val) {
                const diff = Date.now() - new Date(val).getTime();
                const ageDate = new Date(diff);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (document.getElementById('candEdad')) document.getElementById('candEdad').value = age;
            }
        };

        window.switchCompanyTab = (t) => this.switchCompanyTab(t);
        window.submitCompanyProfile = (e) => this.saveCompanyProfile(e);
        window.openPaymentModal = (e) => this.openPaymentModal(e);
        window.closePaymentModal = () => this.closePaymentModal();
        window.confirmDemoPayment = () => this.confirmDemoPayment();
        window.closeDecisionModal = () => { document.getElementById('modalApplicationDecision').style.display = 'none'; };
        window.confirmApplicationDecision = () => this.confirmApplicationDecision();

        window.switchAdminTab = (t) => this.switchAdminTab(t);
        window.closeAdminRejectModal = () => this.closeAdminRejectModal();
        window.confirmAdminReject = () => this.confirmAdminReject();
        window.closeAdminEditModal = () => this.closeAdminEditModal();
        window.submitAdminEditJob = (e) => this.submitAdminEditJob(e);
        window.closeCvViewModal = () => this.closeCvViewModal();

        window.executeJobFilters = () => this.renderPublicJobs();
        window.resetJobFilters = () => this.resetFilters();
    }
};

// Utilidades rápidas
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
}

// Iniciar al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    OFIMANTE.init();
});
