// ========================= //
// EDITAR PERFIL             //
// ========================= //

const btnEditarPerfil = document.getElementById("btnEditarPerfil");
const modalOverlay = document.getElementById("modalOverlay");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const btnSalvarModal = document.getElementById("btnSalvarModal");

const inputNome = document.getElementById("inputNome");
const inputHandle = document.getElementById("inputHandle");

const nomeExibido = document.getElementById("nomeExibido");
const handleExibido = document.getElementById("handleExibido");

const comunidadesList = document.getElementById("comunidades-list");
const comunidadesCount = document.getElementById("stat-comun");

// IDs dos nomes nas contribuições
const nomeContribs = ["nomeContrib1", "nomeContrib2", "nomeContrib3"];
const handleContribs = ["handleContrib1", "handleContrib2", "handleContrib3"];

// Abre modal
btnEditarPerfil.addEventListener("click", () => {
  inputNome.value = nomeExibido.textContent;
  inputHandle.value = handleExibido.textContent;
  modalOverlay.classList.add("ativo");
});

// Fecha modal
function fecharModal() {
  modalOverlay.classList.remove("ativo");
}

btnFecharModal.addEventListener("click", fecharModal);
btnCancelarModal.addEventListener("click", fecharModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) fecharModal();
});

// Salva alterações
btnSalvarModal.addEventListener("click", () => {
  const novoNome = inputNome.value.trim();
  const novoHandle = inputHandle.value.trim();

  if (!novoNome) return;

  nomeExibido.textContent = novoNome;
  handleExibido.textContent =
    novoHandle || "@" + novoNome.toLowerCase().replace(/\s/g, "");

  nomeContribs.forEach((id) => {
    document.getElementById(id).textContent = novoNome;
  });
  handleContribs.forEach((id) => {
    document.getElementById(id).textContent = handleExibido.textContent;
  });

  fecharModal();
});

async function getSessionStats() {
  try {
    const response = await window.userService.getSessionStats();
    console.log(response);

    const ctx = document.getElementById("myChart");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: response?.data?.map((el) => el.day),
        datasets: [
          {
            label: "Tempo de estudo em minutos",
            data: response?.data?.map((el) => el.timeInMinutes),
            borderWidth: 3,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
}

async function carregarComunidades() {
  try {
    const response = await window.communityService.getIn();

    comunidadesList.innerHTML = "";
    response?.map((comum) => {
      const art = document.createElement("article");
      art.className = "comunidade-card";

      art.innerHTML = `
                <div class="comunidade-cover" style="background: linear-gradient(135deg, #6366f1, #4338ca)">
                  <i class="fa-solid fa-book-open"></i>
                  <span class="comunidade-nome-overlay">${comum?.name}</span>
                  <button class="btn-acessar">Acessar</button>
                </div>
            `;
      comunidadesList.appendChild(art);
    });
    comunidadesCount.innerText = response?.length;
  } catch (e) {}
}

async function init() {
  try {
    await Promise.all([getSessionStats(), carregarComunidades()]);
  } catch (e) {
    console.error("Erro ao carregar dados");
  }

  nomeExibido.innerText = userData?.username;
  handleExibido.innerText = `@${userData?.username}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  await init();
});
