// CAO Tracker - Documents Manager Component

class DocumentsManager {
    constructor() {
        this.documents = [];
        this.filteredDocuments = [];
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.sortDirection = 'desc';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDocuments();
    }
    
    setupEventListeners() {
        // Upload button
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('documentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchDocuments(e.target.value);
            });
        }
        
        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-btn')) {
                const filterType = e.target.closest('.filter-btn').dataset.filter;
                this.setFilter(filterType);
            }
        });
        
        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSorting(e.target.value);
            });
        }
        
        // Date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.currentFilters = this.currentFilters || {};
                this.currentFilters.date = e.target.value;
                this.toggleCustomDateRange(e.target.value === 'custom');
                if (e.target.value !== 'custom') {
                    this.applyFilters();
                }
            });
        }
        
        // Custom date range
        const applyDateRange = document.getElementById('applyDateRange');
        if (applyDateRange) {
            applyDateRange.addEventListener('click', () => {
                this.applyCustomDateRange();
            });
        }
        
        // Document actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.doc-action')) {
                const action = e.target.closest('.doc-action').dataset.action;
                const docId = e.target.closest('.document-item').dataset.docId;
                this.handleDocumentAction(action, docId);
            }
        });
        
        // Drag and drop
        const dropZone = document.getElementById('documentsTab');
        if (dropZone) {
            dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropZone.addEventListener('drop', this.handleDrop.bind(this));
        }
    }
    
    async loadDocuments() {
        try {
            window.app.showLoading('Documenten laden...');
            
            // Simulate API call
            await this.delay(1000);
            
            // Load from localStorage or API
            const savedDocs = localStorage.getItem('cao_documents');
            if (savedDocs) {
                this.documents = JSON.parse(savedDocs);
            } else {
                // Load sample documents
                this.documents = this.getSampleDocuments();
            }
            
            this.filterAndSortDocuments();
            this.renderDocuments();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading documents:', error);
            window.app.showNotification('Fout bij laden van documenten', 'error');
        } finally {
            window.app.hideLoading();
        }
    }
    
    getSampleDocuments() {
        return [
            {
                id: '1',
                name: 'CAO Metaal en Techniek 2024.pdf',
                type: 'pdf',
                size: 2456789,
                uploadDate: new Date('2024-01-15'),
                status: 'processed',
                category: 'cao',
                tags: ['metaal', 'techniek', '2024'],
                description: 'Collectieve Arbeidsovereenkomst voor de Metaal en Techniek sector'
            },
            {
                id: '2',
                name: 'Salarisschalen_Zorg_2024.xlsx',
                type: 'excel',
                size: 1234567,
                uploadDate: new Date('2024-01-10'),
                status: 'analyzing',
                category: 'salary',
                tags: ['zorg', 'salaris', '2024'],
                description: 'Salarisschalen voor de zorgsector'
            },
            {
                id: '3',
                name: 'CAO_Onderwijs_2023.pdf',
                type: 'pdf',
                size: 3456789,
                uploadDate: new Date('2023-12-20'),
                status: 'completed',
                category: 'cao',
                tags: ['onderwijs', '2023'],
                description: 'CAO voor het primair en voortgezet onderwijs'
            }
        ];
    }
    
    async handleFileUpload(files) {
        if (!files || files.length === 0) return;
        
        const allowedTypes = ['.pdf', '.xlsx', '.xls', '.docx', '.doc'];
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        for (let file of files) {
            // Validate file type
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(fileExtension)) {
                window.app.showNotification(`Bestandstype ${fileExtension} wordt niet ondersteund`, 'error');
                continue;
            }
            
            // Validate file size
            if (file.size > maxSize) {
                window.app.showNotification(`Bestand ${file.name} is te groot (max 50MB)`, 'error');
                continue;
            }
            
            try {
                await this.uploadDocument(file);
            } catch (error) {
                console.error('Upload error:', error);
                window.app.showNotification(`Fout bij uploaden van ${file.name}`, 'error');
            }
        }
    }
    
    async uploadDocument(file) {
        window.app.showLoading(`${file.name} uploaden...`);
        
        try {
            // Create document object
            const document = {
                id: Date.now().toString(),
                name: file.name,
                type: this.getFileType(file.name),
                size: file.size,
                uploadDate: new Date(),
                status: 'uploading',
                category: this.detectCategory(file.name),
                tags: this.extractTags(file.name),
                description: ''
            };
            
            // Add to documents list
            this.documents.unshift(document);
            this.filterAndSortDocuments();
            this.renderDocuments();
            this.updateStats();
            
            // Simulate upload process
            await this.delay(2000);
            
            // Update status to processing
            document.status = 'processing';
            this.renderDocuments();
            
            // Simulate processing
            await this.delay(3000);
            
            // Update status to completed
            document.status = 'processed';
            this.renderDocuments();
            this.saveDocuments();
            
            window.app.showNotification(`${file.name} succesvol geüpload`, 'success');
            
        } catch (error) {
            // Update status to error
            const doc = this.documents.find(d => d.name === file.name);
            if (doc) {
                doc.status = 'error';
                this.renderDocuments();
            }
            throw error;
        } finally {
            window.app.hideLoading();
        }
    }
    
    getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'pdf',
            'xlsx': 'excel',
            'xls': 'excel',
            'docx': 'word',
            'doc': 'word'
        };
        return typeMap[extension] || 'unknown';
    }
    
    detectCategory(filename) {
        const name = filename.toLowerCase();
        if (name.includes('cao')) return 'cao';
        if (name.includes('salaris') || name.includes('schaal')) return 'salary';
        if (name.includes('contract')) return 'contract';
        return 'other';
    }
    
    extractTags(filename) {
        const name = filename.toLowerCase();
        const tags = [];
        
        // Year detection
        const yearMatch = name.match(/20\d{2}/);
        if (yearMatch) tags.push(yearMatch[0]);
        
        // Common sectors
        const sectors = ['zorg', 'onderwijs', 'metaal', 'techniek', 'bouw', 'horeca'];
        sectors.forEach(sector => {
            if (name.includes(sector)) tags.push(sector);
        });
        
        return tags;
    }
    
    searchDocuments(query) {
        this.searchQuery = query.toLowerCase();
        this.filterAndSortDocuments();
        this.renderDocuments();
    }
    
    setFilter(filterType) {
        this.currentFilter = filterType;
        
        // Update filter button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filterType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        this.filterAndSortDocuments();
        this.renderDocuments();
    }
    
    setSorting(sortType) {
        if (this.currentSort === sortType) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort = sortType;
            this.sortDirection = 'desc';
        }
        
        this.filterAndSortDocuments();
        this.renderDocuments();
    }
    
    toggleCustomDateRange(show) {
        const customDateRange = document.getElementById('customDateRange');
        if (customDateRange) {
            customDateRange.style.display = show ? 'flex' : 'none';
        }
    }
    
    applyCustomDateRange() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!startDate || !endDate) {
            window.app.showNotification('Selecteer beide datums', 'warning');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            window.app.showNotification('Startdatum moet voor einddatum liggen', 'warning');
            return;
        }
        
        this.currentFilters = this.currentFilters || {};
        this.currentFilters.customStart = startDate;
        this.currentFilters.customEnd = endDate;
        this.applyFilters();
    }
    
    getDateRange(filterType) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (filterType) {
            case 'today':
                return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                return { start: yesterday, end: today };
            case 'week':
                const weekStart = new Date(today);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                return { start: weekStart, end: new Date() };
            case 'lastweek':
                const lastWeekEnd = new Date(today);
                lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay());
                const lastWeekStart = new Date(lastWeekEnd);
                lastWeekStart.setDate(lastWeekStart.getDate() - 7);
                return { start: lastWeekStart, end: lastWeekEnd };
            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                return { start: monthStart, end: new Date() };
            case 'lastmonth':
                const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                return { start: lastMonthStart, end: lastMonthEnd };
            case 'quarter':
                const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                return { start: quarterStart, end: new Date() };
            case 'year':
                const yearStart = new Date(now.getFullYear(), 0, 1);
                return { start: yearStart, end: new Date() };
            case 'custom':
                if (this.currentFilters && this.currentFilters.customStart && this.currentFilters.customEnd) {
                    return {
                        start: new Date(this.currentFilters.customStart),
                        end: new Date(this.currentFilters.customEnd + 'T23:59:59')
                    };
                }
                return null;
            default:
                return null;
        }
    }
    
    applyFilters() {
        let filteredDocuments = [...this.documents];
        
        // Apply search filter
        if (this.currentFilters && this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filteredDocuments = filteredDocuments.filter(doc => 
                doc.name.toLowerCase().includes(searchTerm) ||
                doc.type.toLowerCase().includes(searchTerm) ||
                doc.status.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply date filter
        if (this.currentFilters && this.currentFilters.date && this.currentFilters.date !== 'all') {
            const dateRange = this.getDateRange(this.currentFilters.date);
            
            if (dateRange) {
                filteredDocuments = filteredDocuments.filter(doc => {
                    const docDate = new Date(doc.uploadDate);
                    return docDate >= dateRange.start && docDate <= dateRange.end;
                });
            }
        }
        
        // Apply status filter
        if (this.currentFilters && this.currentFilters.status && this.currentFilters.status !== 'all') {
            filteredDocuments = filteredDocuments.filter(doc => 
                doc.status === this.currentFilters.status
            );
        }
        
        this.filteredDocuments = filteredDocuments;
        this.renderDocuments();
    }

    filterAndSortDocuments() {
        let filtered = [...this.documents];
        
        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(doc => 
                doc.name.toLowerCase().includes(this.searchQuery) ||
                doc.description.toLowerCase().includes(this.searchQuery) ||
                doc.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))
            );
        }
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(doc => doc.category === this.currentFilter);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (this.currentSort) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'size':
                    aValue = a.size;
                    bValue = b.size;
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                case 'date':
                default:
                    aValue = new Date(a.uploadDate);
                    bValue = new Date(b.uploadDate);
                    break;
            }
            
            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        this.filteredDocuments = filtered;
    }
    
    renderDocuments() {
        const container = document.getElementById('documentsList');
        if (!container) return;
        
        if (this.filteredDocuments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>Geen documenten gevonden</h3>
                    <p>Upload uw eerste CAO document om te beginnen</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredDocuments.map(doc => `
            <div class="document-item" data-doc-id="${doc.id}">
                <div class="doc-icon">
                    <i class="${this.getFileIcon(doc.type)}"></i>
                </div>
                <div class="doc-info">
                    <div class="doc-name">${doc.name}</div>
                    <div class="doc-meta">
                        <span class="doc-size">${window.app.formatFileSize(doc.size)}</span>
                        <span class="doc-date">${window.app.formatDate(doc.uploadDate)}</span>
                        <span class="doc-status status-${doc.status}">${this.getStatusText(doc.status)}</span>
                    </div>
                    ${doc.description ? `<div class="doc-description">${doc.description}</div>` : ''}
                    ${doc.tags.length > 0 ? `
                        <div class="doc-tags">
                            ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="doc-actions">
                    <button class="doc-action" data-action="view" title="Bekijken">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="doc-action" data-action="download" title="Downloaden">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="doc-action" data-action="analyze" title="Analyseren">
                        <i class="fas fa-search"></i>
                    </button>
                    <button class="doc-action" data-action="delete" title="Verwijderen">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    getFileIcon(type) {
        const iconMap = {
            'pdf': 'fas fa-file-pdf',
            'excel': 'fas fa-file-excel',
            'word': 'fas fa-file-word',
            'unknown': 'fas fa-file'
        };
        return iconMap[type] || iconMap.unknown;
    }
    
    getStatusText(status) {
        const statusMap = {
            'uploading': 'Uploaden...',
            'processing': 'Verwerken...',
            'processed': 'Verwerkt',
            'analyzing': 'Analyseren...',
            'completed': 'Voltooid',
            'error': 'Fout'
        };
        return statusMap[status] || 'Onbekend';
    }
    
    updateStats() {
        const totalDocs = this.documents.length;
        const processedDocs = this.documents.filter(doc => doc.status === 'processed' || doc.status === 'completed').length;
        const pendingDocs = this.documents.filter(doc => doc.status === 'uploading' || doc.status === 'processing').length;
        
        // Update stats in UI if elements exist
        const totalElement = document.getElementById('totalDocuments');
        const processedElement = document.getElementById('processedDocuments');
        const pendingElement = document.getElementById('pendingDocuments');
        
        if (totalElement) totalElement.textContent = totalDocs;
        if (processedElement) processedElement.textContent = processedDocs;
        if (pendingElement) pendingElement.textContent = pendingDocs;
    }
    
    async handleDocumentAction(action, docId) {
        const document = this.documents.find(doc => doc.id === docId);
        if (!document) return;
        
        switch (action) {
            case 'view':
                this.viewDocument(document);
                break;
            case 'download':
                this.downloadDocument(document);
                break;
            case 'analyze':
                this.analyzeDocument(document);
                break;
            case 'delete':
                this.deleteDocument(document);
                break;
        }
    }
    
    viewDocument(document) {
        // Open document viewer modal
        window.app.showNotification(`Bekijken van ${document.name}`, 'info');
    }
    
    downloadDocument(document) {
        // Simulate download
        window.app.showNotification(`${document.name} wordt gedownload`, 'success');
    }
    
    analyzeDocument(document) {
        // Start analysis
        window.app.showNotification(`Analyse van ${document.name} gestart`, 'info');
        
        // Switch to tracker tab and start scan
        window.app.switchTab('tracker');
        if (window.app.trackerManager) {
            setTimeout(() => {
                window.app.trackerManager.startScan();
            }, 500);
        }
    }
    
    deleteDocument(document) {
        if (!confirm(`Weet u zeker dat u ${document.name} wilt verwijderen?`)) {
            return;
        }
        
        // Remove from documents array
        this.documents = this.documents.filter(doc => doc.id !== document.id);
        
        // Update UI
        this.filterAndSortDocuments();
        this.renderDocuments();
        this.updateStats();
        this.saveDocuments();
        
        window.app.showNotification(`${document.name} verwijderd`, 'success');
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    handleDrop(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        this.handleFileUpload(files);
    }
    
    saveDocuments() {
        localStorage.setItem('cao_documents', JSON.stringify(this.documents));
    }
    
    refreshDocuments() {
        this.loadDocuments();
    }
    
    // Utility method
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in main app
window.DocumentsManager = DocumentsManager;