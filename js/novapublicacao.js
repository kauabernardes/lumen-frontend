document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadContent = document.getElementById('uploadContent');
    const btnRemove = document.getElementById('btnRemoveImage');
    const btnPostar = document.getElementById('btnPostar');
    const textarea = document.getElementById('desc');

    dropArea.addEventListener('click', (e) => {
        if (e.target.closest('#btnRemoveImage')) return;
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadContent.style.display = 'none';
                btnRemove.style.display = 'flex';
            }
            reader.readAsDataURL(file);
        }
    });

    btnRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = "";
        imagePreview.src = "";
        imagePreview.style.display = 'none';
        uploadContent.style.display = 'block';
        btnRemove.style.display = 'none';
    });

    btnPostar.addEventListener('click', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const communityId = urlParams.get('id') || urlParams.get('communityId');

        if (!communityId) {
            alert("Erro: ID da comunidade não encontrado na URL!");
            return;
        }

        if (textarea.value.trim() === "") {
            alert("Escreve uma descrição para a tua publicação!");
            textarea.focus();
            return;
        }

        const textoOriginal = btnPostar.innerHTML;
        btnPostar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';
        btnPostar.disabled = true;

        try {
            // Chamada ao serviço global
            await window.postService.create(textarea.value.trim(), communityId);

            alert("Publicado com sucesso no Lumen!");

            textarea.value = "";
            fileInput.value = "";
            imagePreview.style.display = 'none';
            uploadContent.style.display = 'block';
            btnRemove.style.display = 'none';
            btnPostar.innerHTML = textoOriginal;
            btnPostar.disabled = false;
        } catch (error) {
            console.error("Erro ao publicar:", error);
            alert("Erro ao publicar: " + (error.message || "Tente novamente mais tarde."));
            btnPostar.innerHTML = textoOriginal;
            btnPostar.disabled = false;
        }
    });
});
