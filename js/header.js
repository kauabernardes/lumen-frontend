
const botao = document.querySelector(".icon-bell");
const dropdown = document.getElementById("dropdownNotificacao");
const badge = document.getElementById("badgeNotif");
const emptyMsg = document.getElementById("emptyNotif");
const userItem = document.querySelector(".user-info span");

if (botao && dropdown) {
  botao.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("ativo");
    atualizarBadge();
  });

  document.addEventListener("click", (e) => {
    if (!botao.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("ativo");
    }
  });
}

function atualizarBadge() {
  const notificacoes = document.querySelectorAll(".dropdown .item");
  const total = notificacoes.length;

  if (badge && emptyMsg) {
    if (total === 0) {
      badge.style.display = "none";
      emptyMsg.style.display = "block";
    } else {
      badge.style.display = "block";
      badge.textContent = total;
      emptyMsg.style.display = "none";
    }
  }
}

// estado inicial
if (emptyMsg) emptyMsg.style.display = "none";
atualizarBadge();

let userData = null;

function getUserData() {
  try {
    userData = JSON.parse(sessionStorage.getItem("auth_data"));
    console.log("Dados do usuário obtidos:", userData);
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
  }
}
getUserData();

const userTrigger = document.querySelector(".user-trigger");
const userDropdown = document.getElementById("userDropdown");

const username = userTrigger.children[1];
if (username && userData) {
  username.innerHTML = userData.username || "Usuário";
  userItem.innerHTML = userData.username || "Usuário";
}

if (userTrigger && userDropdown) {
  userTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle("ativo");
  });

  document.addEventListener("click", (e) => {
    if (!userTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("ativo");
    }
  });
}

// botão sair
const btnSair = document.getElementById("btnSair");
if (btnSair) {
  btnSair.addEventListener("click", () => {
    window.location.href = "/";
  });
}

if (userItem) {
  userItem.addEventListener("click", () => {
    console.log("oadoaoda");
    window.location.href = "/PerfilUsuario/usuario.html";
  });
}
