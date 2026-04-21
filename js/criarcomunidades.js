/**
 * Lógica para a tela de criação de novas comunidades.
 * Responsável por coletar os dados do formulário e enviar para o backend.
 */

async function handleSave(event) {
  if (event) event.preventDefault();

  const nameInput = document.getElementById("nameInput");
  const descInput = document.getElementById("descInput");
  const errorMsg = document.getElementById("error-save");
  const btnSave = document.getElementById("btn-save");

  const name = nameInput.value.trim();
  const description = descInput.value.trim();

  // Validação básica de front-end
  if (name.length < 5) {
    showError("O nome deve ter pelo menos 5 caracteres.");
    return;
  }

  if (name.length > 50) {
    showError("O nome deve ter no máximo 50 caracteres.");
    return;
  }

  try {
    // Feedback visual de carregamento
    const originalText = btnSave.innerHTML;
    btnSave.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Criando...';
    btnSave.disabled = true;
    errorMsg.classList.remove("active");

    // Chamada ao serviço centralizado via window
    await window.communityService.create(name, description);

    // Sucesso!
    alert("Comunidade criada com sucesso!");
    window.location.href = "/Comunidades.html";
  } catch (error) {
    console.error("Erro ao criar comunidade:", error);
    showError(
      error.message || "Não foi possível criar a comunidade. Tente novamente.",
    );
  } finally {
    // Restaurar botão
    if (btnSave) {
      btnSave.innerHTML = originalText;
      btnSave.disabled = false;
    }
  }
}

/**
 * Exibe mensagens de erro na tela.
 * @param {string} message
 */
function showError(message) {
  const errorMsg = document.getElementById("error-save");
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.classList.add("active");
    // Remove a classe de erro após 5 segundos
    setTimeout(() => {
      errorMsg.classList.remove("active");
    }, 5000);
  } else {
    alert(message);
  }
}

// Expõe a função globalmente para o onsubmit do HTML
window.handleSave = handleSave;
