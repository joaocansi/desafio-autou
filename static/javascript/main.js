const CONFIG = {
    fileValidation: {
        allowedTypes: ['application/pdf', 'text/plain'],
        maxSizeMB: 2
    },
    animations: {
        highlightDuration: 1000
    }
};

const MESSAGES = {
    errors: {
        invalidFileType: 'Apenas arquivos PDF ou TXT são permitidos.',
        fileTooLarge: 'Arquivo maior que 2MB.',
        noEmailText: 'Por favor, insira o texto do e-mail.',
        classificationFailed: 'Não foi possível classificar o e-mail.',
        suggestionFailed: 'Erro ao criar sugestão de resposta',
        fileLoadFailed: 'Erro ao carregar o arquivo.',
    },
    loading: {
        readingFile: 'Lendo arquivo...',
        classifying: 'Classificando e-mail...',
        suggesting: 'Criando sugestão de resposta para o e-mail...'
    },
    success: {
        classified: 'E-mail classificado com sucesso!',
        suggested: 'Sugestão criada com sucesso!',
        fileLoaded: 'Arquivo carregado com sucesso!'
    }
};

class EmailProcessor {
    constructor() {
        this.processedEmails = [];
        this.templates = {
            productive: null,
            unproductive: null
        };
        this.init();
    }

    async init() {
        await this.preloadTemplates();
    }

    async preloadTemplates() {
        try {
            const [productiveResponse, unproductiveResponse] = await Promise.all([
                fetch('/components/processed-email/productive-processed-email.html'),
                fetch('/components/processed-email/unproductive-processed-email.html')
            ]);

            this.templates.productive = await productiveResponse.text();
            this.templates.unproductive = await unproductiveResponse.text();
        } catch (error) {
            console.error('Failed to preload templates:', error);
        }
    }

    addEmail(emailData) {
        this.processedEmails.unshift(emailData);
    }

    getEmails() {
        return this.processedEmails;
    }

    getTemplate(classification) {
        return this.templates[classification];
    }
}

const Utils = {
    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    translateClassification(classification) {
        const translations = {
            'productive': 'Produtivo',
            'unproductive': 'Não Produtivo'
        };
        return translations[classification] || classification;
    },

    generateId() {
        return Math.random().toString(36).substring(2, 15);
    },

    validateFile(file) {
        const { allowedTypes, maxSizeMB } = CONFIG.fileValidation;
        
        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: MESSAGES.errors.invalidFileType };
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            return { valid: false, error: MESSAGES.errors.fileTooLarge };
        }

        return { valid: true };
    }
};

class DropzoneHandler {
    constructor() {
        this.dropzone = document.getElementById('dropzone');
        this.input = document.getElementById('dropzone-file');
        this.bindEvents();
    }

    bindEvents() {
        if (this.dropzone) {
            this.dropzone.addEventListener('dragover', this.handleDragover.bind(this));
            this.dropzone.addEventListener('dragleave', this.handleDragleave.bind(this));
            this.dropzone.addEventListener('drop', this.handleDrop.bind(this));
        }
    }

    handleDragover(e) {
        e.preventDefault();
        this.dropzone.classList.add('bg-gray-100');
    }

    handleDragleave() {
        this.dropzone.classList.remove('bg-gray-100');
    }

    async handleDrop(e) {
        e.preventDefault();
        this.dropzone.classList.remove('bg-gray-100');

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const validation = Utils.validateFile(file);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        this.input.files = e.dataTransfer.files;
        
        try {
            const content = await window.toastManager?.loading(this.readFileContent(file), MESSAGES.loading.readingFile, MESSAGES.success.fileLoaded, MESSAGES.errors.fileLoadFailed);
            this.populateTextarea(content);
            console.log('Arquivo processado:', file.name);
        } catch (error) {
            console.error('Erro ao ler arquivo:', error);
            alert('Erro ao ler o conteúdo do arquivo.');
        }
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                let content = e.target.result;
                if (file.type === 'application/pdf')
                    content = 'PDF text extraction requires additional library. Please copy and paste the text manually.';
                resolve(content);
            };
            
            reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
            if (file.type === 'text/plain') {
                reader.readAsText(file, 'UTF-8');
            } else {
                reader.readAsText(file, 'UTF-8');
            }
        });
    }

    populateTextarea(content) {
        const textarea = document.getElementById('email');
        if (textarea) {
            textarea.value = content;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

class EmailService {
    static async classifyEmail(email) {
        const response = await fetch('/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return response;
    }

    static async suggestResponse(email) {
        const response = await fetch('/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return response;
    }
}

class UIManager {
    constructor(emailProcessor) {
        this.emailProcessor = emailProcessor;
    }

    async goToProcessedEmail(id, classification) {
        const element = document.getElementById(`processed-email-${id}`);
        if (!element) return;

        const classificationColor = classification === 'productive' ? 'green' : 'red';
        
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', `ring-${classificationColor}-400`, 'animate-pulse');
        
        setTimeout(() => {
            element.classList.remove('ring-2', `ring-${classificationColor}-400`, 'animate-pulse');
        }, CONFIG.animations.highlightDuration);
    }

    async updateProcessedEmailsList() {
        const list = document.getElementById('processed-emails-list');
        const countElement = document.getElementById('processed-email-count');
        
        if (!list) return;

        list.innerHTML = '';
        
        const emails = this.emailProcessor.getEmails();
        const count = emails.length;
        
        if (countElement) {
            countElement.innerText = `(${count}) E-mails processados`;
        }

        for (const email of emails) {
            await this.renderEmailComponent(email, list);
        }
    }

    async renderEmailComponent(email, container) {
        let componentHtml = this.emailProcessor.getTemplate(email.classification);
        
        if (!componentHtml) {
            const response = await fetch(`/components/processed-email/${email.classification}-processed-email.html`);
            componentHtml = await response.text();
        }

        const sanitizedEmail = Utils.escapeHtml(DOMPurify.sanitize(email.email));
        
        componentHtml = componentHtml
            .replace(/{{id}}/g, email.id)
            .replace("{{email}}", sanitizedEmail)
            .replace("{{classification}}", Utils.translateClassification(email.classification));

        const wrapper = document.createElement('div');
        wrapper.innerHTML = componentHtml;
        
        if (wrapper.firstElementChild) {
            container.appendChild(wrapper.firstElementChild);
        }
    }
}

class EmailClassificationHandler {
    constructor(emailProcessor, uiManager) {
        this.emailProcessor = emailProcessor;
        this.uiManager = uiManager;
    }

    async handleClassification(e) {
        e.preventDefault();
        
        try {
            const emailText = this.getEmailText();
            if (!emailText) {
                window.toastManager?.error(MESSAGES.errors.noEmailText);
                return;
            }

            const shouldSuggest = this.shouldGenerateSuggestion();
            const id = Utils.generateId();

            const classification = await this.classifyEmail(emailText);
            
            const result = {
                id,
                classification,
                email: emailText
            };

            if (shouldSuggest) {
                result.suggestion = await this.generateSuggestion(emailText);
            }

            this.emailProcessor.addEmail(result);
            await this.uiManager.updateProcessedEmailsList();
            await this.uiManager.goToProcessedEmail(id, classification);

            this.clearEmailField();

        } catch (error) {
            console.error('Erro ao classificar o e-mail:', error);
            window.toastManager?.error(MESSAGES.errors.classificationFailed);
        }
    }

    getEmailText() {
        const emailField = document.getElementById('email');
        return emailField?.value || '';
    }

    shouldGenerateSuggestion() {
        const checkbox = document.getElementById('suggestion-checkbox');
        return checkbox?.checked || false;
    }

    async classifyEmail(email) {
        const classifyPromise = EmailService.classifyEmail(email);
        const response = await window.toastManager?.loading(
            classifyPromise,
            MESSAGES.loading.classifying,
            MESSAGES.success.classified,
            MESSAGES.errors.classificationFailed
        ) || await classifyPromise;

        const { classification } = await response.json();
        return classification;
    }

    async generateSuggestion(email) {
        const suggestPromise = EmailService.suggestResponse(email);
        const response = await window.toastManager?.loading(
            suggestPromise,
            MESSAGES.loading.suggesting,
            MESSAGES.success.suggested,
            MESSAGES.errors.suggestionFailed
        ) || await suggestPromise;

        const { suggestion } = await response.json();
        return suggestion;
    }

    clearEmailField() {
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.value = '';
        }
    }
}

class EmailApp {
    constructor() {
        this.emailProcessor = new EmailProcessor();
        this.uiManager = new UIManager(this.emailProcessor);
        this.classificationHandler = new EmailClassificationHandler(this.emailProcessor, this.uiManager);
        this.dropzoneHandler = new DropzoneHandler();
        
        this.bindGlobalFunctions();
    }

    bindGlobalFunctions() {
        window.classifyEmail = this.classificationHandler.handleClassification.bind(this.classificationHandler);
        window.goToProcessedEmail = this.uiManager.goToProcessedEmail.bind(this.uiManager);
        window.suggestEmailAnswer = EmailService.suggestResponse;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmailApp();
});