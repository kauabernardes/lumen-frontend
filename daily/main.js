// ============================================================
//  daily.js — Lumen Daily Check-in
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------------------------------------
  // DATA DE HOJE no cabeçalho
  // ----------------------------------------------------------
  var dateEl = document.getElementById("dailyDate");
  if (dateEl) {
    var now = new Date();
    var opts = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    var formatted = now.toLocaleDateString("pt-BR", opts);
    dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // ----------------------------------------------------------
  // FUNÇÃO PARA CARREGAR DADOS DA API
  // ----------------------------------------------------------
  async function loadSummary() {
    try {
      // Usa o service que acabamos de criar!
      const summary = await window.dailyService.getSummary();
      
      // 1. Atualiza a Ofensiva (Streak)
      const streakEl = document.getElementById("streakCount");
      const streakFill = document.querySelector(".streak-bar-fill");
      const streakCaption = document.querySelector(".streak-bar-caption");

      if (streakEl) streakEl.textContent = summary.streak;
      
      if (streakFill && streakCaption) {
        const target = 30; // Alvo fixo de 30 dias para a barra de progresso
        const pct = Math.min((summary.streak / target) * 100, 100);
        
        setTimeout(() => {
          streakFill.style.width = pct + "%";
        }, 400); // pequeno delay para a animação CSS acontecer
        
        streakCaption.innerHTML = `${summary.streak} de ${target} dias — continue assim! 🎯`;
      }

      // 2. Atualiza o Calendário da Semana
      const weekDaysEl = document.getElementById("weekDays");
      if (weekDaysEl && summary.weekly) {
        weekDaysEl.innerHTML = ""; // Limpa o conteúdo mockado
        
        const names = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const today = new Date();
        const dayOfWeek = today.getDay(); 

        for (let i = 0; i < 7; i++) {
          const diff = i - dayOfWeek;
          const d = new Date(today);
          d.setDate(today.getDate() + diff);

          const isToday = i === dayOfWeek;
          const isDone = summary.weekly[i]; // boolean retornado pela sua API

          const dayEl = document.createElement("div");
          dayEl.className = "week-day" + (isToday ? " today" : "") + (isDone ? " done" : "");

          const nameEl = document.createElement("span");
          nameEl.className = "week-day-name";
          nameEl.textContent = names[i];

          const dotEl = document.createElement("div");
          dotEl.className = "week-day-dot";
          dotEl.textContent = isDone ? "✓" : (isToday ? d.getDate() : "");

          dayEl.appendChild(nameEl);
          dayEl.appendChild(dotEl);
          weekDaysEl.appendChild(dayEl);
        }
      }

      // 3. Atualiza as Estatísticas (Check-ins e Metas)
      const statValues = document.querySelectorAll(".stat-item .stat-value");
      if (statValues.length >= 3 && summary.stats) {
        // [0] = Check-ins, [1] = Matérias, [2] = Meta, [3] = Horas
        statValues[0].textContent = summary.stats.totalCheckins;
        statValues[2].textContent = summary.stats.goalPercentage + "%";
      }

    } catch (error) {
      console.error("Erro ao carregar o resumo:", error);
    }
  }

  // Chama a função assim que a página carregar
  loadSummary();


  // ----------------------------------------------------------
  // RADIO "CONSEGUIU ATINGIR?" E HUMOR (Sem alterações)
  // ----------------------------------------------------------
  var radioOptions = document.querySelectorAll(".radio-option");
  radioOptions.forEach(function (opt) {
    opt.addEventListener("click", function () {
      radioOptions.forEach(function (o) {
        o.classList.remove("selected");
      });
      this.classList.add("selected");
      var input = this.querySelector('input[type="radio"]');
      if (input) input.checked = true;
    });
  });

  var moodBtns = document.querySelectorAll(".mood-btn");
  var selectedMood = null;

  moodBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      moodBtns.forEach(function (b) {
        b.classList.remove("selected");
      });
      this.classList.add("selected");
      selectedMood = this.dataset.mood;
    });
  });

  // ----------------------------------------------------------
  // LÓGICA DE CHECK-IN
  // ----------------------------------------------------------
  var btnCheckin = document.getElementById("btnCheckin");
  var successBanner = document.getElementById("successBanner");
  var estudouOntem = document.getElementById("estudouOntem");
  var estudaHoje = document.getElementById("estudaHoje");

  if (btnCheckin) {
    btnCheckin.addEventListener("click", async function () {
      var desc1 = estudouOntem ? estudouOntem.value.trim() : "";
      var desc2 = estudaHoje ? estudaHoje.value.trim() : "";
      var atingiuInput = document.querySelector('input[name="atingiu"]:checked');

      if (!desc1) { shakeCard("step1"); estudouOntem.focus(); return; }
      if (!atingiuInput) { shakeCard("step2"); return; }
      if (!desc2) { shakeCard("step3"); estudaHoje.focus(); return; }
      if (!selectedMood) { shakeCard("step4"); return; }

      const payload = {
        date: new Date().toISOString().split("T")[0],
        mood: selectedMood.toString(),
        studiedYesterday: desc1,
        achievedGoal: atingiuInput.value,
        studyToday: desc2,
      };

      try {
        btnCheckin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Salvando...</span>';
        btnCheckin.disabled = true;

        // Usa o service para fazer o POST!
        await window.dailyService.createCheckin(payload);

        btnCheckin.innerHTML = '<i class="fa-solid fa-check"></i> <span>Check-in feito!</span>';
        btnCheckin.style.background = "linear-gradient(135deg, #34c47a, #27a86a)";
        btnCheckin.style.boxShadow = "0 5px 20px rgba(52,196,122,0.4)";

        if (successBanner) successBanner.classList.add("visible");

        // Recarrega os dados do painel lateral inteiro chamando a API de novo!
        // Isso atualiza a ofensiva, os cards da semana e as estatísticas automaticamente.
        await loadSummary();

      } catch (error) {
        console.error("Erro ao fazer checkin:", error);
        alert(error.message || "Erro ao salvar o check-in. Tente novamente.");

        btnCheckin.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Fazer Check-in</span>';
        btnCheckin.disabled = false;
      }
    });
  }

  // ----------------------------------------------------------
  // FRASES MOTIVACIONAIS E HELPERS
  // ----------------------------------------------------------
  var frases = [
    '"Cada dia de estudo é um tijolo na construção do seu futuro."',
    '"A disciplina é a ponte entre metas e realizações."',
    '"Quem estuda ontem, vence amanhã."',
    '"O sucesso é a soma de pequenos esforços repetidos dia após dia."',
    '"Não existe atalho para qualquer lugar que valha a pena ir."',
    '"Estude enquanto eles dormem. Vença enquanto eles descansam."',
    '"A aprovação começa aqui, neste momento, nesta revisão."',
    '"Foco, força e fé: a tríade do estudante que vai passar."',
    '"Um dia de cada vez. Uma matéria de cada vez. Uma conquista de cada vez."',
    '"Você não precisa ser perfeito todos os dias — só precisa tentar."',
  ];

  var quoteEl = document.getElementById("motivationQuote");
  var btnQuote = document.getElementById("btnQuote");
  var lastIdx = -1;

  function getRandomQuote() {
    var idx;
    do { idx = Math.floor(Math.random() * frases.length); } while (idx === lastIdx);
    lastIdx = idx;
    return frases[idx];
  }

  if (btnQuote && quoteEl) {
    btnQuote.addEventListener("click", function () {
      quoteEl.style.opacity = "0";
      setTimeout(function () {
        quoteEl.textContent = getRandomQuote();
        quoteEl.style.opacity = "1";
      }, 250);
    });
  }

  function shakeCard(id) {
    var card = document.getElementById(id);
    if (!card) return;
    card.style.animation = "none";
    card.offsetHeight;
    card.style.animation = "shake 0.4s ease";
    setTimeout(function () { card.style.animation = ""; }, 450);
  }
});

(function () {
  var style = document.createElement("style");
  style.textContent = [
    "@keyframes shake {",
    "  0%, 100% { transform: translateX(0); }",
    "  20%      { transform: translateX(-7px); }",
    "  40%      { transform: translateX(7px); }",
    "  60%      { transform: translateX(-5px); }",
    "  80%      { transform: translateX(5px); }",
    "}",
  ].join("");
  document.head.appendChild(style);
})();