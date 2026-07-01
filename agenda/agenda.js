async function fetchEvents() {
  return await window.agendaService.getEvents();
}

async function newEvent(e) {
  e.preventDefault();

  const inputTitulo = document.getElementById("inputTitulo");
  const inputDescricao = document.getElementById("inputDescricao");
  const inputData = document.getElementById("inputData");
  const inputHora = document.getElementById("inputHora");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnCancelar = document.getElementById("btnCancelar");

  if (!inputTitulo.value.trim()) {
    alert("Por favor, preencha pelo menos o título do evento.");
    inputTitulo.focus();
    return;
  }

  const novoEvento = {
    title: inputTitulo.value.trim(),
    description: inputDescricao.value.trim(),
    eventDate: `${inputData.value}T${inputHora.value}:00Z`,
  };

  try {
    btnSalvar.innerHTML = "<div class='loader'></div>";
    await window.agendaService.create(novoEvento);
    btnSalvar.innerHTML = "<i class='fa-solid fa-floppy-disk'></i> Salvar";
    renderizarEventos();
    limparFormulario();
  } catch (error) {
    btnSalvar.innerHTML = "<i class='fa-solid fa-floppy-disk'></i> Salvar";
  }
}

const formCard = document.getElementById("formCard");

const listaEventos = document.getElementById("listaEventos");
const emptyState = document.getElementById("emptyState");

async function renderizarEventos() {
  const events = await fetchEvents();
  listaEventos.innerHTML = "";

  if (events.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  events.forEach((evento) => {
    const dataFormatada = new Date(evento.eventDate).toLocaleDateString(
      "pt-BR",
    );

    let textoExibicao = `${evento.title}`;
    if (dataFormatada) textoExibicao += ` - ${dataFormatada}`;
    if (evento.eventDate)
      textoExibicao += ` às ${new Date(evento.eventDate).toLocaleTimeString(
        "pt-BR",
      )}`;

    const item = document.createElement("div");
    item.classList.add("evento-item");
    item.innerHTML = `
        <div class="evento-content">
          <h4>${textoExibicao}</h4>
          ${evento.description ? `<p>${evento.description}</p>` : ""}
        </div>
        <button class="btn-deletar-evento" data-id="${evento.id}" title="Excluir evento">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;

    listaEventos.appendChild(item);
  });

  adicionarEventosDeExclusao();
}

function adicionarEventosDeExclusao() {
  const botoesDeletar = document.querySelectorAll(".btn-deletar-evento");
  botoesDeletar.forEach((botao) => {
    botao.addEventListener("click", async (e) => {
      const idDeletar = botao.getAttribute("data-id");
      try {
        botao.innerHTML = "<div class='loader'></div>";
        await window.agendaService.del(idDeletar);
        botao.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        renderizarEventos();
      } catch (e) {}
    });
  });
}


function limparFormulario() {
  inputTitulo.value = "";
  inputDescricao.value = "";
  inputData.value = "";
  inputHora.value = "";
}


btnCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  limparFormulario();
});

renderizarEventos();
