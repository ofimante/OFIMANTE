// Base de datos simulada inicial con vacantes
let jobs = [
    { id: 1, puesto: "Auxiliar de Mostrador", empresa: "Papelería Mante", ubicacion: "Zona Centro", requisitos: "Facilidad de palabra y manejo de caja.", contacto: "831 123 4567" },
    { id: 2, puesto: "Soporte Técnico", empresa: "Soluciones Digitales", ubicacion: "Zona Norte", requisitos: "Mantenimiento de PCs y redes.", contacto: "contacto@soluciones.com" },
    { id: 3, puesto: "Encargado de Ventas", empresa: "Bananos Studio", ubicacion: "Zona Centro", requisitos: "Atención al cliente y responsabilidad.", contacto: "831 987 6543" }
];

// 1. RENDERIZAR EN PANTALLA PRINCIPAL
function renderJobs(jobsArray) {
    const grid = document.getElementById('jobsGrid');
    grid.innerHTML = '';

    if (jobsArray.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No se encontraron vacantes registradas.</p>`;
        return;
    }

    jobsArray.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div class="job-title">${job.puesto}</div>
                    <span class="badge">${job.ubicacion}</span>
                </div>
                <div class="job-company">${job.empresa}</div>
                <div class="job-details">
                    <p><strong>Requisitos:</strong> ${job.requisitos}</p>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 1rem;">
                <span style="font-size: 0.85rem; color: var(--text-light);">📞 ${job.contacto}</span>
                <button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="alert('Contacto para postularse: ${job.contacto}')">Postularme</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 2. RENDERIZAR EN TABLA DE GESTIÓN (Pantalla 3)
function renderManageTable() {
    const tbody = document.getElementById('manageTableBody');
    tbody.innerHTML = '';

    if (jobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light);">No hay registros en el sistema.</td></tr>`;
        return;
    }

    jobs.forEach(job => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${job.id}</td>
            <td><strong>${job.puesto}</strong></td>
            <td>${job.empresa}</td>
            <td>${job.ubicacion}</td>
            <td>${job.contacto}</td>
            <td>
                <button class="btn-warning" onclick="openEditModal(${job.id})">Editar</button>
                <button class="btn-danger" onclick="deleteJob(${job.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. ACCIÓN: BUSCAR Y FILTRAR (Cumple con filtros y búsqueda)
function filterJobs() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const locationFilter = document.getElementById('locationSelect').value;

    const filtered = jobs.filter(job => {
        const matchesText = job.puesto.toLowerCase().includes(searchText) || 
                            job.requisitos.toLowerCase().includes(searchText) || 
                            job.empresa.toLowerCase().includes(searchText);
        const matchesLocation = locationFilter === "" || job.ubicacion === locationFilter;
        return matchesText && matchesLocation;
    });

    renderJobs(filtered);
}

// 4. ACCIÓN: LIMPIAR FILTROS
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('locationSelect').value = '';
    renderJobs(jobs);
}

// 5. ACCIÓN: GUARDAR / PUBLICAR NUEVA VACANTE CON VALIDACIONES
function handlePostJob(event) {
    event.preventDefault();

    const puesto = document.getElementById('puesto').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const ubicacion = document.getElementById('ubicacion').value;
    const requisitos = document.getElementById('requisitos').value.trim();
    const contacto = document.getElementById('contacto').value.trim();
    const errorAlert = document.getElementById('errorAlert');

    // VALIDACIÓN 1: No permitir campos vacíos (Obligatorios)
    if (!puesto || !empresa || !ubicacion || !requisitos || !contacto) {
        showError("⚠️ Error de validación: Todos los campos marcados con * son obligatorios y no pueden estar vacíos.");
        return;
    }

    // VALIDACIÓN 2: Validar longitud mínima de requisitos para asegurar información completa
    if (requisitos.length < 10) {
        showError("⚠️ Error de validación: El campo de requisitos debe contener al menos 10 caracteres explicativos.");
        return;
    }

    // VALIDACIÓN 3: Validar formato numérico básico o datos de contacto (ej. que contenga números o @)
    if (contacto.length < 7) {
        showError("⚠️ Error de validación: Ingrese un dato de contacto válido (Teléfono o correo con longitud mínima de 7 caracteres).");
        return;
    }

    // Si pasa todas las validaciones, ocultar errores y guardar
    errorAlert.style.display = 'none';

    const newJob = {
        id: jobs.length > 0 ? jobs[jobs.length - 1].id + 1 : 1,
        puesto: puesto,
        empresa: empresa,
        ubicacion: ubicacion,
        requisitos: requisitos,
        contacto: contacto
    };

    jobs.push(newJob);
    resetForm();
    switchView('home');
    renderJobs(jobs);
    renderManageTable();
    alert('¡Vacante guardada y publicada exitosamente!');
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.innerText = message;
    errorAlert.style.display = 'block';
}

// ACCIÓN: LIMPIAR FORMULARIO
function resetForm() {
    document.getElementById('jobForm').reset();
    document.getElementById('errorAlert').style.display = 'none';
}

// 6. ACCIÓN: ELIMINAR VACANTE
function deleteJob(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta vacante del sistema?')) {
        jobs = jobs.filter(job => job.id !== id);
        renderJobs(jobs);
        renderManageTable();
        alert('Vacante eliminada correctamente.');
    }
}

// 7. ACCIÓN: EDITAR Y ACTUALIZAR VACANTE
function openEditModal(id) {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    document.getElementById('editId').value = job.id;
    document.getElementById('editPuesto').value = job.puesto;
    document.getElementById('editEmpresa').value = job.empresa;
    document.getElementById('editContacto').value = job.contacto;
    document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveEditedJob() {
    const id = parseInt(document.getElementById('editId').value);
    const puesto = document.getElementById('editPuesto').value.trim();
    const empresa = document.getElementById('editEmpresa').value.trim();
    const contacto = document.getElementById('editContacto').value.trim();

    if (!puesto || !empresa || !contacto) {
        alert('Los campos de edición no pueden estar vacíos.');
        return;
    }

    const job = jobs.find(j => j.id === id);
    if (job) {
        job.puesto = puesto;
        job.empresa = empresa;
        job.contacto = contacto;
    }

    closeEditModal();
    renderJobs(jobs);
    renderManageTable();
    alert('¡Vacante actualizada correctamente!');
}

// CONTROL DE NAVEGACIÓN ENTRE PANTALLAS (Vistas)
function switchView(viewName) {
    const homeView = document.getElementById('view-home');
    const postView = document.getElementById('view-post');
    const manageView = document.getElementById('view-manage');
    
    const btnHome = document.getElementById('btn-home');
    const btnPost = document.getElementById('btn-post');
    const btnManage = document.getElementById('btn-manage');

    homeView.classList.remove('active');
    postView.classList.remove('active');
    manageView.classList.remove('active');
    btnHome.classList.remove('active');
    btnPost.classList.remove('active');
    btnManage.classList.remove('active');

    if (viewName === 'home') {
        homeView.classList.add('active');
        btnHome.classList.add('active');
        renderJobs(jobs);
    } else if (viewName === 'post') {
        postView.classList.add('active');
        btnPost.classList.add('active');
    } else if (viewName === 'manage') {
        manageView.classList.add('active');
        btnManage.classList.add('active');
        renderManageTable();
    }
}

// Inicialización al cargar la ventana
window.onload = function() {
    renderJobs(jobs);
    renderManageTable();
<<<<<<< HEAD
}
=======
};
>>>>>>> 20c6def2e42b7507fa258c6c4eb90721129ad6fd
