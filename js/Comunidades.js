const botao = document.querySelector(".icon-bell");
const dropdown = document.getElementById("dropdownNotificacao");
const badge = document.getElementById("badgeNotif");
const emptyMsg = document.getElementById("emptyNotif");

// clique no sino
botao.addEventListener("click", () => {
  dropdown.classList.toggle("ativo");
  atualizarBadge();
});

// fechar clicando fora
document.addEventListener("click", (e) => {
  if (!botao.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("ativo");
  }
});

// função principal
function atualizarBadge() {
  const notificacoes = document.querySelectorAll(".dropdown .item");
  const total = notificacoes.length;

  if (total === 0) {
    badge.style.display = "none";
    emptyMsg.style.display = "block";
  } else {
    badge.style.display = "block";
    badge.textContent = total;
    emptyMsg.style.display = "none";
  }
}

// adicionar nova notificação (opcional)
function adicionarNotificacao(texto) {
  const nova = document.createElement("div");
  nova.classList.add("item");

  nova.innerHTML = `
        <span class="dot"></span>
        <p>${texto}</p>
    `;

  dropdown.appendChild(nova);

  atualizarBadge();
}

// estado inicial
emptyMsg.style.display = "none";
atualizarBadge();

// seleciona elementos
const userTrigger = document.querySelector(".user-trigger");
const userDropdown = document.getElementById("userDropdown");

// abrir/fechar ao clicar
userTrigger.addEventListener("click", (e) => {
  e.stopPropagation(); // evita conflito com o document
  userDropdown.classList.toggle("ativo");
});

// fechar clicando fora
document.addEventListener("click", (e) => {
  if (!userTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.classList.remove("ativo");
  }
});

document.getElementById("btnSair").addEventListener("click", () => {
  window.location.href = "telalogin.html";
});

function gerarCorPastel() {
  const r = Math.floor(Math.random() * 127 + 128);
  const g = Math.floor(Math.random() * 127 + 128);
  const b = Math.floor(Math.random() * 127 + 128);
  const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return hex;
}

async function fetchRecommends() {
  const token = localStorage.getItem("access_token");
  const comunidadesContainer = document.getElementById("comunidades-container");

  try {
    const response = await fetch(
      "http://localhost:3000/community/recommended?page=1&limit=5",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("Erro ao buscar comunidades");

    const result = await response.json();
    const comunidades = result.data;

    comunidadesContainer.innerHTML = "";

    if (comunidades.length === 0) {
      comunidadesContainer.innerHTML = "<p>Nenhuma comunidade recomendada.</p>";
      return;
    }
    comunidades.forEach((comu) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.style.backgroundColor = gerarCorPastel();
      card.innerHTML = `
        
        <h2>${comu.name}</h2>
        <button onclick="acessarComunidade('${comu.id}')">Acessar</button>
      `;

      comunidadesContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Erro no fetch:", error);
    if (comunidadesContainer) {
      comunidadesContainer.innerHTML = "<p>Erro ao carregar comunidades.</p>";
    }
  }
}

// Função auxiliar para o botão acessar
function acessarComunidade(id) {
  window.location.href = `/comunidade/?id=${id}`;
}

fetchRecommends();
