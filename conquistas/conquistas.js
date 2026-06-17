const iconCheck = `<svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const iconLock = `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
const iconStarFilled = `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const iconStarOutline = `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

const grid = document.getElementById("conquistasGrid");

const totalDesbloqueadas = document.getElementById("totalDesbloqueadas");
const totalConquistas = document.getElementById("totalConquistas");

async function fetchConquistas() {
  grid.innerHTML = "";

  try {
    const response = await window.rewardService.getMy();

    response.forEach((reward) => {
      const item = document.createElement("div");
      item.classList.add("conquista-card");
      if (reward.isCorrect == true) {
        item.classList.add("desbloqueada");
      } else {
        item.classList.add("bloqueada");
      }

      item.innerHTML = `<div class="conquista-card-nome">${reward?.title}</div>
        <div class="conquista-card-footer">
          <div class="conquista-pontos">
           ${reward?.isCorrect ? iconStarFilled : iconStarOutline}
            ${reward.difficulty && reward.difficulty}
          </div>,
          <div class="conquista-badge">
           ${reward?.isCorrect ? iconCheck : iconLock}
          </div>
        </div>`;

      grid.append(item);
    });

    totalDesbloqueadas.innerText = Array.from(response).reduce(
      (total, current) => total + (current.isCorrect ? 1 : 0),
      0,
    );

    totalConquistas.innerText = response.length;
  } catch (e) {
    console.log(1);
  }
}

fetchConquistas();
