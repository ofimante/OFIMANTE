// ==============================================================================
// OFIMANTE - SERVIDOR BACKEND Y API REST (Node.js)
// Ciudad Mante, Tamaulipas - Plataforma de Empleo y Agenda Virtual
// Creado de forma didáctica para estudiantes de nivel superior
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// ------------------------------------------------------------------------------
// DATOS INICIALES SEMILLA (SEED DATA) ENFOCADOS EN CIUDAD MANTE, TAMAULIPAS
// ------------------------------------------------------------------------------
const initialData = {
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
            requisitos: "Conocimientos en HTML, CSS, JavaScript y bases de datos. Egresado o estudiante de últimos semestres de Ingeniería en Sistemas o Telemática (UAMM o IT Mante). Proactivo y con ganas de aprender.",
            escolaridadMinima: "Licenciatura / Ingeniería",
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
            requisitos: "Manejo de equipo de cómputo, paquetería Office y atención a pacientes. Excelente presentación, empatía y organización para expedientes clínicos.",
            escolaridadMinima: "Técnico Superior / Licenciatura Trunca",
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
            requisitos: "Experiencia en configuración de redes LAN, cableado estructurado, respaldo de servidores y soporte a básculas digitales de recepción cañera.",
            escolaridadMinima: "Ingeniería en Sistemas / Informática / Electrónica",
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
            requisitos: "Manejo de Canva, Photoshop o Illustrator. Creación de contenido para redes sociales de comercios locales en El Mante. Horarios adaptables a clases universitarias.",
            escolaridadMinima: "Licenciatura en Diseño / Comunicación / Mercadotecnia",
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
            funcionesLogros: "Mantenimiento preventivo a 20 equipos de cómputo, desarrollo de página de catálogo web local e inventario digital.",
            contactoJefe: "Ing. Roberto M. - Cel: 831-110-5544",
            // 6. Conocimientos y habilidades
            idiomas: "Español (Nativo), Inglés (Intermedio Técnico B2)",
            softwareHerramientas: "HTML5, CSS3, JavaScript, Node.js, SQL Server, Git, Mantenimiento de Hardware.",
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
            tamanoEstructura: "Mediana (18 empleados: 10 desarrolladores, 4 soporte, 4 administración)",
            datosBancarios: "BBVA Bancomer - Cuenta CLABE: 012813001234567890 (Facturación e ingresos)",
            datosTecnograficos: "Linux Ubuntu Server, PostgreSQL, Docker, AWS, Node.js, Windows 11 Pro, MikroTik RouterBOARD",
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
            tamanoEstructura: "Mediana (45 colaboradores entre médicos, enfermeras y administrativos)",
            datosBancarios: "Banorte - Cuenta CLABE: 072813009876543210",
            datosTecnograficos: "Expediente Clínico Electrónico, Sistema ERP MedicoPro, Windows 10/11, Red Fibra Óptica 500Mbps",
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
            modalidad: "Presencial (Oficina Mante)",
            lugarEnlace: "Av. Manuel Cavazos Lerma #205, Col. Moderna",
            notas: "Llevar laptop y muestra de proyectos escolares en JavaScript y repositorio de GitHub.",
            estado: "Confirmada"
        },
        {
            id: 2,
            titulo: "Sesión de Asesoría de Programación y Portafolio Digital",
            tipo: "Sesión de Programación Estudiantil",
            candidatoId: 1,
            candidatoNombre: "Carlos Eduardo Garza Morales",
            empresaId: 1,
            empresaNombre: "UAT UAMM / Club de Programación",
            fecha: "2026-11-14",
            hora: "16:00",
            modalidad: "Virtual (Google Meet)",
            lugarEnlace: "https://meet.google.com/ofi-mante-demo",
            notas: "Revisión de arquitectura web y optimización de código para estudiantes graduados.",
            estado: "Programada"
        }
    ]
};

// ------------------------------------------------------------------------------
// MANEJO DE BASE DE DATOS PERSISTENTE EN ARCHIVO JSON
// ------------------------------------------------------------------------------
function loadDatabase() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
            console.log("-> [OFIMANTE] Base de datos creada exitosamente con datos iniciales de Cd. Mante.");
            return initialData;
        }
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        console.error("Error al leer base de datos, usando datos en memoria:", err);
        return initialData;
    }
}

function saveDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (err) {
        console.error("Error al guardar base de datos:", err);
        return false;
    }
}

let db = loadDatabase();

// ------------------------------------------------------------------------------
// SERVIDOR HTTP CON API REST Y SERVICIO DE ARCHIVOS ESTÁTICOS
// ------------------------------------------------------------------------------
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Configurar encabezados CORS para peticiones locales fluidas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Soporte para endpoints PHP y REST
    if (pathname === '/api.php') {
        const action = parsedUrl.searchParams.get('action');
        if (action === 'get_all_data') {
            return sendJSON(res, 200, db);
        }
    }

    // --------------------------------------------------------------------------
    // RUTAS DE LA API REST (/api/...)
    // --------------------------------------------------------------------------
    if (pathname.startsWith('/api/')) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            let payload = {};
            if (body) {
                try { payload = JSON.parse(body); } catch (e) { /* cuerpo no json */ }
            }

            // 1. Estadísticas para Dashboard Admin
            if (pathname === '/api/stats' && req.method === 'GET') {
                const stats = {
                    totalJobs: db.jobs.length,
                    activeJobs: db.jobs.filter(j => j.estado === 'aprobada').length,
                    pendingJobs: db.jobs.filter(j => j.estado === 'pendiente').length,
                    totalCandidates: db.candidates.length,
                    activeCandidates: db.candidates.filter(c => c.estado !== 'baneado').length,
                    totalCompanies: db.companies.length,
                    activeCompanies: db.companies.filter(c => c.estado !== 'baneado').length,
                    totalAgenda: db.agenda.length
                };
                return sendJSON(res, 200, stats);
            }

            // 2. Base de datos completa (para sincronización con cliente)
            if (pathname === '/api/sync' && req.method === 'GET') {
                return sendJSON(res, 200, db);
            }

            // 3. VACANTES (/api/jobs)
            if (pathname === '/api/jobs') {
                if (req.method === 'GET') {
                    return sendJSON(res, 200, db.jobs);
                }
                if (req.method === 'POST') {
                    const newJob = {
                        id: db.jobs.length > 0 ? Math.max(...db.jobs.map(j => j.id)) + 1 : 1,
                        puesto: payload.puesto || 'Puesto Sin Definir',
                        empresa: payload.empresa || 'Empresa Local',
                        giro: payload.giro || 'General',
                        rfcEmpresa: payload.rfcEmpresa || '',
                        ubicacion: payload.ubicacion || 'Zona Centro',
                        sueldo: payload.sueldo || 'A convenir',
                        sueldoNum: Number(payload.sueldoNum) || 0,
                        modalidad: payload.modalidad || 'Presencial',
                        tipo: payload.tipo || 'Tiempo Completo',
                        requisitos: payload.requisitos || '',
                        escolaridadMinima: payload.escolaridadMinima || 'Preparatoria / Universidad',
                        contacto: payload.contacto || '',
                        estado: payload.estado || 'pendiente', // Por defecto pendiente de aprobación de admin
                        fechaPublicacion: new Date().toISOString().split('T')[0],
                        postulados: []
                    };
                    db.jobs.push(newJob);
                    saveDatabase(db);
                    return sendJSON(res, 201, { success: true, message: "Vacante registrada con éxito", job: newJob });
                }
            }

            // Operaciones sobre una vacante específica (/api/jobs/:id)
            const jobMatch = pathname.match(/^\/api\/jobs\/(\d+)(\/.*)?$/);
            if (jobMatch) {
                const jobId = parseInt(jobMatch[1]);
                const subAction = jobMatch[2];
                const jobIndex = db.jobs.findIndex(j => j.id === jobId);

                if (jobIndex === -1) {
                    return sendJSON(res, 404, { error: "Vacante no encontrada" });
                }

                // POSTULARSE a una vacante: /api/jobs/:id/apply
                if (subAction === '/apply' && req.method === 'POST') {
                    const candidateId = Number(payload.candidateId) || 1;
                    if (!db.jobs[jobIndex].postulados) db.jobs[jobIndex].postulados = [];
                    if (!db.jobs[jobIndex].postulados.includes(candidateId)) {
                        db.jobs[jobIndex].postulados.push(candidateId);
                        saveDatabase(db);
                    }
                    return sendJSON(res, 200, { success: true, message: "Postulación exitosa", job: db.jobs[jobIndex] });
                }

                // APROBAR / CAMBIAR ESTADO: /api/jobs/:id/status
                if (subAction === '/status' && req.method === 'PATCH') {
                    db.jobs[jobIndex].estado = payload.estado || 'aprobada';
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, job: db.jobs[jobIndex] });
                }

                // EDITAR VACANTE (PUT)
                if (req.method === 'PUT') {
                    db.jobs[jobIndex] = { ...db.jobs[jobIndex], ...payload, id: jobId };
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, message: "Vacante actualizada", job: db.jobs[jobIndex] });
                }

                // ELIMINAR VACANTE (DELETE)
                if (req.method === 'DELETE') {
                    const deleted = db.jobs.splice(jobIndex, 1);
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, message: "Vacante eliminada", deleted: deleted[0] });
                }
            }

            // 4. CANDIDATOS (/api/candidates)
            if (pathname === '/api/candidates') {
                if (req.method === 'GET') {
                    return sendJSON(res, 200, db.candidates);
                }
                if (req.method === 'POST') {
                    const newCand = {
                        id: db.candidates.length > 0 ? Math.max(...db.candidates.map(c => c.id)) + 1 : 1,
                        ...payload,
                        estado: 'activo',
                        rol: 'candidato'
                    };
                    db.candidates.push(newCand);
                    saveDatabase(db);
                    return sendJSON(res, 201, { success: true, candidate: newCand });
                }
            }

            // Operaciones sobre candidato (/api/candidates/:id)
            const candMatch = pathname.match(/^\/api\/candidates\/(\d+)(\/.*)?$/);
            if (candMatch) {
                const candId = parseInt(candMatch[1]);
                const subAction = candMatch[2];
                const candIndex = db.candidates.findIndex(c => c.id === candId);

                if (candIndex === -1) {
                    return sendJSON(res, 404, { error: "Candidato no encontrado" });
                }

                if (subAction === '/ban' && req.method === 'PATCH') {
                    db.candidates[candIndex].estado = db.candidates[candIndex].estado === 'baneado' ? 'activo' : 'baneado';
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, candidate: db.candidates[candIndex] });
                }

                if (req.method === 'PUT') {
                    db.candidates[candIndex] = { ...db.candidates[candIndex], ...payload, id: candId };
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, candidate: db.candidates[candIndex] });
                }

                if (req.method === 'DELETE') {
                    const deleted = db.candidates.splice(candIndex, 1);
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, deleted: deleted[0] });
                }
            }

            // 5. EMPRESAS (/api/companies)
            if (pathname === '/api/companies') {
                if (req.method === 'GET') {
                    return sendJSON(res, 200, db.companies);
                }
                if (req.method === 'POST') {
                    const newComp = {
                        id: db.companies.length > 0 ? Math.max(...db.companies.map(c => c.id)) + 1 : 1,
                        ...payload,
                        estado: 'activo',
                        rol: 'empresa'
                    };
                    db.companies.push(newComp);
                    saveDatabase(db);
                    return sendJSON(res, 201, { success: true, company: newComp });
                }
            }

            // Operaciones sobre empresa (/api/companies/:id)
            const compMatch = pathname.match(/^\/api\/companies\/(\d+)(\/.*)?$/);
            if (compMatch) {
                const compId = parseInt(compMatch[1]);
                const subAction = compMatch[2];
                const compIndex = db.companies.findIndex(c => c.id === compId);

                if (compIndex === -1) {
                    return sendJSON(res, 404, { error: "Empresa no encontrada" });
                }

                if (subAction === '/ban' && req.method === 'PATCH') {
                    db.companies[compIndex].estado = db.companies[compIndex].estado === 'baneado' ? 'activo' : 'baneado';
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, company: db.companies[compIndex] });
                }

                if (req.method === 'PUT') {
                    db.companies[compIndex] = { ...db.companies[compIndex], ...payload, id: compId };
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, company: db.companies[compIndex] });
                }

                if (req.method === 'DELETE') {
                    const deleted = db.companies.splice(compIndex, 1);
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, deleted: deleted[0] });
                }
            }

            // 6. AGENDA VIRTUAL INTERACTIVA (/api/agenda)
            if (pathname === '/api/agenda') {
                if (req.method === 'GET') {
                    return sendJSON(res, 200, db.agenda);
                }
                if (req.method === 'POST') {
                    const newEvent = {
                        id: db.agenda.length > 0 ? Math.max(...db.agenda.map(a => a.id)) + 1 : 1,
                        titulo: payload.titulo || 'Cita / Entrevista',
                        tipo: payload.tipo || 'Entrevista Laboral',
                        candidatoId: payload.candidatoId || null,
                        candidatoNombre: payload.candidatoNombre || 'Estudiante / Candidato',
                        empresaId: payload.empresaId || null,
                        empresaNombre: payload.empresaNombre || 'Empresa Solicitante',
                        fecha: payload.fecha || new Date().toISOString().split('T')[0],
                        hora: payload.hora || '12:00',
                        modalidad: payload.modalidad || 'Presencial',
                        lugarEnlace: payload.lugarEnlace || 'Cd. Mante, Tam.',
                        notas: payload.notas || '',
                        estado: payload.estado || 'Programada'
                    };
                    db.agenda.push(newEvent);
                    saveDatabase(db);
                    return sendJSON(res, 201, { success: true, event: newEvent });
                }
            }

            // Operaciones sobre un evento de agenda (/api/agenda/:id)
            const agendaMatch = pathname.match(/^\/api\/agenda\/(\d+)(\/.*)?$/);
            if (agendaMatch) {
                const agendaId = parseInt(agendaMatch[1]);
                const subAction = agendaMatch[2];
                const agendaIndex = db.agenda.findIndex(a => a.id === agendaId);

                if (agendaIndex === -1) {
                    return sendJSON(res, 404, { error: "Cita de agenda no encontrada" });
                }

                if (subAction === '/status' && req.method === 'PATCH') {
                    db.agenda[agendaIndex].estado = payload.estado || 'Confirmada';
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, event: db.agenda[agendaIndex] });
                }

                if (req.method === 'DELETE') {
                    const deleted = db.agenda.splice(agendaIndex, 1);
                    saveDatabase(db);
                    return sendJSON(res, 200, { success: true, deleted: deleted[0] });
                }
            }

            // Si ninguna ruta API coincide
            return sendJSON(res, 404, { error: "Ruta API no encontrada" });
        });
        return;
    }

    // --------------------------------------------------------------------------
    // SERVIR ARCHIVOS ESTÁTICOS (HTML, CSS, JS, IMÁGENES)
    // --------------------------------------------------------------------------
    let safePath = pathname === '/' ? '/index.html' : pathname;
    let filePath = path.join(__dirname, safePath);

    // Protección básica contra Path Traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("Acceso denegado");
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Reintentar sirviendo index.html si es SPA
            filePath = path.join(__dirname, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end("Archivo no encontrado en OFIMANTE");
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
});

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

server.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`  🌾 OFIMANTE - Plataforma de Empleo & Agenda Virtual Activa    `);
    console.log(`  📍 Ciudad Mante, Tamaulipas                                   `);
    console.log(`  🚀 Servidor local ejecutándose en: http://localhost:${PORT}      `);
    console.log(`  💡 Abre tu navegador web en esa dirección para interactuar    `);
    console.log(`================================================================`);
});

