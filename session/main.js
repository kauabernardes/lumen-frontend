const API_URL = "https://lumen-backend-production-8879.up.railway.app/session";

window.socket = io(
  "https://lumen-backend-production-8879.up.railway.app/session",
);
const socket = window.socket;

let currentSessionId = null;
let participants = [];

const notificacao = new Audio("../../assets/audio/session-notification.wav");
const startNotificacao = new Audio("../../assets/audio/session-start.wav");

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
const timerContainer = document.getElementById("timer-container");
const participantsContainer = document.getElementById("participants-list");

const themeInput = document.getElementById("theme-input");
const btnAddTheme = document.getElementById("btn-add-theme");
const themesList = document.getElementById("themes-list");
const themesPlaceholder = document.getElementById("themes-placeholder");

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatContainer = document.getElementById("chat");
const chatPlaceholder = document.getElementById("chat-placeholder");
const chatBtn = document.getElementById("btn-send");

const loadingIndicator = document.getElementById("loading");
const tip = document.getElementById("tip");
const tipIndicator = document.getElementById("tip-indicator");

const lastChallengeCard = document.getElementById("card-last-challenge");
const lastChallengeTitle = document.getElementById("title-last-challenge");
const lastChallengeSubtitle = document.getElementById(
  "subtitle-last-challenge",
);
const lastChallengeContent = document.getElementById("content-last-challenge");

loadingIndicator.style.display = "none";
chatInput.disabled = true;
chatBtn.disabled = true;

btnAddTheme.disabled = true;
themeInput.disabled = true;

function notificar() {
  notificacao.play().catch(console.error);
}
function start() {
  startNotificacao.play().catch(console.error);
}

function triggerShake() {
  if (timerContainer) {
    timerContainer.classList.add("shake");
    setTimeout(() => timerContainer.classList.remove("shake"), 400);
  }
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

  document.title = `${document.title.includes("🔔") ? "🔔 " : ""}${timeString} - Sessão de Estudos`;
}

function showTimerUI() {
  if (joinContainer) joinContainer.classList.add("d-none");
  if (timerContainer) timerContainer.classList.remove("d-none");
}

function renderParticipants(users) {
  if (!participantsContainer) return;
  participantsContainer.innerHTML = "";

  if (users.length === 0) {
    participantsContainer.innerHTML =
      '<p class="empty-text">Apenas você por aqui.</p>';
    return;
  }

  users.forEach((user) => {
    const userEl = document.createElement("div");
    userEl.className = "participant-item";
    userEl.innerHTML = `
      <div class="participant-avatar"><i class="fa-regular fa-circle-user"></i></div>
      <span class="participant-name">@${user.username || "Participante"}</span>
    `;
    participantsContainer.appendChild(userEl);
  });
}

socket.on("connect", () =>
  console.info("Conectado ao servidor Socket.io com ID:", socket.id),
);

socket.on("user_joined", (user) => {
  participants.push(user);
  renderParticipants(participants);
});

socket.on("user_left", (user) => {
  participants = participants.filter((p) => p.userId !== user.userId);
  renderParticipants(participants);
});

socket.on("ai_generating", () => {
  tipIndicator.style.display = "flex";
  tip.innerText = "Luminha está pensando...";
});

socket.on("ai_generated", () => {
  tipIndicator.style.display = "none";
  tip.innerText = "Luminha está pensando...";
});

function renderMessage(message) {
  const messageE = document.createElement("div");

  const isMe = userData?.id === message?.userId;
  const isAi = message?.isAi || message?.userId === "ai";

  if (isMe) {
    messageE.className = "message-sent";
  } else if (isAi) {
    messageE.className = "message message-ai";
  } else {
    messageE.className = "message";
  }

  const formattedDate = new Date(message?.timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let innerContent = "";

  if (isAi) {
    innerContent = `
      <div class="message-header">
        <span class="username">
          <i class="fa-solid fa-robot"></i> ${message?.username || "Luminha"}
        </span>
        <span class="timestamp">${formattedDate}</span>
      </div>
      <div class="ai-card">
        ${message?.title ? `<h4 class="ai-title">${message.title}</h4>` : ""}
        ${message?.subtitle ? `<span class="ai-subtitle">${message.subtitle}</span>` : ""}
        <p class="content mt-2">${message?.text}</p>
      </div>
    `;

    lastChallengeCard.style.display = "block";
    lastChallengeTitle.innerText = message.title || "";
    lastChallengeSubtitle.innerText = message.subtitle || "";
    lastChallengeContent.innerText = message.text || "";
  } else {
    innerContent = `
      <div class="message-header">
        <span class="username">${message?.username}</span>
        <span class="timestamp">${formattedDate}</span>
      </div>
      <p class="content">${message?.text}</p>
    `;
  }

  messageE.innerHTML = innerContent;
  chatContainer.appendChild(messageE);
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
}

async function validateAi() {
  try {
    document.getElementById("btn-validate-ai").disabled = true;
    const data = await window.sessionService.validate(currentSessionId);

    console.log("Resposta da IA validada com sucesso." + JSON.stringify(data));
  } catch (e) {
    console.error("Erro ao validar resposta da IA:", e);
    alert("Erro ao validar resposta da IA. Tente novamente.");
  } finally {
    document.getElementById("btn-validate-ai").disabled = false;
  }
}

socket.on("receive_message", (message) => {
  renderMessage(message);
});

socket.on("validation_result", (result) => {
  if (result.feedback) {
    const messageE = document.createElement("div");
    messageE.className = "message message-ai";

    const formattedDate = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    messageE.innerHTML = `
      <div class="message-header">
        <span class="username">
          <i class="fa-solid fa-robot"></i> Luminha
        </span>
        <span class="timestamp">${formattedDate}</span>
      </div>
      <div class="ai-card">
        <h4 class="ai-title">Feedback da Luminha ;)</h4>
        <p class="content mt-2">${result.feedback}</p>
      </div>
    `;

    chatContainer.appendChild(messageE);
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }
});

socket.on("timer_state", (data) => {
  console.log("Estado do timer atualizado:", data);

  if (data.status === "running")
    btnResume.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
  else btnResume.innerHTML = '<i class="fa-solid fa-play"></i> Retomar';

  updateTimerDisplay(data.timeLeft);
});

function requestJoinSession(sessionId = null) {
  if (!window.sessionService) {
    console.error("sessionService não encontrado!");
    return;
  }

  loadingIndicator.style.display = "block";
  joinContainer.style.display = "none";

  window.sessionService.join(sessionId, async (response) => {
    if (response.error) {
      alert("Erro: " + response.error);
      if (response.error.includes("Acesso negado")) window.location.href = "/";
      return;
    }

    currentSessionId = response.sessionId;
    loadingIndicator.style.display = "none";
    chatInput.disabled = false;
    chatBtn.disabled = false;
    btnAddTheme.disabled = false;
    themeInput.disabled = false;

    try {
      const participantsData =
        await window.sessionService.getParticipants(currentSessionId);
      participants = participantsData;
      renderParticipants(participants);
    } catch (err) {
      console.error("Erro ao buscar participantes:", err);
    }

    try {
      const themesData =
        await window.sessionService.getThemes(currentSessionId);
      if (themesData && themesData.length > 0) {
        themesList.innerHTML = "";
        themesData.forEach((theme) => {
          const themeEl = document.createElement("li");
          themeEl.className = "theme-item";
          themeEl.innerHTML = `${theme}`;
          themesList.appendChild(themeEl);
        });
      } else {
        themesList.innerHTML = "";
        themesList.appendChild(themesPlaceholder);
        themesPlaceholder.style.display = "block";
      }
    } catch (err) {
      console.error("Erro ao buscar temas:", err);
    }

    try {
      const lastChallengeData =
        await window.sessionService.getLastChallenge(currentSessionId);
      if (lastChallengeData) {
        lastChallengeCard.style.display = "block";
        lastChallengeTitle.innerText =
          lastChallengeData.title || "Desafio sem título";
        lastChallengeSubtitle.innerText = lastChallengeData.context || "";
        lastChallengeContent.innerText = lastChallengeData.question || "";
      } else {
        lastChallengeCard.style.display = "none";
      }
    } catch (err) {
      console.error("Erro ao buscar último desafio:", err);
    }

    updateTimerDisplay(response.pomodoro.timeLeft);
    showTimerUI();
  });
}

function sendMessage(text) {
  if (!window.sessionService) {
    console.error("sessionService não encontrado!");
    return;
  }
  chatBtn.disabled = true;
  chatBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  window.sessionService.sendMessage(text, async (response) => {
    if (response.error) {
      chatInput.value = "";
      chatBtn.disabled = false;
      chatBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;
      alert("Erro: " + response.error);
      if (response.error.includes("Acesso negado")) window.location.href = "/";
      return;
    }
    chatInput.value = "";
    chatBtn.disabled = false;
    chatBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;
  });
}

async function handleCommand(command, payload = {}) {
  if (!currentSessionId) return;

  try {
    let result;
    if (command === "toggle")
      result = await window.sessionService.toggle(currentSessionId);
    else if (command === "break")
      result = await window.sessionService.forceBreak(
        currentSessionId,
        payload.type,
      );
    else if (command === "study")
      result = await window.sessionService.forceStudy(currentSessionId);

    if (result) {
      triggerShake();
      if (command === "toggle") {
        updateResumeButton(result.status);
        if (result.status === "running") start();
        else notificar();
      } else {
        updateResumeButton("paused");
        notificar();
      }
    }
  } catch (error) {
    console.error(`Erro:`, error);
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

btnResume.addEventListener("click", () => handleCommand("toggle"));
btnShortBreak.addEventListener("click", () =>
  handleCommand("break", { type: "short" }),
);
btnLongBreak.addEventListener("click", () =>
  handleCommand("break", { type: "long" }),
);
btnStudy.addEventListener("click", () => handleCommand("study"));
btnCreate.addEventListener("click", () => requestJoinSession());

btnJoin.addEventListener("click", () => {
  const sessionIdToJoin = elSessionInput.value.trim();
  if (!sessionIdToJoin) return alert("Cole um ID válido.");
  requestJoinSession(sessionIdToJoin);
});

async function addTheme(e) {
  console.log("Adicionando tema...");
  e.preventDefault();
  const newTheme = themeInput.value.trim();
  if (!newTheme || !currentSessionId) return;

  try {
    const result = await window.sessionService.addTheme(
      currentSessionId,
      themeInput.value,
    );
  } catch (e) {}
  themeInput.value = "";
}

async function handleMessage(e) {
  e.preventDefault();
  sendMessage(chatInput.value);
}

socket.on("themes_updated", (themes) => {
  console.log(themes);
  if (!themes || themes.length === 0) {
    themesList.innerHTML = "";
    themesList.appendChild(themesPlaceholder);
    themesPlaceholder.style.display = "block";
    return;
  }

  themesList.innerHTML = "";
  themes.forEach((theme) => {
    const themeEl = document.createElement("li");
    themeEl.className = "theme-item";
    themeEl.innerHTML = `${theme}`;
    themesList.appendChild(themeEl);
  });
});

const urlParams = new URLSearchParams(window.location.search);
const sessionIdFromURL = urlParams.get("id");
if (sessionIdFromURL) {
  if (elSessionInput) elSessionInput.value = sessionIdFromURL;
  requestJoinSession(sessionIdFromURL);
}

btnCopyLink.addEventListener("click", () => {
  if (!currentSessionId) return;
  const shareUrl = `${window.location.origin}/session/?id=${currentSessionId}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    alert("Link da sessão copiado!");
  });
});

function goTo(path) {
  window.location.href = path;
}
