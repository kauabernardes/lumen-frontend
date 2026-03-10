const socket = io("http://localhost:3000/session");

const myUser = "7a988a5d-ce2d-4f43-855b-eec1d7c1aa64";
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
  notificacao.play().catch((error) => {
    console.error(error);
  });
}

function start() {
  startNotificacao.play().catch((error) => {
    console.error(error);
  });
}

function updateTimerDisplay(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minStr = String(minutes).padStart(2, "0");
  const secStr = String(seconds).padStart(2, "0");
  const timeString = `${minStr}:${secStr}`;

  // Atualiza os números no HTML
  elMinutes.innerText = minStr;
  elSeconds.innerText = secStr;

  // ATUALIZA O TÍTULO DA ABA
  if (totalSeconds <= 0) {
    document.title = "🔔 Fim do Bloco! | Lumen";
  } else {
    document.title = `${timeString} - Sessão de Estudos`;
  }
}

function showTimerUI() {
  // Esconde a área de input
  joinContainer.classList.add("d-none");
  joinContainer.classList.remove("d-flex");

  // Mostra os componentes do timer
  Array.from(timerComponents).forEach((e) => {
    e.classList.remove("d-none");
    if (e.tagName === "DIV") {
      e.classList.add("d-flex");
    }
  });
}

// ==========================================
// LÓGICA DE CONEXÃO E SESSÃO
// ==========================================

socket.on("connect", () => {
  console.info("Conectado ao servidor Socket.io com ID:", socket.id);
});

function requestJoinSession(sessionId = null) {
  const payload = { userId: myUser };

  if (sessionId) {
    payload.sessionId = sessionId;
  }

  socket.emit("join_session", payload, (response) => {
    if (response.error) {
      alert("Erro: " + response.error);
      return;
    }

    currentSessionId = response.sessionId;

    updateTimerDisplay(response.pomodoro.timeLeft);
    showTimerUI();

    // Configuração inicial dos botões dependendo do status atual
    if (response.pomodoro.status === "running") {
      btnResume.disabled = true;
    } else {
      btnResume.disabled = false;
    }
  });
}

btnCreate.addEventListener("click", () => {
  requestJoinSession();
});

btnJoin.addEventListener("click", () => {
  const sessionIdToJoin = elSessionInput.value.trim();
  if (!sessionIdToJoin) {
    alert("Por favor, cole um ID de sessão válido no campo de texto.");
    return;
  }
  requestJoinSession(sessionIdToJoin);
});

// ==========================================
// EVENTOS DO TIMER
// ==========================================

socket.on("timer_tick", (data) => {
  updateTimerDisplay(data.timeLeft);
});

socket.on("timer_paused", (data) => {
  updateTimerDisplay(data.timeLeft);
  document.title = "⏸️ Pausado - Lumen";
  btnResume.innerHTML = '<i class="fa-solid fa-play"></i> Retomar';
  notificar();
  Array.from(timerComponents).forEach((e) => e.classList.add("shake"));
  setTimeout(() => {
    Array.from(timerComponents).forEach((e) => e.classList.remove("shake"));
  }, 500);
});

socket.on("timer_started", async (data) => {
  if (data.error) {
    alert("Erro: " + response.error);
    return;
  }

  btnResume.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
  start();
  Array.from(timerComponents).forEach((e) => e.classList.add("shake"));
  setTimeout(() => {
    Array.from(timerComponents).forEach((e) => e.classList.remove("shake"));
  }, 500);
});

socket.on("timer_ended", (data) => {
  updateTimerDisplay(data.timeLeft);
  btnResume.innerHTML = '<i class="fa-solid fa-play"></i> Retomar';
  notificar();
  Array.from(timerComponents).forEach((e) => e.classList.add("shake"));
  setTimeout(() => {
    Array.from(timerComponents).forEach((e) => e.classList.remove("shake"));
  }, 500);
});

// ==========================================
// CONTROLES TIMER
// ==========================================

btnResume.addEventListener("click", () => {
  if (!currentSessionId) return;

  socket.emit("toggle_timer", {
    sessionId: currentSessionId,
    userId: myUser,
  });
});

btnShortBreak.addEventListener("click", () => {
  if (!currentSessionId) return;
  socket.emit("force_break", {
    sessionId: currentSessionId,
    userId: myUser,
    type: "short",
  });
});

btnLongBreak.addEventListener("click", () => {
  if (!currentSessionId) return;
  socket.emit("force_break", {
    sessionId: currentSessionId,
    userId: myUser,
    type: "long",
  });
});

btnStudy.addEventListener("click", () => {
  if (!currentSessionId) return;
  socket.emit("force_study", {
    sessionId: currentSessionId,
    userId: myUser,
  });
});

const urlParams = new URLSearchParams(window.location.search);
const sessionIdFromURL = urlParams.get("id");

if (sessionIdFromURL) {
  console.log("ID encontrado na URL:", sessionIdFromURL);
  elSessionInput.value = sessionIdFromURL;
  requestJoinSession(sessionIdFromURL);
}

function generateShareLink() {
  if (!currentSessionId) return;
  const shareUrl = `${window.location.origin}/session/?id=${currentSessionId}`;

  navigator.clipboard.writeText(shareUrl).then(() => {
    alert("Link da sessão copiado! Mande para seus amigos.");
  });
}

btnCopyLink.addEventListener("click", () => generateShareLink());
