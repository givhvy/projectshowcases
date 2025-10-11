// Import Firebase modules
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Projects data
let projects = [];

// Pagination state
const paginationState = {
    latest: { currentPage: 1, itemsPerPage: 6 },
    all: { currentPage: 1, itemsPerPage: 6 },
    experimental: { currentPage: 1, itemsPerPage: 6 }
};

// Category mapping
const categoryLabels = {
    'web': 'Web Design',
    'mobile': 'Mobile Apps',
    'branding': 'Branding',
    'ui-ux': 'UI/UX',
    'experimental': 'Experimental',
    '3d': '3D & Animation'
};

// Wait for Firebase to initialize
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.db) {
            resolve(window.db);
        } else {
            const checkInterval = setInterval(() => {
                if (window.db) {
                    clearInterval(checkInterval);
                    resolve(window.db);
                }
            }, 100);
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await waitForFirebase();
    await loadProjects();
    renderAllSections();
    initializeEventListeners();
});

// Load projects from Firebase
async function loadProjects() {
    try {
        const db = window.db;
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        projects = [];
        querySnapshot.forEach((doc) => {
            projects.push({
                id: doc.id,
                ...doc.data()
            });
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        showNotification('Error loading projects from database');
    }
}

// Save project to Firebase
async function saveProject(projectData, projectId = null) {
    try {
        const db = window.db;
        const projectsRef = collection(db, 'projects');

        if (projectId) {
            // Update existing project
            const projectDocRef = doc(db, 'projects', projectId);
            await updateDoc(projectDocRef, {
                ...projectData,
                updatedAt: new Date().toISOString()
            });
        } else {
            // Add new project
            await addDoc(projectsRef, {
                ...projectData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        await loadProjects();
        renderAllSections();
    } catch (error) {
        console.error('Error saving project:', error);
        showNotification('Error saving project to database');
        throw error;
    }
}

// Delete project from Firebase
async function deleteProjectFromDB(projectId) {
    try {
        const db = window.db;
        const projectDocRef = doc(db, 'projects', projectId);
        await deleteDoc(projectDocRef);

        await loadProjects();
        renderAllSections();
    } catch (error) {
        console.error('Error deleting project:', error);
        showNotification('Error deleting project from database');
        throw error;
    }
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
    const paginationContainer = document.getElementById('latestPagination');
    const { currentPage, itemsPerPage } = paginationState.latest;

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects yet. Click "Add Project" to create one!</p></div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    container.innerHTML = paginatedProjects.map(project => createProjectCard(project, true)).join('');

    // Render pagination
    if (paginationContainer) {
        paginationContainer.innerHTML = createPagination('latest', projects.length, currentPage, itemsPerPage);
    }
}

// Render All Projects Section
function renderAllProjects() {
    const container = document.getElementById('allProjects');
    const paginationContainer = document.getElementById('allPagination');
    const { currentPage, itemsPerPage } = paginationState.all;

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects yet. Click "Add Project" to create one!</p></div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    container.innerHTML = paginatedProjects.map(project => createProjectCard(project, false)).join('');

    // Render pagination
    if (paginationContainer) {
        paginationContainer.innerHTML = createPagination('all', projects.length, currentPage, itemsPerPage);
    }
}

// Render Experimental Projects Section
function renderExperimentalProjects() {
    const container = document.getElementById('experimentalProjects');
    const paginationContainer = document.getElementById('experimentalPagination');
    const { currentPage, itemsPerPage } = paginationState.experimental;

    const experimentalProjects = projects.filter(p => p.category === 'experimental');

    if (experimentalProjects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No experimental projects yet.</p></div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = experimentalProjects.slice(startIndex, endIndex);

    container.innerHTML = paginatedProjects.map(project => createProjectCard(project, false)).join('');

    // Render pagination
    if (paginationContainer) {
        paginationContainer.innerHTML = createPagination('experimental', experimentalProjects.length, currentPage, itemsPerPage);
    }
}

// Create project card HTML
function createProjectCard(project, showNewBadge = false) {
    const cursorStyle = project.link ? 'style="cursor: pointer;"' : '';

    return `
        <div class="project-card-medium" data-category="${project.category}" data-project-id="${project.id}">
            <div class="project-thumbnail" data-link="${project.link || ''}" ${cursorStyle}>
                <img src="${project.image}" alt="${project.title}" class="project-bg">
                ${showNewBadge ? '<div class="new-added-badge">New Added</div>' : ''}
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-actions">
                    <button class="btn-edit" data-project-id="${project.id}">Edit</button>
                    <button class="btn-delete" data-project-id="${project.id}">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Create pagination HTML
function createPagination(section, totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="pagination">';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn pagination-prev"
                data-section="${section}"
                data-page="${currentPage - 1}"
                ${currentPage === 1 ? 'disabled' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
    `;

    // Page numbers
    paginationHTML += '<div class="pagination-numbers">';

    // Logic for showing page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }

    // First page
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn pagination-number" data-section="${section}" data-page="1">1</button>
        `;
        if (startPage > 2) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn pagination-number ${i === currentPage ? 'active' : ''}"
                    data-section="${section}"
                    data-page="${i}">
                ${i}
            </button>
        `;
    }

    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
        paginationHTML += `
            <button class="pagination-btn pagination-number" data-section="${section}" data-page="${totalPages}">${totalPages}</button>
        `;
    }

    paginationHTML += '</div>';

    // Next button
    paginationHTML += `
        <button class="pagination-btn pagination-next"
                data-section="${section}"
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? 'disabled' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
    `;

    paginationHTML += '</div>';

    return paginationHTML;
}

// Handle pagination click
function handlePaginationClick(section, page) {
    paginationState[section].currentPage = page;

    // Re-render the appropriate section
    if (section === 'latest') {
        renderLatestProjects();
    } else if (section === 'all') {
        renderAllProjects();
    } else if (section === 'experimental') {
        renderExperimentalProjects();
    }

    // Scroll to section
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
        const yOffset = -100;
        const y = sectionElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
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

    // Event delegation for edit and delete buttons
    document.body.addEventListener('click', (e) => {
        // Handle edit button click
        if (e.target.classList.contains('btn-edit')) {
            const projectId = e.target.getAttribute('data-project-id');
            if (projectId) {
                editProject(projectId);
            }
        }

        // Handle delete button click
        if (e.target.classList.contains('btn-delete')) {
            const projectId = e.target.getAttribute('data-project-id');
            if (projectId) {
                deleteProject(projectId);
            }
        }

        // Handle thumbnail click for opening links
        if (e.target.closest('.project-thumbnail')) {
            const thumbnail = e.target.closest('.project-thumbnail');
            const link = thumbnail.getAttribute('data-link');
            if (link && link !== '') {
                window.open(link, '_blank');
            }
        }

        // Handle pagination button clicks
        const paginationBtn = e.target.closest('.pagination-btn');
        if (paginationBtn && !paginationBtn.disabled) {
            const section = paginationBtn.getAttribute('data-section');
            const page = parseInt(paginationBtn.getAttribute('data-page'));
            if (section && page) {
                handlePaginationClick(section, page);
            }
        }
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
            document.getElementById('projectLink').value = project.link || '';
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
async function handleFormSubmit(e) {
    e.preventDefault();

    const projectId = document.getElementById('projectId').value;
    const projectData = {
        title: document.getElementById('projectTitle').value.toUpperCase(),
        category: document.getElementById('projectCategory').value,
        description: document.getElementById('projectDescription').value,
        image: document.getElementById('projectImage').value,
        link: document.getElementById('projectLink').value || null
    };

    try {
        await saveProject(projectData, projectId || null);
        closeModal();
        showNotification(projectId ? 'Project updated successfully!' : 'Project added successfully!');
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

// Edit project
function editProject(projectId) {
    openModal(projectId);
}

// Delete project
async function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await deleteProjectFromDB(projectId);
            showNotification('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
        }
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
