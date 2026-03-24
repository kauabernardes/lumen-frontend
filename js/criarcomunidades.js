document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const descInput = document.getElementById('descInput');
    const targetSelect = document.getElementById('targetSelect');
    const checkboxes = document.querySelectorAll('.tag input');
    
    const viewName = document.getElementById('viewName');
    const viewDesc = document.getElementById('viewDesc');
    const viewTarget = document.getElementById('viewTarget');
    const viewTags = document.getElementById('viewTags');

    // Função para atualizar as tags no card de Preview
    function updateTags() {
        const selected = Array.from(document.querySelectorAll('.tag input:checked'))
            .map(i => `<span>${i.value}</span>`)
            .join('');
        viewTags.innerHTML = selected || "<span>Sem focos</span>";
    }

    // Listeners para atualização em tempo real
    nameInput.addEventListener('input', () => viewName.innerText = nameInput.value || "Nome da Comunidade");
    descInput.addEventListener('input', () => viewDesc.innerText = descInput.value || "Sua descrição aparecerá aqui...");
    targetSelect.addEventListener('change', () => viewTarget.innerText = targetSelect.value);
    
    // Aplica o evento de mudança em todos os checkboxes iniciais
    checkboxes.forEach(box => box.addEventListener('change', updateTags));

    // Lógica da Sugestão Lumen (Adicionar/Remover)
    document.getElementById('btnAddSugg').addEventListener('click', function() {
        const container = document.getElementById('tagsContainer');
        const tagName = "Geometria";
        
        // Verifica se a tag "Geometria" já existe no container
        const existingTag = Array.from(container.querySelectorAll('.tag span'))
                                 .find(s => s.innerText === tagName);

        if (existingTag) {
            // Se já existe, remove o elemento <label> completo
            existingTag.parentElement.remove();
            
            // Reseta o botão para o estado original (Roxo)
            this.innerText = "+ Adicionar Foco";
            this.style.background = "var(--accent-purple)";
        } else {
            // Se não existe, cria a nova tag marcada
            const label = document.createElement('label');
            label.className = 'tag';
            label.innerHTML = `<input type="checkbox" value="${tagName}" checked><span>${tagName}</span>`;
            
            container.appendChild(label);
            
            // Adiciona o listener de atualização para este novo checkbox criado
            label.querySelector('input').addEventListener('change', updateTags);
            
            // Altera o botão para o estado de "Remover" (Vermelho/Rosa)
            this.innerText = "Remover Geometria";
            this.style.background = "#b81414";
        }

        // Atualiza o preview lateral imediatamente
        updateTags();
    });
});