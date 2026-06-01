// ==========================================
// ESTADOS GERAIS - COMUNIDADES
// ==========================================
let currentPage = 1;
const limitPerPage = 5;
let isLoading = false;
let hasMore = true;

// ==========================================
// ESTADOS GERAIS - POSTS RECOMENDADOS
// ==========================================
let currentPostPage = 1;
const postLimitPerPage = 5;
let isPostsLoading = false;
let hasMorePosts = true;

// ==========================================
// UTILITÁRIOS
// ==========================================
function gerarCorPastel() {
  const r = Math.floor(Math.random() * 127 + 128);
  const g = Math.floor(Math.random() * 127 + 128);
  const b = Math.floor(Math.random() * 127 + 128);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ==========================================
// LÓGICA DE COMUNIDADES RECOMENDADAS
// ==========================================
function mostrarSkeletonsComunidades(isAppending = false) {
  const container = document.getElementById("comunidades-container");
  if (!container) return;

  if (!isAppending) {
    container.innerHTML = "";
  }
  const skeletonWrapper = document.createElement("div");
  skeletonWrapper.id = "skeleton-wrapper";

  for (let i = 0; i < limitPerPage; i++) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-box", "glass-card");
    skeletonWrapper.appendChild(skeleton);
  }

  container.appendChild(skeletonWrapper);
}

function removerSkeletons() {
  const wrapper = document.getElementById("skeleton-wrapper");
  if (wrapper) wrapper.remove();
}

async function fetchRecommends(page = 1) {
  if (isLoading || !hasMore) return;

  const comunidadesContainer = document.getElementById("comunidades-container");
  if (!comunidadesContainer) return;

  isLoading = true;
  mostrarSkeletonsComunidades(page > 1);

  try {
    const result = await window.communityService.getRecommended(
      page,
      limitPerPage,
    );
    const comunidades = result.data;

    removerSkeletons();

    if (!comunidades || comunidades.length === 0) {
      hasMore = false;
      if (page === 1) {
        comunidadesContainer.innerHTML =
          "<p style='color: var(--text-mid); font-family: DM Sans;'>Nenhuma comunidade recomendada.</p>";
      }
      return;
    }

    if (comunidades.length < limitPerPage) hasMore = false;

    comunidades.forEach((comu) => {
      const card = document.createElement("div");
      card.classList.add("card", "glass-card");
      card.style.backgroundColor = gerarCorPastel();

      const botaoAcao = comu.isMember
        ? `<button onclick="acessarComunidade('${comu.id}', ${comu.isMember})">Acessar</button>`
        : `<button onclick="acessarComunidade('${comu.id}', ${comu.isMember})">Entrar</button>`;

      card.innerHTML = `
        <h2>${comu.name}</h2>
        ${botaoAcao}
      `;

      comunidadesContainer.appendChild(card);
    });

    currentPage = page;
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    removerSkeletons();

    if (page === 1) {
      comunidadesContainer.innerHTML =
        "<p style='color: var(--text-mid); font-family: DM Sans;'>Erro ao carregar comunidades recomendadas.</p>";
    }
  } finally {
    isLoading = false;
  }
}

async function acessarComunidade(id, isMember) {
  if (isMember) {
    window.location.href = `/comunidade/feed/?id=${id}`;
    return;
  }

  try {
    await window.communityService.join(id);
    alert("Inscrição realizada com sucesso!");
    window.location.href = `/comunidade/feed/?id=${id}`;
  } catch (error) {
    console.error("Erro ao entrar na comunidade:", error);
    alert(error.message || "Erro ao entrar na comunidade.");
  }
}

// ==========================================
// LÓGICA DE POSTS RECOMENDADOS
// ==========================================
// ==========================================
// LÓGICA DE POSTS RECOMENDADOS
// ==========================================
function mostrarSkeletonsPosts(isAppending = false) {
  const container = document.querySelector(".timeline");
  if (!container) return;

  if (!isAppending) {
    container.innerHTML = "";
  }

  const wrapperSkel = document.createElement("div");
  wrapperSkel.id = "post-skeleton-wrapper";

  for (let i = 0; i < postLimitPerPage; i++) {
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
    wrapperSkel.appendChild(skel);
  }

  container.appendChild(wrapperSkel);
}

function removerSkeletonsPosts() {
  const wrapper = document.getElementById("post-skeleton-wrapper");
  if (wrapper) wrapper.remove();
}

async function fetchRecommendedPosts(page = 1) {
  if (isPostsLoading || !hasMorePosts) return;

  // Garante que os posts vão para o container correto
  const postsContainer = document.querySelector(".timeline");
  if (!postsContainer) return;

  isPostsLoading = true;
  mostrarSkeletonsPosts(page > 1);

  try {
    const result = await window.postService.getRecommendedPosts(
      page,
      postLimitPerPage,
    );
    const posts = result.data;

    removerSkeletonsPosts();

    if (!posts || posts.length === 0) {
      hasMorePosts = false;
      if (page === 1) {
        const msg = document.createElement("p");
        msg.style.cssText =
          "text-align: center; color: var(--text-light); padding: 20px;";
        msg.textContent = "Nenhuma postagem recomendada.";
        postsContainer.appendChild(msg);
      }
      return;
    }

    if (posts.length < postLimitPerPage) hasMorePosts = false;

    posts.forEach((post) => {
      const dataHora = new Date(post.createdAt).toLocaleTimeString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const authorName = post.user ? post.user.username : "Usuário Oculto";
      const communityName = post.community ? post.community.name : "Comunidade";

      const article = document.createElement("div");
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
                  <span>Postado em ${dataHora}</span><br>
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

      // Evento de curtir
      article.querySelector(".btn-like").addEventListener("click", (e) => {
        e.stopPropagation();
        handleLike(post.id, article);
      });

      // Evento para abrir o post
      article.addEventListener("click", (e) => {
        if (e.target.closest(".btn-like") || e.target.closest("a")) return;
        location.href = `/comunidade/post/?id=${post.id}`;
      });

      postsContainer.appendChild(article);
    });

    currentPostPage = page;
  } catch (error) {
    console.error("Erro ao carregar posts recomendados:", error);
    removerSkeletonsPosts();
    if (page === 1) {
      const erroMsg = document.createElement("p");
      erroMsg.style.cssText =
        "text-align: center; color: var(--text-light); padding: 20px;";
      erroMsg.textContent = "Erro ao carregar postagens.";
      postsContainer.appendChild(erroMsg);
    }
  } finally {
    isPostsLoading = false;
  }
}

async function handleLike(postId, postElement) {
  const btn = postElement.querySelector(".btn-like");
  const likeIcon = btn.querySelector("i");
  const likeCountSpan = btn.querySelector(".like-count");

  try {
    if (likeIcon.classList.contains("fa-solid")) {
      likeIcon.classList.replace("fa-solid", "fa-regular");
      likeCountSpan.textContent = Math.max(
        0,
        parseInt(likeCountSpan.textContent) - 1,
      );
    } else {
      likeIcon.classList.replace("fa-regular", "fa-solid");
      likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
    }

    btn.style.pointerEvents = "none";

    const data = await window.postService.toggleLike(postId);

    likeIcon.className = `${data.liked ? "fa-solid" : "fa-regular"} fa-heart`;
    likeCountSpan.textContent = data.totalLikes;
  } catch (error) {
    console.error("Erro ao curtir:", error);
    alert("Erro ao processar curtida.");
  } finally {
    btn.style.pointerEvents = "auto";
  }
}

// ==========================================
// INICIALIZAÇÃO E SCROLL
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await Promise.all([
      fetchRecommends(currentPage),
      fetchRecommendedPosts(currentPostPage),
    ]);
  } catch (error) {
    console.error("Erro durante o carregamento inicial:", error);
  }

  const comunidadesContainer = document.getElementById("comunidades-container");
  if (comunidadesContainer) {
    comunidadesContainer.addEventListener("scroll", () => {
      if (
        comunidadesContainer.scrollTop + comunidadesContainer.clientHeight >=
        comunidadesContainer.scrollHeight - 10
      ) {
        fetchRecommends(currentPage + 1);
      }
    });
  }

  const postsContainer = document.getElementById("center");
  postsContainer.addEventListener("scroll", () => {
    if (
      postsContainer.scrollTop + postsContainer.clientHeight >=
      postsContainer.scrollHeight - 10
    ) {
      fetchRecommendedPosts(currentPostPage + 1);
    }
  });
});
