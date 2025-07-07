// CAO Tracker - Hoofdapplicatie JavaScript

class CAOTracker {
    constructor() {
        this.currentTab = 'chat';
        this.isConnected = false;
        this.notifications = [];
        
        // Make this instance globally accessible before initialization
        window.app = this;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.checkConnection();
        this.loadInitialData();
    }
    
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Window events
        window.addEventListener('resize', () => {
            this.handleResize();
            if (this.trackerManager) {
                this.trackerManager.onResize();
            }
        });
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Connection status
        window.addEventListener('online', () => this.updateConnectionStatus(true));
        window.addEventListener('offline', () => this.updateConnectionStatus(false));
    }
    
    initializeComponents() {
        // Wait for DOM to be fully loaded before initializing components
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.doInitializeComponents();
            });
        } else {
            // DOM is already loaded
            this.doInitializeComponents();
        }
    }
    
    doInitializeComponents() {
        try {
            // Initialize chat component
            if (window.ChatManager) {
                this.chatManager = new ChatManager();
                console.log('Chat manager initialized');
            } else {
                console.warn('ChatManager not available');
            }
            
            // Initialize documents component
            if (window.DocumentsManager) {
                this.documentsManager = new DocumentsManager();
                console.log('Documents manager initialized');
            } else {
                console.warn('DocumentsManager not available');
            }
            
            // Initialize tracker component
            if (window.TrackerManager) {
                this.trackerManager = new TrackerManager();
                // Initialize the tracker manager after DOM is ready
                this.trackerManager.init();
                console.log('Tracker manager initialized');
            } else {
                console.warn('TrackerManager not available');
            }
            
            // Force initial render of tracker components with error handling
            setTimeout(() => {
                try {
                    this.trackerManager.renderCaoList();
                    this.trackerManager.updateCurrentCaoInfo();
                } catch (error) {
                    console.warn('Error during tracker initialization:', error.message);
                }
            }, 200);
            
            // Export trackerManager to window for global access
            if (this.trackerManager) {
                window.trackerManager = this.trackerManager;
            }
            
            console.log('CAO Tracker components initialized successfully');
        } catch (error) {
            console.error('Error initializing components:', error);
            this.showNotification('Fout bij het laden van componenten', 'error');
        }
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Trigger tab-specific initialization
        this.onTabSwitch(tabName);
        
        // Refresh component data when switching tabs
        if (tabName === 'tracker' && this.trackerManager) {
            this.trackerManager.refreshTasks();
        } else if (tabName === 'chat' && this.chatManager) {
            this.chatManager.refreshChat();
        } else if (tabName === 'documents' && this.documentsManager) {
            this.documentsManager.refreshDocuments();
        }
        
        // Update URL without page reload
        history.pushState({ tab: tabName }, '', `#${tabName}`);
    }
    
    onTabSwitch(tabName) {
        switch (tabName) {
            case 'chat':
                if (this.chatManager) {
                    this.chatManager.onTabActivated();
                }
                break;
            case 'documents':
                if (this.documentsManager) {
                    this.documentsManager.refreshDocuments();
                }
                break;
            case 'tracker':
                if (this.trackerManager) {
                    this.trackerManager.refreshTasks();
                }
                break;
        }
    }
    
    async checkConnection() {
        try {
            // Simulate API call to check backend connection
            // In real implementation, this would be an actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // For demo purposes, assume no backend connection (frontend-only mode)
            const isConnected = false;
            
            this.updateConnectionStatus(isConnected);
            
            // Don't show connection notifications in demo mode
            console.log('Running in frontend-only mode (no backend)');
            
        } catch (error) {
            console.warn('Connection check failed (expected in demo mode):', error.message);
            this.updateConnectionStatus(false);
        }
    }
    
    updateConnectionStatus(isConnected) {
        this.isConnected = isConnected;
        const statusElement = document.getElementById('connectionStatus');
        const icon = statusElement.querySelector('i');
        const text = statusElement.querySelector('span');
        
        if (isConnected) {
            statusElement.className = 'status-indicator';
            icon.className = 'fas fa-circle';
            text.textContent = 'Verbonden';
            statusElement.style.background = '#e8f5e8';
            icon.style.color = '#28a745';
        } else {
            statusElement.className = 'status-indicator';
            icon.className = 'fas fa-exclamation-circle';
            text.textContent = 'Offline';
            statusElement.style.background = '#f8d7da';
            icon.style.color = '#dc3545';
        }
    }
    
    async loadInitialData() {
        try {
            // Load initial data for all components with error handling
            const loadPromises = [];
            
            if (this.documentsManager && typeof this.documentsManager.loadDocuments === 'function') {
                loadPromises.push(
                    Promise.resolve(this.documentsManager.loadDocuments())
                        .catch(error => console.warn('Error loading documents:', error.message))
                );
            }
            
            if (this.trackerManager && typeof this.trackerManager.loadTasks === 'function') {
                loadPromises.push(
                    Promise.resolve(this.trackerManager.loadTasks())
                        .catch(error => console.warn('Error loading tasks:', error.message))
                );
            }
            
            if (this.chatManager && typeof this.chatManager.loadChatHistory === 'function') {
                loadPromises.push(
                    Promise.resolve(this.chatManager.loadChatHistory())
                        .catch(error => console.warn('Error loading chat history:', error.message))
                );
            }
            
            // Wait for all data to load
            await Promise.allSettled(loadPromises);
            console.log('Initial data loaded successfully');
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Don't show notification for initial data loading errors as they're expected without backend
        }
    }
    
    showLoading(message = 'Bezig met laden...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('p');
        text.textContent = message;
        overlay.classList.add('active');
    }
    
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const id = Date.now();
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="close-btn" onclick="app.closeNotification(${id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.dataset.id = id;
        container.appendChild(notification);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.closeNotification(id);
            }, duration);
        }
        
        this.notifications.push({ id, element: notification });
    }
    
    closeNotification(id) {
        const notification = document.querySelector(`[data-id="${id}"]`);
        if (notification) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 300);
        }
    }
    
    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);
        
        // Notify components of resize
        if (this.chatManager) {
            this.chatManager.onResize();
        }
        if (this.documentsManager) {
            this.documentsManager.onResize();
        }
        if (this.trackerManager) {
            this.trackerManager.onResize();
        }
    }
    
    handleBeforeUnload(event) {
        // Check if there are unsaved changes
        let hasUnsavedChanges = false;
        
        if (this.trackerManager && this.trackerManager.hasUnsavedChanges()) {
            hasUnsavedChanges = true;
        }
        
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = 'Er zijn niet-opgeslagen wijzigingen. Weet u zeker dat u wilt vertrekken?';
            return event.returnValue;
        }
    }
    
    handleKeyboard(event) {
        // Keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    this.switchTab('chat');
                    break;
                case '2':
                    event.preventDefault();
                    this.switchTab('documents');
                    break;
                case '3':
                    event.preventDefault();
                    this.switchTab('tracker');
                    break;
                case 'r':
                    event.preventDefault();
                    this.refreshCurrentTab();
                    break;
            }
        }
        
        // Escape key to close modals/notifications
        if (event.key === 'Escape') {
            this.closeAllNotifications();
        }
    }
    
    refreshCurrentTab() {
        this.showLoading('Vernieuwen...');
        
        setTimeout(() => {
            this.onTabSwitch(this.currentTab);
            this.hideLoading();
            this.showNotification('Tab vernieuwd', 'success', 2000);
        }, 500);
    }
    
    closeAllNotifications() {
        this.notifications.forEach(notification => {
            this.closeNotification(notification.id);
        });
    }
    
    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            return 'Vandaag ' + date.toLocaleTimeString('nl-NL', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (days === 1) {
            return 'Gisteren ' + date.toLocaleTimeString('nl-NL', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (days < 7) {
            return days + ' dagen geleden';
        } else {
            return date.toLocaleDateString('nl-NL');
        }
    }
    
    getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fas fa-file-pdf',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel',
            'txt': 'fas fa-file-alt',
            'default': 'fas fa-file'
        };
        
        return iconMap[extension] || iconMap.default;
    }
    
    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        let message = 'Er is een onbekende fout opgetreden';
        
        if (error.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }
        
        this.showNotification(message, 'error');
    }
}

// Initialize application when DOM is loaded
let app;

document.addEventListener('DOMContentLoaded', () => {
    // Create app instance (window.app is set in constructor)
    app = new CAOTracker();
    
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.tab) {
            app.switchTab(event.state.tab);
        }
    });
    
    // Handle initial hash
    const hash = window.location.hash.substring(1);
    if (hash && ['chat', 'documents', 'tracker'].includes(hash)) {
        app.switchTab(hash);
    }
});

// Add CSS for slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other modules
window.CAOTracker = CAOTracker;