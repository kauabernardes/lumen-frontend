const conquistas = [
    { nome: "Personalize seu perfil com foto e bio", pontos: 50, desbloqueada: true },
    { nome: "Crie sua primeira tarefa ou meta de estudo", pontos: 30, desbloqueada: true },
    { nome: "Configure seu cronograma de estudos pela primeira vez", pontos: 50, desbloqueada: true },
    { nome: "Faça sua primeira postagem na comunidade", pontos: 50, desbloqueada: false },
    { nome: "Adicione seu primeiro colega ou amigo no app", pontos: 50, desbloqueada: false },
    { nome: "Complete uma sessão de estudo por 3 dias seguidos", pontos: 50, desbloqueada: false },
    { nome: "Entre no app por 7 dias seguidos (Streak)", pontos: 50, desbloqueada: false },
    { nome: "Acumule 10 horas de estudo em uma semana", pontos: 50, desbloqueada: false },
    { nome: "Complete todas as suas tarefas de um dia", pontos: 50, desbloqueada: false },
    { nome: "Inicie uma sessão de estudo antes das 7h da manhã", pontos: 50, desbloqueada: false },
    { nome: "Complete uma sessão de estudo após as 22h", pontos: 50, desbloqueada: false },
  ];
  
  const iconCheck = `<svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const iconLock = `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  const iconStarFilled = `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const iconStarOutline = `<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  
  function renderConquistas() {
    const grid = document.getElementById('conquistasGrid');
    const total = conquistas.length;
    const desbloqueadas = conquistas.filter(c => c.desbloqueada).length;
  
    document.getElementById('totalConquistas').textContent = total;
    document.getElementById('totalDesbloqueadas').textContent = desbloqueadas;
  
    grid.innerHTML = conquistas.map(c => `
      <div class="conquista-card ${c.desbloqueada ? 'desbloqueada' : 'bloqueada'}">
        <div class="conquista-card-nome">${c.nome}</div>
        <div class="conquista-card-footer">
          <div class="conquista-pontos">
            ${c.desbloqueada ? iconStarFilled : iconStarOutline}
            ${c.pontos} pontos
          </div>
          <div class="conquista-badge">
            ${c.desbloqueada ? iconCheck : iconLock}
          </div>
        </div>
      </div>
    `).join('');
  }
  
  renderConquistas();