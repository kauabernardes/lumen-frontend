const loginField = document.getElementById("loginField");
const passwordInput = document.getElementById("password");
const loginBtn = document.querySelector(".btn-login");
const loginError = document.getElementById("loginError");
const passwordError = document.getElementById("passwordError");
const togglePassword = document.getElementById("togglePassword");

// Regex para validar e-mail
function validarEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
}

function validarCampos() {
  let valido = true;

  // Validação de login (e-mail OU usuário)
  if (!loginField.value) {
    loginError.textContent = "O campo é obrigatório";
    loginError.classList.add("active");
    loginField.classList.add("error");
    valido = false;
  } else if (!validarEmail(loginField.value) && loginField.value.length < 4) {
    loginError.textContent =
      "Digite um e-mail válido ou um usuário com pelo menos 4 caracteres";
    loginError.classList.add("active");
    loginField.classList.add("error");
    valido = false;
  } else {
    loginError.textContent = "";
    loginError.classList.remove("active");
    loginField.classList.remove("error");
    loginField.classList.add("valid");
  }

  // Validação de senha
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

  loginBtn.disabled = !valido;
}

loginField.addEventListener("input", validarCampos);
passwordInput.addEventListener("input", validarCampos);

async function handleLogin(event) {
  // PREVINE O RECARREGAMENTO DA PÁGINA
  if (event) event.preventDefault();

  validarCampos();

  if (!loginBtn.disabled) {
    const identifier = loginField.value;
    const password = passwordInput.value;

    const textoOriginal = loginBtn.textContent;
    try {
      loginBtn.textContent = "Entrando...";
      loginBtn.disabled = true;
      passwordInput.disabled = true;
      loginField.disabled = true;

      // USA O SERVIÇO GLOBAL (definido no authService.js via window)
      await window.authService.login(identifier, password);

      window.location.href = "home.html";
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      loginError.textContent =
        error.message || "E-mail, usuário ou senha incorretos.";
      loginError.classList.add("active");
      loginField.classList.add("error");
      passwordError.textContent =
        error.message || "E-mail, usuário ou senha incorretos.";
      passwordError.classList.add("active");
      passwordInput.classList.add("error");
    } finally {
      loginBtn.textContent = textoOriginal;
      loginBtn.disabled = false;
      passwordInput.disabled = false;
      loginField.disabled = false;
    }
  }
}

// Ícone inicial do olho (senha oculta)
togglePassword.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" class="icon-eye" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
`;

// Alternar visualização da senha com olhinho SVG
togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  if (type === "password") {
    this.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon-eye" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;
  } else {
    this.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon-eye" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.91 21.91 0 0 1 5.06-6.06M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12M1 1l22 22"/>
      </svg>
    `;
  }
});
