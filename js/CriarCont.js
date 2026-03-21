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

// Função que será chamada pelo onsubmit do form
async function handleRegister(event) {
  event.preventDefault(); // Impede a página de recarregar

  // Executa a validação uma última vez antes de enviar
  validarCampos();

  // Se o botão não estiver desabilitado (ou seja, campos estão válidos)
  if (!registerBtn.disabled) {
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      registerBtn.textContent = "Cadastrando...";
      registerBtn.disabled = true;

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          name: username,
          password: password,
        }),
      });

      const data = await response.json();

      // Verifica se a requisição foi um sucesso (Status 200-299)
      if (response.ok) {
        // Redireciona o usuário para a tela de login sem o alert
        window.location.href = "/";
      } else {
        console.error("Erro no cadastro:", data);
        emailError.textContent =
          data.message || "Erro ao criar conta. Verifique os dados.";
        emailError.classList.add("active");
        emailInput.classList.add("error");

        passwordError.textContent =
          data.message || "Erro ao criar conta. Verifique os dados.";
        passwordError.classList.add("active");
        passwordInput.classList.add("error");
      }
    } catch (error) {
      console.error("Erro de conexão com o servidor:", error);
      emailError.textContent =
        "Erro de conexão com o servidor. Tente mais tarde.";
      emailError.classList.add("active");
    } finally {
      registerBtn.textContent = "Entrar";
    }
  }
}
