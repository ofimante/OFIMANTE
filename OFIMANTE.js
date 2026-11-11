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

        // Colecciones en memoria
        users: [],
        candidates: [],
        companies: [],
        jobs: [],
        applications: [],
        payments: []
    },

    // --------------------------------------------------------------------------
    // 1. INICIALIZACIÓN Y SINCRONIZACIÓN DE DATOS
    // --------------------------------------------------------------------------
    init: async function() {
        console.log("-> [OFIMANTE] Inicializando plataforma de empleo...");
        await this.checkSession();
        await this.syncData();
        this.renderAll();
        this.setupEventListeners();
    },

    checkSession: async function() {
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
                try { this.state.currentUser = JSON.parse(localUser); } catch(err){}
            }
            this.state.backendEngine = 'Modo Local Autónomo (LocalStorage)';
        }
        this.updateBackendBadge();
    },

    syncData: async function() {
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

        // Cargar desde LocalStorage si la API no estuviera disponible
        this.loadFromLocalCache();
    },

    saveToLocalCache: function() {
        localStorage.setItem('ofimante_cache', JSON.stringify({
            users: this.state.users,
            candidates: this.state.candidates,
            companies: this.state.companies,
            jobs: this.state.jobs,
            applications: this.state.applications,
            payments: this.state.payments
        }));
    },

    loadFromLocalCache: function() {
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
            } catch (e) {}
        }
        // Semilla mínima de demostración inicial de Cd. Mante
        this.initDemoSeed();
    },

    initDemoSeed: function() {
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

    updateBackendBadge: function() {
        const msgEl = document.getElementById('backendStatusMsg');
        const barEl = document.getElementById('backendStatusBar');
        if (msgEl) {
            msgEl.innerText = `Motor Activo: ${this.state.backendEngine} | Ciudad Mante, Tam.`;
        }
        if (barEl) {
            const isLocal = this.state.backendEngine.includes('Local');
            barEl.style.background = isLocal
                ? "linear-gradient(90deg, #1e293b, #0f172a)"
                : "linear-gradient(90deg, #064e3b, #07172b)";
        }
    },

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
            if (badge) badge.style.display = 'none';
            if (btnAuth) btnAuth.style.display = 'flex';
            if (navAuth) navAuth.style.display = 'inline-block';
            if (navCand) navCand.style.display = 'none';
            if (navComp) navComp.style.display = 'none';
            if (navAdmin) navAdmin.style.display = 'none';
        }
    },

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
    },

    register: async function(e) {
        e.preventDefault();
        const nombre = document.getElementById('inputRegNombre').value.trim();
        const email = document.getElementById('inputRegEmail').value.trim();
        const password = document.getElementById('inputRegPassword').value;
        const rol = this.state.registerRole;

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

            this.state.currentUser = newUser;
            localStorage.setItem('ofimante_active_user', JSON.stringify(newUser));
            this.saveToLocalCache();
            alert(`¡Registro exitoso como ${rol.toUpperCase()} (Modo Local)!`);
            this.afterLoginRedirect();
        }
    },

    googleSignIn: async function() {
        const role = (this.state.authMode === 'register') ? this.state.registerRole : 'candidato';
        const simulatedEmail = (role === 'empresa') ? "contacto.empresa.mante@gmail.com" : "candidato.mante@gmail.com";
        const simulatedName = (role === 'empresa') ? "Comercial Mantense (Google)" : "Estudiante Mante (Google)";

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
        } catch (e) {}

        // Fallback simulación local
        const user = { id: 88, nombre: simulatedName, email: simulatedEmail, rol: role, estado: "activo", foto: "logo.png" };
        this.state.currentUser = user;
        localStorage.setItem('ofimante_active_user', JSON.stringify(user));
        this.afterLoginRedirect();
    },

    logout: async function() {
        if (confirm("¿Deseas cerrar tu sesión en OFIMANTE?")) {
            try { await fetch('api.php?action=logout'); } catch(e){}
            this.state.currentUser = null;
            localStorage.removeItem('ofimante_active_user');
            this.renderNavbarSession();
            this.navigateTo('view-home');
            alert("Has cerrado sesión exitosamente.");
        }
    },

    quickAdminLogin: function() {
        document.getElementById('inputLoginEmail').value = 'admin@ofimante.com';
        document.getElementById('inputLoginPassword').value = 'Admin1234!';
        this.setAuthMode('login');
        alert("Credenciales administrativas precargadas. Haz clic en 'Ingresar a la Plataforma'.");
    },

    afterLoginRedirect: function() {
        const u = this.state.currentUser;
        if (!u) return;

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

    // --------------------------------------------------------------------------
    // 5. PANEL CANDIDATO: CV, ESTADO Y POSTULACIONES
    // --------------------------------------------------------------------------
    getCurrentCandidate: function() {
        const u = this.state.currentUser;
        if (!u) return this.state.candidates[0] || null;
        return this.state.candidates.find(c => Number(c.usuario_id) === Number(u.id)) || this.state.candidates[0] || null;
    },

    renderCandidatePanel: function() {
        const cand = this.getCurrentCandidate();
        const pill = document.getElementById('candidateApprovalPill');
        const bPending = document.getElementById('bannerCandidatePending');
        const bRejected = document.getElementById('bannerCandidateRejected');
        const bApproved = document.getElementById('bannerCandidateApproved');

        if (!cand) return;

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

        const status = cand.estado_aprobacion || 'pendiente';

        if (pill) {
            pill.className = `status-pill ${status === 'aprobado' ? 'success' : (status === 'rechazado' ? 'danger' : 'warning')}`;
            pill.innerText = (status === 'aprobado') ? '✓ Aprobado por Administrador' : ((status === 'rechazado') ? '✕ Rechazado' : '⏳ En Revisión por Admin');
        }

        if (bPending) bPending.style.display = (status === 'pendiente') ? 'flex' : 'none';
        if (bRejected) {
            bRejected.style.display = (status === 'rechazado') ? 'flex' : 'none';
            if (document.getElementById('txtCandidateRejectionReason')) {
                document.getElementById('txtCandidateRejectionReason').innerText = cand.motivo_rechazo || 'Datos incompletos o pendientes de corrección.';
            }
        }
        if (bApproved) bApproved.style.display = (status === 'aprobado') ? 'flex' : 'none';

        // Renderizar postulaciones del candidato
        this.renderCandidateApplicationsList(cand.id);

        // Renderizar vacantes en la subpestaña del candidato
        const candJobsGrid = document.getElementById('candidateJobsGrid');
        if (candJobsGrid) {
            candJobsGrid.innerHTML = this.state.jobs
                .filter(j => j.estado === 'aprobada')
                .map(j => this.buildJobCardHtml(j))
                .join('');
        }
    },

    switchCandidateTab: function(tab) {
        document.getElementById('btnCandTabCv')?.classList.toggle('active', tab === 'cv');
        document.getElementById('btnCandTabApplications')?.classList.toggle('active', tab === 'applications');
        document.getElementById('btnCandTabJobs')?.classList.toggle('active', tab === 'jobs');

        document.getElementById('tabContentCandCv').style.display = (tab === 'cv') ? 'block' : 'none';
        document.getElementById('tabContentCandApplications').style.display = (tab === 'applications') ? 'block' : 'none';
        document.getElementById('tabContentCandJobs').style.display = (tab === 'jobs') ? 'block' : 'none';
    },

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
        } catch (err) {}

        // Fallback local
        if (cand) {
            Object.assign(cand, payload, { estado_aprobacion: 'pendiente', motivo_rechazo: null });
        }
        this.saveToLocalCache();
        this.renderCandidatePanel();
        alert("¡Currículum guardado!\nEn revisión por el Administrador.");
    },

    uploadPdf: async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Solo se admiten documentos en formato PDF.");
            return;
        }

        const formData = new FormData();
        formData.append('pdf_file', file);

        const statusEl = document.getElementById('pdfUploadStatus');
        if (statusEl) statusEl.innerText = 'Subiendo archivo...';

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
        } catch (err) {}

        if (statusEl) statusEl.innerText = `✓ Archivo PDF seleccionado: ${file.name}`;
        alert("Archivo PDF seleccionado correctamente.");
    },

    renderCandidateApplicationsList: function(candidatoId) {
        const tbody = document.getElementById('candidateApplicationsTableBody');
        const badge = document.getElementById('candAppsCount');
        if (!tbody) return;

        const myApps = this.state.applications.filter(a => Number(a.candidato_id) === Number(candidatoId));
        if (badge) badge.innerText = myApps.length;

        if (myApps.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:#64748b;">Aún no te has postulado a ninguna vacante.</td></tr>`;
            return;
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

    applyToJob: async function(jobId) {
        const cand = this.getCurrentCandidate();
        if (!this.state.currentUser) {
            alert("Debes iniciar sesión como Candidato para poder postularte a las vacantes.");
            this.openAuth('candidato');
            return;
        }

        if (cand && cand.estado_aprobacion !== 'aprobado') {
            alert("Tu cuenta aún está en revisión por el Administrador. Podrás postularte en cuanto sea aprobada.");
            return;
        }

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
        } catch (e) {}

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

    // --------------------------------------------------------------------------
    // 6. PANEL EMPRESA: REGISTRO, TARIFA $100 Y SOLICITUDES
    // --------------------------------------------------------------------------
    getCurrentCompany: function() {
        const u = this.state.currentUser;
        if (!u) return this.state.companies[0] || null;
        return this.state.companies.find(c => Number(c.usuario_id) === Number(u.id)) || this.state.companies[0] || null;
    },

    renderCompanyPanel: function() {
        const comp = this.getCurrentCompany();
        const pill = document.getElementById('companyApprovalPill');
        const bPending = document.getElementById('bannerCompanyPending');
        const bRejected = document.getElementById('bannerCompanyRejected');
        const tabsNav = document.getElementById('companyTabsNav');

        if (!comp) return;

        setVal('compNombreComercial', comp.nombre_comercial || '');
        setVal('compRazonSocial', comp.razon_social || '');
        setVal('compRfc', comp.rfc || '');
        setVal('compResponsable', comp.responsable_nombre || '');
        setVal('compTelefono', comp.telefono || '');
        setVal('compEmail', comp.email_corporativo || this.state.currentUser?.email || '');
        setVal('compDireccion', comp.direccion || '');
        setVal('compGiro', comp.giro_comercial || 'Comercio / Tienda');
        setVal('compDescripcion', comp.descripcion_negocio || '');

        const status = comp.estado_aprobacion || 'pendiente';
        const isApproved = (status === 'aprobado');

        if (pill) {
            pill.className = `status-pill ${isApproved ? 'success' : (status === 'rechazado' ? 'danger' : 'warning')}`;
            pill.innerText = isApproved ? '✓ Empresa Aprobada' : ((status === 'rechazado') ? '✕ Rechazada' : '⏳ En Revisión por Admin');
        }

        if (bPending) bPending.style.display = (status === 'pendiente') ? 'flex' : 'none';
        if (bRejected) {
            bRejected.style.display = (status === 'rechazado') ? 'flex' : 'none';
            if (document.getElementById('txtCompanyRejectionReason')) {
                document.getElementById('txtCompanyRejectionReason').innerText = comp.motivo_rechazo || 'Datos incompletos o requieren verificación.';
            }
        }

        if (tabsNav) tabsNav.style.display = isApproved ? 'flex' : 'none';

        if (isApproved) {
            this.switchCompanyTab('post');
            this.renderCompanyApplicantsList(comp.id);
        } else {
            this.switchCompanyTab('profile');
        }
    },

    switchCompanyTab: function(tab) {
        document.getElementById('btnCompTabPost')?.classList.toggle('active', tab === 'post');
        document.getElementById('btnCompTabApplicants')?.classList.toggle('active', tab === 'applicants');
        document.getElementById('btnCompTabProfile')?.classList.toggle('active', tab === 'profile');

        document.getElementById('tabContentCompPost').style.display = (tab === 'post') ? 'block' : 'none';
        document.getElementById('tabContentCompApplicants').style.display = (tab === 'applicants') ? 'block' : 'none';
        document.getElementById('tabContentCompProfile').style.display = (tab === 'profile') ? 'block' : 'none';
    },

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
        } catch (e) {}

        const comp = this.getCurrentCompany();
        if (comp) Object.assign(comp, payload, { estado_aprobacion: 'pendiente', motivo_rechazo: null });
        this.saveToLocalCache();
        this.renderCompanyPanel();
        alert("¡Datos guardados con éxito!\nEn revisión administrativa.");
    },

    // Flujo de Tarifa $100 MXN para vacantes
    openPaymentModal: function(e) {
        e.preventDefault();
        document.getElementById('modalPaymentFee').style.display = 'flex';
    },

    closePaymentModal: function() {
        document.getElementById('modalPaymentFee').style.display = 'none';
    },

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
        } catch (e) {}

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

        this.saveToLocalCache();
        this.closePaymentModal();
        document.getElementById('formPostVacancy').reset();
        this.renderAll();
        alert("¡Pago demo de $100 MXN validado y vacante publicada con éxito!");
    },

    // Lista de solicitudes recibidas por la empresa ordenadas cronológicamente
    renderCompanyApplicantsList: function(empresaId) {
        const tbody = document.getElementById('companyApplicantsTableBody');
        const badge = document.getElementById('companyAppsBadge');
        if (!tbody) return;

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

    openDecisionModal: function(appId, decision, candidateName) {
        document.getElementById('decisionAppId').value = appId;
        document.getElementById('decisionType').value = decision;
        document.getElementById('modalDecisionTitle').innerText = (decision === 'aceptada')
            ? `Aceptar Solicitud de ${candidateName}`
            : `Rechazar Solicitud de ${candidateName}`;

        const summary = document.getElementById('modalDecisionSummary');
        if (summary) {
            summary.innerHTML = (decision === 'aceptada')
                ? `<p>Has decidido <strong>ACEPTAR</strong> al candidato. Redacta a continuación una nota con la fecha, hora y lugar de entrevista o indicaciones de contratación:</p>`
                : `<p>Has decidido <strong>RECHAZAR</strong> la postulación. Puedes redactar un mensaje cordial de agradecimiento por su interés.</p>`;
        }

        document.getElementById('txtDecisionMessage').value = (decision === 'aceptada')
            ? "Estimado candidato, revisamos tu currículum y nos interesa tu perfil. Te esperamos en nuestras oficinas para entrevista el día..."
            : "Agradecemos tu tiempo y postulación. En esta ocasión continuaremos con otros perfiles pero conservamos tu CV para futuras oportunidades.";

        document.getElementById('modalApplicationDecision').style.display = 'flex';
    },

    confirmApplicationDecision: async function() {
        const appId = document.getElementById('decisionAppId').value;
        const decision = document.getElementById('decisionType').value;
        const message = document.getElementById('txtDecisionMessage').value.trim();

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
        } catch (e) {}

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

        // Total recaudado de publicaciones ($100 MXN por vacante pagada)
        const totalRevenue = this.state.payments.reduce((acc, p) => acc + (Number(p.monto) || 100), 0);

        if (document.getElementById('kpiTotalCandidates')) document.getElementById('kpiTotalCandidates').innerText = totalCands;
        if (document.getElementById('kpiTotalCompanies')) document.getElementById('kpiTotalCompanies').innerText = totalComps;
        if (document.getElementById('kpiPendingTotal')) document.getElementById('kpiPendingTotal').innerText = pendCands + pendComps;
        if (document.getElementById('kpiTotalVacancies')) document.getElementById('kpiTotalVacancies').innerText = totalJobs;
        if (document.getElementById('kpiTotalApplications')) document.getElementById('kpiTotalApplications').innerText = totalApps;
        if (document.getElementById('kpiTotalRevenue')) document.getElementById('kpiTotalRevenue').innerText = `$${totalRevenue.toLocaleString()} MXN`;

        this.renderAdminCandidatesTable();
        this.renderAdminCompaniesTable();
        this.renderAdminVacanciesTable();
        this.renderAdminApplicationsTable();
    },

    switchAdminTab: function(tab) {
        document.getElementById('btnAdminTabCandidates')?.classList.toggle('active', tab === 'candidates');
        document.getElementById('btnAdminTabCompanies')?.classList.toggle('active', tab === 'companies');
        document.getElementById('btnAdminTabVacancies')?.classList.toggle('active', tab === 'vacancies');
        document.getElementById('btnAdminTabApplications')?.classList.toggle('active', tab === 'applications');

        document.getElementById('tabContentAdminCandidates').style.display = (tab === 'candidates') ? 'block' : 'none';
        document.getElementById('tabContentAdminCompanies').style.display = (tab === 'companies') ? 'block' : 'none';
        document.getElementById('tabContentAdminVacancies').style.display = (tab === 'vacancies') ? 'block' : 'none';
        document.getElementById('tabContentAdminApplications').style.display = (tab === 'applications') ? 'block' : 'none';
    },

    renderAdminCandidatesTable: function() {
        const tbody = document.getElementById('adminCandidatesTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.state.candidates.map(c => {
            const st = c.estado_aprobacion || 'pendiente';
            const stClass = (st === 'aprobado') ? 'success' : ((st === 'rechazado') ? 'danger' : 'warning');

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

    renderAdminCompaniesTable: function() {
        const tbody = document.getElementById('adminCompaniesTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.state.companies.map(c => {
            const st = c.estado_aprobacion || 'pendiente';
            const stClass = (st === 'aprobado') ? 'success' : ((st === 'rechazado') ? 'danger' : 'warning');

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

    renderAdminVacanciesTable: function() {
        const tbody = document.getElementById('adminVacanciesTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.state.jobs.map(j => {
            const st = j.estado || 'pendiente';
            const stClass = (st === 'aprobada') ? 'success' : 'warning';

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

    renderAdminApplicationsTable: function() {
        const tbody = document.getElementById('adminApplicationsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.state.applications.map(a => {
            const stClass = (a.estado === 'aceptada') ? 'success' : ((a.estado === 'rechazada') ? 'danger' : 'warning');
            return `
                <tr>
                    <td><span class="time-badge">${a.fecha_postulacion}</span></td>
                    <td><strong>${a.candidato_nombre}</strong></td>
                    <td>${a.vacante_puesto}</td>
                    <td>${a.empresa_nombre}</td>
                    <td><span class="status-pill ${stClass}">${a.estado.toUpperCase()}</span></td>
                    <td>${a.respuesta_empresa || '<em>Pendiente</em>'}</td>
                </tr>
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
        this.saveToLocalCache();
        this.renderAll();
        alert(`Candidato actualizado a: ${status.toUpperCase()}`);
    },

    adminSetCompanyStatus: async function(empId, status, reason = '') {
        try {
            await fetch('api.php?action=admin_set_company_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empresa_id: empId, estado: status, motivo_rechazo: reason })
            });
        } catch (e) {}

        const emp = this.state.companies.find(c => Number(c.id) === Number(empId));
        if (emp) {
            emp.estado_aprobacion = status;
            emp.motivo_rechazo = reason;
        }
        this.saveToLocalCache();
        this.renderAll();
        alert(`Empresa actualizada a: ${status.toUpperCase()}`);
    },

    adminSetJobStatus: async function(jobId, status) {
        try {
            await fetch('api.php?action=admin_set_job_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vacante_id: jobId, estado: status })
            });
        } catch (e) {}

        const job = this.state.jobs.find(j => Number(j.id) === Number(jobId));
        if (job) job.estado = status;
        this.saveToLocalCache();
        this.renderAll();
        alert(`Vacante actualizada a: ${status.toUpperCase()}`);
    },

    adminDeleteJob: async function(jobId) {
        if (!confirm("¿Deseas eliminar definitivamente esta vacante?")) return;
        try {
            await fetch('api.php?action=admin_delete_job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vacante_id: jobId })
            });
        } catch (e) {}

        this.state.jobs = this.state.jobs.filter(j => Number(j.id) !== Number(jobId));
        this.saveToLocalCache();
        this.renderAll();
        alert("Vacante eliminada del sistema.");
    },

    adminDeleteUser: async function(userId) {
        if (!confirm("¿Eliminar usuario y registros asociados permanentemente?")) return;
        try {
            await fetch('api.php?action=admin_delete_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId })
            });
        } catch (e) {}

        this.state.users = this.state.users.filter(u => Number(u.id) !== Number(userId));
        this.state.candidates = this.state.candidates.filter(c => Number(c.usuario_id) !== Number(userId));
        this.state.companies = this.state.companies.filter(c => Number(c.usuario_id) !== Number(userId));
        this.saveToLocalCache();
        this.renderAll();
        alert("Usuario eliminado correctamente.");
    },

    // Modal Rechazo con Motivo
    openAdminRejectModal: function(entityId, type) {
        document.getElementById('rejectEntityId').value = entityId;
        document.getElementById('rejectEntityType').value = type;
        document.getElementById('txtAdminRejectReason').value = '';
        document.getElementById('modalAdminRejectReason').style.display = 'flex';
    },

    closeAdminRejectModal: function() {
        document.getElementById('modalAdminRejectReason').style.display = 'none';
    },

    confirmAdminReject: function() {
        const id = document.getElementById('rejectEntityId').value;
        const type = document.getElementById('rejectEntityType').value;
        const reason = document.getElementById('txtAdminRejectReason').value.trim();

        if (!reason) {
            alert("Debes escribir el motivo del rechazo para que el usuario pueda corregirlo.");
            return;
        }

        if (type === 'candidato') {
            this.adminSetCandidateStatus(id, 'rechazado', reason);
        } else {
            this.adminSetCompanyStatus(id, 'rechazado', reason);
        }
        this.closeAdminRejectModal();
    },

    // Modal Modificar Vacante (Admin)
    openAdminEditJob: function(jobId) {
        const job = this.state.jobs.find(j => Number(j.id) === Number(jobId));
        if (!job) return;

        setVal('adminEditJobId', job.id);
        setVal('adminEditPuesto', job.puesto);
        setVal('adminEditSueldo', job.sueldo_ofrecido);
        setVal('adminEditUbicacion', job.ubicacion);
        setVal('adminEditBeneficios', job.prestaciones_beneficios);
        setVal('adminEditDescripcion', job.descripcion);
        setVal('adminEditRequisitos', job.requisitos);

        document.getElementById('modalAdminEditJob').style.display = 'flex';
    },

    closeAdminEditModal: function() {
        document.getElementById('modalAdminEditJob').style.display = 'none';
    },

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

        try {
            await fetch('api.php?action=admin_edit_job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (err) {}

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
