// CAO Tracker - Tracker Manager Component

class TrackerManager {
    constructor() {
        this.checklistItems = [];
        this.scanInProgress = false;
        this.currentStep = 0;
        this.caoList = [
            {
                id: 'vvt',
                name: 'VVT (Verpleeg-, Verzorgingshuizen en Thuiszorg)',
                status: 'pending',
                progress: 0,
                priority: 1
            },
            {
                id: 'vgn',
                name: 'VGN (Vereniging Gehandicaptenzorg Nederland)',
                status: 'pending',
                progress: 0,
                priority: 2
            },
            {
                id: 'ggz',
                name: 'GGZ (Geestelijke Gezondheidszorg)',
                status: 'pending',
                progress: 0,
                priority: 3
            },
            {
                id: 'zkh',
                name: 'ZKH (Ziekenhuizen)',
                status: 'pending',
                progress: 0,
                priority: 4
            }
        ];
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
    
    init() {
        this.setupEventListeners();
        this.renderCaoList();
        this.updateCurrentCaoInfo();
        this.updateStats();
        this.loadSavedState();
    }
    
    setupEventListeners() {
        // Start Scan button
        const startScanBtn = document.getElementById('startScanBtn');
        if (startScanBtn) {
            startScanBtn.addEventListener('click', () => {
                this.startScan();
            });
        }
        
        // Checklist item details toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.checklist-header')) {
                const checklistItem = e.target.closest('.checklist-item');
                this.toggleChecklistDetails(checklistItem);
            }
        });
        
        // Details buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.checklist-actions button')) {
                const checklistItem = e.target.closest('.checklist-item');
                const agentId = checklistItem.dataset.agent;
                this.showAgentDetails(agentId);
            }
        });
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
}

// Export for use in main app
window.TrackerManager = TrackerManager;