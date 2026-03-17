const API_URL = "http://localhost:3000/session"; // URL base para as rotas REST
const socket = io("http://localhost:3000/session");

const myUser = "019cfd8f-4bd8-798c-9e83-ea34343a94ef";
let currentSessionId = null;

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

// Elementos de Entrada
const elSessionInput = document.getElementById("session-input");
const btnCreate = document.getElementById("btn-create");
const btnJoin = document.getElementById("btn-join");
const joinContainer = document.getElementById("join-container");
const timerComponents = document.getElementsByClassName("timer-component");

// ==========================================
// FUNÇÕES DE INTERFACE (UI)
// ==========================================

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

  elMinutes.innerText = minStr;
  elSeconds.innerText = secStr;

  if (totalSeconds <= 0) {
    document.title = "🔔 Fim do Bloco! | Lumen";
  } else {
    document.title = `${timeString} - Sessão de Estudos`;
  }
}

function showTimerUI() {
  joinContainer.classList.add("d-none");
  joinContainer.classList.remove("d-flex");

  Array.from(timerComponents).forEach((e) => {
    e.classList.remove("d-none");
    if (e.tagName === "DIV") {
      e.classList.add("d-flex");
    }
  });
}

// ==========================================
// LÓGICA DE CONEXÃO (SOCKET.IO)
// ==========================================

socket.on("connect", () => {
  console.info("Conectado ao servidor Socket.io com ID:", socket.id);
});

// O ingresso na sala continua via Socket (já que você manteve o @SubscribeMessage no Gateway)
function requestJoinSession(sessionId = null) {
  const payload = { userId: myUser };
  if (sessionId) payload.sessionId = sessionId;

  socket.emit("join_session", payload, (response) => {
    if (response.error) {
      alert("Erro: " + response.error);
      return;
    }

    currentSessionId = response.sessionId;
    updateTimerDisplay(response.pomodoro.timeLeft);
    showTimerUI();

    updateResumeButton(response.pomodoro.status);
  });
}

// Escuta o único evento que o back-end emite agora
socket.on("timer_state", (data) => {
  updateTimerDisplay(data.timeLeft);

  // Se você adicionar o 'status' no payload do back-end, pode descomentar a linha abaixo:
  // updateResumeButton(data.status);
});

// ==========================================
// AÇÕES DO USUÁRIO (REST API COM FETCH)
// ==========================================

// Função auxiliar para não repetir o fetch toda hora
async function sendCommand(endpoint, bodyData = {}) {
  if (!currentSessionId) return null;

  try {
    const response = await fetch(`${API_URL}/${currentSessionId}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: myUser, ...bodyData }),
    });

    if (!response.ok) throw new Error("Falha na requisição");
    return await response?.json();
  } catch (error) {}
}

function updateResumeButton(status) {
  if (status === "running") {
    btnResume.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
  } else {
    btnResume.innerHTML = '<i class="fa-solid fa-play"></i> Retomar';
  }
}

btnResume.addEventListener("click", async () => {
  const result = await sendCommand("toggle");

  // O seu Controller deve retornar { status: 'running' } ou { status: 'paused' }
  // baseado na função toggleTimer do Service.
  if (result && result.status) {
    updateResumeButton(result.status);
    triggerShake();

    if (result.status === "running") start();
    else notificar();
  }
});

btnShortBreak.addEventListener("click", async () => {
  const result = await sendCommand("break", { type: "short" });
  if (result) {
    updateResumeButton("paused");
    triggerShake();
    notificar();
  }
});

btnLongBreak.addEventListener("click", async () => {
  const result = await sendCommand("break", { type: "long" });
  if (result) {
    updateResumeButton("paused");
    triggerShake();
    notificar();
  }
});

btnStudy.addEventListener("click", async () => {
  const result = await sendCommand("study");
  if (result) {
    updateResumeButton("paused");
    triggerShake();
    notificar();
  }
});

// ==========================================
// OUTROS EVENTOS DA TELA
// ==========================================

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
  elSessionInput.value = sessionIdFromURL;
  requestJoinSession(sessionIdFromURL);
}

btnCopyLink.addEventListener("click", () => {
  if (!currentSessionId) return;
  const shareUrl = `${window.location.origin}/session/?id=${currentSessionId}`;

  navigator.clipboard.writeText(shareUrl).then(() => {
    alert("Link da sessão copiado! Mande para seus amigos.");
  });
});
