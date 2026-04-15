
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
      
      // Aqui você já pode usar o isMember que configuramos no backend!
      const botaoAcao = comu.isMember 
        ? `<button onclick="acessarComunidade('${comu.id}')">Acessar (Você já participa)</button>`
        : `<button onclick="acessarComunidade('${comu.id}')">Entrar</button>`;

      card.innerHTML = `
        <h2>${comu.name}</h2>
        ${botaoAcao}
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
  window.location.href = `/comunidade/feed/?id=${id}`;
}

fetchRecommends();
