document.addEventListener("DOMContentLoaded", () => {
  const btnPostar = document.getElementById("btnPostar");
  const textarea = document.getElementById("desc");
  const communityList = document.getElementById("communityList");
  const errorE = document.getElementById("error");

  const urlParams = new URLSearchParams(window.location.search);
  const communityId = urlParams.get("id") || urlParams.get("communityId");

  btnPostar.addEventListener("click", async () => {
    // Reseta estado de erro
    errorE.innerText = "";
    errorE.style.display = "none";

    if (!communityId) {
      errorE.innerText = "Erro: ID da comunidade não encontrado na URL!";
      errorE.style.display = "block";
      return;
    }

    if (textarea.value.trim() === "") {
      errorE.innerText = "Escreva uma descrição para a sua publicação!";
      errorE.style.display = "block";
      textarea.focus();
      return;
    }

    const textoOriginal = btnPostar.innerHTML;
    btnPostar.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';
    btnPostar.disabled = true;

    try {
    
      await window.postService.create(textarea.value.trim(), communityId);

      textarea.value = "";
      btnPostar.innerHTML = textoOriginal;
      btnPostar.disabled = false;
      location.href = `${location.origin}/comunidade/feed/?id=${communityId}`;

    } catch (error) {
      console.error("Erro ao publicar:", error);
      errorE.innerText = error.message || "Tente novamente mais tarde.";
      errorE.style.display = "block";

      btnPostar.innerHTML = textoOriginal;
      btnPostar.disabled = false;
    }
  });

  async function minhasComunidades() {
    try {
      const response = await window.communityService.getIn();
      const comunidades = response.data || response;

      communityList.innerHTML = "";

      if (comunidades.length === 0) {
        communityList.innerHTML =
          "<p style='font-size: 13px; color: var(--text-light); padding: 10px;'>Você ainda não participa de nenhuma comunidade.</p>";
        return;
      }

      comunidades.forEach((c) => {
        const box = document.createElement("div");
        box.className = "community-item";

        // Verifica se é a comunidade atual para deixar "selecionada"
        if (c.id === communityId) {
            box.classList.add("selected");
        }

        box.innerHTML = `
          <div class="community-avatar">
            <img src="${c.bannerUrl || "../img/default-community.webp"}" alt="${c.name}" />
          </div>
          <div class="community-info">
            <div class="community-name">${c.name}</div>
            <div class="community-members">${c.membersCount || 0} membros</div>
          </div>
          <i class="fa-solid fa-check community-check"></i>
        `;

        box.addEventListener(
          "click",
          () =>
            (location.href = `${location.origin}/comunidade/feed/?id=${c.id}`),
        );

        communityList.appendChild(box);
      });
    } catch (error) {
      console.error("Erro ao carregar comunidades:", error);
      communityList.innerHTML = "<p style='font-size: 13px; color: var(--text-light); padding: 10px;'>Erro ao carregar suas comunidades.</p>";
    }
  }

  minhasComunidades();
});