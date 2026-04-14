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

    // Remover Imagem
    btnRemove.addEventListener('click', (e) => {
        e.stopPropagation(); // Previne abrir o seletor de arquivos
        fileInput.value = ""; // Limpa o input
        imagePreview.src = "";
        imagePreview.style.display = 'none';
        uploadContent.style.display = 'block';
        btnRemove.style.display = 'none'; 
    });

  
    btnPostar.addEventListener('click', () => {
        if (textarea.value.trim() === "") {
            alert("Escreve uma descrição para a tua publicação!");
            textarea.focus();
            return;
        }

        btnPostar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';
        btnPostar.style.pointerEvents = "none";

        setTimeout(() => {
            alert("Publicado com sucesso no Lumen!");
        
            textarea.value = "";
            fileInput.value = "";
            imagePreview.style.display = 'none';
            uploadContent.style.display = 'block';
            btnRemove.style.display = 'none';
            btnPostar.innerHTML = 'Postar';
            btnPostar.style.pointerEvents = "auto";
        }, 1500);
    });
});