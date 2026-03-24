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
function atualizarBadge(){
    const notificacoes = document.querySelectorAll(".dropdown .item");
    const total = notificacoes.length;

    if(total === 0){
        badge.style.display = "none";
        emptyMsg.style.display = "block";
    } else {
        badge.style.display = "block";
        badge.textContent = total;
        emptyMsg.style.display = "none";
    }
}

// adicionar nova notificação (opcional)
function adicionarNotificacao(texto){
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



