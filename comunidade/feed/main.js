// ==========================================
// 1. CONFIGURAÇÕES E UTILITÁRIOS GERAIS
// ==========================================
const urlParams = new URLSearchParams(window.location.search);
const comunidadeId = urlParams.get("id");

// Gerador de cor adaptado para tons mais alinhados ao tema base
function gerarCorPastel() {
  const tonsBase = ['#f9c0d8', '#f28cb8', '#d4e8ff', '#fbc8e0', '#fce4ef'];
  return tonsBase[Math.floor(Math.random() * tonsBase.length)];
}

// ==========================================
// 2. INTERFACE DO USUÁRIO (MENU DROPDOWN)
// ==========================================
const userTrigger = document.querySelector(".user-trigger");
const userDropdown = document.getElementById("dropdownNotificacao");

if (userTrigger && userDropdown) {
  userTrigger.addEventListener("click", () => {
    userDropdown.classList.toggle("active");
  });
}

// ==========================================
// 3. LÓGICA DE POSTAGEM (EVENTO DE FORMULÁRIO)
// ==========================================
function newPost() {
  location.href = `${location.origin}/comunidade/post/new/?id=${comunidadeId}`;
}

// ==========================================
// 4. BUSCA DE DADOS (COMUNIDADE E FEED)
// ==========================================
async function carregarComunidade() {
  if (!comunidadeId) return;

  mostrarSkeletonComunidade();

  try {
    const comunidade = await window.communityService.getById(comunidadeId);
    const dataCriacao = new Date(comunidade.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const cardInfo = document.querySelector(".card-info");
    cardInfo.innerHTML = `
        <div id="banner" class="banner">
            <div id="comunidade-capa" style="background-color: ${gerarCorPastel()}; width: 100%; height: 100%;"></div>
        </div>
        <h2 id="comunidade-nome">${comunidade.name}</h2>
        <p class="description" id="comunidade-desc">${comunidade.description}</p>
        <div class="meta">
            <small>Criado por: <strong id="comunidade-autor">@${comunidade.author?.username || "desconhecido"}</strong></small>
            <small id="comunidade-data">Em ${dataCriacao}</small>
        </div>
    `;
  } catch (error) {
    console.error("Erro ao carregar comunidade:", error);
    document.querySelector(".card-info").innerHTML = "<p>Erro ao carregar dados.</p>";
  }
}

async function carregarPosts(pagina = 1) {
  const timeline = document.getElementById("timeline-posts");
  if (!comunidadeId) return;

  mostrarSkeletons();

  try {
    const result = await window.communityService.getPosts(comunidadeId, pagina, 10);

    if (pagina === 1) timeline.innerHTML = "";

    if (result.data.length === 0) {
      timeline.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px; font-style: italic;">Nenhum post encontrado nesta comunidade.</p>';
      return;
    }

    result.data.forEach((post) => {
      const dataHora = new Date(post.createdAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const authorName = post.user ? post.user.username : "Usuário Oculto";
      const communityName = post.community ? post.community.name : "Comunidade";

      const article = document.createElement("article");
      article.className = "post";
      article.setAttribute("data-id", post.id);
      article.innerHTML = `
          <div class="post-user">
              <i class="fa-regular fa-circle-user avatar"></i>
              <div class="user-data">
                  <strong>${authorName}</strong>
                  <span>@${authorName}</span>
              </div>
              <div class="post-info">
                  <span>Postado às ${dataHora}</span><br>
                  <a href="#">${communityName}</a>
              </div>
          </div>
          <p class="post-text">${post.content}</p>
          <div class="post-stats">
              <button class="btn-like">
                  <i class="${post.isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
                  <span class="like-count">${post.likesCount || 0}</span>
               </button>
              <span><i class="fa-regular fa-comment"></i> ${post.commentsCount || 0}</span>
          </div>
      `;
      
      article.querySelector(".btn-like").addEventListener("click", () =>
        handleLike(post.id, article, post.likesCount || 0)
      );
      
      article.addEventListener("click", (e) => {
        if (e.target.closest(".btn-like")) return;
        location.href = `${location.origin}/comunidade/post/?id=${post.id}`;
      });
      timeline.appendChild(article);
    });
  } catch (error) {
    console.error("Erro ao carregar o feed:", error);
    timeline.innerHTML = '<p style="text-align: center; color: var(--text-light);">Erro ao carregar o feed.</p>';
  }
}

// ==========================================
// 5. INICIALIZAÇÃO DA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  if (!comunidadeId) {
    console.warn("Nenhum ID de comunidade detectado na URL.");
    return;
  }
  carregarComunidade();
  carregarPosts(1);
});

function mostrarSkeletons() {
  const timeline = document.getElementById("timeline-posts");
  timeline.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const skel = document.createElement("div");
    skel.className = "skeleton-post";
    skel.innerHTML = `
        <div class="post-user" style="display: flex; gap: 12px; align-items: center; margin-bottom: 15px;">
            <div class="skeleton skeleton-avatar"></div>
            <div class="user-data">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton" style="width: 80px; height: 10px;"></div>
            </div>
        </div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
    `;
    timeline.appendChild(skel);
  }
}

function mostrarSkeletonComunidade() {
  const cardInfo = document.querySelector(".card-info");
  cardInfo.innerHTML = `
      <div class="skeleton skeleton-banner"></div>
      <div class="skeleton skeleton-title-lg"></div>
      <div class="skeleton skeleton-desc"></div>
      <div class="skeleton skeleton-desc"></div>
      <div class="meta">
          <div class="skeleton skeleton-meta"></div>
          <div class="skeleton skeleton-meta"></div>
      </div>
  `;
}

async function handleLike(postId, postElement) {
  const btn = postElement.querySelector(".btn-like");
  const likeIcon = postElement.querySelector(".btn-like i");
  const likeCountSpan = postElement.querySelector(".like-count");

  try {
    if (likeIcon.classList.contains("fa-solid")) {
      likeIcon.classList.replace("fa-solid", "fa-regular");
      likeCountSpan.textContent = Number.parseInt(likeCountSpan.textContent) - 1;
    } else {
      likeIcon.classList.replace("fa-regular", "fa-solid");
      likeCountSpan.textContent = Number.parseInt(likeCountSpan.textContent) + 1;
    }

    btn.disabled = true;

    const data = await window.postService.toggleLike(postId);
    btn.disabled = false;

    if (data.liked) {
      likeIcon.classList.replace("fa-regular", "fa-solid");
    } else {
      likeIcon.classList.replace("fa-solid", "fa-regular");
    }

    likeCountSpan.textContent = data.totalLikes;
  } catch (error) {
    console.error("Erro ao curtir:", error);
    alert(error.message || "Erro ao processar curtida.");
    btn.disabled = false;
  }
}

