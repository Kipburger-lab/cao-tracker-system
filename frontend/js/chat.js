// CAO Tracker - Chat Manager Component

class ChatManager {
    constructor() {
        this.messages = [];
        this.currentAgent = null;
        this.isTyping = false;
        this.messageHistory = [];
        this.agents = {
            'general': {
                name: 'Algemene Agent',
                description: 'Intelligente routing agent die uw vraag naar de juiste specialist doorverwijst',
                status: 'online',
                avatar: 'fas fa-robot',
                isDefault: true
            },
            'analist': {
                name: 'CAO Analist',
                description: 'Analyseert CAO documenten en identificeert belangrijke clausules',
                status: 'offline',
                avatar: 'fas fa-search'
            },
            'notulist': {
                name: 'Notulist',
                description: 'Maakt gestructureerde samenvattingen van CAO analyses',
                status: 'offline',
                avatar: 'fas fa-file-alt'
            },
            'excel': {
                name: 'Excel Expert',
                description: 'Verwerkt data naar Excel formaten en maakt rapporten',
                status: 'offline',
                avatar: 'fas fa-table'
            },
            'controleur': {
                name: 'Controleur',
                description: 'Controleert kwaliteit en consistentie van analyses',
                status: 'offline',
                avatar: 'fas fa-check-circle'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.currentAgent = 'general'; // Automatisch algemene agent instellen
        this.loadChatHistory();
        this.checkAgentStatus();
        this.updateChatHeader();
    }
    
    setupEventListeners() {
        // Message input
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendMessage');
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            messageInput.addEventListener('input', () => {
                this.handleTyping();
            });
        }
        
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // File upload
        const fileUpload = document.getElementById('chatFileUpload');
        if (fileUpload) {
            fileUpload.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
        
        // Agent selection is now handled automatically by the general agent
        
        // Clear chat
        const clearButton = document.getElementById('clearChat');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearChat();
            });
        }
    }
    
    updateChatHeader() {
        // Update chat header to show current agent
        const chatHeader = document.querySelector('.chat-header h2');
        if (chatHeader && this.agents[this.currentAgent]) {
            chatHeader.textContent = `AI Agent Chat - ${this.agents[this.currentAgent].name}`;
        }
    }
    
    // Agent selection is now automatic - general agent handles routing
    

    
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || !this.currentAgent) {
            if (!this.currentAgent) {
                window.app.showNotification('Selecteer eerst een agent', 'warning');
            }
            return;
        }
        
        // Clear input
        messageInput.value = '';
        
        // Add user message to chat
        this.addMessage({
            type: 'user',
            content: message,
            timestamp: new Date(),
            agent: this.currentAgent
        });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send message to backend
            const response = await this.sendToAgent(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add agent response
            this.addMessage({
                type: 'agent',
                content: response.message,
                timestamp: new Date(),
                agent: this.currentAgent,
                metadata: response.metadata
            });
            
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Error sending message:', error);
            this.addMessage({
                type: 'error',
                content: 'Er is een fout opgetreden bij het verzenden van het bericht.',
                timestamp: new Date(),
                agent: this.currentAgent
            });
        }
    }
    
    async sendToAgent(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agent: this.currentAgent,
                message: message,
                session_id: this.getSessionId()
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    addMessage(messageData) {
        this.messages.push(messageData);
        this.renderMessage(messageData);
        this.scrollToBottom();
        this.saveChatHistory();
    }
    
    renderMessage(messageData) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageData.type}`;
        
        const timestamp = window.app.formatDate(messageData.timestamp);
        
        let content = '';
        
        switch (messageData.type) {
            case 'user':
                content = `
                    <div class="message-header">
                        <span class="sender">U</span>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <div class="message-content">${this.formatMessageContent(messageData.content)}</div>
                `;
                break;
                
            case 'agent':
                const agent = this.agents[messageData.agent];
                content = `
                    <div class="message-header">
                        <div class="agent-info">
                            <i class="${agent.avatar}"></i>
                            <span class="sender">${agent.name}</span>
                        </div>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <div class="message-content">${this.formatMessageContent(messageData.content)}</div>
                    ${messageData.metadata ? this.renderMetadata(messageData.metadata) : ''}
                `;
                break;
                
            case 'system':
                content = `
                    <div class="message-content system">
                        <i class="fas fa-info-circle"></i>
                        ${messageData.content}
                    </div>
                `;
                break;
                
            case 'error':
                content = `
                    <div class="message-content error">
                        <i class="fas fa-exclamation-triangle"></i>
                        ${messageData.content}
                    </div>
                `;
                break;
        }
        
        messageElement.innerHTML = content;
        chatMessages.appendChild(messageElement);
    }
    
    formatMessageContent(content) {
        // Convert URLs to links
        content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks
        content = content.replace(/\n/g, '<br>');
        
        // Convert markdown-style formatting
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        content = content.replace(/`(.*?)`/g, '<code>$1</code>');
        
        return content;
    }
    
    renderMetadata(metadata) {
        if (!metadata || Object.keys(metadata).length === 0) return '';
        
        let metadataHtml = '<div class="message-metadata">';
        
        if (metadata.confidence) {
            metadataHtml += `<span class="confidence">Betrouwbaarheid: ${Math.round(metadata.confidence * 100)}%</span>`;
        }
        
        if (metadata.processing_time) {
            metadataHtml += `<span class="processing-time">Verwerkingstijd: ${metadata.processing_time}ms</span>`;
        }
        
        if (metadata.sources && metadata.sources.length > 0) {
            metadataHtml += '<div class="sources">Bronnen: ';
            metadata.sources.forEach(source => {
                metadataHtml += `<span class="source">${source}</span>`;
            });
            metadataHtml += '</div>';
        }
        
        metadataHtml += '</div>';
        
        return metadataHtml;
    }
    
    addSystemMessage(content) {
        this.addMessage({
            type: 'system',
            content: content,
            timestamp: new Date()
        });
    }
    
    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        
        const typingElement = document.createElement('div');
        typingElement.className = 'message typing-indicator';
        typingElement.id = 'typingIndicator';
        
        const agent = this.agents[this.currentAgent];
        typingElement.innerHTML = `
            <div class="message-header">
                <div class="agent-info">
                    <i class="${agent.avatar}"></i>
                    <span class="sender">${agent.name}</span>
                </div>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typingIndicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    async handleFileUpload(files) {
        if (!files || files.length === 0) return;
        
        const file = files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (file.size > maxSize) {
            window.app.showNotification('Bestand is te groot (max 10MB)', 'error');
            return;
        }
        
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        
        if (!allowedTypes.includes(file.type)) {
            window.app.showNotification('Bestandstype niet ondersteund', 'error');
            return;
        }
        
        try {
            window.app.showLoading('Bestand uploaden...');
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('agent', this.currentAgent);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const result = await response.json();
            
            window.app.hideLoading();
            
            // Add file message to chat
            this.addMessage({
                type: 'user',
                content: `Bestand geüpload: ${file.name}`,
                timestamp: new Date(),
                agent: this.currentAgent,
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    id: result.file_id
                }
            });
            
            window.app.showNotification('Bestand succesvol geüpload', 'success');
            
        } catch (error) {
            window.app.hideLoading();
            console.error('File upload error:', error);
            window.app.showNotification('Fout bij uploaden van bestand', 'error');
        }
    }
    
    async checkAgentStatus() {
        try {
            const response = await fetch('/api/agents/status');
            if (response.ok) {
                const statuses = await response.json();
                
                Object.entries(statuses).forEach(([agentId, status]) => {
                    if (this.agents[agentId]) {
                        this.agents[agentId].status = status;
                    }
                });
                
                this.renderAgentList();
            }
        } catch (error) {
            console.error('Error checking agent status:', error);
        }
        
        // Check again in 30 seconds
        setTimeout(() => this.checkAgentStatus(), 30000);
    }
    
    getStatusText(status) {
        const statusMap = {
            'online': 'Online',
            'offline': 'Offline',
            'busy': 'Bezig',
            'error': 'Fout'
        };
        
        return statusMap[status] || 'Onbekend';
    }
    
    clearChat() {
        if (confirm('Weet u zeker dat u de chat wilt wissen?')) {
            this.messages = [];
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = '';
            }
            this.saveChatHistory();
            window.app.showNotification('Chat gewist', 'success', 2000);
        }
    }
    
    handleTyping() {
        // Could implement typing indicators for other users
    }
    
    getSessionId() {
        let sessionId = localStorage.getItem('cao_tracker_session');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('cao_tracker_session', sessionId);
        }
        return sessionId;
    }
    
    saveChatHistory() {
        const historyKey = `chat_history_${this.currentAgent || 'general'}`;
        localStorage.setItem(historyKey, JSON.stringify(this.messages));
    }
    
    loadChatHistory() {
        // Load general chat history on init
        this.loadAgentChatHistory('general');
    }
    
    loadAgentChatHistory(agentId) {
        const historyKey = `chat_history_${agentId}`;
        const savedHistory = localStorage.getItem(historyKey);
        
        if (savedHistory) {
            try {
                this.messages = JSON.parse(savedHistory);
                this.renderChatHistory();
            } catch (error) {
                console.error('Error loading chat history:', error);
                this.messages = [];
            }
        } else {
            this.messages = [];
        }
    }
    
    renderChatHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            this.messages.forEach(message => {
                this.renderMessage(message);
            });
            this.scrollToBottom();
        }
    }
    
    onTabActivated() {
        // Called when chat tab becomes active
        this.scrollToBottom();
        
        // Focus message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    }
    
    onResize() {
        // Handle responsive adjustments
        this.scrollToBottom();
    }
}

// Export for use in main app
window.ChatManager = ChatManager;