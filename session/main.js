// ==========================================
// 1. CONFIGURAÇÕES E UTILITÁRIOS GERAIS
// ==========================================
const API_URL = "http://localhost:3000/session";

// Injetando o socket no window para que outros serviços possam usá-lo
window.socket = io("http://localhost:3000/session");
const socket = window.socket;

const myUser = "019cfd8f-4bd8-798c-9e83-ea34343a94ef";
let currentSessionId = null;
let participants = [];

const notificacao = new Audio("../../assets/audio/session-notification.wav");
const startNotificacao = new Audio("../../assets/audio/session-start.wav");

// Elementos do DOM
const elMinutes = document.getElementById("minutes");
const elSeconds = document.getElementById("seconds");
const btnResume = document.getElementById("btn-resume");
const btnShortBreak = document.getElementById("btn-short-break");
const btnLongBreak = document.getElementById("btn-long-break");
const btnStudy = document.getElementById("btn-study");

const btnCopyLink = document.getElementById("btn-copy-link");
const elSessionInput = document.getElementById("session-input");
const btnCreate = document.getElementById("btn-create");
const btnJoin = document.getElementById("btn-join");
const joinContainer = document.getElementById("join-container");
const timerComponents = document.getElementsByClassName("timer-component");

// Novos elementos para usuários ativos
const participantsContainer = document.getElementById("participants-list");

// interface

function notificar() {
  notificacao.play().catch((error) => console.error(error));
}

function start() {
  startNotificacao.play().catch((error) => console.error(error));
}

function triggerShake() {
  Array.from(timerComponents).forEach((e) => e.classList.add("shake"));
  setTimeout(() => {
    Array.from(timerComponents).forEach((e) => e.classList.remove("shake"));
  }, 500);
}

function updateTimerDisplay(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minStr = String(minutes).padStart(2, "0");
  const secStr = String(seconds).padStart(2, "0");
  const timeString = `${minStr}:${secStr}`;

  if (elMinutes && elSeconds) {
    elMinutes.innerText = minStr;
    elSeconds.innerText = secStr;
  }

  if (document.title.includes("🔔")) {
    document.title = timeString + " - Sessão de Estudos";
  } else {
    document.title = `${timeString} - Sessão de Estudos`;
  }
}

function showTimerUI() {
  if (joinContainer) {
    joinContainer.classList.add("d-none");
    joinContainer.classList.remove("d-flex");
  }

  Array.from(timerComponents).forEach((e) => {
    e.classList.remove("d-none");
    // Mantém a lógica existente que readiciona d-flex
    if (e.tagName === "DIV") {
      e.classList.add("d-flex");
    }
  });
}

// --- Gerenciamento de Participantes ---

function renderParticipants(users) {
  if (!participantsContainer) return;
  participantsContainer.innerHTML = "";

  users.forEach(user => {
    const userEl = document.createElement("div");
    userEl.className = "participant-item";
    userEl.innerHTML = `
      <div class="participant-avatar">
        <i class="fa-regular fa-circle-user"></i>
      </div>
      <span class="participant-name">${user.username}</span>
    `;
    participantsContainer.appendChild(userEl);
  });
}

// logica websocket

socket.on("connect", () => {
  console.info("Conectado ao servidor Socket.io com ID:", socket.id);
});

socket.on("user_joined", (user) => {
  console.log("Usuário entrou:", user);
  participants.push(user);
  renderParticipants(participants);
});

socket.on("user_left", (user) => {
  console.log("Usuário saiu:", user);
  participants = participants.filter(p => p.userId !== user.userId);
  renderParticipants(participants);
});

socket.on("timer_state", (data) => {
  updateTimerDisplay(data.timeLeft);
});

function requestJoinSession(sessionId = null) {
  if (!window.sessionService) {
    console.error("sessionService não encontrado!");
    return;
  }

  window.sessionService.join(sessionId, async (response) => {
    if (response.error) {
      alert("Erro: " + response.error);
      if (response.error.includes("Acesso negado")) {
        window.location.href = "/";
      }
      return;
    }

    currentSessionId = response.sessionId;

    // Busca a lista inicial de participantes via API
    try {
      const participantsData = await window.sessionService.getParticipants(currentSessionId);
      participants = participantsData;
      renderParticipants(participants);
    } catch (err) {
      console.error("Erro ao buscar participantes iniciais:", err);
    }

    updateTimerDisplay(response.pomodoro.timeLeft);
    showTimerUI();
  });
}

// acoes usuario

async function handleCommand(command, payload = {}) {
  if (!currentSessionId) return;

  try {
    let result;
    if (command === 'toggle') {
      result = await window.sessionService.toggle(currentSessionId);
    } else if (command === 'break') {
      result = await window.sessionService.forceBreak(currentSessionId, payload.type);
    } else if (command === 'study') {
      result = await window.sessionService.forceStudy(currentSessionId);
    }

    if (result) {
      triggerShake();
      if (command === 'toggle') {
        updateResumeButton(result.status);
        if (result.status === "running") start();
        else notificar();
      } else {
        updateResumeButton("paused");
        notificar();
      }
    }
  } catch (error) {
    console.error(`Erro ao executar comando ${command}:`, error);
    alert(error.message || "Erro ao processar comando.");
  }
}

function updateResumeButton(status) {
  if (!btnResume) return;
  if (status === "running") {
    btnResume.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
  } else {
    btnResume.innerHTML = '<i class="fa-solid fa-play"></i> Retomar';
  }
}

btnResume.addEventListener("click", () => handleCommand('toggle'));

btnShortBreak.addEventListener("click", () => handleCommand('break', { type: 'short' }));

btnLongBreak.addEventListener("click", () => handleCommand('break', { type: 'long' }));

btnStudy.addEventListener("click", () => handleCommand('study'));

btnCreate.addEventListener("click", () => requestJoinSession());

btnJoin.addEventListener("click", () => {
  const sessionIdToJoin = elSessionInput.value.trim();
  if (!sessionIdToJoin) {
    alert("Por favor, cole um ID de sessão válido.");
    return;
  }
  requestJoinSession(sessionIdToJoin);
});

const urlParams = new URLSearchParams(window.location.search);
const sessionIdFromURL = urlParams.get("id");

if (sessionIdFromURL) {
  console.log("ID encontrado na URL:", sessionIdFromURL);
  if (elSessionInput) elSessionInput.value = sessionIdFromURL;
  requestJoinSession(sessionIdFromURL);
}

btnCopyLink.addEventListener("click", () => {
  if (!currentSessionId) return;
  const shareUrl = `${window.location.origin}/session/?id=${currentSessionId}`;

  navigator.clipboard.writeText(shareUrl).then(() => {
    alert("Link da sessão copiado! Mande para seus amigos.");
  });
});

function goTo(path) {
  window.location.href = path;
}