document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario");
  const campos = formulario.querySelectorAll("input, textarea, select, button");
  const contatoSection = document.getElementById("contato");
  const toggleBtn = document.getElementById("toggle-theme");
  const body = document.body;
  const statusTexto = document.getElementById("statusTexto");
  const statusDiv = document.getElementById("statusBarbearia");

  // Animação nos campos do formulário
  campos.forEach((campo, index) => {
    campo.style.opacity = 0;
    campo.style.transform = "translateY(20px)";
    setTimeout(() => {
      campo.style.transition = "all 0.6s ease";
      campo.style.opacity = 1;
      campo.style.transform = "translateY(0)";
    }, 200 * index);
  });

  // Rolar para a seção de contato
  window.agendarServico = function () {
    contatoSection.scrollIntoView({ behavior: "smooth" });
  };

  // Envio do formulário
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const servico = document.getElementById("servico").value;
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !telefone || !servico || !mensagem) {
      showMensagem("Por favor, preencha todos os campos.", true);
      return;
    }

    showMensagem(`Obrigado, ${nome}! Sua mensagem foi enviada.`, false);
    formulario.reset();
  });

  function showMensagem(texto, erro) {
    const aviso = document.createElement("div");
    aviso.textContent = texto;
    aviso.style.position = "fixed";
    aviso.style.bottom = "20px";
    aviso.style.left = "50%";
    aviso.style.transform = "translateX(-50%)";
    aviso.style.backgroundColor = erro ? "#e91e63" : "#4caf50";
    aviso.style.color = "#fff";
    aviso.style.padding = "1rem 2rem";
    aviso.style.borderRadius = "6px";
    aviso.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
    aviso.style.opacity = 0;
    aviso.style.transition = "opacity 0.5s ease";

    document.body.appendChild(aviso);
    setTimeout(() => aviso.style.opacity = 1, 100);
    setTimeout(() => {
      aviso.style.opacity = 0;
      setTimeout(() => aviso.remove(), 500);
    }, 3000);
  }

  // Aplicar tema salvo
  function aplicarTema() {
    const tema = localStorage.getItem("tema");
    if (tema === "claro") {
      body.classList.add("light-mode");
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      body.classList.remove("light-mode");
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  aplicarTema();

  toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode");
      localStorage.setItem("tema", "escuro");
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      body.classList.add("light-mode");
      localStorage.setItem("tema", "claro");
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

  // Verificar se a barbearia está aberta
  if (statusTexto && statusDiv) {
    const agora = new Date();
    const dia = agora.getDay(); // 0 = domingo, 1 = segunda...
    const hora = agora.getHours();
    const minutos = agora.getMinutes();

    function estaAberto(hInicio, mInicio, hFim, mFim) {
      const agoraMin = hora * 60 + minutos;
      const inicioMin = hInicio * 60 + mInicio;
      const fimMin = hFim * 60 + mFim;
      return agoraMin >= inicioMin && agoraMin < fimMin;
    }

    let aberto = false;
    if (dia >= 2 && dia <= 6) {
      aberto = estaAberto(9, 0, 19, 30); // Terça a sábado
    } else if (dia === 0) {
      aberto = estaAberto(9, 0, 13, 0); // Domingo
    }

    if (aberto) {
      statusTexto.textContent = "Estamos ABERTOS agora! Venha nos visitar.";
      statusDiv.classList.add("status-aberto");
      statusDiv.classList.remove("status-fechado");
    } else {
      statusTexto.textContent = "Estamos FECHADOS no momento.";
      statusDiv.classList.add("status-fechado");
      statusDiv.classList.remove("status-aberto");
    }
  } else {
    console.warn("Elementos de status da barbearia não encontrados.");
  }
});
