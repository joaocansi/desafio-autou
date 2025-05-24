class ToastManager {
    constructor() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.style.position = 'fixed';
        this.toastContainer.style.top = '10px';
        this.toastContainer.style.right = '10px';
        this.toastContainer.style.zIndex = '1000';
        document.body.appendChild(this.toastContainer);

        const style = document.createElement('style');
        style.textContent = `
            .toast {
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                margin-bottom: 10px;
            }
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        this.toastTypes = ['error', 'success', 'warning', 'loading'];
        this.templateCache = new Map();
        this.preloadTemplates();
    }

    async preloadTemplates() {
        for (const type of this.toastTypes) {
            const path = `/components/toasts/${type}-toast.handlebars`;
            try {
                const response = await window.loadTemplate(path);
                this.templateCache.set(type, response);
            } catch (e) {
                console.warn(`Não foi possível carregar template: ${path}`);
            }
        }
    }

    async showToast(type, message, options = {}) {
        let templateData = this.templateCache.get(type);
        if (!templateData) {
            const toastTemplatePath = `/components/toasts/${type}-toast.handlebars`;
            try {
                const response = await window.loadTemplate(toastTemplatePath);
                template = response;
                this.templateCache.set(type, response);
            } catch (error) {
                console.error('Error displaying toast:', error);
                return;
            }
        }

        const template = Handlebars.compile(templateData);
        const componentHtml = template(message);
        const toastElement = document.createElement('div');
        toastElement.innerHTML = componentHtml;
        const toastContent = toastElement.firstChild;

        const messageElement = toastContent.querySelector('.toast-message');
        if (messageElement) {
            messageElement.textContent = message;
        }

        toastContent.classList.add('toast');
        this.toastContainer.appendChild(toastContent);

        const closeButton = toastContent.querySelector('[data-dismiss-target]');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                toastContent.classList.remove('show');
                setTimeout(() => {
                    this.toastContainer.removeChild(toastContent);
                }, 300);
            });
        }

        requestAnimationFrame(() => {
            toastContent.classList.add('show');
        });

        if (!options.persist) {
            setTimeout(() => {
                toastContent.classList.remove('show');
                setTimeout(() => {
                    if (this.toastContainer.contains(toastContent)) {
                        this.toastContainer.removeChild(toastContent);
                    }
                }, 300);
            }, 5000);
        }

        return toastContent;
    }

    error(message) {
        this.showToast('error', message);
    }

    success(message) {
        this.showToast('success', message);
    }

    warning(message) {
        this.showToast('warning', message);
    }

    async loading(promise, loadingMessage = 'Carregando...', successMessage = 'Concluído!', errorMessage = 'Erro ao processar') {
        const toast = await this.showToast('loading', loadingMessage, { persist: true });

        try {
            const result = await promise;
            if (toast) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (this.toastContainer.contains(toast)) {
                        this.toastContainer.removeChild(toast);
                    }
                }, 300);
            }
            this.success(successMessage);
            return result;
        } catch (err) {
            if (toast) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (this.toastContainer.contains(toast)) {
                        this.toastContainer.removeChild(toast);
                    }
                }, 300);
            }
            this.error(errorMessage);
            throw err;
        }
    }
}

const toastMessage = new ToastManager();
window.toastManager = toastMessage;
