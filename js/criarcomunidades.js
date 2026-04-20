// ============================================================
//  novapublicacao.js
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // ----------------------------------------------------------
    // SELEÇÃO DE COMUNIDADE
    // ----------------------------------------------------------
    const communityItems = document.querySelectorAll('.community-item');
    const selectedTag    = document.getElementById('selectedCommunityTag');
    const selectedName   = document.getElementById('selectedCommunityName');
    const selectedImg    = document.getElementById('selectedCommunityImg');
    const tagRemoveBtn   = document.getElementById('tagRemoveBtn');

    communityItems.forEach(function (item) {
        item.addEventListener('click', function () {
            selectCommunity(this);
        });
    });

    function selectCommunity(el) {
        // remove seleção anterior
        communityItems.forEach(function (i) { i.classList.remove('selected'); });
        el.classList.add('selected');

        // atualiza tag no formulário
        const name     = el.dataset.name;
        const imgEl    = el.querySelector('.community-avatar img');
        const imgSrc   = imgEl ? imgEl.getAttribute('src') : '';

        selectedName.textContent = name;

        if (imgSrc) {
            selectedImg.setAttribute('src', imgSrc);
            selectedImg.style.display = 'block';
        } else {
            selectedImg.style.display = 'none';
        }

        selectedTag.classList.add('visible');
    }

    function clearCommunity() {
        communityItems.forEach(function (i) { i.classList.remove('selected'); });
        selectedTag.classList.remove('visible');
        selectedImg.setAttribute('src', '');
        selectedName.textContent = '';
    }

    if (tagRemoveBtn) {
        tagRemoveBtn.addEventListener('click', clearCommunity);
    }

    // ----------------------------------------------------------
    // BUSCA DE COMUNIDADE
    // ----------------------------------------------------------
    const communitySearchInput = document.getElementById('communitySearchInput');

    if (communitySearchInput) {
        communitySearchInput.addEventListener('input', function () {
            var q = this.value.toLowerCase().trim();
            communityItems.forEach(function (item) {
                var name = (item.dataset.name || '').toLowerCase();
                item.style.display = name.includes(q) ? 'flex' : 'none';
            });
        });
    }

    // ----------------------------------------------------------
    // UPLOAD DE MÍDIA (drag & drop + clique)
    // ----------------------------------------------------------
    var dropArea       = document.getElementById('dropArea');
    var fileInput      = document.getElementById('fileInput');
    var imagePreview   = document.getElementById('imagePreview');
    var uploadContent  = document.getElementById('uploadContent');
    var btnRemoveImage = document.getElementById('btnRemoveImage');

    if (dropArea && fileInput) {

        // clique na área abre o seletor de arquivo
        dropArea.addEventListener('click', function (e) {
            // ignora se clicou no botão de remover
            if (e.target.closest('#btnRemoveImage')) return;
            fileInput.click();
        });

        // arquivo escolhido pelo input
        fileInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                showImagePreview(this.files[0]);
            }
        });

        // drag over
        dropArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });

        dropArea.addEventListener('dragleave', function () {
            dropArea.classList.remove('dragover');
        });

        // drop
        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            var file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                showImagePreview(file);
            }
        });

        // remove imagem
        if (btnRemoveImage) {
            btnRemoveImage.addEventListener('click', function (e) {
                e.stopPropagation();
                imagePreview.src = '';
                imagePreview.style.display = 'none';
                uploadContent.style.display = 'flex';
                btnRemoveImage.style.display = 'none';
                fileInput.value = '';
            });
        }
    }

    function showImagePreview(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadContent.style.display = 'none';
            btnRemoveImage.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    // ----------------------------------------------------------
    // CHIPS OPCIONAIS (toggle ativo/inativo)
    // ----------------------------------------------------------
    var chips = document.querySelectorAll('.option-chip');

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });

    // ----------------------------------------------------------
    // BOTÃO POSTAR — validação básica
    // ----------------------------------------------------------
    var btnPostar = document.getElementById('btnPostar');
    var descInput = document.getElementById('desc');

    if (btnPostar) {
        btnPostar.addEventListener('click', function () {

            var desc      = descInput ? descInput.value.trim() : '';
            var community = document.querySelector('.community-item.selected');

            if (!community) {
                alert('Selecione uma comunidade antes de publicar.');
                return;
            }

            if (!desc) {
                alert('Escreva uma descrição para a publicação.');
                descInput.focus();
                return;
            }

            // Aqui você chama sua função real de postagem (ex: novapublicacao.js original)
            // Por enquanto exibe confirmação visual no botão
            btnPostar.innerHTML = '<i class="fa-solid fa-check"></i> Publicado!';
            btnPostar.style.background = 'linear-gradient(135deg,#34c47a,#27a86a)';
            btnPostar.disabled = true;

            setTimeout(function () {
                btnPostar.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar agora';
                btnPostar.style.background = '';
                btnPostar.disabled = false;
            }, 2500);
        });
    }

});