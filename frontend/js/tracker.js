// CAO Tracker - Tracker Manager Component

class TrackerManager {
    constructor() {
        this.checklistItems = [];
        this.scanInProgress = false;
        this.currentStep = 0;
        this.allCAOs = [
            // Ziekenhuizen
            {
                id: 'cao_ziekenhuizen_nvz',
                name: 'CAO Ziekenhuizen (NVZ)',
                sector: 'ziekenhuis',
                organisatie: 'NVZ',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 1,
                selected: true
            },
            {
                id: 'cao_academische_ziekenhuizen',
                name: 'CAO Academische Ziekenhuizen (NFU)',
                sector: 'ziekenhuis',
                organisatie: 'NFU',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 2,
                selected: false
            },
            {
                id: 'cao_umc',
                name: 'CAO UMC\'s',
                sector: 'ziekenhuis',
                organisatie: 'NFU',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 3,
                selected: false
            },
            // Verpleging & Verzorging
            {
                id: 'cao_verpleeghuizen_actiz',
                name: 'CAO Verpleeg- en Verzorgingshuizen (Actiz)',
                sector: 'verpleging',
                organisatie: 'Actiz',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 4,
                selected: true
            },
            {
                id: 'cao_thuiszorg_actiz',
                name: 'CAO Thuiszorg (Actiz)',
                sector: 'verpleging',
                organisatie: 'Actiz',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 5,
                selected: false
            },
            {
                id: 'cao_gehandicaptenzorg_vgn',
                name: 'CAO Gehandicaptenzorg (VGN)',
                sector: 'verpleging',
                organisatie: 'VGN',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 6,
                selected: true
            },
            // GGZ & Verslavingszorg
            {
                id: 'cao_ggz_nederland',
                name: 'CAO GGZ (GGZ Nederland)',
                sector: 'ggz',
                organisatie: 'GGZ Nederland',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 7,
                selected: true
            },
            {
                id: 'cao_verslavingszorg',
                name: 'CAO Verslavingszorg',
                sector: 'ggz',
                organisatie: 'Verslavingszorg Nederland',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 8,
                selected: false
            },
            // Huisartsen & Eerstelijn
            {
                id: 'cao_huisartsenzorg_lhv',
                name: 'CAO Huisartsenzorg (LHV)',
                sector: 'eerstelijn',
                organisatie: 'LHV',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 9,
                selected: false
            },
            {
                id: 'cao_apotheken_knmp',
                name: 'CAO Apotheken (KNMP)',
                sector: 'eerstelijn',
                organisatie: 'KNMP',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 10,
                selected: false
            },
            // Overige Zorg
            {
                id: 'cao_jeugdzorg',
                name: 'CAO Jeugdzorg',
                sector: 'overig',
                organisatie: 'Jeugdzorg Nederland',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 11,
                selected: false
            },
            {
                id: 'cao_ambulancezorg',
                name: 'CAO Ambulancezorg',
                sector: 'overig',
                organisatie: 'Ambulancezorg Nederland',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 12,
                selected: false
            },
            {
                id: 'cao_kraamzorg',
                name: 'CAO Kraamzorg',
                sector: 'overig',
                organisatie: 'Kraamzorg Nederland',
                vakbond: 'FNV, CNV, FWG',
                status: 'pending',
                progress: 0,
                priority: 13,
                selected: false
            }
        ];
        
        this.filters = {
            sector: '',
            status: 'alle',
            search: ''
        };
        
        this.caoList = this.getSelectedCAOs();
        this.currentCaoIndex = 0;
        this.agents = {
            'analist': {
                name: 'Analist Agent',
                status: 'pending',
                progress: 0,
                tasks: [
                    'Vergelijking met bestaande Excel-documenten',
                    'Detectie van verouderde CAO\'s',
                    'Actuele CAO-schalen zoeken',
                    'Financiële details extractie'
                ]
            },
            'notulist': {
                name: 'Notulist Agent',
                status: 'pending',
                progress: 0,
                tasks: [
                    'Data verzameling via Brave Search',
                    'Documentatie van CAO-veranderingen',
                    'Nieuwe schalen en tarieven',
                    'Gedetailleerde notities voor Excel-Expert'
                ]
            },
            'excel': {
                name: 'Excel-Expert Agent',
                status: 'pending',
                progress: 0,
                tasks: [
                    'Tabblad 1: CAO-schalen en periodieken',
                    'Tabblad 2: Financiële details',
                    'Tabblad 3: Overzicht met veranderingen',
                    'Duidelijke formattering en structuur'
                ]
            },
            'controleur': {
                name: 'Controleur Agent',
                status: 'pending',
                progress: 0,
                tasks: [
                    'Verificatie van Notulist en Excel-Expert werk',
                    'Vergelijking met eerdere overeenkomsten',
                    'Afwijkingen markeren',
                    'Aanbevelingen verstrekken'
                ]
            }
        };
        
        this.init();
    }
    
    async init() {
        try {
            // 1. Load saved data eerst
            await this.loadSavedCAOSelection();
            
            // 2. Render UI
            this.renderCaoSelector();
            this.renderCaoList();
            this.updateCurrentCaoInfo();
            this.updateStats();
            this.loadSavedState();
            
            // 3. Setup event listeners LAATSTE (na rendering)
            this.setupEventListeners();
            
            console.log('TrackerManager initialized successfully');
        } catch (error) {
            console.error('Error initializing TrackerManager:', error);
        }
    }
    
    getSelectedCAOs() {
        return this.allCAOs.filter(cao => cao.selected);
    }
    
    getFilteredCAOs() {
        let filtered = this.allCAOs;
        
        if (this.filters.sector) {
            filtered = filtered.filter(cao => cao.sector === this.filters.sector);
        }
        
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(cao => 
                cao.name.toLowerCase().includes(searchTerm) ||
                cao.organisatie.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }
    
    toggleCAOSelection(caoId) {
        console.log('Toggle called for:', caoId); // Debug log
        
        const cao = this.allCAOs.find(c => c.id === caoId);
        if (!cao) {
            console.error('CAO not found:', caoId);
            return;
        }
        
        // Toggle de state
        cao.selected = !cao.selected;
        
        // Update andere dependencies
        this.caoList = this.getSelectedCAOs();
        
        // Update UI - maar alleen de specifieke checkbox
        this.updateCheckboxState(caoId, cao.selected);
        
        // Update andere components
        this.renderCaoList();
        this.updateCurrentCaoInfo();
        this.saveCAOSelection();
        
        console.log('CAO state updated:', cao.selected); // Debug log
    }
    
    updateCheckboxState(caoId, isSelected) {
        const checkbox = document.querySelector(`input[data-cao-id="${caoId}"]`);
        if (checkbox) {
            checkbox.checked = isSelected;
            
            // Update parent item styling zonder re-render
            const item = checkbox.closest('.cao-selector-item');
            if (item) {
                if (isSelected) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            }
            
            // Update selection count
            const selectedCount = this.allCAOs.filter(cao => cao.selected).length;
            const countElement = document.querySelector('.selected-count');
            if (countElement) {
                countElement.textContent = `${selectedCount} CAO's geselecteerd`;
            }
        }
    }
    
    async saveCAOSelection() {
        const selectedIds = this.allCAOs.filter(cao => cao.selected).map(cao => cao.id);
        
        // Save to localStorage immediately
        try {
            localStorage.setItem('selectedCAOs', JSON.stringify(selectedIds));
            console.log('Saved to localStorage:', selectedIds);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
        
        // Save to backend
        try {
            const response = await fetch('/api/cao-selection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedCAOs: selectedIds })
            });
            
            if (response.ok) {
                console.log('Saved to backend successfully');
            } else {
                console.warn('Backend save failed:', response.status);
            }
        } catch (error) {
            console.warn('Error saving to backend:', error);
        }
    }

    async loadSavedCAOSelection() {
        try {
            // Try to load from backend first
            const response = await fetch('/api/cao-selection');
            if (response.ok) {
                const data = await response.json();
                const savedSelection = data.selectedCAOs || [];
                
                if (savedSelection.length > 0) {
                    this.allCAOs.forEach(cao => {
                        cao.selected = savedSelection.includes(cao.id);
                    });
                    this.caoList = this.getSelectedCAOs();
                    return;
                }
            }
        } catch (error) {
            console.warn('Error loading CAO selection from backend:', error);
        }
        
        // Fallback to localStorage
        const savedSelection = JSON.parse(localStorage.getItem('selectedCAOs') || '[]');
        if (savedSelection.length > 0) {
            this.allCAOs.forEach(cao => {
                cao.selected = savedSelection.includes(cao.id);
            });
            this.caoList = this.getSelectedCAOs();
        }
    }
    
    removeEventListeners() {
        // Remove existing event listeners to prevent duplicates
        const startScanBtn = document.getElementById('startScanBtn');
        if (startScanBtn && this.startScanHandler) {
            startScanBtn.removeEventListener('click', this.startScanHandler);
        }
        
        const container = document.getElementById('caoSelectorContainer');
        if (container && this.containerChangeHandler) {
            container.removeEventListener('change', this.containerChangeHandler);
        }
        
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter && this.sectorFilterHandler) {
            sectorFilter.removeEventListener('change', this.sectorFilterHandler);
        }
        
        const caoSearch = document.getElementById('caoSearch');
        if (caoSearch && this.searchHandler) {
            caoSearch.removeEventListener('input', this.searchHandler);
        }
        
        if (this.documentClickHandler) {
            document.removeEventListener('click', this.documentClickHandler);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...'); // Debug
        
        // Remove existing listeners to prevent duplicates
        this.removeEventListeners();
        
        // Start Scan button
        const startScanBtn = document.getElementById('startScanBtn');
        if (startScanBtn) {
            this.startScanHandler = () => {
                this.startScan();
            };
            startScanBtn.addEventListener('click', this.startScanHandler);
        }
        
        // Event delegation op container niveau voor CAO checkboxes
        const container = document.getElementById('caoSelectorContainer');
        console.log('Container found:', container); // Debug
        
        if (container) {
            // Event delegation voor CAO checkboxes
            this.containerChangeHandler = (e) => {
                console.log('Change event triggered!'); // Debug
                if (e.target && e.target.classList.contains('cao-checkbox')) {
                    e.stopPropagation(); // Stop event bubbling!
                    console.log('Checkbox change detected:', e.target.dataset.caoId);
                    
                    const caoId = e.target.dataset.caoId;
                    if (caoId) {
                        this.toggleCAOSelection(caoId);
                    } else {
                        console.error('No cao-id found on checkbox');
                    }
                }
            };
            container.addEventListener('change', this.containerChangeHandler);
        }
        
        // Filter events - ALLEEN voor sectorFilter
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter) {
            this.sectorFilterHandler = (e) => {
                this.filters.sector = e.target.value;
                this.renderCaoSelector();
            };
            sectorFilter.addEventListener('change', this.sectorFilterHandler);
        }
        
        // Search events
        const caoSearch = document.getElementById('caoSearch');
        if (caoSearch) {
            this.searchHandler = (e) => {
                this.filters.search = e.target.value;
                this.renderCaoSelector();
            };
            caoSearch.addEventListener('input', this.searchHandler);
        }
        
        // Checklist item details toggle
        this.documentClickHandler = (e) => {
            if (e.target.closest('.checklist-header')) {
                const checklistItem = e.target.closest('.checklist-item');
                this.toggleChecklistDetails(checklistItem);
            }
            
            // Details buttons
            if (e.target.closest('.checklist-actions button')) {
                const checklistItem = e.target.closest('.checklist-item');
                const agentId = checklistItem.dataset.agent;
                this.showAgentDetails(agentId);
            }
        };
        document.addEventListener('click', this.documentClickHandler);
    }
    
    renderCaoSelector() {
        const container = document.getElementById('caoSelectorContainer');
        if (!container) return;
        
        const filteredCAOs = this.getFilteredCAOs();
        const selectedCount = this.allCAOs.filter(cao => cao.selected).length;
        
        container.innerHTML = `
            <div class="cao-selector-header">
                <h3>CAO Selectie voor Analyse</h3>
                <div class="cao-selector-controls">
                    <div class="filter-group">
                        <label for="sectorFilter">Sector:</label>
                        <select id="sectorFilter">
                            <option value="">Alle sectoren</option>
                            <option value="ziekenhuis" ${this.filters.sector === 'ziekenhuis' ? 'selected' : ''}>Ziekenhuizen</option>
                            <option value="verpleging" ${this.filters.sector === 'verpleging' ? 'selected' : ''}>Verpleging & Verzorging</option>
                            <option value="ggz" ${this.filters.sector === 'ggz' ? 'selected' : ''}>GGZ & Verslavingszorg</option>
                            <option value="eerstelijn" ${this.filters.sector === 'eerstelijn' ? 'selected' : ''}>Huisartsen & Eerstelijn</option>
                            <option value="overig" ${this.filters.sector === 'overig' ? 'selected' : ''}>Overige Zorg</option>
                        </select>
                    </div>
                    <div class="search-group">
                        <label for="caoSearch">Zoeken:</label>
                        <input type="text" id="caoSearch" placeholder="Zoek CAO's..." value="${this.filters.search}">
                    </div>
                </div>
                <div class="selection-summary">
                    <span class="selected-count">${selectedCount} CAO's geselecteerd</span>
                </div>
            </div>
            <div class="cao-selector-list">
                ${filteredCAOs.map(cao => `
                    <div class="cao-selector-item ${cao.selected ? 'selected' : ''}">
                        <label class="cao-checkbox-label">
                            <input type="checkbox" class="cao-checkbox" data-cao-id="${cao.id}" ${cao.selected ? 'checked' : ''}>
                            <div class="cao-info">
                                <div class="cao-name">${cao.name}</div>
                                <div class="cao-details">
                                    <span class="cao-sector">${this.getSectorDisplayName(cao.sector)}</span>
                                    <span class="cao-org">${cao.organisatie}</span>
                                    <span class="cao-vakbond">${cao.vakbond}</span>
                                </div>
                            </div>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Re-attach event listeners voor filter/search
        // (checkboxes worden afgehandeld via event delegation op container)
        this.attachFilterListeners();
    }
    
    attachFilterListeners() {
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter && this.sectorFilterHandler) {
            sectorFilter.removeEventListener('change', this.sectorFilterHandler);
            sectorFilter.addEventListener('change', this.sectorFilterHandler);
        }
        
        const caoSearch = document.getElementById('caoSearch');
        if (caoSearch && this.searchHandler) {
            caoSearch.removeEventListener('input', this.searchHandler);
            caoSearch.addEventListener('input', this.searchHandler);
        }
    }
    
    getSectorDisplayName(sector) {
        const sectorNames = {
            'ziekenhuis': 'Ziekenhuizen',
            'verpleging': 'Verpleging & Verzorging',
            'ggz': 'GGZ & Verslavingszorg',
            'eerstelijn': 'Huisartsen & Eerstelijn',
            'overig': 'Overige Zorg'
        };
        return sectorNames[sector] || sector;
    }
    
    async startScan() {
        if (this.scanInProgress) {
            window.app.showNotification('Scan is al bezig', 'warning');
            return;
        }
        
        // Confirm start
        if (!confirm('Weet u zeker dat u de CAO analyse workflow wilt starten?')) {
            return;
        }
        
        this.scanInProgress = true;
        this.currentStep = 0;
        
        // Update UI
        this.updateStartScanButton(true);
        this.resetAllAgents();
        
        window.app.showNotification('CAO analyse workflow gestart', 'success');
        
        try {
            // Start the workflow
            await this.executeWorkflow();
            
        } catch (error) {
            console.error('Workflow error:', error);
            window.app.showNotification('Fout tijdens workflow uitvoering', 'error');
            this.scanInProgress = false;
            this.updateStartScanButton(false);
        }
    }
    
    async executeWorkflow() {
        const agentOrder = ['analist', 'notulist', 'excel', 'controleur'];
        
        // Start processing first CAO
        this.updateCaoStatus(this.currentCaoIndex, 'processing');
        
        for (let caoIndex = 0; caoIndex < this.caoList.length; caoIndex++) {
            this.currentCaoIndex = caoIndex;
            this.updateCurrentCaoInfo();
            this.updateCaoStatus(caoIndex, 'processing');
            
            window.app.showNotification(`Bezig met analyse van: ${this.caoList[caoIndex].name}`, 'info');
            
            // Reset agents for new CAO
            this.resetAllAgents();
            
            for (let i = 0; i < agentOrder.length; i++) {
                const agentId = agentOrder[i];
                this.currentStep = i;
                
                // Update agent status to running
                this.updateAgentStatus(agentId, 'running');
                
                // Simulate agent execution
                await this.executeAgent(agentId);
                
                // Update agent status to completed
                this.updateAgentStatus(agentId, 'completed');
                
                // Update CAO progress based on agent completion
                const caoProgress = ((i + 1) / agentOrder.length) * 100;
                this.updateCaoProgress(caoIndex, caoProgress);
                
                // Small delay between agents
                await this.delay(1000);
            }
            
            // CAO completed
            this.updateCaoStatus(caoIndex, 'completed');
            this.updateCaoProgress(caoIndex, 100);
            
            window.app.showNotification(`${this.caoList[caoIndex].name} analyse voltooid!`, 'success');
            
            // Delay before next CAO
            if (caoIndex < this.caoList.length - 1) {
                await this.delay(2000);
            }
        }
        
        // All workflows completed
        this.scanInProgress = false;
        this.updateStartScanButton(false);
        this.updateStats();
        this.updateCurrentCaoInfo();
        
        window.app.showNotification('Alle CAO analyses voltooid!', 'success');
        
        // Show completion message
        this.showWorkflowCompletion();
        
        // Save state
        this.saveState();
    }
    
    async executeAgent(agentId) {
        const agent = this.agents[agentId];
        const tasks = agent.tasks;
        
        // Simulate task execution with progress updates
        for (let i = 0; i < tasks.length; i++) {
            const progress = ((i + 1) / tasks.length) * 100;
            this.updateAgentProgress(agentId, progress);
            
            // Simulate processing time
            await this.delay(2000 + Math.random() * 3000);
        }
        
        // Final progress update
        this.updateAgentProgress(agentId, 100);
    }
    
    updateAgentStatus(agentId, status) {
        this.agents[agentId].status = status;
        
        const checklistItem = document.querySelector(`[data-agent="${agentId}"]`);
        if (!checklistItem) return;
        
        const statusIcon = checklistItem.querySelector('.checklist-status i');
        const detailsBtn = checklistItem.querySelector('.checklist-actions button');
        
        // Remove all status classes
        statusIcon.classList.remove('status-pending', 'status-running', 'status-completed', 'status-error');
        
        switch (status) {
            case 'pending':
                statusIcon.classList.add('status-pending');
                statusIcon.className = 'fas fa-circle status-pending';
                detailsBtn.disabled = true;
                break;
            case 'running':
                statusIcon.classList.add('status-running');
                statusIcon.className = 'fas fa-spinner fa-spin status-running';
                detailsBtn.disabled = false;
                break;
            case 'completed':
                statusIcon.classList.add('status-completed');
                statusIcon.className = 'fas fa-check-circle status-completed';
                detailsBtn.disabled = false;
                break;
            case 'error':
                statusIcon.classList.add('status-error');
                statusIcon.className = 'fas fa-exclamation-circle status-error';
                detailsBtn.disabled = false;
                break;
        }
        
        this.updateStats();
        this.saveState();
    }
    
    updateAgentProgress(agentId, progress) {
        this.agents[agentId].progress = progress;
        
        const checklistItem = document.querySelector(`[data-agent="${agentId}"]`);
        if (!checklistItem) return;
        
        const progressFill = checklistItem.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        this.saveState();
    }
    
    updateStartScanButton(isScanning) {
        const startScanBtn = document.getElementById('startScanBtn');
        if (!startScanBtn) return;
        
        if (isScanning) {
            startScanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scan Bezig...';
            startScanBtn.disabled = true;
            startScanBtn.classList.add('scanning');
        } else {
            startScanBtn.innerHTML = '<i class="fas fa-play"></i> Start Scan';
            startScanBtn.disabled = false;
            startScanBtn.classList.remove('scanning');
        }
    }
    
    updateStats() {
        const totalChecks = Object.keys(this.agents).length;
        const completedChecks = Object.values(this.agents).filter(agent => agent.status === 'completed').length;
        const pendingChecks = totalChecks - completedChecks;
        
        const totalElement = document.getElementById('totalChecks');
        const completedElement = document.getElementById('completedChecks');
        const pendingElement = document.getElementById('pendingChecks');
        
        if (totalElement) totalElement.textContent = totalChecks;
        if (completedElement) completedElement.textContent = completedChecks;
        if (pendingElement) pendingElement.textContent = pendingChecks;
    }
    
    toggleChecklistDetails(checklistItem) {
        const details = checklistItem.querySelector('.checklist-details');
        if (!details) return;
        
        const isVisible = details.style.display !== 'none';
        
        if (isVisible) {
            details.style.display = 'none';
            checklistItem.classList.remove('expanded');
        } else {
            details.style.display = 'block';
            checklistItem.classList.add('expanded');
        }
    }
    
    showAgentDetails(agentId) {
        const agent = this.agents[agentId];
        if (!agent) return;
        
        // Create modal or detailed view
        const modal = this.createAgentModal(agentId, agent);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    createAgentModal(agentId, agent) {
        const modal = document.createElement('div');
        modal.className = 'agent-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${agent.name}</h3>
                    <button class="close-btn" onclick="this.closest('.agent-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="agent-status-info">
                        <div class="status-badge status-${agent.status}">
                            ${this.getStatusText(agent.status)}
                        </div>
                        <div class="progress-info">
                            <span>Voortgang: ${Math.round(agent.progress)}%</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${agent.progress}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="agent-tasks">
                        <h4>Taken:</h4>
                        <ul>
                            ${agent.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                    ${agent.status === 'completed' ? this.getCompletedAgentInfo(agentId) : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.agent-modal').remove()">
                        Sluiten
                    </button>
                    ${agent.status === 'completed' ? `
                        <button class="btn btn-primary" onclick="app.trackerManager.downloadAgentResults('${agentId}')">
                            <i class="fas fa-download"></i>
                            Download Resultaten
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        return modal;
    }
    
    getStatusText(status) {
        const statusMap = {
            'pending': 'Wachtend',
            'running': 'Bezig',
            'completed': 'Voltooid',
            'error': 'Fout'
        };
        
        return statusMap[status] || 'Onbekend';
    }
    
    getCompletedAgentInfo(agentId) {
        // Return specific completion info based on agent
        const completionInfo = {
            'analist': 'CAO analyse voltooid. Verouderde gegevens gedetecteerd en gemarkeerd.',
            'notulist': 'Gegevens verzameld van 5 betrouwbare bronnen. Notities gereed voor Excel-Expert.',
            'excel': 'Excel-bestand gegenereerd met 3 werkbladen. Alle gegevens gestructureerd.',
            'controleur': 'Verificatie voltooid. Geen afwijkingen gevonden. Bestand goedgekeurd.'
        };
        
        return `
            <div class="completion-info">
                <h4>Resultaat:</h4>
                <p>${completionInfo[agentId] || 'Taak succesvol voltooid.'}</p>
            </div>
        `;
    }
    
    async downloadAgentResults(agentId) {
        try {
            window.app.showLoading('Resultaten voorbereiden...');
            
            // Simulate download preparation
            await this.delay(1500);
            
            // In a real implementation, this would fetch the actual results
            const response = await fetch(`/api/agents/${agentId}/results`, {
                method: 'GET'
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${agentId}_results_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                window.app.showNotification('Resultaten gedownload', 'success');
            } else {
                throw new Error('Download failed');
            }
            
        } catch (error) {
            console.error('Download error:', error);
            window.app.showNotification('Fout bij downloaden van resultaten', 'error');
        } finally {
            window.app.hideLoading();
        }
    }
    
    resetAllAgents() {
        this.agents = {
            analist: { status: 'pending', progress: 0 },
            notulist: { status: 'pending', progress: 0 },
            excel: { status: 'pending', progress: 0 },
            controleur: { status: 'pending', progress: 0 }
        };
        
        this.currentStep = 0;
        
        // Update UI
        this.updateAgentStatuses();
        this.updateStats();
    }
    
    resetAgents() {
        this.agents = {
            analist: { status: 'pending', progress: 0 },
            notulist: { status: 'pending', progress: 0 },
            excel: { status: 'pending', progress: 0 },
            controleur: { status: 'pending', progress: 0 }
        };
        
        this.currentStep = 0;
        this.scanInProgress = false;
        
        // Reset all CAO statuses
        this.caoList.forEach((cao, index) => {
            cao.status = 'pending';
            cao.progress = 0;
        });
        this.currentCaoIndex = 0;
        
        // Update UI
        this.updateAgentStatuses();
        this.updateStartScanButton(false);
        this.updateStats();
        this.renderCaoList();
        this.updateCurrentCaoInfo();
        
        // Save state
        this.saveState();
        
        window.app.showNotification('Agents en CAO lijst gereset', 'info');
    }
    
    showWorkflowCompletion() {
        const trackerEmpty = document.getElementById('trackerEmpty');
        if (trackerEmpty) {
            trackerEmpty.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                trackerEmpty.style.display = 'none';
            }, 5000);
        }
    }
    
    saveState() {
        const state = {
            agents: this.agents,
            scanInProgress: this.scanInProgress,
            currentStep: this.currentStep,
            caoList: this.caoList,
            currentCaoIndex: this.currentCaoIndex,
            lastUpdate: new Date().toISOString()
        };
        
        localStorage.setItem('trackerState', JSON.stringify(state));
    }
    
    loadSavedState() {
        const savedState = localStorage.getItem('trackerState');
        if (!savedState) return;
        
        try {
            const state = JSON.parse(savedState);
            
            // Check if state is recent (within 24 hours)
            const lastUpdate = new Date(state.lastUpdate);
            const now = new Date();
            const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                // State is too old, reset
                this.resetAllAgents();
                return;
            }
            
            // Restore state
            this.agents = state.agents || this.agents;
            this.scanInProgress = state.scanInProgress || false;
            this.currentStep = state.currentStep || 0;
            
            // Restore CAO list state if available
            if (state.caoList && Array.isArray(state.caoList)) {
                this.caoList = state.caoList;
            }
            this.currentCaoIndex = state.currentCaoIndex || 0;
            
            // Update UI
            Object.keys(this.agents).forEach(agentId => {
                const agent = this.agents[agentId];
                this.updateAgentStatus(agentId, agent.status);
                this.updateAgentProgress(agentId, agent.progress);
            });
            
            this.updateStartScanButton(this.scanInProgress);
            this.updateStats();
            this.renderCaoList();
            this.updateCurrentCaoInfo();
            
        } catch (error) {
            console.error('Error loading saved state:', error);
            this.resetAllAgents();
        }
    }
    
    renderCaoList() {
        const container = document.getElementById('caoListContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.caoList.forEach((cao, index) => {
            const caoElement = document.createElement('div');
            caoElement.className = `cao-item ${cao.status}`;
            if (index === this.currentCaoIndex) {
                caoElement.classList.add('current');
            }
            
            caoElement.innerHTML = `
                <div class="cao-item-header">
                    <div class="cao-item-name">${cao.name}</div>
                    <div class="cao-item-status">
                        <i class="fas fa-circle status-${cao.status}"></i>
                        <span>${this.getCaoStatusText(cao.status)}</span>
                    </div>
                </div>
                <div class="cao-item-progress">
                    <div class="cao-item-progress-fill" style="width: ${cao.progress}%;"></div>
                </div>
            `;
            
            container.appendChild(caoElement);
        });
    }
    
    updateCurrentCaoInfo() {
        const currentCaoName = document.getElementById('currentCaoName');
        if (!currentCaoName) return;
        
        if (this.currentCaoIndex < this.caoList.length) {
            const currentCao = this.caoList[this.currentCaoIndex];
            currentCaoName.textContent = currentCao.name;
        } else {
            currentCaoName.textContent = 'Alle CAO\'s voltooid';
        }
    }
    
    getCaoStatusText(status) {
        const statusTexts = {
            'pending': 'Wachtend',
            'processing': 'In behandeling',
            'completed': 'Voltooid',
            'error': 'Fout'
        };
        return statusTexts[status] || 'Onbekend';
    }
    
    updateCaoProgress(caoIndex, progress) {
        if (caoIndex >= 0 && caoIndex < this.caoList.length) {
            this.caoList[caoIndex].progress = progress;
            this.renderCaoList();
        }
    }
    
    updateCaoStatus(caoIndex, status) {
        if (caoIndex >= 0 && caoIndex < this.caoList.length) {
            this.caoList[caoIndex].status = status;
            this.renderCaoList();
            this.updateCurrentCaoInfo();
        }
    }
    
    moveToNextCao() {
        if (this.currentCaoIndex < this.caoList.length - 1) {
            // Mark current CAO as completed
            this.updateCaoStatus(this.currentCaoIndex, 'completed');
            this.updateCaoProgress(this.currentCaoIndex, 100);
            
            // Move to next CAO
            this.currentCaoIndex++;
            this.updateCurrentCaoInfo();
            
            // Start processing next CAO
            if (this.currentCaoIndex < this.caoList.length) {
                this.updateCaoStatus(this.currentCaoIndex, 'processing');
            }
        } else {
            // All CAOs completed
            this.updateCaoStatus(this.currentCaoIndex, 'completed');
            this.updateCaoProgress(this.currentCaoIndex, 100);
            this.updateCurrentCaoInfo();
        }
    }
    
    refreshTasks() {
        // Called when tracker tab becomes active
        this.updateStats();
    }
    
    onResize() {
        // Handle responsive adjustments if needed
    }
    
    hasUnsavedChanges() {
        // Check if there are any unsaved changes
        return this.scanInProgress;
    }
    
    // Utility method
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Debug method om checkbox states te controleren
    debugCheckboxStates() {
        const checkboxes = document.querySelectorAll('.cao-checkbox');
        console.log('Checkbox states:');
        checkboxes.forEach(cb => {
            console.log(`${cb.dataset.caoId}: ${cb.checked}`);
        });
        
        console.log('Data states:');
        this.allCAOs.forEach(cao => {
            console.log(`${cao.id}: ${cao.selected}`);
        });
    }
}

// Export for use in main app
window.TrackerManager = TrackerManager;

// Also export instance for direct access
if (window.app && window.app.trackerManager) {
    window.trackerManager = window.app.trackerManager;
}