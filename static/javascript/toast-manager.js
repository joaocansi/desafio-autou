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
    }

    async showToast(type, message) {
        const toastTemplatePath = `/components/toasts/${type}-toast.html`;

        try {
            const response = await fetch(toastTemplatePath);
            if (!response.ok) {
                throw new Error(`Failed to load toast template: ${toastTemplatePath}`);
            }

            const template = await response.text();
            const toastElement = document.createElement('div');
            toastElement.innerHTML = template.trim();
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

            setTimeout(() => {
                toastContent.classList.remove('show');
                setTimeout(() => {
                    if (this.toastContainer.contains(toastContent)) {
                        this.toastContainer.removeChild(toastContent);
                    }
                }, 300);
            }, 5000);
        } catch (error) {
            console.error('Error displaying toast:', error);
        }
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
}

window.toastManager = new ToastManager();