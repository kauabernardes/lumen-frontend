document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const formCard = document.getElementById("formCard");
  const inputTitulo = document.getElementById("inputTitulo");
  const inputDescricao = document.getElementById("inputDescricao");
  const inputData = document.getElementById("inputData");
  const inputHora = document.getElementById("inputHora");
  
  const btnSalvar = document.getElementById("btnSalvar");
  const btnCancelar = document.getElementById("btnCancelar");
  
  const listaEventos = document.getElementById("listaEventos");
  const emptyState = document.getElementById("emptyState");

  let eventos = [
    {
      id: 1,
      titulo: "Prova de História",
      descricao: "Conteúdo do bimestre",
      data: "2025-10-10",
      hora: "08:00"
    },
    {
      id: 2,
      titulo: "Entrega: Trabalho de Química",
      descricao: "Enviar por e-mail",
      data: "2025-10-18",
      hora: ""
    },
    {
      id: 3,
      titulo: "Prova de Matemática",
      descricao: "Trazer calculadora",
      data: "2025-10-22",
      hora: "10:00"
    },
    {
      id: 4,
      titulo: "Pesquisa: Era Vargas",
      descricao: "História do Brasil",
      data: "2025-10-30",
      hora: ""
    }
  ];

  // Função para renderizar a lista na tela
  function renderizarEventos() {
    listaEventos.innerHTML = "";

    if (eventos.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    eventos.forEach((evento) => {
  
      const dataFormatada = evento.data ? evento.data.split('-').reverse().join('/') : "";
      
     
      let textoExibicao = `${evento.titulo}`;
      if (dataFormatada) textoExibicao += ` - ${dataFormatada}`;
      if (evento.hora) textoExibicao += ` às ${evento.hora}`;

      const item = document.createElement("div");
      item.classList.add("evento-item");
      item.innerHTML = `
        <div class="evento-content">
          <h4>${textoExibicao}</h4>
          ${evento.descricao ? `<p>${evento.descricao}</p>` : ''}
        </div>
        <button class="btn-deletar-evento" data-id="${evento.id}" title="Excluir evento">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;

      listaEventos.appendChild(item);
    });

    adicionarEventosDeExclusao();
  }

  // Função para cadastrar novo evento
  btnSalvar.addEventListener("click", (e) => {
    e.preventDefault();

    // Validação básica
    if (!inputTitulo.value.trim()) {
      alert("Por favor, preencha pelo menos o título do evento.");
      inputTitulo.focus();
      return;
    }

    // Criando estrutura do novo objeto
    const novoEvento = {
      id: Date.now(), // Gera um ID único simples
      titulo: inputTitulo.value.trim(),
      descricao: inputDescricao.value.trim(),
      data: inputData.value,
      hora: inputHora.value
    };

    // Adiciona no início do Array para aparecer no topo
    eventos.unshift(novoEvento);

    // Atualiza a tela e limpa formulário
    renderizarEventos();
    limparFormulario();
  });

  // Função para deletar um evento da lista
  function adicionarEventosDeExclusao() {
    const botoesDeletar = document.querySelectorAll(".btn-deletar-evento");
    botoesDeletar.forEach(botao => {
      botao.addEventListener("click", (e) => {
        const idDeletar = Number(botao.getAttribute("data-id"));
        eventos = eventos.filter(ev => ev.id !== idDeletar);
        renderizarEventos();
      });
    });
  }

  // Limpar os campos do formulário
  function limparFormulario() {
    inputTitulo.value = "";
    inputDescricao.value = "";
    inputData.value = "";
    inputHora.value = "";
  }

  // Ação do botão Cancelar
  btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    limparFormulario();
  });

  // Inicializa chamando a lista padrão
  renderizarEventos();
});