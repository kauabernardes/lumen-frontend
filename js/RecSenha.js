const emailField = document.getElementById('emailField');
const emailError = document.getElementById('emailError');
const sendBtn = document.querySelector('.btn-login');

// Regex simples para validar e-mail
function validarEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
}

function validarCampo() {
  let valido = true;

  if (!emailField.value) {
    emailError.textContent = "O campo é obrigatório";
    emailError.classList.add("active");
    emailField.classList.add("error");
    valido = false;
  } else if (!validarEmail(emailField.value)) {
    emailError.textContent = "Digite um e-mail válido";
    emailError.classList.add("active");
    emailField.classList.add("error");
    valido = false;
  } else {
    emailError.textContent = "";
    emailError.classList.remove("active");
    emailField.classList.remove("error");
    emailField.classList.add("valid");
  }

  sendBtn.disabled = !valido;
}

// Eventos
emailField.addEventListener("input", validarCampo);

sendBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (!sendBtn.disabled) {
    window.location.href = "LinkRec.html";
  }
});
