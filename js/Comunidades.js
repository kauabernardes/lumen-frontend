/**
 * Gerador de cores aleatórias para o design do card.
 */
function gerarCorPastel() {
  const r = Math.floor(Math.random() * 127 + 128);
  const g = Math.floor(Math.random() * 127 + 128);
  const b = Math.floor(Math.random() * 127 + 128);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Exibe o esqueleto enquanto carrega.
 */
function mostrarSkeletonsComunidades() {
  const container = document.getElementById("comunidades-container");
  if (!container) return;

  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-card";
    container.appendChild(skeleton);
  }
}

/**
 * Busca e renderiza as comunidades recomendadas.
 */
async function fetchRecommends() {
  const comunidadesContainer = document.getElementById("comunidades-container");
  if (!comunidadesContainer) return;

  // 1. Mostra o esqueleto
  mostrarSkeletonsComunidades();

  try {
    // 2. Chama a API via serviço
    const result = await window.communityService.getRecommended(1, 5);
    const comunidades = result.data;

    comunidadesContainer.innerHTML = "";

    if (!comunidades || comunidades.length === 0) {
      comunidadesContainer.innerHTML = "<p>Nenhuma comunidade recomendada.</p>";
      return;
    }

    comunidades.forEach((comu) => {
      const card = document.createElement("div");
      card.classList.add("card");
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
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    comunidadesContainer.innerHTML = "<p>Erro ao carregar comunidades recomendadas.</p>";
  }
}

/**
 * Lógica para entrar ou acessar uma comunidade.
 * @param {string} id - ID da comunidade.
 * @param {boolean} isMember - Se o usuário já é membro.
 */
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

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  fetchRecommends();
});
