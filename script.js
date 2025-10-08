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
    renderProjects();
    initializeEventListeners();
});

// Load projects from localStorage
function loadProjects() {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else {
        // Default projects
        projects = [
            {
                id: generateId(),
                title: 'NEON FUTURES',
                category: 'web',
                description: 'A cutting-edge web experience for a tech startup, featuring immersive 3D elements and micro-interactions.',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'
            },
            {
                id: generateId(),
                title: 'QUANTUM LABS',
                category: 'branding',
                description: 'Complete brand identity for a quantum computing company, from logo to visual language.',
                image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&q=80'
            },
            {
                id: generateId(),
                title: 'MINDFUL MEDITATION',
                category: 'mobile',
                description: 'A serene mobile app designed to help users practice mindfulness with beautiful animations.',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'
            },
            {
                id: generateId(),
                title: 'CYBERPUNK CITY',
                category: 'experimental',
                description: 'An experimental WebGL experience exploring futuristic cityscapes and neon aesthetics.',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
            },
            {
                id: generateId(),
                title: 'ELECTRIC DASHBOARD',
                category: 'ui-ux',
                description: 'A comprehensive dashboard design for electric vehicle fleet management.',
                image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80'
            },
            {
                id: generateId(),
                title: 'ABSTRACT WORLDS',
                category: '3d',
                description: 'A series of 3D animated scenes exploring abstract geometric compositions.',
                image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80'
            }
        ];
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

// Render projects to grid
function renderProjects(filter = 'all') {
    const grid = document.getElementById('projectsGrid');

    let filteredProjects = projects;
    if (filter !== 'all') {
        filteredProjects = projects.filter(p => p.category === filter);
    }

    if (filteredProjects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No Projects Found</h3>
                <p>Start by adding your first project!</p>
                <button class="btn-primary" onclick="openModal()">Add Project</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProjects.map(project => `
        <div class="project-card" data-category="${project.category}">
            <img src="${project.image}" alt="${project.title}" class="project-bg">
            <div class="project-info">
                <div class="project-category">${categoryLabels[project.category]}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-actions">
                    <button class="btn-edit" onclick="editProject('${project.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteProject('${project.id}')">Delete</button>
                </div>
            </div>
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

    // Category filters
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderProjects(category);
        });
    });

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
    renderProjects();
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
        renderProjects();
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
