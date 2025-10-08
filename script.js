// Projects data stored in localStorage
let projects = [];

// Category mapping
const categoryLabels = {
    'web': 'Web Design',
    'mobile': 'Mobile Apps',
    'branding': 'Branding',
    'ui-ux': 'UI/UX',
    'experimental': 'Experimental',
    '3d': '3D & Animation'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    renderAllSections();
    initializeEventListeners();
});

// Load projects from localStorage
function loadProjects() {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else {
        // Start with empty projects array
        projects = [];
        saveProjects();
    }
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Render all sections
function renderAllSections() {
    renderLatestProjects();
    renderAllProjects();
    renderExperimentalProjects();
    renderCategories();
}

// Render Latest Projects Section
function renderLatestProjects() {
    const container = document.getElementById('latestProjects');
    const latestProjects = projects.slice(0, 6);

    if (latestProjects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects yet. Click "Add Project" to create one!</p></div>';
        return;
    }

    container.innerHTML = latestProjects.map(project => createProjectCard(project, true)).join('');
}

// Render All Projects Section
function renderAllProjects() {
    const container = document.getElementById('allProjects');
    const allProjectsList = projects.slice(0, 6);

    if (allProjectsList.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects yet. Click "Add Project" to create one!</p></div>';
        return;
    }

    container.innerHTML = allProjectsList.map(project => createProjectCard(project, false)).join('');
}

// Render Experimental Projects Section
function renderExperimentalProjects() {
    const container = document.getElementById('experimentalProjects');
    const experimentalProjects = projects.filter(p => p.category === 'experimental').slice(0, 6);

    if (experimentalProjects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No experimental projects yet.</p></div>';
        return;
    }

    container.innerHTML = experimentalProjects.map(project => createProjectCard(project, false)).join('');
}

// Create project card HTML
function createProjectCard(project, showNewBadge = false) {
    return `
        <div class="project-card-medium" data-category="${project.category}">
            <img src="${project.image}" alt="${project.title}" class="project-bg">
            ${showNewBadge ? '<div class="new-added-badge">New Added</div>' : ''}
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-actions">
                    <button class="btn-edit" onclick="editProject('${project.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteProject('${project.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Render Categories Section
function renderCategories() {
    const container = document.getElementById('categoriesGrid');

    const categories = [
        { name: 'Web Design', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80' },
        { name: 'Mobile Apps', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80' },
        { name: 'Branding', image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80' },
        { name: 'UI/UX', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80' },
        { name: 'Experimental', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80' },
        { name: '3D & Animation', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80' }
    ];

    container.innerHTML = categories.map(category => `
        <div class="category-card">
            <img src="${category.image}" alt="${category.name}">
            <div class="category-name">${category.name}</div>
        </div>
    `).join('');
}

// Initialize event listeners
function initializeEventListeners() {
    // Add project button
    document.getElementById('addProjectBtn').addEventListener('click', () => openModal());

    // Close modal buttons
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    // Close modal on background click
    document.getElementById('projectModal').addEventListener('click', (e) => {
        if (e.target.id === 'projectModal') {
            closeModal();
        }
    });

    // Form submit
    document.getElementById('projectForm').addEventListener('submit', handleFormSubmit);


    // Parallax effect on hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Open modal
function openModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const modalTitle = document.getElementById('modalTitle');

    form.reset();

    if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            modalTitle.textContent = 'Edit Project';
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectCategory').value = project.category;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectImage').value = project.image;
        }
    } else {
        modalTitle.textContent = 'Add New Project';
        document.getElementById('projectId').value = '';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    const projectId = document.getElementById('projectId').value;
    const projectData = {
        title: document.getElementById('projectTitle').value.toUpperCase(),
        category: document.getElementById('projectCategory').value,
        description: document.getElementById('projectDescription').value,
        image: document.getElementById('projectImage').value
    };

    if (projectId) {
        // Update existing project
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...projectData };
        }
    } else {
        // Add new project
        const newProject = {
            id: generateId(),
            ...projectData
        };
        projects.unshift(newProject);
    }

    saveProjects();
    renderAllSections();
    closeModal();

    // Show success message (optional)
    showNotification(projectId ? 'Project updated successfully!' : 'Project added successfully!');
}

// Edit project
function editProject(projectId) {
    openModal(projectId);
}

// Delete project
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== projectId);
        saveProjects();
        renderAllSections();
        showNotification('Project deleted successfully!');
    }
}

// Show notification (simple implementation)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgb(10, 201, 77);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
