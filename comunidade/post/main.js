

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const comments = document.getElementById("comments");


async function fetchPost() {
  if (!postId) return;
  const timeline = document.getElementById("timeline-posts");
  if (!timeline) return;

  
  if (!comments) return
  try {
    const result = await window.postService.getById(postId);
   
   

    console.log("Post encontrado:", result);
    if (!result) {
      timeline.innerHTML = "<p style='color: var(--text-mid); font-family: DM Sans;'>Post não encontrado.</p>";
      return;
    }
    const postCard = createPostCard(result);
    timeline.insertBefore(postCard, timeline.firstChild);

    if (result.comments.length === 0) {
      comments.classList.add("hidden");
      return;
    } else {
      comments.classList.remove("hidden");
    }

    result.comments.forEach((comment) => {
      const commentCard = createPostCard(comment, true);
      comments.appendChild(commentCard);
    });
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    timeline.innerHTML = "<p style='color: var(--text-mid); font-family: DM Sans;'>Erro ao carregar post.</p>";
  }
}

function createPostCard(post, comment = false) {
  const dataHora = new Date(post.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const authorName = post.user ? post.user.username : "Usuário Oculto";
  const communityName = post.community ? post.community.name : "Comunidade";

  const article = document.createElement("article");
  article.className = comment ? "comment" : "post";
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
              ${! comment ? `<a href="/comunidade/feed/?id=${post?.community?.id}">${communityName}</a>` : ''}
          </div>
      </div>
        ${post.parent ?
          `<a href="/comunidade/post/?id=${post?.parent?.id}" class="post-reply">Em resposta a ${post?.parent?.user?.username || "usuário"}</a>` : ''}
      <p class="post-text">${post.content}</p>
       <div class="post-stats">
              <button class="btn-like">
                  <i class="${post.isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
                  <span class="like-count">${post.likesCount || 0}</span>
               </button>
                ${comment ? `<span><i class="fa-regular fa-comment"></i> ${post.commentsCount || 0}</span>` : ''}   
          </div>

          ${!comment ? `<div class="input-group">
          <label for="desc">Responder</label>
          <textarea
            id="desc"
            placeholder="Comentar na postagem de @${authorName}"
          ></textarea> 
        </div>
        <button class="btn-postar" onclick="handleComment('${post.id}', document.getElementById('desc'), this)">Comentar</button>` : ''}
  `;

   article.querySelector(".btn-like").addEventListener("click", () =>
        handleLike(post.id, article, post.likesCount || 0)
      );

      if (comment) {
      article.addEventListener("click", (e) => {
        if (e.target.closest(".btn-like")) return;
        location.href = `${location.origin}/comunidade/post/?id=${post.id}`;
      });}

  return article;
}




fetchPost();


async function handleComment(postId, desc, commentButton) {
  const commentValue = desc.value.trim();

  if (!commentValue) {
    alert("O comentário não pode ser vazio.");
    return;
  }
  commentButton.disabled = true;
  desc.disabled = true;
  commentButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';
  try {
    
    const newComment = await window.postService.addComment(postId, commentValue);
     desc.value = "";
    const commentsContainer = document.getElementById("comments");
    if (commentsContainer) {
      const commentCard = createPostCard(newComment, true);
      commentsContainer.appendChild(commentCard);
    }
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    alert("Erro ao adicionar comentário.");
  } finally {
    commentButton.disabled = false;
    commentButton.innerHTML = "Comentar";
    desc.disabled = false;
    comments.classList.remove("hidden");
  }
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