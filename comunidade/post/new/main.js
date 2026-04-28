document.addEventListener("DOMContentLoaded", () => {
  //const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  const imagePreview = document.getElementById("imagePreview");
  const uploadContent = document.getElementById("uploadContent");
  //const btnRemove = document.getElementById("btnRemoveImage");
  const btnPostar = document.getElementById("btnPostar");
  const textarea = document.getElementById("desc");
  const communityList = document.getElementById("communityList");
  const errorE = document.getElementById("error");

  const urlParams = new URLSearchParams(window.location.search);
  const communityId = urlParams.get("id") || urlParams.get("communityId");

  console.log(btnPostar);

  // dropArea.addEventListener("click", (e) => {
  //   if (e.target.closest("#btnRemoveImage")) return;
  //   fileInput.click();
  // });
  //
  //  fileInput.addEventListener("change", function () {
  //    const file = this.files[0];
  //    if (file) {
  //      const reader = new FileReader();
  //      reader.onload = function (e) {
  //        imagePreview.src = e.target.result;
  //        imagePreview.style.display = "block";
  //        uploadContent.style.display = "none";
  //        btnRemove.style.display = "flex";
  //      };
  //      reader.readAsDataURL(file);
  //    }
  //  });

  // btnRemove.addEventListener("click", (e) => {
  //   e.stopPropagation();
  //   fileInput.value = "";
  //   imagePreview.src = "";
  //   imagePreview.style.display = "none";
  //   uploadContent.style.display = "block";
  //   btnRemove.style.display = "none";
  // });

  btnPostar.addEventListener("click", async () => {
    console.log("oo1ooas");

    if (!communityId) {
      errorE.innerText = "Erro: ID da comunidade não encontrado na URL!";
      return;
    }

    if (textarea.value.trim() === "") {
      alert("Escreve uma descrição para a tua publicação!");
      textarea.focus();
      return;
    }

    const textoOriginal = btnPostar.innerHTML;
    btnPostar.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';
    btnPostar.disabled = true;

    try {
      // Chamada ao serviço global
      await window.postService.create(textarea.value.trim(), communityId);

      textarea.value = "";
      btnPostar.innerHTML = textoOriginal;
      btnPostar.disabled = false;
      location.href = `${location.origin}/comunidade/feed/?id=${communityId}`;

      //fileInput.value = "";
      //imagePreview.style.display = "none";
      //uploadContent.style.display = "block";
      //btnRemove.style.display = "none";
    } catch (error) {
      console.error("Erro ao publicar:", error);
      errorE.innerText = error.message || "Tente novamente mais tarde.";

      btnPostar.innerHTML = textoOriginal;
      btnPostar.disabled = false;
    }
  });

  async function minhasComunidades() {
    try {
      console.log("Iniciando carregamento de comunidades...");

      const response = await window.communityService.getIn();

      const comunidades = response.data || response;

      communityList.innerHTML = "";

      if (comunidades.length === 0) {
        communityList.innerHTML =
          "<p>Você ainda não participa de nenhuma comunidade.</p>";
        return;
      }

      comunidades.forEach((c) => {
        const box = document.createElement("div");
        box.className = "community-item";

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
      communityList.innerHTML = "<p>Erro ao carregar suas comunidades.</p>";
    }
  }

  minhasComunidades();
});
