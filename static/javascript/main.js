const dropzone = document.getElementById('dropzone');
const input = document.getElementById('dropzone-file');

function onDropzoneDragover(e) {
    e.preventDefault();
    dropzone.classList.add('bg-gray-100');
}

function onDropzoneDragleave() {
    dropzone.classList.remove('bg-gray-100');
}

function onDropzoneDrop(e) {
    e.preventDefault();
    dropzone.classList.remove('bg-gray-100');

    const file = e.dataTransfer.files[0];
    if (file) {
        const allowedTypes = ['application/pdf', 'text/plain'];
        const maxSizeMB = 2;

        if (!allowedTypes.includes(file.type)) {
            alert('Apenas arquivos PDF ou TXT são permitidos.');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert('Arquivo maior que 2MB.');
            return;
        }

        input.files = e.dataTransfer.files;
        console.log('Arquivo válido:', file.name);
    }
}

async function classifyEmail(e) {
    e.preventDefault();
    try {
        const emailField = document.getElementById('email');
        const email = emailField ? emailField.value : '';
        const res = await fetch('/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
    } catch (error) {
        window.toastManager?.error("Não foi possível classificar o e-mail.");
    }
    

    // const file = input.files[0];
    // if (file) {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     fetch('/upload', {
    //         method: 'POST',
    //         body: formData,
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log('Upload bem-sucedido:', data);
    //         alert('Arquivo enviado com sucesso!');
    //     })
    //     .catch(error => {
    //         console.error('Erro no upload:', error);
    //         alert('Erro ao enviar o arquivo.');
    //     });
    // } else {
    //     alert('Nenhum arquivo selecionado.');
    // }
}