// ========================= //
// EDITAR PERFIL             //
// ========================= //

const btnEditarPerfil  = document.getElementById('btnEditarPerfil');
const modalOverlay     = document.getElementById('modalOverlay');
const btnFecharModal   = document.getElementById('btnFecharModal');
const btnCancelarModal = document.getElementById('btnCancelarModal');
const btnSalvarModal   = document.getElementById('btnSalvarModal');

const inputNome   = document.getElementById('inputNome');
const inputHandle = document.getElementById('inputHandle');

const nomeExibido   = document.getElementById('nomeExibido');
const handleExibido = document.getElementById('handleExibido');

// IDs dos nomes nas contribuições
const nomeContribs   = ['nomeContrib1', 'nomeContrib2', 'nomeContrib3'];
const handleContribs = ['handleContrib1', 'handleContrib2', 'handleContrib3'];

// Abre modal
btnEditarPerfil.addEventListener('click', () => {
  inputNome.value   = nomeExibido.textContent;
  inputHandle.value = handleExibido.textContent;
  modalOverlay.classList.add('ativo');
});

// Fecha modal
function fecharModal() {
  modalOverlay.classList.remove('ativo');
}

btnFecharModal.addEventListener('click', fecharModal);
btnCancelarModal.addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) fecharModal();
});

// Salva alterações
btnSalvarModal.addEventListener('click', () => {
  const novoNome   = inputNome.value.trim();
  const novoHandle = inputHandle.value.trim();

  if (!novoNome) return;

  // Atualiza hero
  nomeExibido.textContent   = novoNome;
  handleExibido.textContent = novoHandle || '@' + novoNome.toLowerCase().replace(/\s/g, '');

  // Atualiza contribuições
  nomeContribs.forEach(id => {
    document.getElementById(id).textContent = novoNome;
  });
  handleContribs.forEach(id => {
    document.getElementById(id).textContent = handleExibido.textContent;
  });

  fecharModal();
});