// Navigation functionality
let currentSection = 'home';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeDocumentManagement();
  initializeContactForm();
  
  // Show home section by default
  showSection('home');
});

// Navigation management
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = link.getAttribute('href').substring(1);
      showSection(sectionName);
      
      // Close mobile menu
      navMenu.classList.remove('active');
    });
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });
}

// Section management
function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));

  // Show target section
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionName;
  }

  // Update navigation
  updateNavigation(sectionName);
  
  // Update page title
  updatePageTitle(sectionName);
}

function updateNavigation(activeSectionName) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + activeSectionName) {
      link.classList.add('active');
    }
  });
}

function updatePageTitle(sectionName) {
  const titles = {
    home: 'CloudLaunch - Your Digital Platform Solution',
    about: 'About - CloudLaunch',
    features: 'Features - CloudLaunch',
    contact: 'Contact - CloudLaunch',
    documents: 'Documents - CloudLaunch'
  };
  
  document.title = titles[sectionName] || 'CloudLaunch';
}

// Document management system
function initializeDocumentManagement() {
  const authForm = document.getElementById('auth-form');
  const fileUpload = document.getElementById('file-upload');
  const searchInput = document.getElementById('search-input');
  
  // Authentication
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (demo purposes)
    if (username === 'admin' && password === 'password') {
      login();
    } else {
      showNotification('Invalid credentials. Please use: admin / password', 'error');
    }
  });

  // File upload handling
  fileUpload.addEventListener('change', handleFileUpload);
  
  // Search functionality
  searchInput.addEventListener('input', handleDocumentSearch);
  
  // Document actions
  initializeDocumentActions();
}

function login() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('document-area').style.display = 'block';
  showNotification('Login successful!', 'success');
}

function logout() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('document-area').style.display = 'none';
  
  // Clear form
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  
  showNotification('Logged out successfully', 'info');
}

function handleFileUpload(event) {
  const files = event.target.files;
  const documentGrid = document.getElementById('document-grid');
  
  Array.from(files).forEach(file => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const icon = getFileIcon(fileExtension);
    const currentDate = new Date().toISOString().split('T')[0];
    
    const documentCard = createDocumentCard(file.name, icon, currentDate);
    documentGrid.appendChild(documentCard);
  });
  
  // Clear the file input
  event.target.value = '';
  
  // Show success message
  showNotification('Files uploaded successfully!', 'success');
}

function getFileIcon(extension) {
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    ppt: '📊',
    pptx: '📊',
    xls: '📊',
    xlsx: '📊',
    txt: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    zip: '📦',
    rar: '📦'
  };
  
  return icons[extension] || '📄';
}

function createDocumentCard(fileName, icon, uploadDate) {
  const card = document.createElement('div');
  card.className = 'document-card';
  card.setAttribute('data-name', fileName.toLowerCase());
  
  card.innerHTML = `
    <div class="document-icon">${icon}</div>
    <div class="document-info">
      <h4>${fileName.split('.')[0]}</h4>
      <p>${fileName}</p>
      <small>Uploaded: ${uploadDate}</small>
    </div>
    <div class="document-actions-mini">
      <button class="btn-icon" title="Download" onclick="downloadFile('${fileName}')">⬇️</button>
      <button class="btn-icon" title="Delete" onclick="deleteDocument(this)">🗑️</button>
    </div>
  `;
  
  return card;
}

function handleDocumentSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const documentCards = document.querySelectorAll('.document-card');
  
  documentCards.forEach(card => {
    const fileName = card.getAttribute('data-name');
    if (fileName.includes(searchTerm)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function initializeDocumentActions() {
  // Add event listeners to existing document cards
  const documentCards = document.querySelectorAll('.document-card');
  documentCards.forEach(card => {
    const downloadBtn = card.querySelector('.btn-icon[title="Download"]');
    const deleteBtn = card.querySelector('.btn-icon[title="Delete"]');
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const fileName = card.querySelector('.document-info p').textContent;
        downloadFile(fileName);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        deleteDocument(deleteBtn);
      });
    }
  });
}

function downloadFile(fileName) {
  // Simulate file download
  showNotification(`Downloading ${fileName}...`, 'info');
  
  // In a real application, you would handle actual file download here
  console.log(`Downloading file: ${fileName}`);
}

function deleteDocument(deleteButton) {
  const documentCard = deleteButton.closest('.document-card');
  const fileName = documentCard.querySelector('.document-info p').textContent;
  
  if (confirm(`Are you sure you want to delete ${fileName}?`)) {
    documentCard.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      documentCard.remove();
      showNotification(`${fileName} deleted successfully`, 'success');
    }, 300);
  }
}

// Contact form handling
function initializeContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simulate form submission
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Clear form
    contactForm.reset();
    
    console.log('Contact form submitted:', { name, email, message });
  });
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Export functions for global access
window.showSection = showSection;
window.logout = logout;
window.downloadFile = downloadFile;
window.deleteDocument = deleteDocument;
