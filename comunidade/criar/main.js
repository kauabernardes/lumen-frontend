const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const errorMsg = document.getElementById("error-save");
const btnSave = document.getElementById("btn-save");

const namePreview = document.getElementById("viewName");
const descPreview = document.getElementById("viewDesc");

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  namePreview.textContent = name || "Nome da Comunidade";
});

descInput.addEventListener("input", () => {
  const desc = descInput.value.trim();
  descPreview.textContent = desc || "Sua descrição aparecerá aqui...";
});

async function handleSave(event) {
  if (event) event.preventDefault();

  const name = nameInput.value.trim();
  const description = descInput.value.trim();

  // Validação básica de front-end
  if (name.length < 5) {
    showError("O nome deve ter pelo menos 5 caracteres.");
    return;
  }

  if (name.length > 50) {
    showError("O nome deve ter no máximo 50 caracteres.");
    return;
  }

  try {
    // Feedback visual de carregamento
    const originalText = btnSave.innerHTML;
    btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Criando...';
    btnSave.disabled = true;
    errorMsg.classList.remove("active");

    // Chamada ao serviço centralizado via window
    await window.communityService.create(name, description);

    // Sucesso!
    alert("Comunidade criada com sucesso!");
    window.location.href = "/Comunidades.html";
  } catch (error) {
    console.error("Erro ao criar comunidade:", error);
    showError(error.message || "Não foi possível criar a comunidade. Tente novamente.");
  } finally {
    // Restaurar botão
    if (btnSave) {
      btnSave.innerHTML = "Lançar Comunidade";
      btnSave.disabled = false;
    }
  }
}

function showError(message) {
  const errorMsg = document.getElementById("error-save");
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.classList.add("active");
    setTimeout(() => {
      errorMsg.classList.remove("active");
    }, 5000);
  }
}

// Função para carregar as comunidades do usuário
const communityList = document.getElementById("communityList");

async function minhasComunidades() {
  try {
    console.log("Iniciando carregamento de comunidades...");
    const response = await window.communityService.getIn();
    const comunidades = response.data || response;

    communityList.innerHTML = "";

    if (comunidades.length === 0) {
      communityList.innerHTML =
        '<p style="font-size: 13px; color: var(--text-light); text-align: center; padding: 20px;">Você ainda não participa de nenhuma comunidade.</p>';
      return;
    }

    comunidades.forEach((c) => {
      const box = document.createElement("div");
      box.className = "community-item";

      box.innerHTML = `
        <div class="community-avatar">
          <img src="${c.bannerUrl || "../../img/default-community.webp"}" alt="${c.name}" />
        </div>
        <div class="community-info">
          <div class="community-name">${c.name}</div>
          <div class="community-members">${c.membersCount || 0} membros</div>
        </div>
        <i class="fa-solid fa-check community-check"></i>
      `;

      box.addEventListener(
        "click",
        () => (location.href = `${location.origin}/comunidade/feed/?id=${c.id}`)
      );

      communityList.appendChild(box);
    });
  } catch (error) {
    console.error("Erro ao carregar comunidades:", error);
    communityList.innerHTML = '<p style="font-size: 13px; color: var(--text-light);">Erro ao carregar suas comunidades.</p>';
  }
}

minhasComunidades();

// Expõe a função globalmente para o onsubmit do HTML
window.handleSave = handleSave;