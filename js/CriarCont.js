const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerBtn = document.querySelector(".btn-login");

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

function validarEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
}

function validarCampos() {
  let valido = true;

  // Nome de usuário
  if (!usernameInput.value) {
    usernameError.textContent = "O nome de usuário é obrigatório";
    usernameError.classList.add("active");
    usernameInput.classList.add("error");
    valido = false;
  } else if (usernameInput.value.length < 4) {
    usernameError.textContent = "O usuário deve ter pelo menos 4 caracteres";
    usernameError.classList.add("active");
    usernameInput.classList.add("error");
    valido = false;
  } else {
    usernameError.textContent = "";
    usernameError.classList.remove("active");
    usernameInput.classList.remove("error");
    usernameInput.classList.add("valid");
  }

  // E-mail
  if (!emailInput.value) {
    emailError.textContent = "O e-mail é obrigatório";
    emailError.classList.add("active");
    emailInput.classList.add("error");
    valido = false;
  } else if (!validarEmail(emailInput.value)) {
    emailError.textContent = "Digite um e-mail válido";
    emailError.classList.add("active");
    emailInput.classList.add("error");
    valido = false;
  } else {
    emailError.textContent = "";
    emailError.classList.remove("active");
    emailInput.classList.remove("error");
    emailInput.classList.add("valid");
  }

  // Senha
  if (!passwordInput.value) {
    passwordError.textContent = "A senha é obrigatória";
    passwordError.classList.add("active");
    passwordInput.classList.add("error");
    valido = false;
  } else if (passwordInput.value.length < 8) {
    passwordError.textContent = "A senha deve ter pelo menos 8 caracteres";
    passwordError.classList.add("active");
    passwordInput.classList.add("error");
    valido = false;
  } else {
    passwordError.textContent = "";
    passwordError.classList.remove("active");
    passwordInput.classList.remove("error");
    passwordInput.classList.add("valid");
  }

  // Confirmar senha
  if (!confirmPasswordInput.value) {
    confirmPasswordError.textContent = "Confirme sua senha";
    confirmPasswordError.classList.add("active");
    confirmPasswordInput.classList.add("error");
    valido = false;
  } else if (confirmPasswordInput.value !== passwordInput.value) {
    confirmPasswordError.textContent = "As senhas não coincidem";
    confirmPasswordError.classList.add("active");
    confirmPasswordInput.classList.add("error");
    valido = false;
  } else {
    confirmPasswordError.textContent = "";
    confirmPasswordError.classList.remove("active");
    confirmPasswordInput.classList.remove("error");
    confirmPasswordInput.classList.add("valid");
  }

  registerBtn.disabled = !valido;
}

// Eventos
usernameInput.addEventListener("input", validarCampos);
emailInput.addEventListener("input", validarCampos);
passwordInput.addEventListener("input", validarCampos);
confirmPasswordInput.addEventListener("input", validarCampos);

async function handleRegister(event) {
  // PREVINE O RECARREGAMENTO DA PÁGINA
  if (event) event.preventDefault();

  validarCampos();

  if (!registerBtn.disabled) {
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      registerBtn.textContent = "Cadastrando...";
      registerBtn.disabled = true;

      // USA O SERVIÇO GLOBAL (definido no authService.js via window)
      await window.authService.register({
        email: email,
        username: username,
        password: password,
      });

      alert("Conta criada com sucesso! Faça login.");
      window.location.href = "/telalogin.html"; // Ou sua rota de login
    } catch (error) {
      console.error("Erro no cadastro:", error);
      emailError.textContent = error.message || "Erro ao criar conta. Verifique os dados.";
      emailError.classList.add("active");
      emailInput.classList.add("error");
      passwordError.textContent = error.message || "Erro ao criar conta. Verifique os dados.";
      passwordError.classList.add("active");
      passwordInput.classList.add("error");
    } finally {
      registerBtn.textContent = "Cadastrar";
      registerBtn.disabled = false;
    }
  }
}
