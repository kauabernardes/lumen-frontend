let currentPostPage = 1;
const postLimitPerPage = 5;
let isPostsLoading = false;
let hasMorePosts = true;

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

      // Assumindo que a variável global API_BASE_URL esteja definida no client.js
      const profileImage =
        post.user && post.user.profileImage
          ? `<img src="${API_BASE_URL}/uploads/${post.user.profileImage}"></img>`
          : '<i class="fa-regular fa-circle-user avatar"></i>';

      const article = document.createElement("div");
      article.className = "post";
      article.setAttribute("data-id", post.id);

      article.innerHTML = `
        <div class="post-user">
              ${profileImage}
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

      article.querySelector(".btn-like").addEventListener("click", (e) => {
        e.stopPropagation();
        handleLike(post.id, article);
      });

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

async function renderEvents() {
  const eventsList = document.getElementById("events-list");
  eventsList.innerHTML = "";

  try {
    const response = await window.agendaService.getEvents();

    response.forEach((evento) => {
      const item = document.createElement("li");
      item.innerHTML = `
              <div class="event-date">${new Date(
                evento?.eventDate,
              ).toLocaleString("pt-BR", { day: "2-digit" })}<br />${new Date(
                evento?.eventDate,
              ).toLocaleString("pt-BR", { month: "short" })}</div>
              <div class="event-info">
                <span class="event-title">${evento?.title}</span>
                <span class="event-time">Às ${new Date(evento?.eventDate).toLocaleTimeString("pt-BR", { minute: "2-digit", hour: "2-digit" })}</span>
              </div>
              `;

      eventsList.append(item);
    });
  } catch (e) {}
}

async function iaRec() {
  const box = document.getElementById("recom");
  box.innerHTML = "<div class='loader'></div>";

  try {
    const response = await window.recommendationService.get();

    box.innerHTML = `<div class="rec-content">
            <h4>${response?.title}</h4>
            <span>${response?.subtitle}</span>
          </div>
          <button class="btn-light">${response?.action}</button>`;
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchRecommendedPosts(currentPostPage);
  const postsContent = document.querySelector(".posts");

  if (postsContent) {
    postsContent.addEventListener("scroll", () => {
      if (
        postsContent.scrollTop + postsContent.clientHeight >=
        postsContent.scrollHeight - 10
      ) {
        fetchRecommendedPosts(currentPostPage + 1);
      }
    });
  }
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 10
    ) {
      fetchRecommendedPosts(currentPostPage + 1);
    }
  });
});

renderEvents();
iaRec();
