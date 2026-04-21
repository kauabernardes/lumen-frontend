// ============================================================
//  daily.js — Lumen Daily Check-in
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // ----------------------------------------------------------
    // DATA DE HOJE no cabeçalho
    // ----------------------------------------------------------
    var dateEl = document.getElementById('dailyDate');
    if (dateEl) {
        var now = new Date();
        var opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        var formatted = now.toLocaleDateString('pt-BR', opts);
        // Capitaliza primeira letra
        dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    // ----------------------------------------------------------
    // MINI CALENDÁRIO DA SEMANA
    // ----------------------------------------------------------
    var weekDaysEl = document.getElementById('weekDays');
    if (weekDaysEl) {
        var names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        var today = new Date();
        var dayOfWeek = today.getDay(); // 0 = domingo

        // Gera os 7 dias da semana (começando no domingo)
        // Simula que os dias anteriores a hoje já foram feitos (exceto hoje)
        for (var i = 0; i < 7; i++) {
            var diff = i - dayOfWeek;
            var d = new Date(today);
            d.setDate(today.getDate() + diff);

            var isToday = (i === dayOfWeek);
            var isPast  = (i < dayOfWeek);

            var dayEl = document.createElement('div');
            dayEl.className = 'week-day' + (isToday ? ' today' : '') + (isPast ? ' done' : '');

            var nameEl = document.createElement('span');
            nameEl.className = 'week-day-name';
            nameEl.textContent = names[i];

            var dotEl = document.createElement('div');
            dotEl.className = 'week-day-dot';
            dotEl.textContent = isPast ? '✓' : (isToday ? d.getDate() : '');

            dayEl.appendChild(nameEl);
            dayEl.appendChild(dotEl);
            weekDaysEl.appendChild(dayEl);
        }
    }


    var streakFill = document.querySelector('.streak-bar-fill');
    if (streakFill) {
        // a barra já tem width inline no HTML, anima ao carregar
        var targetWidth = streakFill.style.width;
        streakFill.style.width = '0%';
        setTimeout(function () {
            streakFill.style.width = targetWidth;
        }, 400);
    }

    // ----------------------------------------------------------
    // RADIO "CONSEGUIU ATINGIR?"
    // ----------------------------------------------------------
    var radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(function (opt) {
        opt.addEventListener('click', function () {
            radioOptions.forEach(function (o) { o.classList.remove('selected'); });
            this.classList.add('selected');
            var input = this.querySelector('input[type="radio"]');
            if (input) input.checked = true;
        });
    });


    var moodBtns = document.querySelectorAll('.mood-btn');
    var selectedMood = null;

    moodBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            moodBtns.forEach(function (b) { b.classList.remove('selected'); });
            this.classList.add('selected');
            selectedMood = this.dataset.mood;
        });
    });


    var btnCheckin    = document.getElementById('btnCheckin');
    var successBanner = document.getElementById('successBanner');
    var estudouOntem  = document.getElementById('estudouOntem');
    var estudaHoje    = document.getElementById('estudaHoje');

    if (btnCheckin) {
        btnCheckin.addEventListener('click', function () {

            var desc1 = estudouOntem ? estudouOntem.value.trim() : '';
            var desc2 = estudaHoje   ? estudaHoje.value.trim()   : '';
            var atingiu = document.querySelector('input[name="atingiu"]:checked');

            if (!desc1) {
                shakeCard('step1');
                estudouOntem.focus();
                return;
            }

            if (!atingiu) {
                shakeCard('step2');
                return;
            }

            if (!desc2) {
                shakeCard('step3');
                estudaHoje.focus();
                return;
            }

            // Sucesso!
            btnCheckin.innerHTML = '<i class="fa-solid fa-check"></i> <span>Check-in feito!</span>';
            btnCheckin.style.background = 'linear-gradient(135deg, #34c47a, #27a86a)';
            btnCheckin.style.boxShadow  = '0 5px 20px rgba(52,196,122,0.4)';
            btnCheckin.disabled = true;

            if (successBanner) successBanner.classList.add('visible');

            // Incrementa streak visualmente
            var streakEl = document.getElementById('streakCount');
            if (streakEl) {
                var current = parseInt(streakEl.textContent, 10) || 0;
                animateNumber(streakEl, current, current + 1, 600);
            }

            // Marca hoje como feito no calendário
            var todayDot = document.querySelector('.week-day.today .week-day-dot');
            if (todayDot) {
                var parent = todayDot.closest('.week-day');
                if (parent) {
                    parent.classList.add('done');
                    parent.classList.remove('today');
                    todayDot.textContent = '✓';
                }
            }

            // Restaura botão após 4s
            setTimeout(function () {
                btnCheckin.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Publicar agora</span>';
                btnCheckin.style.background = '';
                btnCheckin.style.boxShadow  = '';
                btnCheckin.disabled = false;
            }, 4000);
        });
    }

    // ----------------------------------------------------------
    // FRASES MOTIVACIONAIS
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
        '"Você não precisa ser perfeito todos os dias — só precisa tentar."'
    ];

    var quoteEl  = document.getElementById('motivationQuote');
    var btnQuote = document.getElementById('btnQuote');
    var lastIdx  = -1;

    function getRandomQuote() {
        var idx;
        do { idx = Math.floor(Math.random() * frases.length); } while (idx === lastIdx);
        lastIdx = idx;
        return frases[idx];
    }

    if (btnQuote && quoteEl) {
        btnQuote.addEventListener('click', function () {
            quoteEl.style.opacity = '0';
            setTimeout(function () {
                quoteEl.textContent = getRandomQuote();
                quoteEl.style.opacity = '1';
            }, 250);
        });
    }

    // ----------------------------------------------------------
    // HELPERS
    // ----------------------------------------------------------

    // Shake de card inválido
    function shakeCard(id) {
        var card = document.getElementById(id);
        if (!card) return;
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'shake 0.4s ease';
        setTimeout(function () { card.style.animation = ''; }, 450);
    }

    // Animação de número
    function animateNumber(el, from, to, duration) {
        var start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.round(from + (to - from) * progress);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

});

// ----------------------------------------------------------
// Animação de shake (injetada via CSS dinâmico)
// ----------------------------------------------------------
(function () {
    var style = document.createElement('style');
    style.textContent = [
        '@keyframes shake {',
        '  0%, 100% { transform: translateX(0); }',
        '  20%       { transform: translateX(-7px); }',
        '  40%       { transform: translateX(7px); }',
        '  60%       { transform: translateX(-5px); }',
        '  80%       { transform: translateX(5px); }',
        '}'
    ].join('');
    document.head.appendChild(style);
})();