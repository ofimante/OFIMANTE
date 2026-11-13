// ==============================================================================
// OFIMANTE - CONTROLADOR PRINCIPAL JAVASCRIPT (ES6+)
// Plataforma de Empleo y Conexión Laboral
// Ciudad Mante, Tamaulipas, México
// ==============================================================================

const OFIMANTE = {
    state: {
        currentScreen: 'screen-1',
        authTab: 'login', // 'login' | 'register'
        selectedRegisterRole: 'candidato', // 'candidato' | 'empresa'
        currentUser: null,
        csrfToken: '',
        backendOnline: false,

        // Colecciones en memoria
        vacantes: [],
        misPostulaciones: [],
        solicitudesEmpresa: [],
        candidatosAdmin: [],
        empresasAdmin: [],
        vacantesAdmin: [],
        historialAdmin: [],
        notificaciones: [],
        unreadNotifs: 0,
        pagosAdmin: []
    },

    // --------------------------------------------------------------------------
    // 1. INICIALIZACIÓN
    // --------------------------------------------------------------------------
    init: async function () {
        console.log("Iniciando OFIMANTE...");
        this.ensureLocalDatabase();
        await this.checkSession();
        await this.loadInitialPublicData();
        this.setupEventListeners();
        this.renderNavbarUser();
        this.updateSyncBadge();

        // Mostrar pantalla inicial o previamente guardada
        const savedScreen = localStorage.getItem('ofimante_active_screen') || 'screen-1';
        this.goToScreen(savedScreen, false);
    },

    // --------------------------------------------------------------------------
    // 2. BASE DE DATOS LOCAL AUTÓNOMA (PERSISTENCIA INMEDIATA)
    // --------------------------------------------------------------------------
    
    // --------------------------------------------------------------------------
    // FORMATEO DE ENTRADAS DE TARJETA BANCARIA
    // --------------------------------------------------------------------------
    formatCardNumberInput: function (input) {
        let v = input.value.replace(/\D/g, '').substring(0, 16);
        let formatted = '';
        for (let i = 0; i < v.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += v[i];
        }
        input.value = formatted;
    },

    formatCardExpiryInput: function (input) {
        let v = input.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 3) {
            input.value = v.substring(0, 2) + '/' + v.substring(2);
        } else {
            input.value = v;
        }
    },

    ensureLocalDatabase: function () {
        const existing = localStorage.getItem('ofimante_db_store');
        if (!existing) {
            const seedDb = {
                users: [
                    { id: 1, nombre: "Administrador General Mante", email: "admin@ofimante.com", password: "Admin1234!", rol: "admin", estado: "activo", avatar: "logo.png" },
                    { id: 2, nombre: "Carlos Eduardo Garza Morales", email: "carlos.garza@alumnos.uat.edu.mx", password: "Candidato123!", rol: "candidato", estado: "activo", avatar: "logo.png" },
                    { id: 3, nombre: "Soluciones Digitales Mante", email: "contacto@solucionesmante.com.mx", password: "Empresa123!", rol: "empresa", estado: "activo", avatar: "logo.png" },
                    { id: 4, nombre: "Clínica Médica Santa Fe Mante", email: "recepcion@clinicasantafe.com", password: "Empresa123!", rol: "empresa", estado: "activo", avatar: "logo.png" },
                    { id: 5, nombre: "Ana Patricia Méndez Torres", email: "ana.mendez@gmail.com", password: "Candidato123!", rol: "candidato", estado: "activo", avatar: "logo.png" }
                ],
                candidates: [
                    {
                        id: 1,
                        usuario_id: 2,
                        nombre_completo: "Carlos Eduardo Garza Morales",
                        puesto_deseado: "Auxiliar de Soporte Técnico y Redes",
                        fecha_nacimiento: "2001-05-18",
                        edad: 23,
                        telefono: "831-145-8921",
                        email_contacto: "carlos.garza@alumnos.uat.edu.mx",
                        domicilio_zona: "Calle Juárez #402 Ote., Zona Centro, Cd. Mante",
                        nivel_academico: "Ingeniería en Tecnologías de la Información (UAMM UAT)",
                        experiencia_laboral: "1 año en soporte preventivo, ensamblaje de PC y mantenimiento a locales de El Mante.",
                        habilidades: "Atención a clientes, Office 365, diagnóstico de hardware, cableado y redes.",
                        conocimientos: "HTML5, CSS3, JavaScript básico, MySQL y Windows 11.",
                        descripcion_personal: "Joven profesional enfocado en optimizar el servicio tecnológico de las empresas en Ciudad Mante.",
                        disponibilidad: "Inmediata - Tiempo Completo",
                        expectativa_salarial: "$9,000 - $11,000 mensuales",
                        foto_url: "logo.png",
                        archivo_cv_pdf: "cv_carlos_garza.pdf",
                        estado_aprobacion: "aprobado",
                        motivo_rechazo: ""
                    },
                    {
                        id: 2,
                        usuario_id: 5,
                        nombre_completo: "Ana Patricia Méndez Torres",
                        puesto_deseado: "Recepcionista y Control de Citas",
                        fecha_nacimiento: "2002-09-12",
                        edad: 22,
                        telefono: "831-234-8899",
                        email_contacto: "ana.mendez@gmail.com",
                        domicilio_zona: "Colonia Tamaulipas, Cd. Mante",
                        nivel_academico: "Licenciatura en Administración (7mo Semestre)",
                        experiencia_laboral: "Prácticas en consultorio dental, recepción de pacientes y caja chica.",
                        habilidades: "Facilidad de palabra, proactividad, redacción formal y conmutador.",
                        conocimientos: "Excel administrativo, archivo y facturación básica.",
                        descripcion_personal: "Estudiante responsable con vocación de servicio y puntualidad.",
                        disponibilidad: "Medio Tiempo / Estudiantes",
                        expectativa_salarial: "$7,000 - $8,500 mensuales",
                        foto_url: "logo.png",
                        archivo_cv_pdf: "",
                        estado_aprobacion: "pendiente",
                        motivo_rechazo: ""
                    }
                ],
                companies: [
                    {
                        id: 1,
                        usuario_id: 3,
                        nombre_comercial: "Soluciones Digitales Mante",
                        razon_social: "Soluciones Digitales del Mante S.A. de C.V.",
                        rfc: "SDM190412AB1",
                        nombre_responsable: "Lic. Andrea Guadalupe Ruiz",
                        telefono: "831-232-5500",
                        email_contacto: "contacto@solucionesmante.com.mx",
                        direccion: "Av. Manuel Cavazos Lerma #205, Col. Moderna, Cd. Mante",
                        giro_actividad: "Tecnología y Software",
                        descripcion_empresa: "Empresa mantense líder en equipo de cómputo, redes y desarrollo de software.",
                        logotipo_url: "logo.png",
                        estado_aprobacion: "aprobada",
                        motivo_rechazo: ""
                    },
                    {
                        id: 2,
                        usuario_id: 4,
                        nombre_comercial: "Clínica Santa Fe Mante",
                        razon_social: "Clínica Médica Santa Fe de El Mante S.C.",
                        rfc: "CMS980315KL9",
                        nombre_responsable: "Dr. Héctor Manuel Treviño",
                        telefono: "831-232-1144",
                        email_contacto: "recepcion@clinicasantafe.com",
                        direccion: "Calle Hidalgo #310 Ote., Zona Centro, Cd. Mante",
                        giro_actividad: "Salud y Clínica Médica",
                        descripcion_empresa: "Centro médico integral de especialidades al servicio de las familias cañeras.",
                        logotipo_url: "logo.png",
                        estado_aprobacion: "aprobada",
                        motivo_rechazo: ""
                    }
                ],
                vacancies: [
                    {
                        id: 1,
                        empresa_id: 1,
                        puesto: "Auxiliar de Soporte Técnico y Redes",
                        nombre_comercial: "Soluciones Digitales Mante",
                        ubicacion: "Zona Centro, Cd. Mante",
                        horario: "Lunes a Viernes 8:30 am - 5:30 pm, Sábado 9:00 am - 1:00 pm",
                        tipo_contratacion: "Tiempo Completo",
                        sueldo_ofrecido: "$10,500 mensuales netos",
                        prestaciones: "Prestaciones de ley completas (IMSS, Infonavit, aguinaldo de 15 días, prima vacacional).",
                        beneficios: "Capacitación técnica pagada, bonos de productividad bimestral y excelente ambiente.",
                        descripcion: "Mantenimiento preventivo a computadoras, formateo, configuración de routers e impresoras en comercios de El Mante.",
                        requisitos: "Conocimientos de hardware, Windows y trato cordial con clientes.",
                        fecha_publicacion: "2026-11-10",
                        fecha_cierre: "2026-12-15",
                        tarifa_monto: 100.00,
                        tarifa_pagada: 1,
                        estado: "aprobada",
                        categoria: "Tecnología e Informática"
                    },
                    {
                        id: 2,
                        empresa_id: 2,
                        puesto: "Recepcionista y Control de Citas Médicas",
                        nombre_comercial: "Clínica Santa Fe Mante",
                        ubicacion: "Zona Centro (Frente a Plaza Principal), Cd. Mante",
                        horario: "Lunes a Viernes 8:00 am - 4:00 pm, Sábado 8:00 am - 1:00 pm",
                        tipo_contratacion: "Tiempo Completo",
                        sueldo_ofrecido: "$9,800 mensuales netos",
                        prestaciones: "Seguro social (IMSS), aguinaldo, vacaciones y días festivos de ley.",
                        beneficios: "Vales de despensa mensuales ($800), descuentos médicos familiares y estabilidad.",
                        descripcion: "Atención y orientación a pacientes, recepción de llamadas telefónicas y archivo de expedientes.",
                        requisitos: "Excelente presentación, puntualidad y trato cálido con pacientes.",
                        fecha_publicacion: "2026-11-10",
                        fecha_cierre: "2026-12-20",
                        tarifa_monto: 100.00,
                        tarifa_pagada: 1,
                        estado: "aprobada",
                        categoria: "Salud y Administración"
                    },
                    {
                        id: 3,
                        empresa_id: 1,
                        puesto: "Asistente de Facturación y Ventas Mostrador",
                        nombre_comercial: "Soluciones Digitales Mante",
                        ubicacion: "Av. Cavazos Lerma #205, Cd. Mante",
                        horario: "Lunes a Viernes 9:00 am - 2:00 pm (Medio Tiempo)",
                        tipo_contratacion: "Medio Tiempo",
                        sueldo_ofrecido: "$6,800 mensuales netos",
                        prestaciones: "IMSS, aguinaldo proporcional y prima dominical en su caso.",
                        beneficios: "Horario ideal para estudiantes universitarios y apoyo para transporte.",
                        descripcion: "Emisión de notas de venta, facturación básica y atención al público en mostrador.",
                        requisitos: "Facilidad de palabra y manejo de Office.",
                        fecha_publicacion: "2026-11-11",
                        fecha_cierre: "2026-12-30",
                        tarifa_monto: 100.00,
                        tarifa_pagada: 1,
                        estado: "aprobada",
                        categoria: "Comercio y Ventas"
                    }
                ],
                applications: [
                    {
                        id: 1,
                        vacante_id: 1,
                        candidato_id: 1,
                        puesto: "Auxiliar de Soporte Técnico y Redes",
                        nombre_completo: "Carlos Eduardo Garza Morales",
                        telefono: "831-145-8921",
                        email_contacto: "carlos.garza@alumnos.uat.edu.mx",
                        nivel_academico: "Ingeniería en Tecnologías de la Información",
                        empresa_nombre: "Soluciones Digitales Mante",
                        fecha_postulacion: "2026-11-11 08:30:15",
                        estado: "aceptada",
                        respuesta_empresa: "Estimado Carlos, revisamos tu currículum y tu perfil cumple con lo requerido. Te esperamos para entrevista este jueves 10:30 am."
                    }
                ],
                payments: [
                    { id: 1, vacante_id: 1, empresa_id: 1, empresa_nombre: "Soluciones Digitales Mante", vacante_puesto: "Auxiliar de Soporte Técnico y Redes", monto: 100.00, moneda: "MXN", metodo_pago: "Tarjeta de Débito", tarjeta_titular: "Lic. Andrea Guadalupe Ruiz", tarjeta_numero: "4152 3132 4567 8901", tarjeta_expiracion: "08/28", tarjeta_tipo: "Tarjeta de Débito", tarjeta_banco: "BBVA México", referencia: "OFM-PAY-2026-001", estado: "completado", fecha_pago: "2026-11-10 11:45:00", fecha_cobro: "2026-11-10 11:46:00" },
                    { id: 2, vacante_id: 2, empresa_id: 2, empresa_nombre: "Clínica Santa Fe Mante", vacante_puesto: "Recepcionista y Control de Citas Médicas", monto: 100.00, moneda: "MXN", metodo_pago: "Tarjeta de Crédito", tarjeta_titular: "Dr. Héctor Manuel Treviño", tarjeta_numero: "5412 7512 3412 9012", tarjeta_expiracion: "11/27", tarjeta_tipo: "Tarjeta de Crédito", tarjeta_banco: "Banorte", referencia: "OFM-PAY-2026-002", estado: "pendiente_cobro", fecha_pago: "2026-11-10 14:10:00", fecha_cobro: null },
                    { id: 3, vacante_id: 3, empresa_id: 1, empresa_nombre: "Soluciones Digitales Mante", vacante_puesto: "Asistente de Facturación y Ventas Mostrador", monto: 100.00, moneda: "MXN", metodo_pago: "Tarjeta de Débito", tarjeta_titular: "Lic. Andrea Guadalupe Ruiz", tarjeta_numero: "4152 3132 4567 8901", tarjeta_expiracion: "08/28", tarjeta_tipo: "Tarjeta de Débito", tarjeta_banco: "BBVA México", referencia: "OFM-PAY-2026-003", estado: "completado", fecha_pago: "2026-11-11 09:15:00", fecha_cobro: "2026-11-11 09:16:00" }
                ],
                notifications: [
                    { id: 1, usuario_id: 2, titulo: "¡Postulación Aceptada!", mensaje: "Soluciones Digitales Mante ha aceptado tu postulación para Auxiliar de Soporte Técnico.", creado_en: "2026-11-11 11:20:00", leida: 0 },
                    { id: 2, usuario_id: 3, titulo: "Nueva Postulación Recibida", mensaje: "Carlos Eduardo Garza Morales se ha postulado a Auxiliar de Soporte Técnico.", creado_en: "2026-11-11 08:30:15", leida: 1 },
                    { id: 3, usuario_id: 1, titulo: "Nueva Empresa Registrada", mensaje: "La empresa Clínica Santa Fe Mante solicita verificación.", creado_en: "2026-11-09 11:15:00", leida: 1 }
                ],
                activity: [
                    { id: 1, usuario_id: 1, accion: "INICIO_SISTEMA", descripcion: "Plataforma OFIMANTE desplegada en Ciudad Mante.", direccion_ip: "127.0.0.1", creado_en: "2026-11-10 08:00:00" },
                    { id: 2, usuario_id: 1, accion: "APROBACION_CANDIDATO", descripcion: "El administrador aprobó a Carlos Eduardo Garza Morales.", direccion_ip: "127.0.0.1", creado_en: "2026-11-10 10:00:00" },
                    { id: 3, usuario_id: 1, accion: "VALIDACION_PAGO", descripcion: "Verificación de tarifa de $100 MXN para vacante #1.", direccion_ip: "127.0.0.1", creado_en: "2026-11-10 11:45:00" }
                ]
            };
            localStorage.setItem('ofimante_db_store', JSON.stringify(seedDb));
        }
    },

    getLocalDb: function () {
        this.ensureLocalDatabase();
        try {
            return JSON.parse(localStorage.getItem('ofimante_db_store')) || {};
        } catch (e) {
            return {};
        }
    },

    saveLocalDb: function (db) {
        localStorage.setItem('ofimante_db_store', JSON.stringify(db));
    },

    // --------------------------------------------------------------------------
    // 3. COMUNICACIÓN CON LA API O MOTOR LOCAL AUTÓNOMO
    // --------------------------------------------------------------------------
    apiCall: async function (action, data = null, method = 'POST') {
        const url = `backend/api.php?action=${action}`;
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.state.csrfToken
                }
            };
            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }
            const res = await fetch(url, options);
            if (res.ok) {
                const json = await res.json();
                this.state.backendOnline = true;
                this.updateSyncBadge();
                return json;
            }
            // Si el servidor responde con error 400/401/403/409, retornar JSON de error del servidor
            if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 409) {
                return await res.json();
            }
            throw new Error("HTTP error " + res.status);
        } catch (err) {
            // Conmutar transparente al motor local autónomo
            this.state.backendOnline = false;
            this.updateSyncBadge();
            return this.localFallbackHandler(action, data);
        }
    },

    // --------------------------------------------------------------------------
    // 4. MOTOR LOCAL AUTÓNOMO (EJECUCIÓN DIRECTA EN NAVEGADOR)
    // --------------------------------------------------------------------------
    localFallbackHandler: function (action, data) {
        const db = this.getLocalDb();
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

        switch (action) {
            case 'get_session': {
                const u = this.state.currentUser;
                const notifs = u ? (db.notifications || []).filter(n => n.usuario_id === u.id) : [];
                const unread = notifs.filter(n => n.leida === 0).length;
                return {
                    success: true,
                    logged_in: !!u,
                    user: u,
                    csrf_token: 'local_csrf_' + Date.now(),
                    notificaciones: notifs,
                    notifs_unread: unread
                };
            }

            case 'get_initial_data': {
                const approvedJobs = (db.vacancies || []).filter(v => v.estado === 'aprobada');
                return {
                    success: true,
                    jobs: approvedJobs,
                    stats: {
                        candidatos: (db.candidates || []).length,
                        empresas: (db.companies || []).length,
                        vacantes: approvedJobs.length,
                        solicitudes: (db.applications || []).length
                    }
                };
            }

            case 'login': {
                const email = (data.email || '').toLowerCase().trim();
                const pass = data.password || '';
                const user = (db.users || []).find(u => u.email.toLowerCase() === email);

                if (!user) {
                    // Si el usuario no existe en la BD semilla, crear uno automático para prueba
                    let rol = 'candidato';
                    if (email.includes('admin')) rol = 'admin';
                    else if (email.includes('empresa') || email.includes('soluciones') || email.includes('clinica')) rol = 'empresa';

                    const newUser = {
                        id: Date.now(),
                        nombre: email.split('@')[0],
                        email: email,
                        password: pass,
                        rol: rol,
                        estado: 'activo',
                        avatar: 'logo.png'
                    };
                    db.users.push(newUser);
                    this.saveLocalDb(db);
                    return { success: true, message: 'Inicio de sesión exitoso.', user: newUser };
                }

                if (user.estado === 'suspendido') {
                    return { success: false, error: 'Esta cuenta se encuentra suspendida.' };
                }

                // Aceptar contraseña de la BD o las contraseñas estándar de prueba
                if (user.password !== pass && pass !== 'Admin1234!' && pass !== 'Candidato123!' && pass !== 'Empresa123!') {
                    return { success: false, error: 'Contraseña incorrecta.' };
                }

                return { success: true, message: 'Inicio de sesión exitoso.', user: user };
            }

            case 'register_candidate': {
                const email = (data.email || '').toLowerCase().trim();
                const exists = (db.users || []).some(u => u.email.toLowerCase() === email);
                if (exists) {
                    return { success: false, error: 'Este correo electrónico ya se encuentra registrado.' };
                }

                const newUserId = Date.now();
                const newUser = {
                    id: newUserId,
                    nombre: data.nombre,
                    email: email,
                    password: data.password,
                    rol: 'candidato',
                    estado: 'activo',
                    avatar: 'logo.png'
                };
                db.users.push(newUser);

                const newCandId = (db.candidates && db.candidates.length) ? Math.max(...db.candidates.map(c => c.id)) + 1 : 1;
                const newCandidate = {
                    id: newCandId,
                    usuario_id: newUserId,
                    nombre_completo: data.nombre,
                    puesto_deseado: 'Profesional / Búsqueda de Empleo',
                    fecha_nacimiento: '2000-01-01',
                    edad: 24,
                    telefono: '831-000-0000',
                    email_contacto: email,
                    domicilio_zona: 'Ciudad Mante, Tam.',
                    nivel_academico: 'Por definir',
                    experiencia_laboral: 'Sin experiencia previa registrada',
                    habilidades: 'Proactividad, puntualidad',
                    conocimientos: 'Manejo de equipo básico',
                    descripcion_personal: 'En búsqueda de oportunidades de desarrollo en El Mante.',
                    disponibilidad: 'Inmediata - Tiempo Completo',
                    expectativa_salarial: '$8,000 mensuales',
                    foto_url: 'logo.png',
                    archivo_cv_pdf: '',
                    estado_aprobacion: 'pendiente',
                    motivo_rechazo: ''
                };
                db.candidates.push(newCandidate);

                db.notifications.push({
                    id: Date.now(),
                    usuario_id: 1, // Admin
                    titulo: 'Nuevo Candidato Registrado',
                    mensaje: `El candidato ${data.nombre} solicita validación de datos.`,
                    creado_en: nowStr,
                    leida: 0
                });

                this.saveLocalDb(db);
                return { success: true, message: '¡Registro exitoso como Candidato!', user: newUser };
            }

            case 'register_company': {
                const email = (data.email || '').toLowerCase().trim();
                const exists = (db.users || []).some(u => u.email.toLowerCase() === email);
                if (exists) {
                    return { success: false, error: 'El correo electrónico ya está registrado.' };
                }

                const newUserId = Date.now();
                const newUser = {
                    id: newUserId,
                    nombre: data.nombre_comercial,
                    email: email,
                    password: data.password,
                    rol: 'empresa',
                    estado: 'activo',
                    avatar: 'logo.png'
                };
                db.users.push(newUser);

                const newEmpId = (db.companies && db.companies.length) ? Math.max(...db.companies.map(e => e.id)) + 1 : 1;
                const newCompany = {
                    id: newEmpId,
                    usuario_id: newUserId,
                    nombre_comercial: data.nombre_comercial,
                    razon_social: data.nombre_comercial,
                    rfc: 'RFC-PENDIENTE',
                    nombre_responsable: data.nombre_responsable,
                    telefono: '831-000-0000',
                    email_contacto: email,
                    direccion: 'Ciudad Mante, Tam.',
                    giro_actividad: 'Comercio Local',
                    descripcion_empresa: 'Negocio local de Ciudad Mante.',
                    logotipo_url: 'logo.png',
                    estado_aprobacion: 'pendiente',
                    motivo_rechazo: ''
                };
                db.companies.push(newCompany);

                db.notifications.push({
                    id: Date.now(),
                    usuario_id: 1,
                    titulo: 'Nueva Empresa Registrada',
                    mensaje: `La empresa ${data.nombre_comercial} solicita verificación.`,
                    creado_en: nowStr,
                    leida: 0
                });

                this.saveLocalDb(db);
                return { success: true, message: '¡Empresa registrada exitosamente!', user: newUser };
            }

            case 'google_login': {
                const email = (data.email || '').toLowerCase().trim();
                let user = (db.users || []).find(u => u.email.toLowerCase() === email);
                if (!user) {
                    user = {
                        id: Date.now(),
                        nombre: data.nombre || 'Usuario Google',
                        email: email,
                        password: 'GoogleUser123!',
                        rol: data.rol || 'candidato',
                        estado: 'activo',
                        avatar: 'logo.png'
                    };
                    db.users.push(user);
                    this.saveLocalDb(db);
                }
                return { success: true, message: 'Sesión iniciada con Google.', user: user };
            }

            case 'logout': {
                return { success: true, message: 'Sesión finalizada.' };
            }

            case 'get_candidate_dashboard': {
                const u = this.state.currentUser;
                const cand = (db.candidates || []).find(c => c.usuario_id === u?.id) || db.candidates[0];
                const myApps = (db.applications || []).filter(a => a.candidato_id === cand?.id);
                const approvedJobs = (db.vacancies || []).filter(v => v.estado === 'aprobada');
                return {
                    success: true,
                    candidato: cand,
                    curriculum: { puesto_deseado: cand?.puesto_deseado || 'Especialista' },
                    solicitudes: myApps,
                    vacantes: approvedJobs
                };
            }

            case 'update_candidate_profile': {
                const u = this.state.currentUser;
                let cand = (db.candidates || []).find(c => c.usuario_id === u?.id);
                if (!cand) {
                    cand = { id: Date.now(), usuario_id: u?.id };
                    db.candidates.push(cand);
                }
                Object.assign(cand, data);
                cand.estado_aprobacion = 'pendiente'; // Solicitar validación

                db.notifications.push({
                    id: Date.now(),
                    usuario_id: 1,
                    titulo: 'Perfil en Revisión',
                    mensaje: `El candidato ${cand.nombre_completo} ha actualizado sus datos curriculares.`,
                    creado_en: nowStr,
                    leida: 0
                });

                this.saveLocalDb(db);
                return { success: true, message: 'Perfil y Currículum guardados. Tus datos han quedado en revisión por el Administrador.' };
            }

            case 'get_company_dashboard': {
                const u = this.state.currentUser;
                const emp = (db.companies || []).find(e => e.usuario_id === u?.id) || db.companies[0];
                const myJobs = (db.vacancies || []).filter(v => v.empresa_id === emp?.id);
                const apps = (db.applications || []).map(a => {
                    const c = (db.candidates || []).find(cand => cand.id === a.candidato_id);
                    return c ? { ...c, ...a } : a;
                });
                // Ordenar cronológicamente descendente
                apps.sort((a, b) => new Date(b.fecha_postulacion).getTime() - new Date(a.fecha_postulacion).getTime());
                return {
                    success: true,
                    empresa: emp,
                    vacantes: myJobs,
                    solicitudes: apps
                };
            }

            case 'update_company_profile': {
                const u = this.state.currentUser;
                let emp = (db.companies || []).find(e => e.usuario_id === u?.id);
                if (!emp) {
                    emp = { id: Date.now(), usuario_id: u?.id };
                    db.companies.push(emp);
                }
                Object.assign(emp, data);
                emp.estado_aprobacion = 'pendiente';
                this.saveLocalDb(db);
                return { success: true, message: 'Datos empresariales actualizados. Están en proceso de validación por el Administrador.' };
            }

            case 'create_job': {
                const u = this.state.currentUser;
                const emp = (db.companies || []).find(e => e.usuario_id === u?.id) || db.companies[0];
                const newJobId = (db.vacancies && db.vacancies.length) ? Math.max(...db.vacancies.map(v => v.id)) + 1 : 1;

                const newJob = {
                    id: newJobId,
                    empresa_id: emp.id,
                    puesto: data.puesto,
                    nombre_comercial: emp.nombre_comercial,
                    ubicacion: data.ubicacion || 'Zona Centro, Cd. Mante',
                    horario: data.horario,
                    tipo_contratacion: data.tipo_contratacion,
                    sueldo_ofrecido: data.sueldo_ofrecido,
                    prestaciones: data.prestaciones,
                    beneficios: data.beneficios,
                    descripcion: data.descripcion,
                    requisitos: data.requisitos,
                    fecha_publicacion: nowStr.split(' ')[0],
                    fecha_cierre: data.fecha_cierre,
                    tarifa_monto: 100.00,
                    tarifa_pagada: 1,
                    estado: 'pendiente', // Espera revisión admin
                    categoria: data.categoria
                };
                db.vacancies.push(newJob);

                const ref = 'OFM-PAY-' + Date.now().toString().slice(-6);
                db.payments.push({
                    id: Date.now(),
                    vacante_id: newJobId,
                    empresa_id: emp.id,
                    empresa_nombre: emp.nombre_comercial,
                    vacante_puesto: data.puesto,
                    monto: 100.00,
                    moneda: 'MXN',
                    metodo_pago: data.tarjeta_tipo || 'Tarjeta de Débito',
                    tarjeta_titular: data.tarjeta_titular || '',
                    tarjeta_numero: data.tarjeta_numero || '',
                    tarjeta_expiracion: data.tarjeta_expiracion || '',
                    tarjeta_tipo: data.tarjeta_tipo || 'Tarjeta de Débito',
                    tarjeta_banco: data.tarjeta_banco || 'BBVA México',
                    referencia: ref,
                    estado: 'pendiente_cobro',
                    fecha_pago: nowStr,
                    fecha_cobro: null
                });

                db.notifications.push({
                    id: Date.now(),
                    usuario_id: 1,
                    titulo: 'Nueva Vacante con Tarifa $100',
                    mensaje: `La empresa ${emp.nombre_comercial} publicó "${data.puesto}" con tarifa cubierta.`,
                    creado_en: nowStr,
                    leida: 0
                });

                this.saveLocalDb(db);
                return {
                    success: true,
                    message: `¡Vacante registrada exitosamente! Se procesó la tarifa de servicio de $100 MXN (Demostración). El Administrador validará la publicación.`,
                    referencia: ref
                };
            }

            case 'apply_job': {
                const u = this.state.currentUser;
                const cand = (db.candidates || []).find(c => c.usuario_id === u?.id) || db.candidates[0];
                const vac = (db.vacancies || []).find(v => v.id === data.vacante_id);

                if (cand.estado_aprobacion !== 'aprobado') {
                    return { success: false, error: 'Tu perfil debe ser aprobado por el Administrador antes de postularte a vacantes.' };
                }

                const already = (db.applications || []).some(a => a.vacante_id === data.vacante_id && a.candidato_id === cand.id);
                if (already) {
                    return { success: false, error: 'Ya te has postulado a esta vacante anteriormente.' };
                }

                const newApp = {
                    id: Date.now(),
                    vacante_id: data.vacante_id,
                    candidato_id: cand.id,
                    puesto: vac?.puesto || 'Puesto Solicitado',
                    nombre_completo: cand.nombre_completo,
                    telefono: cand.telefono,
                    email_contacto: cand.email_contacto,
                    nivel_academico: cand.nivel_academico,
                    empresa_nombre: vac?.nombre_comercial || 'Empresa',
                    fecha_postulacion: nowStr,
                    estado: 'pendiente',
                    respuesta_empresa: ''
                };
                db.applications.push(newApp);

                // Notificar a la empresa
                const emp = (db.companies || []).find(e => e.id === vac?.empresa_id);
                if (emp) {
                    db.notifications.push({
                        id: Date.now(),
                        usuario_id: emp.usuario_id,
                        titulo: 'Nueva Postulación Recibida',
                        mensaje: `${cand.nombre_completo} se ha postulado a tu vacante "${vac?.puesto}".`,
                        creado_en: nowStr,
                        leida: 0
                    });
                }

                this.saveLocalDb(db);
                return { success: true, message: '¡Tu currículum ha sido enviado a la empresa exitosamente!' };
            }

            case 'respond_application': {
                const app = (db.applications || []).find(a => a.id === data.solicitud_id);
                if (app) {
                    app.estado = data.decision;
                    app.respuesta_empresa = data.respuesta;
                    this.saveLocalDb(db);
                }
                return { success: true, message: `La solicitud ha sido marcada como ${data.decision}.` };
            }

            case 'get_admin_dashboard': {
                const completedPayments = (db.payments || []).filter(p => p.estado === 'completado');
                const pendingPayments = (db.payments || []).filter(p => p.estado === 'pendiente_cobro');
                const totalRev = completedPayments.reduce((acc, p) => acc + (parseFloat(p.monto) || 100), 0);
                return {
                    success: true,
                    kpis: {
                        candidatos: (db.candidates || []).length,
                        empresas: (db.companies || []).length,
                        candidatos_pendientes: (db.candidates || []).filter(c => c.estado_aprobacion === 'pendiente').length,
                        empresas_pendientes: (db.companies || []).filter(e => e.estado_aprobacion === 'pendiente').length,
                        vacantes: (db.vacancies || []).length,
                        vacantes_pendientes: (db.vacancies || []).filter(v => v.estado === 'pendiente').length,
                        solicitudes: (db.applications || []).length,
                        recaudacion: totalRev,
                        cobros_pendientes: pendingPayments.length
                    },
                    candidatos: db.candidates || [],
                    empresas: db.companies || [],
                    vacantes: db.vacancies || [],
                    solicitudes: db.applications || [],
                    pagos: db.payments || [],
                    historial: db.activity || []
                };
            }

            case 'admin_process_charge': {
                const pago = (db.payments || []).find(p => p.id === data.pago_id);
                if (!pago) return { success: false, error: 'Registro de cobro no encontrado.' };
                pago.estado = 'completado';
                pago.fecha_cobro = nowStr;
                const vac = (db.vacancies || []).find(v => v.id === pago.vacante_id);
                if (vac) vac.tarifa_pagada = 1;

                db.activity.push({
                    id: Date.now(),
                    usuario_id: 1,
                    accion: 'COBRO_TARIFA_TARJETA',
                    descripcion: `Cobro de tarifa de $100.00 MXN confirmado para la empresa '${pago.empresa_nombre}' (Vacante: ${pago.vacante_puesto}).`,
                    direccion_ip: '127.0.0.1',
                    creado_en: nowStr
                });

                this.saveLocalDb(db);
                return { success: true, message: 'Cobro de $100.00 MXN procesado y confirmado con éxito.' };
            }

            case 'admin_moderate_candidate': {
                const cand = (db.candidates || []).find(c => c.id === data.candidato_id);
                if (cand) {
                    if (data.estado === 'eliminado') {
                        db.candidates = db.candidates.filter(c => c.id !== data.candidato_id);
                    } else {
                        cand.estado_aprobacion = data.estado;
                        cand.motivo_rechazo = data.motivo_rechazo || '';
                    }
                    this.saveLocalDb(db);
                }
                return { success: true, message: `Candidato actualizado a estado ${data.estado}.` };
            }

            case 'admin_moderate_company': {
                const emp = (db.companies || []).find(e => e.id === data.empresa_id);
                if (emp) {
                    if (data.estado === 'eliminada') {
                        db.companies = db.companies.filter(e => e.id !== data.empresa_id);
                    } else {
                        emp.estado_aprobacion = data.estado;
                        emp.motivo_rechazo = data.motivo_rechazo || '';
                    }
                    this.saveLocalDb(db);
                }
                return { success: true, message: `Empresa actualizada a estado ${data.estado}.` };
            }

            case 'admin_moderate_job': {
                if (data.action_type === 'delete') {
                    db.vacancies = (db.vacancies || []).filter(v => v.id !== data.vacante_id);
                } else if (data.action_type === 'edit') {
                    const vac = (db.vacancies || []).find(v => v.id === data.vacante_id);
                    if (vac) {
                        vac.puesto = data.puesto;
                        vac.sueldo_ofrecido = data.sueldo_ofrecido;
                        vac.ubicacion = data.ubicacion;
                        vac.beneficios = data.beneficios;
                        vac.descripcion = data.descripcion;
                    }
                } else {
                    const vac = (db.vacancies || []).find(v => v.id === data.vacante_id);
                    if (vac) {
                        vac.estado = data.estado || 'aprobada';
                    }
                }
                this.saveLocalDb(db);
                return { success: true, message: 'Vacante actualizada correctamente.' };
            }

            case 'mark_notification_read': {
                (db.notifications || []).forEach(n => n.leida = 1);
                this.saveLocalDb(db);
                return { success: true };
            }

            default:
                return { success: true, message: 'Acción procesada en modo local.' };
        }
    },

    // --------------------------------------------------------------------------
    // 5. GESTIÓN DE SESIÓN & BARRA DE ESTADO
    // --------------------------------------------------------------------------
    checkSession: async function () {
        const res = await this.apiCall('get_session', null, 'GET');
        if (res && res.success && res.logged_in && res.user) {
            this.state.currentUser = res.user;
            this.state.csrfToken = res.csrf_token || '';
            this.state.notificaciones = res.notificaciones || [];
            this.state.unreadNotifs = res.notifs_unread || 0;
            localStorage.setItem('ofimante_local_user', JSON.stringify(res.user));
        } else {
            const saved = localStorage.getItem('ofimante_local_user');
            if (saved) {
                try {
                    this.state.currentUser = JSON.parse(saved);
                } catch (e) {
                    this.state.currentUser = null;
                }
            }
        }
    },

    renderNavbarUser: function () {
        const u = this.state.currentUser;
        const badge = document.getElementById('userProfileBadge');
        const btnAuth = document.getElementById('btnHeaderAuth');
        const navCand = document.getElementById('nav-btn-3');
        const navEmp = document.getElementById('nav-btn-4');
        const navAdm = document.getElementById('nav-btn-5');
        const notifBtn = document.getElementById('btnNotifNav');

        if (u) {
            if (badge) badge.style.display = 'flex';
            if (btnAuth) btnAuth.style.display = 'none';
            if (notifBtn) notifBtn.style.display = 'flex';

            const uName = document.getElementById('headerUserName');
            const uRole = document.getElementById('headerUserRole');
            const uAvatar = document.getElementById('headerUserAvatar');
            if (uName) uName.innerText = u.nombre;
            if (uRole) uRole.innerText = u.rol.toUpperCase();
            if (uAvatar) uAvatar.src = u.avatar || 'logo.png';

            // Mostrar el botón correspondiente al rol del usuario
            if (navCand) navCand.style.display = (u.rol === 'candidato') ? 'inline-block' : 'none';
            if (navEmp) navEmp.style.display = (u.rol === 'empresa') ? 'inline-block' : 'none';
            if (navAdm) navAdm.style.display = (u.rol === 'admin') ? 'inline-block' : 'none';
        } else {
            if (badge) badge.style.display = 'none';
            if (btnAuth) btnAuth.style.display = 'flex';
            if (notifBtn) notifBtn.style.display = 'none';

            if (navCand) navCand.style.display = 'none';
            if (navEmp) navEmp.style.display = 'none';
            if (navAdm) navAdm.style.display = 'none';
        }
        this.renderNotifCounter();
    },

    updateSyncBadge: function () {
        const el = document.getElementById('backendStatusMsg');
        const banner = document.getElementById('backendStatusBar');
        if (el) {
            el.innerText = this.state.backendOnline
                ? "Conectado con Backend PHP & Base de Datos MySQL (Modo Servidor Activo)"
                : "Modo Local Autónomo (Persistencia segura en navegador activa)";
        }
        if (banner) {
            banner.style.background = this.state.backendOnline
                ? "linear-gradient(90deg, #064e3b, #07172b)"
                : "linear-gradient(90deg, #1e293b, #071324)";
        }
    },

    renderNotifCounter: function () {
        const badge = document.getElementById('notifBadgeCount');
        if (badge) {
            if (this.state.unreadNotifs > 0) {
                badge.style.display = 'block';
                badge.innerText = this.state.unreadNotifs;
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // --------------------------------------------------------------------------
    // 6. NAVEGACIÓN ENTRE PANTALLAS
    // --------------------------------------------------------------------------
    goToScreen: function (screenId, notify = true) {
        // Validación de permisos
        if (screenId === 'screen-3') {
            if (!this.state.currentUser) {
                if (notify) alert("Por favor inicia sesión o regístrate como Candidato para acceder a tu panel.");
                return this.goToScreen('screen-2', false);
            }
            if (this.state.currentUser.rol !== 'candidato') {
                if (notify) alert("Tu cuenta actual es de tipo " + this.state.currentUser.rol.toUpperCase() + ". Ingresa como Candidato para ver este panel.");
                return;
            }
        }

        if (screenId === 'screen-4') {
            if (!this.state.currentUser) {
                if (notify) alert("Por favor inicia sesión o regístrate como Empresa para acceder a tu panel.");
                return this.goToScreen('screen-2', false);
            }
            if (this.state.currentUser.rol !== 'empresa') {
                if (notify) alert("Tu cuenta actual es de tipo " + this.state.currentUser.rol.toUpperCase() + ". Ingresa como Empresa para ver este panel.");
                return;
            }
        }

        if (screenId === 'screen-5') {
            if (!this.state.currentUser) {
                if (notify) alert("Acceso restringido. Por favor ingresa con tus credenciales de Administrador.");
                return this.goToScreen('screen-2', false);
            }
            if (this.state.currentUser.rol !== 'admin') {
                if (notify) alert("Acceso exclusivo para el Administrador General.");
                return;
            }
        }

        this.state.currentScreen = screenId;
        localStorage.setItem('ofimante_active_screen', screenId);

        for (let i = 1; i <= 5; i++) {
            const sec = document.getElementById(`screen-${i}`);
            const btn = document.getElementById(`nav-btn-${i}`);
            if (sec) sec.classList.toggle('active', `screen-${i}` === screenId);
            if (btn) btn.classList.toggle('active', `screen-${i}` === screenId);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Cargas específicas de datos por pantalla
        if (screenId === 'screen-1') {
            this.loadInitialPublicData();
        } else if (screenId === 'screen-3') {
            this.loadCandidateDashboard();
        } else if (screenId === 'screen-4') {
            this.loadCompanyDashboard();
        } else if (screenId === 'screen-5') {
            this.loadAdminDashboard();
        }
    },

    // --------------------------------------------------------------------------
    // 7. CARGA DE VACANTES PÚBLICAS
    // --------------------------------------------------------------------------
    loadInitialPublicData: async function () {
        const res = await this.apiCall('get_initial_data', null, 'GET');
        if (res && res.success) {
            this.state.vacantes = res.jobs || [];
            this.renderFeaturedJobs(this.state.vacantes.slice(0, 6));

            if (res.stats) {
                const sJobs = document.getElementById('homeJobsCount');
                const sComps = document.getElementById('homeCompaniesCount');
                if (sJobs) sJobs.innerText = `${res.stats.vacantes}+`;
                if (sComps) sComps.innerText = `${res.stats.empresas}+`;
            }
        }
    },

    renderFeaturedJobs: function (jobs) {
        const grid = document.getElementById('featuredJobsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        if (!jobs || jobs.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No hay vacantes publicadas en este momento.</p>`;
            return;
        }

        jobs.forEach(j => {
            const card = document.createElement('div');
            card.className = 'job-card-item';
            card.innerHTML = `
                <div>
                    <div class="job-card-top">
                        <h3 class="job-card-title">${j.puesto}</h3>
                        <span class="status-pill success">Verificada</span>
                    </div>
                    <div class="job-company-name">Empresa: ${j.nombre_comercial || 'Empresa Mantense'}</div>
                    <div class="job-meta-line">
                        <span>${j.ubicacion}</span>
                        <span>Horario: ${j.horario || 'Tiempo Completo'}</span>
                    </div>
                    <div class="job-salary-highlight">
                        Sueldo: ${j.sueldo_ofrecido}
                    </div>
                    <div class="job-benefits-box">
                        <strong>Beneficios:</strong> ${j.beneficios || j.prestaciones || 'Prestaciones de ley'}
                    </div>
                    <p class="job-description-excerpt">${j.descripcion ? j.descripcion.substring(0, 110) + '...' : ''}</p>
                </div>
                <div class="job-card-footer">
                    <span style="font-size:0.8rem; color:#64748b;">Publicado: ${j.fecha_publicacion}</span>
                    <button class="btn-primary-large" style="padding:0.5rem 1rem; font-size:0.88rem;" onclick="OFIMANTE.openJobDetailModal(${j.id})">
                        Ver Detalles
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    // --------------------------------------------------------------------------
    // 8. PANTALLA 2: REGISTRO / LOGIN
    // --------------------------------------------------------------------------
    switchAuthTab: function (tab) {
        this.state.authTab = tab;
        const tLogin = document.getElementById('tabBtnLogin');
        const tRegister = document.getElementById('tabBtnRegister');
        const fLogin = document.getElementById('formLogin');
        const fRegister = document.getElementById('formRegister');
        const roleBox = document.getElementById('registerRoleBox');

        if (tab === 'login') {
            if (tLogin) tLogin.classList.add('active');
            if (tRegister) tRegister.classList.remove('active');
            if (fLogin) fLogin.style.display = 'block';
            if (fRegister) fRegister.style.display = 'none';
            if (roleBox) roleBox.style.display = 'none';
        } else {
            if (tLogin) tLogin.classList.remove('active');
            if (tRegister) tRegister.classList.add('active');
            if (fLogin) fLogin.style.display = 'none';
            if (fRegister) fRegister.style.display = 'block';
            if (roleBox) roleBox.style.display = 'block';
        }
    },

    selectRegisterRole: function (role) {
        this.state.selectedRegisterRole = role;
        const optCand = document.getElementById('roleOptCandidate');
        const optEmp = document.getElementById('roleOptCompany');
        const labelName = document.getElementById('lblRegNombre');

        if (optCand) optCand.classList.toggle('active', role === 'candidato');
        if (optEmp) optEmp.classList.toggle('active', role === 'empresa');

        if (labelName) {
            labelName.innerText = (role === 'candidato')
                ? "Nombre Completo (idéntico a tu INE): *"
                : "Nombre Comercial / Empresa: *";
        }
    },

    handleLogin: async function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value;

        const res = await this.apiCall('login', { email, password: pass });
        if (res && res.success && res.user) {
            this.state.currentUser = res.user;
            localStorage.setItem('ofimante_local_user', JSON.stringify(res.user));
            this.renderNavbarUser();
            alert(`¡Bienvenido a OFIMANTE, ${res.user.nombre}!`);

            // Redirección inmediata según el rol
            if (res.user.rol === 'candidato') this.goToScreen('screen-3', false);
            else if (res.user.rol === 'empresa') this.goToScreen('screen-4', false);
            else if (res.user.rol === 'admin') this.goToScreen('screen-5', false);
        } else {
            alert(res?.error || "Error al iniciar sesión.");
        }
    },

    handleRegister: async function (e) {
        e.preventDefault();
        const role = this.state.selectedRegisterRole || 'candidato';
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPassword').value;
        const passConf = document.getElementById('regPasswordConfirm').value;
        const nombre = document.getElementById('regNombre').value.trim();

        if (pass !== passConf) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const action = (role === 'candidato') ? 'register_candidate' : 'register_company';
        const payload = (role === 'candidato')
            ? { nombre, email, password: pass, password_confirm: passConf }
            : { nombre_comercial: nombre, nombre_responsable: nombre, email, password: pass, password_confirm: passConf };

        const res = await this.apiCall(action, payload);
        if (res && res.success && res.user) {
            this.state.currentUser = res.user;
            localStorage.setItem('ofimante_local_user', JSON.stringify(res.user));
            this.renderNavbarUser();
            alert(`¡Cuenta creada exitosamente como ${role.toUpperCase()}!\nA continuación, completa la información de tu perfil.`);

            if (role === 'candidato') this.goToScreen('screen-3', false);
            else this.goToScreen('screen-4', false);
        } else {
            alert(res?.error || "No fue posible completar el registro.");
        }
    },

    loginWithGoogleDemo: async function () {
        const role = this.state.selectedRegisterRole || 'candidato';
        const demoEmail = (role === 'candidato') ? 'carlos.garza@alumnos.uat.edu.mx' : 'contacto@solucionesmante.com.mx';
        const demoNombre = (role === 'candidato') ? 'Carlos Eduardo Garza (Google)' : 'Soluciones Digitales Mante (Google)';

        const res = await this.apiCall('google_login', {
            email: demoEmail,
            nombre: demoNombre,
            rol: role,
            google_id: 'goog_' + Date.now()
        });

        if (res && res.success && res.user) {
            this.state.currentUser = res.user;
            localStorage.setItem('ofimante_local_user', JSON.stringify(res.user));
            this.renderNavbarUser();
            alert(`Inicio de sesión federado con Google exitoso.\nUsuario: ${res.user.nombre}`);
            if (res.user.rol === 'candidato') this.goToScreen('screen-3', false);
            else this.goToScreen('screen-4', false);
        }
    },

    quickDemoLogin: function (role) {
        if (role === 'admin') {
            document.getElementById('loginEmail').value = 'admin@ofimante.com';
            document.getElementById('loginPassword').value = 'Admin1234!';
        } else if (role === 'candidato') {
            document.getElementById('loginEmail').value = 'carlos.garza@alumnos.uat.edu.mx';
            document.getElementById('loginPassword').value = 'Candidato123!';
        } else if (role === 'empresa') {
            document.getElementById('loginEmail').value = 'contacto@solucionesmante.com.mx';
            document.getElementById('loginPassword').value = 'Empresa123!';
        }
        document.getElementById('formLogin').dispatchEvent(new Event('submit'));
    },

    logout: async function () {
        if (confirm("¿Deseas cerrar tu sesión activa en OFIMANTE?")) {
            await this.apiCall('logout');
            this.state.currentUser = null;
            localStorage.removeItem('ofimante_local_user');
            this.renderNavbarUser();
            this.goToScreen('screen-1', false);
            alert("Sesión finalizada correctamente.");
        }
    },

    // --------------------------------------------------------------------------
    // 9. PANTALLA 3: PANEL DEL CANDIDATO
    // --------------------------------------------------------------------------
    loadCandidateDashboard: async function () {
        const res = await this.apiCall('get_candidate_dashboard', null, 'GET');
        if (!res || !res.success) return;

        const cand = res.candidato;
        const cv = res.curriculum;
        this.state.misPostulaciones = res.solicitudes || [];
        this.state.vacantes = res.vacantes || [];

        // Rellenar formulario
        if (cand) {
            this.setVal('cvNombreCompleto', cand.nombre_completo);
            this.setVal('cvPuestoDeseado', cand.puesto_deseado || cv?.puesto_deseado || '');
            this.setVal('cvFechaNacimiento', cand.fecha_nacimiento);
            this.setVal('cvEdad', cand.edad);
            this.setVal('cvTelefono', cand.telefono);
            this.setVal('cvEmailContacto', cand.email_contacto);
            this.setVal('cvDomicilio', cand.domicilio_zona);
            this.setVal('cvNivelAcademico', cand.nivel_academico);
            this.setVal('cvExperiencia', cand.experiencia_laboral);
            this.setVal('cvHabilidades', cand.habilidades);
            this.setVal('cvConocimientos', cand.conocimientos);
            this.setVal('cvDescripcion', cand.descripcion_personal);
            this.setVal('cvDisponibilidad', cand.disponibilidad);
            this.setVal('cvExpectativa', cand.expectativa_salarial);
            this.setVal('cvFotoUrl', cand.foto_url);

            this.renderCandidateApprovalState(cand.estado_aprobacion, cand.motivo_rechazo);
        } else {
            this.renderCandidateApprovalState('pendiente', '');
        }

        this.renderCandidateJobs();
        this.renderMyApplications();
    },

    renderCandidateApprovalState: function (estado, motivo) {
        const banner = document.getElementById('candidateApprovalBanner');
        const badge = document.getElementById('candidateStatusBadge');
        const jobsSection = document.getElementById('candidateJobsSection');

        if (badge) {
            badge.className = `status-pill ${estado === 'aprobado' ? 'success' : (estado === 'rechazado' ? 'danger' : 'warning')}`;
            badge.innerText = `Estado: ${estado.toUpperCase()}`;
        }

        if (banner) {
            banner.className = `alert-banner ${estado === 'aprobado' ? 'success' : (estado === 'rechazado' ? 'danger' : 'warning')}`;
            if (estado === 'pendiente') {
                banner.innerHTML = `<strong>Perfil en Revisión:</strong> Tus datos han sido enviados al Administrador de OFIMANTE. Una vez validados y aprobados podrás postularte a las ofertas de empleo de Ciudad Mante. (Tip: Puedes ingresar como Administrador para aprobar tu cuenta).`;
            } else if (estado === 'aprobado') {
                banner.innerHTML = `<strong>Perfil Verificado y Aprobado:</strong> Tu información cumple con los lineamientos de OFIMANTE. La bolsa de trabajo está desbloqueada y puedes postularte a cualquier vacante.`;
            } else if (estado === 'rechazado') {
                banner.innerHTML = `<strong>Perfil Rechazado:</strong> Motivo: ${motivo || 'Datos incompletos o inconsistentes'}. Por favor corrige la información señalada y vuelve a guardar para solicitar una nueva revisión.`;
            } else {
                banner.innerHTML = `<strong>Cuenta Suspendida:</strong> Comunícate con la administración para más información.`;
            }
        }

        if (jobsSection) {
            jobsSection.style.display = (estado === 'aprobado') ? 'block' : 'none';
        }
    },

    handleSaveCandidateCv: async function (e) {
        e.preventDefault();
        const payload = {
            nombre_completo: this.getVal('cvNombreCompleto'),
            puesto_deseado: this.getVal('cvPuestoDeseado'),
            fecha_nacimiento: this.getVal('cvFechaNacimiento'),
            edad: parseInt(this.getVal('cvEdad')) || 0,
            telefono: this.getVal('cvTelefono'),
            email_contacto: this.getVal('cvEmailContacto'),
            domicilio_zona: this.getVal('cvDomicilio'),
            nivel_academico: this.getVal('cvNivelAcademico'),
            experiencia_laboral: this.getVal('cvExperiencia'),
            habilidades: this.getVal('cvHabilidades'),
            conocimientos: this.getVal('cvConocimientos'),
            descripcion_personal: this.getVal('cvDescripcion'),
            disponibilidad: this.getVal('cvDisponibilidad'),
            expectativa_salarial: this.getVal('cvExpectativa'),
            foto_url: this.getVal('cvFotoUrl') || 'logo.png'
        };

        const res = await this.apiCall('update_candidate_profile', payload);
        if (res && res.success) {
            alert(res.message);
            this.loadCandidateDashboard();
        } else {
            alert(res?.error || "Error al guardar el currículum.");
        }
    },

    uploadCvPdf: async function (fileInput) {
        if (!fileInput.files || fileInput.files.length === 0) return;
        const file = fileInput.files[0];
        if (file.type !== 'application/pdf') {
            alert("Solo se admiten archivos en formato PDF.");
            return;
        }

        const formData = new FormData();
        formData.append('cv_pdf', file);

        try {
            const res = await fetch('backend/api.php?action=upload_cv_pdf', {
                method: 'POST',
                headers: { 'X-CSRF-Token': this.state.csrfToken },
                body: formData
            });
            const data = await res.json();
            if (data && data.success) {
                alert("¡Documento PDF subido exitosamente!");
            } else {
                alert(data?.error || "Currículum PDF registrado localmente.");
            }
        } catch (e) {
            alert("Currículum PDF registrado en el navegador.");
        }
    },

    renderCandidateJobs: function () {
        const grid = document.getElementById('candidateJobsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        const filterPuesto = (this.getVal('filterJobKeyword') || '').toLowerCase();
        const filterCat = this.getVal('filterJobCategory');

        const filtered = this.state.vacantes.filter(j => {
            const matchKeyword = !filterPuesto || j.puesto.toLowerCase().includes(filterPuesto) || (j.descripcion && j.descripcion.toLowerCase().includes(filterPuesto));
            const matchCat = !filterCat || filterCat === 'todas' || j.categoria === filterCat;
            return matchKeyword && matchCat;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding:2rem;">No se encontraron vacantes con los criterios seleccionados.</p>`;
            return;
        }

        filtered.forEach(j => {
            const hasApplied = this.state.misPostulaciones.some(s => s.vacante_id === j.id);
            const card = document.createElement('div');
            card.className = 'job-card-item';
            card.innerHTML = `
                <div>
                    <div class="job-card-top">
                        <h3 class="job-card-title">${j.puesto}</h3>
                        <span class="status-pill success">Verificada</span>
                    </div>
                    <div class="job-company-name">Empresa: ${j.nombre_comercial || 'Empresa Mantense'}</div>
                    <div class="job-meta-line">
                        <span>${j.ubicacion}</span>
                        <span>Horario: ${j.horario || 'Tiempo Completo'}</span>
                        <span>Categoría: ${j.categoria || 'General'}</span>
                    </div>
                    <div class="job-salary-highlight">
                        Sueldo: ${j.sueldo_ofrecido}
                    </div>
                    <div class="job-benefits-box">
                        <strong>Beneficios:</strong> ${j.beneficios || j.prestaciones || 'Prestaciones de ley'}
                    </div>
                    <p class="job-description-excerpt">${j.descripcion ? j.descripcion.substring(0, 110) + '...' : ''}</p>
                </div>
                <div class="job-card-footer">
                    <button class="btn-secondary-large" onclick="OFIMANTE.openJobDetailModal(${j.id})">Consultar Puesto</button>
                    <button class="btn-primary-large" ${hasApplied ? 'disabled style="background:#10b981; cursor:default;"' : ''} onclick="OFIMANTE.applyToJob(${j.id})">
                        ${hasApplied ? 'Ya Postulado' : 'Postularme'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    applyToJob: async function (jobId) {
        if (!confirm("¿Deseas enviar tu currículum vitae a esta vacante?")) return;

        const res = await this.apiCall('apply_job', { vacante_id: jobId, mensaje: 'Postulación formal desde OFIMANTE.' });
        if (res && res.success) {
            alert(res.message);
            this.loadCandidateDashboard();
        } else {
            alert(res?.error || "Error al enviar la postulación.");
        }
    },

    renderMyApplications: function () {
        const tbody = document.getElementById('myApplicationsTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (this.state.misPostulaciones.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#64748b;">Aún no te has postulado a ninguna vacante.</td></tr>`;
            return;
        }

        this.state.misPostulaciones.forEach(s => {
            const tr = document.createElement('tr');
            const stClass = s.estado === 'aceptada' ? 'success' : (s.estado === 'rechazada' ? 'danger' : 'warning');
            tr.innerHTML = `
                <td><strong>${s.puesto}</strong></td>
                <td>${s.empresa_nombre || 'Empresa'}</td>
                <td>${s.fecha_postulacion}</td>
                <td><span class="status-pill ${stClass}">${s.estado.toUpperCase()}</span></td>
                <td>${s.respuesta_empresa ? `<strong style="color:#0284c7;">"${s.respuesta_empresa}"</strong>` : '<span style="color:#94a3b8;">En espera de respuesta</span>'}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderCvModal: function (c, mode, contextId) {
        const modal = document.getElementById('modalPreviewCv');
        const body = document.getElementById('previewCvBody');
        const actions = document.getElementById('previewCvActions');
        if (!modal || !body) return;

        const nombre = c.nombre_completo || 'Nombre no registrado';
        const puesto = c.puesto_solicitado || c.puesto || 'Puesto Deseado';
        const domicilio = c.domicilio_completo || c.direccion || 'Ciudad Mante, Tamaulipas';
        const tel = c.telefono_contacto || c.telefono || 'Sin teléfono';
        const telSec = c.telefono_secundario ? ` | Tel. Alt: ${c.telefono_secundario}` : '';
        const email = c.email_contacto || c.email || 'Sin correo registrado';
        const edad = c.edad ? `${c.edad} años` : (c.fecha_nacimiento ? `Nacimiento: ${c.fecha_nacimiento}` : 'Edad no indicada');
        const edoCivil = c.estado_civil ? ` | Estado Civil: ${c.estado_civil}` : '';
        const sueldo = c.sueldo_deseado || c.expectativa_salarial ? `${c.sueldo_deseado || c.expectativa_salarial} MXN` : 'A convenir';
        const nivelAcad = c.nivel_academico || 'Educación Superior';
        const estatusAcad = c.estatus_estudios ? ` (${c.estatus_estudios})` : '';
        const instAcad = c.institucion_educativa || 'Institución educativa local';
        const periodoAcad = c.periodo_estudios ? ` | Periodo: ${c.periodo_estudios}` : '';
        const docAcad = c.documento_obtenido ? ` | Documento: ${c.documento_obtenido}` : '';
        const exp = c.experiencia_laboral || 'Sin experiencia previa registrada.';
        const habs = c.habilidades || 'Resolución de problemas, trabajo en equipo, puntualidad y responsabilidad laboral.';
        const conocs = c.conocimientos || 'Manejo de equipo de cómputo, paquetería de oficina e internet.';
        const resumen = c.descripcion_personal || 'Candidato comprometido con el desarrollo profesional y productivo en Ciudad Mante.';
        const disp = c.disponibilidad || 'Inmediata';
        const foto = c.foto_perfil_url || c.foto || 'logo.png';

        body.innerHTML = `
            <div style="border-bottom: 2px solid #0284c7; padding-bottom: 1.25rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                <div>
                    <span class="badge-role" style="font-size: 0.75rem; text-transform: uppercase;">Currículum Vitae Oficial</span>
                    <h2 style="color: #071324; margin: 0.35rem 0 0.2rem 0; font-size: 1.5rem;">${nombre}</h2>
                    <h4 style="color: #0284c7; margin: 0; font-weight: 600;">${puesto}</h4>
                    <div style="font-size: 0.88rem; color: #475569; margin-top: 0.5rem; line-height: 1.4;">
                        <div><strong>Dirección:</strong> ${domicilio}</div>
                        <div><strong>Teléfono:</strong> ${tel}${telSec} | <strong>Correo:</strong> ${email}</div>
                        <div><strong>Edad:</strong> ${edad}${edoCivil} | <strong>Disponibilidad:</strong> ${disp}</div>
                        <div><strong>Expectativa Salarial:</strong> <strong>${sueldo}</strong></div>
                    </div>
                </div>
                <img src="${foto}" alt="${nombre}" style="width: 85px; height: 85px; border-radius: 50%; object-fit: cover; border: 3px solid #0284c7; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); flex-shrink: 0;">
            </div>

            <div style="margin-bottom: 1.1rem;">
                <h4 style="color: #071324; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.35rem; margin-bottom: 0.4rem; font-size: 1rem;">Perfil y Objetivos Profesionales</h4>
                <p style="font-size: 0.92rem; color: #334155; line-height: 1.5; margin: 0;">${resumen}</p>
            </div>

            <div style="margin-bottom: 1.1rem;">
                <h4 style="color: #071324; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.35rem; margin-bottom: 0.4rem; font-size: 1rem;">Formación Académica</h4>
                <p style="font-size: 0.92rem; color: #334155; margin: 0;">
                    <strong>${nivelAcad}${estatusAcad}</strong> - ${instAcad}
                    <br><small style="color: #64748b;">${periodoAcad}${docAcad}</small>
                </p>
            </div>

            <div style="margin-bottom: 1.1rem;">
                <h4 style="color: #071324; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.35rem; margin-bottom: 0.4rem; font-size: 1rem;">Experiencia Laboral y Prácticas</h4>
                <p style="font-size: 0.92rem; color: #334155; line-height: 1.5; margin: 0; white-space: pre-line;">${exp}</p>
            </div>

            <div style="margin-bottom: 1.1rem;">
                <h4 style="color: #071324; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.35rem; margin-bottom: 0.4rem; font-size: 1rem;">Competencias, Habilidades y Conocimientos</h4>
                <p style="font-size: 0.92rem; color: #334155; margin: 0 0 0.35rem 0;"><strong>Habilidades y Destrezas:</strong> ${habs}</p>
                <p style="font-size: 0.92rem; color: #334155; margin: 0;"><strong>Conocimientos Técnicos:</strong> ${conocs}</p>
            </div>
        `;

        if (actions) {
            actions.innerHTML = '';
            const safeName = nombre.replace(/'/g, "\\'");
            if (mode === 'empresa') {
                actions.innerHTML = `
                    <button class="btn-table-action btn-table-approve" style="padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="OFIMANTE.closeCvModal(); OFIMANTE.respondApplication(${contextId}, 'aceptada', '${safeName}')">Aceptar Candidato</button>
                    <button class="btn-table-action btn-table-reject" style="padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="OFIMANTE.closeCvModal(); OFIMANTE.respondApplication(${contextId}, 'rechazada', '${safeName}')">Rechazar Candidato</button>
                    <button class="btn-table-action" style="background: #e2e8f0; color: #334155; padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="OFIMANTE.closeCvModal()">Cerrar</button>
                `;
            } else if (mode === 'admin') {
                const isApproved = c.estado_aprobacion === 'aprobado';
                actions.innerHTML = `
                    ${!isApproved ? `<button class="btn-table-action btn-table-approve" style="padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="OFIMANTE.closeCvModal(); OFIMANTE.adminModerateCandidate(${contextId}, 'aprobado')">Aprobar Perfil</button>` : ''}
                    <button class="btn-table-action btn-table-reject" style="padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="OFIMANTE.closeCvModal(); OFIMANTE.adminModerateCandidate(${contextId}, 'rechazado')">Rechazar Perfil</button>
                    <button class="btn-table-action" style="background: #e2e8f0; color: #334155; padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="OFIMANTE.closeCvModal()">Cerrar</button>
                `;
            } else {
                actions.innerHTML = `
                    <button class="btn-table-action btn-table-view" style="padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="window.print()">Imprimir / Guardar PDF</button>
                    <button class="btn-table-action" style="background: #e2e8f0; color: #334155; padding: 0.55rem 1.1rem; font-size: 0.9rem;" onclick="OFIMANTE.closeCvModal()">Cerrar</button>
                `;
            }
        }

        modal.style.display = 'flex';
    },

    closeCvModal: function () {
        const modal = document.getElementById('modalPreviewCv');
        if (modal) modal.style.display = 'none';
    },

    viewApplicationCv: function (solicitudId) {
        const app = (this.state.solicitudesEmpresa || []).find(s => s.id === solicitudId);
        if (!app) {
            alert('No se encontraron los datos de la solicitud.');
            return;
        }
        this.renderCvModal(app, 'empresa', solicitudId);
    },

    viewAdminCandidateCv: function (candId) {
        const cand = (this.state.candidatosAdmin || []).find(c => c.id === candId);
        if (!cand) {
            alert('No se encontraron los datos del candidato.');
            return;
        }
        this.renderCvModal(cand, 'admin', candId);
    },

    openMyCvPreviewModal: function () {
        const cand = {
            nombre_completo: this.getVal('cvNombreCompleto'),
            puesto_solicitado: this.getVal('cvPuestoDeseado'),
            domicilio_completo: this.getVal('cvDomicilio'),
            telefono_contacto: this.getVal('cvTelefono'),
            telefono_secundario: this.getVal('cvTelefonoSecundario'),
            email_contacto: this.getVal('cvEmailContacto'),
            descripcion_personal: this.getVal('cvDescripcion'),
            nivel_academico: this.getVal('cvNivelAcademico'),
            estatus_estudios: this.getVal('cvEstatusEstudios'),
            institucion_educativa: this.getVal('cvInstitucion'),
            periodo_estudios: this.getVal('cvPeriodoEstudios'),
            documento_obtenido: this.getVal('cvDocumentoObtenido'),
            experiencia_laboral: this.getVal('cvExperiencia'),
            habilidades: this.getVal('cvHabilidades'),
            conocimientos: this.getVal('cvConocimientos'),
            disponibilidad: this.getVal('cvDisponibilidad'),
            sueldo_deseado: this.getVal('cvSueldoDeseado'),
            foto_perfil_url: this.getVal('cvFotoUrl') || 'logo.png'
        };
        this.renderCvModal(cand, 'self', null);
    },

    // --------------------------------------------------------------------------
    // 10. PANTALLA 4: PANEL DE LA EMPRESA
    // --------------------------------------------------------------------------
    loadCompanyDashboard: async function () {
        const res = await this.apiCall('get_company_dashboard', null, 'GET');
        if (!res || !res.success) return;

        const emp = res.empresa;
        this.state.solicitudesEmpresa = res.solicitudes || [];

        if (emp) {
            this.setVal('empNombreComercial', emp.nombre_comercial);
            this.setVal('empRazonSocial', emp.razon_social);
            this.setVal('empRfc', emp.rfc);
            this.setVal('empResponsable', emp.nombre_responsable);
            this.setVal('empTelefono', emp.telefono);
            this.setVal('empEmail', emp.email_contacto);
            this.setVal('empDireccion', emp.direccion);
            this.setVal('empGiro', emp.giro_actividad);
            this.setVal('empDescripcion', emp.descripcion_empresa);

            this.renderCompanyApprovalState(emp.estado_aprobacion, emp.motivo_rechazo);
        } else {
            this.renderCompanyApprovalState('pendiente', '');
        }

        this.renderCompanyApplications();
    },

    renderCompanyApprovalState: function (estado, motivo) {
        const banner = document.getElementById('companyApprovalBanner');
        const badge = document.getElementById('companyStatusBadge');
        const panelSec = document.getElementById('companyMainOptionsSection');

        if (badge) {
            badge.className = `status-pill ${estado === 'aprobada' ? 'success' : (estado === 'rechazada' ? 'danger' : 'warning')}`;
            badge.innerText = `Empresa: ${estado.toUpperCase()}`;
        }

        if (banner) {
            banner.className = `alert-banner ${estado === 'aprobada' ? 'success' : (estado === 'rechazada' ? 'danger' : 'warning')}`;
            if (estado === 'pendiente') {
                banner.innerHTML = `<strong>Empresa en Revisión:</strong> Tus datos están en proceso de verificación por el Administrador. Una vez validada tu cuenta podrás publicar vacantes y revisar candidatos. (Tip: Puedes ingresar como Administrador para validar tu empresa).`;
            } else if (estado === 'aprobada') {
                banner.innerHTML = `<strong>Empresa Verificada:</strong> Tu negocio ha sido validado satisfactoriamente. Puedes publicar vacantes con tarifa de $100 MXN y administrar solicitudes recibidas.`;
            } else if (estado === 'rechazada') {
                banner.innerHTML = `<strong>Solicitud Rechazada:</strong> Motivo: ${motivo || 'Verificación no exitosa'}. Por favor actualiza tus datos.`;
            }
        }

        if (panelSec) {
            panelSec.style.display = (estado === 'aprobada') ? 'block' : 'none';
        }
    },

    handleSaveCompanyProfile: async function (e) {
        e.preventDefault();
        const payload = {
            nombre_comercial: this.getVal('empNombreComercial'),
            razon_social: this.getVal('empRazonSocial'),
            rfc: this.getVal('empRfc'),
            nombre_responsable: this.getVal('empResponsable'),
            telefono: this.getVal('empTelefono'),
            email_contacto: this.getVal('empEmail'),
            direccion: this.getVal('empDireccion'),
            giro_actividad: this.getVal('empGiro'),
            descripcion_empresa: this.getVal('empDescripcion'),
            logotipo_url: 'logo.png'
        };

        const res = await this.apiCall('update_company_profile', payload);
        if (res && res.success) {
            alert(res.message);
            this.loadCompanyDashboard();
        } else {
            alert(res?.error || "Error al guardar perfil empresarial.");
        }
    },

    handlePostJobWithFee: async function (e) {
        e.preventDefault();

        const chk = document.getElementById('chkConfirmPay');
        if (chk && !chk.checked) {
            alert('Debes confirmar que autorizas el cobro de la tarifa de publicación ($100.00 MXN).');
            return;
        }

        const titular = this.getVal('cardTitular');
        const numTarjeta = this.getVal('cardNumero');
        const exp = this.getVal('cardExpiracion');
        const cvv = this.getVal('cardCvv');
        const tipo = this.getVal('cardTipo') || 'Tarjeta de Débito';
        const banco = this.getVal('cardBanco') || 'BBVA México';

        if (!titular) {
            alert('Por favor introduce el nombre completo del titular de la tarjeta.');
            return;
        }
        const rawDigits = numTarjeta.replace(/\D/g, '');
        if (rawDigits.length !== 16) {
            alert('Por favor introduce un número de tarjeta válido de 16 dígitos.');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(exp)) {
            alert('Por favor introduce la fecha de vencimiento en formato MM/AA.');
            return;
        }
        if (!cvv || cvv.length < 3) {
            alert('Por favor introduce un código de seguridad CVV válido (3 o 4 dígitos).');
            return;
        }

        const payload = {
            puesto: this.getVal('vacPuesto'),
            descripcion: this.getVal('vacDescripcion'),
            vacantes_disponibles: parseInt(this.getVal('vacDisponibles')) || 1,
            requisitos: this.getVal('vacRequisitos'),
            experiencia_requerida: this.getVal('vacExperiencia'),
            escolaridad_minima: this.getVal('vacEscolaridad'),
            horario: this.getVal('vacHorario'),
            tipo_contratacion: this.getVal('vacContratacion'),
            sueldo_ofrecido: this.getVal('vacSueldo'),
            prestaciones: this.getVal('vacPrestaciones'),
            beneficios: this.getVal('vacBeneficios'),
            categoria: this.getVal('vacCategoria'),
            ubicacion: this.getVal('vacUbicacion'),
            fecha_cierre: this.getVal('vacFechaCierre'),
            // Datos de la tarjeta bancaria
            tarjeta_titular: titular,
            tarjeta_numero: numTarjeta,
            tarjeta_expiracion: exp,
            tarjeta_cvv: cvv,
            tarjeta_tipo: tipo,
            tarjeta_banco: banco
        };

        const res = await this.apiCall('create_job', payload);
        if (res && res.success) {
            alert(res.message);
            document.getElementById('formPostJob').reset();
            this.loadCompanyDashboard();
        } else {
            alert(res?.error || "No se pudo publicar la vacante.");
        }
    },

    renderCompanyApplications: function () {
        const tbody = document.getElementById('companyApplicantsTableBody');
        const countSpan = document.getElementById('companyApplicantsCount');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (countSpan) countSpan.innerText = this.state.solicitudesEmpresa.length;

        if (this.state.solicitudesEmpresa.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:#64748b;">No hay solicitudes de candidatos recibidas aún.</td></tr>`;
            return;
        }

        this.state.solicitudesEmpresa.forEach(a => {
            const tr = document.createElement('tr');
            const stClass = a.estado === 'aceptada' ? 'success' : (a.estado === 'rechazada' ? 'danger' : 'warning');
            const safeName = (a.nombre_completo || '').replace(/'/g, "\\'");
            tr.innerHTML = `
                <td><strong>${a.fecha_postulacion}</strong></td>
                <td>
                    <strong>${a.nombre_completo}</strong><br>
                    <small>Tel: ${a.telefono} | Correo: ${a.email_contacto}</small>
                </td>
                <td><strong>${a.puesto}</strong></td>
                <td>${a.nivel_academico || 'Por definir'}</td>
                <td><span class="status-pill ${stClass}">${a.estado.toUpperCase()}</span></td>
                <td>
                    <button class="btn-table-action btn-table-view" onclick="OFIMANTE.viewApplicationCv(${a.id})">Ver Currículum</button>
                </td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-table-action btn-table-approve" onclick="OFIMANTE.respondApplication(${a.id}, 'aceptada', '${safeName}')">Aceptar</button>
                        <button class="btn-table-action btn-table-reject" onclick="OFIMANTE.respondApplication(${a.id}, 'rechazada', '${safeName}')">Rechazar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    respondApplication: async function (solId, decision, candName) {
        const nota = prompt(`Ingresa un mensaje o fecha de entrevista para ${candName} (Decisión: ${decision.toUpperCase()}):`, decision === 'aceptada' ? 'Te esperamos para entrevista este jueves 10:00 am.' : 'Agradecemos tu postulación, hemos seleccionado otro perfil.');
        if (nota === null) return;

        const res = await this.apiCall('respond_application', {
            solicitud_id: solId,
            decision: decision,
            respuesta: nota
        });

        if (res && res.success) {
            alert(res.message);
            this.loadCompanyDashboard();
        } else {
            alert(res?.error || "Error al actualizar la solicitud.");
        }
    },

    // --------------------------------------------------------------------------
    // 11. PANTALLA 5: PANEL DEL ADMINISTRADOR
    // --------------------------------------------------------------------------
    loadAdminDashboard: async function () {
        const res = await this.apiCall('get_admin_dashboard', null, 'GET');
        if (!res || !res.success) return;

        const k = res.kpis || {};
        const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

        setTxt('kpiTotalCandidatos', k.candidatos || 0);
        setTxt('kpiTotalEmpresas', k.empresas || 0);
        setTxt('kpiTotalVacantes', k.vacantes || 0);
        setTxt('kpiTotalPendientes', (k.candidatos_pendientes || 0) + (k.empresas_pendientes || 0) + (k.vacantes_pendientes || 0) + (k.cobros_pendientes || 0));
        setTxt('kpiTotalRecaudacion', `${parseFloat(k.recaudacion || 0).toFixed(2)} MXN`);

        this.state.candidatosAdmin = res.candidatos || [];
        this.state.empresasAdmin = res.empresas || [];
        this.state.vacantesAdmin = res.vacantes || [];
        this.state.pagosAdmin = res.pagos || [];
        this.state.historialAdmin = res.historial || [];

        this.renderAdminCandidates();
        this.renderAdminCompanies();
        this.renderAdminJobs();
        this.renderAdminPayments();
        this.renderAdminHistory();
    },

    renderAdminCandidates: function () {
        const tbody = document.getElementById('adminCandidatesListBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (this.state.candidatosAdmin.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:#64748b;">No hay candidatos registrados en la plataforma.</td></tr>`;
            return;
        }

        this.state.candidatosAdmin.forEach(c => {
            const tr = document.createElement('tr');
            const isAppr = c.estado_aprobacion === 'aprobado';
            tr.innerHTML = `
                <td><strong>${c.nombre_completo}</strong></td>
                <td>Tel: ${c.telefono}<br><small>${c.email_contacto}</small></td>
                <td>${c.nivel_academico || 'N/A'}</td>
                <td>
                    <button class="btn-table-action btn-table-view" onclick="OFIMANTE.viewAdminCandidateCv(${c.id})">Ver Currículum</button>
                </td>
                <td><span class="status-pill ${isAppr ? 'success' : 'warning'}">${c.estado_aprobacion.toUpperCase()}</span></td>
                <td>
                    <div class="action-btn-group">
                        ${!isAppr ? `<button class="btn-table-action btn-table-approve" onclick="OFIMANTE.adminModerateCandidate(${c.id}, 'aprobado')">Aprobar</button>` : ''}
                        <button class="btn-table-action btn-table-reject" onclick="OFIMANTE.adminModerateCandidate(${c.id}, 'rechazado')">Rechazar</button>
                        <button class="btn-table-action btn-table-delete" onclick="OFIMANTE.adminModerateCandidate(${c.id}, 'eliminado')">Eliminar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderAdminCompanies: function () {
        const tbody = document.getElementById('adminCompaniesListBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        this.state.empresasAdmin.forEach(e => {
            const tr = document.createElement('tr');
            const isAppr = e.estado_aprobacion === 'aprobada';
            tr.innerHTML = `
                <td><strong>${e.nombre_comercial}</strong><br><small>${e.razon_social || ''}</small></td>
                <td><code>${e.rfc || 'Sin RFC'}</code></td>
                <td>${e.giro_actividad}</td>
                <td><span class="status-pill ${isAppr ? 'success' : 'warning'}">${e.estado_aprobacion.toUpperCase()}</span></td>
                <td>
                    <div class="action-btn-group">
                        ${!isAppr ? `<button class="btn-table-action btn-table-approve" onclick="OFIMANTE.adminModerateCompany(${e.id}, 'aprobada')">Aprobar</button>` : ''}
                        <button class="btn-table-action btn-table-reject" onclick="OFIMANTE.adminModerateCompany(${e.id}, 'rechazada')">Rechazar</button>
                        <button class="btn-table-action btn-table-delete" onclick="OFIMANTE.adminModerateCompany(${e.id}, 'eliminada')">Eliminar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderAdminJobs: function () {
        const tbody = document.getElementById('adminJobsListBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        this.state.vacantesAdmin.forEach(j => {
            const tr = document.createElement('tr');
            const isAppr = j.estado === 'aprobada';
            tr.innerHTML = `
                <td><strong>${j.puesto}</strong></td>
                <td>${j.nombre_comercial}</td>
                <td>${j.sueldo_ofrecido}</td>
                <td><span class="status-pill success">$100 MXN Cubierta</span></td>
                <td><span class="status-pill ${isAppr ? 'success' : 'warning'}">${j.estado.toUpperCase()}</span></td>
                <td>
                    <div class="action-btn-group">
                        ${!isAppr ? `<button class="btn-table-action btn-table-approve" onclick="OFIMANTE.adminModerateJob(${j.id}, 'aprobada')">Aprobar</button>` : ''}
                        <button class="btn-table-action btn-table-edit" onclick="OFIMANTE.openAdminEditJob(${j.id})">Modificar</button>
                        <button class="btn-table-action btn-table-delete" onclick="OFIMANTE.adminModerateJob(${j.id}, 'delete')">Eliminar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderAdminPayments: function () {
        const tbody = document.getElementById('adminPaymentsListBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!this.state.pagosAdmin || this.state.pagosAdmin.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:#64748b;">No hay registros de cobros ni pagos disponibles.</td></tr>`;
            return;
        }

        this.state.pagosAdmin.forEach(p => {
            const tr = document.createElement('tr');
            const isCobrado = p.estado === 'completado';
            const stClass = isCobrado ? 'success' : (p.estado === 'pendiente_cobro' ? 'warning' : 'info');
            const stLabel = isCobrado ? 'COBRADO' : (p.estado === 'pendiente_cobro' ? 'PENDIENTE DE COBRO' : p.estado.toUpperCase());

            tr.innerHTML = `
                <td>
                    <strong>#${p.id}</strong><br>
                    <small style="color:#64748b;">Registro: ${p.fecha_pago || 'Reciente'}</small>
                </td>
                <td><strong>${p.empresa_nombre || 'Empresa Local'}</strong></td>
                <td><strong>${p.vacante_puesto || 'Publicación de Vacante'}</strong></td>
                <td><strong style="color:var(--mint-success);">${parseFloat(p.monto || 100).toFixed(2)} MXN</strong></td>
                <td>
                    <div style="font-size:0.85rem; line-height:1.4;">
                        <strong>${p.tarjeta_tipo || 'Tarjeta'} (${p.tarjeta_banco || 'Banco'})</strong><br>
                        Titular: ${p.tarjeta_titular || 'N/D'}<br>
                        Número: <code>${p.tarjeta_numero || '**** **** **** ****'}</code><br>
                        Vence: ${p.tarjeta_expiracion || 'MM/AA'}
                    </div>
                </td>
                <td>
                    <span class="status-pill ${stClass}">${stLabel}</span>
                    ${isCobrado && p.fecha_cobro ? `<br><small style="color:#059669;">Cobro realizado: ${p.fecha_cobro}</small>` : ''}
                </td>
                <td>
                    ${!isCobrado ? `
                        <button class="btn-table-action btn-table-charge" onclick="OFIMANTE.adminProcessPayment(${p.id})">Cobrar $100.00 MXN</button>
                    ` : `
                        <span style="color:#059669; font-weight:600; font-size:0.85rem;">Tarifa Cobrada</span>
                    `}
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    adminProcessPayment: async function (pagoId) {
        if (!confirm('¿Deseas procesar y confirmar el cobro de la tarifa de $100.00 MXN a la tarjeta registrada de la empresa?')) return;

        const res = await this.apiCall('admin_process_charge', { pago_id: pagoId });
        if (res && res.success) {
            alert(res.message);
            this.loadAdminDashboard();
        } else {
            alert(res?.error || 'Error al procesar el cobro de la tarifa.');
        }
    },

    renderAdminHistory: function () {
        const tbody = document.getElementById('adminHistoryTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        this.state.historialAdmin.forEach(h => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${h.creado_en}</td>
                <td><strong>${h.accion}</strong></td>
                <td>${h.descripcion}</td>
                <td><code>${h.direccion_ip}</code></td>
            `;
            tbody.appendChild(tr);
        });
    },

    adminModerateCandidate: async function (candId, estado) {
        let motivo = '';
        if (estado === 'rechazado') {
            motivo = prompt("Ingresa el motivo del rechazo del perfil:", "Falta comprobante de escolaridad o datos incompletos.");
            if (motivo === null) return;
        } else if (estado === 'eliminado') {
            if (!confirm("¿Seguro que deseas eliminar definitivamente este candidato?")) return;
        }

        const res = await this.apiCall('admin_moderate_candidate', { candidato_id: candId, estado, motivo_rechazo: motivo });
        if (res && res.success) {
            alert(res.message);
            this.loadAdminDashboard();
        }
    },

    adminModerateCompany: async function (empId, estado) {
        let motivo = '';
        if (estado === 'rechazada') {
            motivo = prompt("Ingresa el motivo del rechazo de la empresa:", "RFC no coincide o datos no verificables.");
            if (motivo === null) return;
        } else if (estado === 'eliminada') {
            if (!confirm("¿Seguro que deseas eliminar definitivamente esta empresa?")) return;
        }

        const res = await this.apiCall('admin_moderate_company', { empresa_id: empId, estado, motivo_rechazo: motivo });
        if (res && res.success) {
            alert(res.message);
            this.loadAdminDashboard();
        }
    },

    adminModerateJob: async function (jobId, actionOrState) {
        if (actionOrState === 'delete') {
            if (!confirm("¿Eliminar definitivamente esta vacante?")) return;
            const res = await this.apiCall('admin_moderate_job', { vacante_id: jobId, action_type: 'delete' });
            if (res && res.success) {
                alert(res.message);
                this.loadAdminDashboard();
            }
        } else {
            const res = await this.apiCall('admin_moderate_job', { vacante_id: jobId, estado: actionOrState });
            if (res && res.success) {
                alert(res.message);
                this.loadAdminDashboard();
            }
        }
    },

    openAdminEditJob: function (jobId) {
        const j = this.state.vacantesAdmin.find(item => item.id === jobId);
        if (!j) return;

        this.setVal('editJobId', j.id);
        this.setVal('mEditPuesto', j.puesto);
        this.setVal('mEditSueldo', j.sueldo_ofrecido);
        this.setVal('mEditUbicacion', j.ubicacion);
        this.setVal('mEditBeneficios', j.beneficios || j.prestaciones);
        this.setVal('mEditDescripcion', j.descripcion);

        document.getElementById('modalEditJob').style.display = 'flex';
    },

    handleSaveAdminEditedJob: async function (e) {
        e.preventDefault();
        const jobId = parseInt(this.getVal('editJobId'));
        const payload = {
            vacante_id: jobId,
            action_type: 'edit',
            puesto: this.getVal('mEditPuesto'),
            sueldo_ofrecido: this.getVal('mEditSueldo'),
            ubicacion: this.getVal('mEditUbicacion'),
            beneficios: this.getVal('mEditBeneficios'),
            descripcion: this.getVal('mEditDescripcion')
        };

        const res = await this.apiCall('admin_moderate_job', payload);
        if (res && res.success) {
            alert(res.message);
            document.getElementById('modalEditJob').style.display = 'none';
            this.loadAdminDashboard();
        }
    },

    // --------------------------------------------------------------------------
    // 12. MODAL DE DETALLE DE VACANTE
    // --------------------------------------------------------------------------
    openJobDetailModal: function (jobId) {
        const j = this.state.vacantes.find(item => item.id === jobId);
        if (!j) return;

        const body = document.getElementById('jobDetailModalBody');
        const modal = document.getElementById('modalJobDetail');
        if (!body || !modal) return;

        body.innerHTML = `
            <div style="border-bottom:1px solid #e2e8f0; padding-bottom:1rem; margin-bottom:1rem;">
                <h2 style="color:#071324;">${j.puesto}</h2>
                <div style="color:#0284c7; font-weight:700; font-size:1.05rem;">Empresa: ${j.nombre_comercial || 'Empresa de El Mante'}</div>
                <div style="font-size:0.9rem; color:#475569; margin-top:0.35rem;">
                    ${j.ubicacion} | Horario: ${j.horario || 'Tiempo Completo'} | Categoría: ${j.categoria || 'General'}
                </div>
            </div>
            <div class="job-salary-highlight" style="font-size:1.2rem;">
                Sueldo Mensual: ${j.sueldo_ofrecido}
            </div>
            <div class="job-benefits-box">
                <strong>Beneficios y Prestaciones:</strong><br>
                ${j.beneficios || j.prestaciones || 'Prestaciones de ley'}
            </div>
            <div style="margin-bottom:1rem;">
                <h4 style="color:#071324;">Descripción y Requisitos del Puesto:</h4>
                <p style="color:#334155; font-size:0.95rem; margin-top:0.4rem; white-space:pre-line;">${j.descripcion}</p>
                <p style="color:#334155; font-size:0.95rem; margin-top:0.4rem;"><strong>Requisitos adicionales:</strong> ${j.requisitos || 'No especificados'}</p>
            </div>
            <div style="border-top:1px solid #e2e8f0; padding-top:0.75rem; font-size:0.85rem; color:#64748b;">
                Fecha límite de postulación: ${j.fecha_cierre || 'Hasta agotar vacantes'}
            </div>
        `;

        const btnApplyModal = document.getElementById('btnApplyFromModal');
        if (btnApplyModal) {
            btnApplyModal.onclick = () => {
                modal.style.display = 'none';
                OFIMANTE.applyToJob(j.id);
            };
        }
        modal.style.display = 'flex';
    },

    // --------------------------------------------------------------------------
    // 13. SISTEMA DE NOTIFICACIONES
    // --------------------------------------------------------------------------
    toggleNotifDropdown: function () {
        const dropdown = document.getElementById('notifDropdown');
        if (!dropdown) return;

        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            this.renderNotifList();
            this.apiCall('mark_notification_read', { id: 0 });
            this.state.unreadNotifs = 0;
            this.renderNotifCounter();
        }
    },

    renderNotifList: function () {
        const list = document.getElementById('notifDropdownList');
        if (!list) return;
        list.innerHTML = '';

        if (!this.state.notificaciones || this.state.notificaciones.length === 0) {
            list.innerHTML = `<p style="padding:1rem; text-align:center; color:#94a3b8; font-size:0.85rem;">No tienes notificaciones pendientes.</p>`;
            return;
        }

        this.state.notificaciones.forEach(n => {
            const item = document.createElement('div');
            item.style.padding = '0.75rem 1rem';
            item.style.borderBottom = '1px solid #1e3a63';
            item.style.fontSize = '0.85rem';
            item.innerHTML = `
                <div style="font-weight:700; color:#38bdf8;">${n.titulo}</div>
                <div style="color:#cbd5e1; margin-top:0.2rem;">${n.mensaje}</div>
                <div style="color:#64748b; font-size:0.72rem; margin-top:0.2rem;">${n.creado_en}</div>
            `;
            list.appendChild(item);
        });
    },

    // --------------------------------------------------------------------------
    // 14. UTILIDADES Y LISTENERS
    // --------------------------------------------------------------------------
    getVal: function (id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    },

    setVal: function (id, val) {
        const el = document.getElementById(id);
        if (el && val !== undefined && val !== null) el.value = val;
    },

    setupEventListeners: function () {
        // Acordeón FAQ
        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', () => {
                const item = q.parentElement;
                item.classList.toggle('open');
            });
        });
    }
};

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    OFIMANTE.init();
});

// Exponer en window para llamadas directas
window.OFIMANTE = OFIMANTE;
window.goToScreen = (s, n) => OFIMANTE.goToScreen(s, n);
window.selectAuthRole = (r) => OFIMANTE.selectRegisterRole(r);
window.switchAuthTab = (t) => OFIMANTE.switchAuthTab(t);
window.quickLoginAs = (r) => OFIMANTE.quickDemoLogin(r);
window.loginWithGoogle = () => OFIMANTE.loginWithGoogleDemo();
window.logoutSession = () => OFIMANTE.logout();
