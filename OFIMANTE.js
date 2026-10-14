// Base de datos simulada inicial con vacantes de ejemplo en Ciudad Mante
let jobs = [
    {
        id: 1,
        puesto: "Auxiliar de Mostrador",
        empresa: "Papelería y Variedades Mante",
        ubicacion: "Zona Centro",
        requisitos: "Facilidad de palabra, manejo básico de caja registradora, preparatoria terminada.",
        contacto: "Tel: 831 123 4567"
    },
    {
        id: 2,
        puesto: "Soporte Técnico en Computación",
        empresa: "Soluciones Digitales Mante",
        ubicacion: "Zona Norte",
        requisitos: "Conocimiento en mantenimiento de PCs, redes y sistemas operativos. Estudiante o egresado UAT.",
        contacto: "contacto@solucionesmante.com"
    },
    {
        id: 3,
        puesto: "Encargado de Caja y Ventas",
        empresa: "Bananos Barber Studio",
        ubicacion: "Zona Centro",
        requisitos: "Experiencia en atención al cliente, ordenado, responsable y con disponibilidad de horario.",
        contacto: "WhatsApp: 831 987 6543"
    }
];

// Función para renderizar las tarjetas en la pantalla
function renderJobs(jobsArray) {
    const grid = document.getElementById('jobsGrid');
    grid.innerHTML = '';

    if (jobsArray.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No se encontraron vacantes con esos criterios.</p>`;
        return;
    }

    jobsArray.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div>
                <div class="job-header">
                    <div>
                        <div class="job-title">${job.puesto}</div>
                        <div class="job-company">${job.empresa}</div>
                    </div>
                    <span class="badge">${job.ubicacion}</span>
                </div>
                <div class="job-details">
                    <p><strong>Requisitos:</strong> ${job.requisitos}</p>
                </div>
            </div>
            <div class="job-footer">
                <div class="job-contact">📞 ${job.contacto}</div>
                <button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="alert('Datos de contacto para postularse: ${job.contacto}')">Postularme</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Función de filtro en tiempo real (Requerimiento RF08)
function filterJobs() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const locationFilter = document.getElementById('locationSelect').value.toLowerCase();

    const filtered = jobs.filter(job => {
        const matchesText = job.puesto.toLowerCase().includes(searchText) || 
                            job.requisitos.toLowerCase().includes(searchText) || 
                            job.empresa.toLowerCase().includes(searchText);
        
        const matchesLocation = locationFilter === "" || job.ubicacion.toLowerCase().includes(locationFilter);

        return matchesText && matchesLocation;
    });

    renderJobs(filtered);
}

// Función para cambiar de vista (Pestañas)
function switchView(viewName) {
    const homeView = document.getElementById('view-home');
    const postView = document.getElementById('view-post');
    const btnHome = document.getElementById('btn-home');
    const btnPost = document.getElementById('btn-post');

    if (viewName === 'home') {
        homeView.classList.add('active');
        postView.classList.remove('active');
        btnHome.classList.add('active');
        btnPost.classList.remove('active');
    } else {
        homeView.classList.remove('active');
        postView.classList.add('active');
        btnHome.classList.remove('active');
        btnPost.classList.add('active');
    }
}

// Función para manejar el formulario de publicar nueva vacante (Requerimiento RF05)
function handlePostJob(event) {
    event.preventDefault();

    const newJob = {
        id: jobs.length + 1,
        puesto: document.getElementById('puesto').value,
        empresa: document.getElementById('empresa').value,
        ubicacion: document.getElementById('ubicacion').value,
        requisitos: document.getElementById('requisitos').value,
        contacto: document.getElementById('contacto').value
    };

    // Agregar al arreglo principal
    jobs.unshift(newJob);

    // Limpiar formulario
    document.getElementById('jobForm').reset();

    // Cambiar a la vista principal para ver la nueva vacante publicada
    switchView('home');
    renderJobs(jobs);

    alert('¡Vacante publicada exitosamente en OFIMANTE!');
}

// Cargar las vacantes al abrir la página por primera vez
window.onload = function() {
    renderJobs(jobs);
};