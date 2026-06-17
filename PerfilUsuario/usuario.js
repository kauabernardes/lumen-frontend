const btnEditarPerfil = document.getElementById("btnEditarPerfil");
const modalOverlay = document.getElementById("modalOverlay");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const btnSalvarModal = document.getElementById("btnSalvarModal");

const inputNome = document.getElementById("inputNome");
const inputHandle = document.getElementById("inputHandle");
const inputFile = document.getElementById("inputFile");

const nomeExibido = document.getElementById("nomeExibido");
const handleExibido = document.getElementById("handleExibido");

const comunidadesList = document.getElementById("comunidades-list");
const comunidadesCount = document.getElementById("stat-comun");

const nomeContribs = ["nomeContrib1", "nomeContrib2", "nomeContrib3"];
const handleContribs = ["handleContrib1", "handleContrib2", "handleContrib3"];

btnEditarPerfil.addEventListener("click", () => {
  inputNome.value = nomeExibido.textContent;

  inputHandle.value = handleExibido.textContent.replace("@", "");
  modalOverlay.classList.add("ativo");
});

function fecharModal() {
  modalOverlay.classList.remove("ativo");
  inputFile.value = "";
}

btnFecharModal.addEventListener("click", fecharModal);
btnCancelarModal.addEventListener("click", fecharModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) fecharModal();
});

function atualizarFotoNaTela(imgUrl) {
  if (!imgUrl) return;

  const urlCompleta = imgUrl.startsWith("http")
    ? imgUrl
    : `${API_BASE_URL}/${imgUrl}`;
  const avatar = document.querySelector(".perfil-avatar-wrap");

  if (avatar) {
    const icon = avatar.querySelector(".fa-circle-user");
    if (icon) icon.style.display = "none";

    let img = avatar.querySelector(".profile-img-element");
    if (!img) {
      img = document.createElement("img");
      img.className = "profile-img-element";

      img.style.width = "100%";
      img.style.height = "100%";
      img.style.borderRadius = "50%";
      img.style.objectFit = "cover";

      avatar.insertBefore(img, avatar.firstChild);
    }
    img.src = urlCompleta;
  }
}

btnSalvarModal.addEventListener("click", async () => {
  const novoNome = inputNome.value.trim();
  const novoHandle = inputHandle.value.trim();
  const arquivoSelecionado = inputFile.files[0];

  if (!novoNome) {
    alert("O nome do usuário não pode ficar vazio.");
    return;
  }

  const textoOriginalBtn = btnSalvarModal.innerHTML;
  btnSalvarModal.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
  btnSalvarModal.disabled = true;

  try {
    const formData = new FormData();

    formData.append(
      "username",
      novoHandle || novoNome.toLowerCase().replace(/\s/g, ""),
    );

    if (arquivoSelecionado) {
      formData.append("file", arquivoSelecionado);
    }

    const response = await window.userService.updateProfile(formData);

    if (response && response.user) {
      nomeExibido.textContent = novoNome;
      handleExibido.textContent = `@${response.user.username}`;

      nomeContribs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = novoNome;
      });
      handleContribs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `@${response.user.username}`;
      });

      if (response.user.imgProfile) {
        atualizarFotoNaTela(response.user.imgProfile);
        if (typeof userData !== "undefined") {
          userData.profileImage = response.user.imgProfile;
        }
      }
    }

    fecharModal();
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);

    if (error.response && error.response.data && error.response.data.message) {
      alert(`Erro: ${error.response.data.message}`);
    } else {
      alert(
        "Não foi possível atualizar o perfil. Verifique se o username já está em uso.",
      );
    }
  } finally {
    // Restaura o estado operacional do botão de salvar
    btnSalvarModal.innerHTML = textoOriginalBtn;
    btnSalvarModal.disabled = false;
  }
});

async function getSessionStats() {
  try {
    const response = await window.userService.getSessionStats(userData.id);
    console.log(response);

    const ctx = document.getElementById("myChart");
    if (!ctx) return;

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
    console.log("Erro ao carregar gráficos de sessão:", e);
  }
}

async function carregarComunidades() {
  try {
    const response = await window.communityService.getIn();
    if (!comunidadesList) return;

    comunidadesList.innerHTML = "";
    response?.data?.map((comum) => {
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
    if (comunidadesCount)
      comunidadesCount.innerText = response?.meta?.total || 0;
  } catch (e) {
    console.log("Erro ao carregar lista de comunidades:", e);
  }
}

async function init() {
  try {
    await Promise.all([getSessionStats(), carregarComunidades()]);
  } catch (e) {
    console.error("Erro ao carregar dados em lote");
  }

  if (typeof userData !== "undefined" && userData) {
    nomeExibido.innerText = userData.name || userData.username || "Usuário";
    handleExibido.innerText = `@${userData.username}`;

    if (userData.profileImage) {
      atualizarFotoNaTela(userData.profileImage);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await init();
});
