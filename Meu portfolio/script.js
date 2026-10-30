

document.addEventListener("DOMContentLoaded", () => {
   
    const saudacao = document.getElementById("saudacao");
    const hora = new Date().getHours();
    let texto = "Boa noite!";
    if (hora >= 5 && hora < 12) {
        texto = "Bom dia!";
    } else if (hora >= 12 && hora < 18) {
        texto = "Boa tarde!";
    }
    saudacao.textContent = texto;
 
  
    document.getElementById("ano").textContent = new Date().getFullYear();
 
   
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");
 
    function fecharMenu() {
        menu.classList.remove("aberto");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Abrir menu");
        menuBtn.textContent = "☰";
    }
 
    menuBtn.addEventListener("click", () => {
        const aberto = menu.classList.toggle("aberto");
        menuBtn.setAttribute("aria-expanded", String(aberto));
        menuBtn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
        menuBtn.textContent = aberto ? "✕" : "☰";
    });
 
    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", fecharMenu);
    });
 
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("aberto")) {
            fecharMenu();
            menuBtn.focus();
        }
    });
 
    
    const temaBtn = document.getElementById("tema-btn");
    const raiz = document.documentElement;
 
    function aplicarTema(tema) {
        if (tema === "dark") {
            raiz.setAttribute("data-theme", "dark");
        } else {
            raiz.removeAttribute("data-theme");
        }
        temaBtn.textContent = tema === "dark" ? "☀️" : "🌙";
        temaBtn.setAttribute("aria-pressed", String(tema === "dark"));
    }
 
    let temaSalvo = null;
    try {
        temaSalvo = localStorage.getItem("tema");
    } catch (e) {
      
    }
    const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    aplicarTema(temaSalvo || (prefereEscuro ? "dark" : "light"));
 
    temaBtn.addEventListener("click", () => {
        const novo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
        aplicarTema(novo);
        try {
            localStorage.setItem("tema", novo);
        } catch (e) {
            /* ignora */
        }
    });
 
    
    const form = document.getElementById("form-contato");
    const status = document.getElementById("status-form");
 
    const campos = [
        {
            el: document.getElementById("nome"),
            erro: document.getElementById("erro-nome"),
            validar: (v) => (v.trim().length < 3 ? "Informe seu nome (mínimo de 3 caracteres)." : ""),
        },
        {
            el: document.getElementById("email"),
            erro: document.getElementById("erro-email"),
            validar: (v) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Informe um e-mail válido, como nome@exemplo.com.",
        },
        {
            el: document.getElementById("mensagem"),
            erro: document.getElementById("erro-mensagem"),
            validar: (v) => (v.trim().length < 10 ? "Escreva uma mensagem com pelo menos 10 caracteres." : ""),
        },
        {
            el: document.getElementById("consentimento"),
            erro: document.getElementById("erro-consentimento"),
            validar: (_, el) => (el.checked ? "" : "É necessário concordar para enviar a mensagem."),
        },
    ];
 
    function validarCampo(campo) {
        const msg = campo.validar(campo.el.value, campo.el);
        campo.erro.textContent = msg;
        campo.el.setAttribute("aria-invalid", msg ? "true" : "false");
        return msg === "";
    }
 
    campos.forEach((campo) => {
        const evento = campo.el.type === "checkbox" ? "change" : "blur";
        campo.el.addEventListener(evento, () => validarCampo(campo));
        campo.el.addEventListener("input", () => {
            if (campo.el.getAttribute("aria-invalid") === "true") validarCampo(campo);
        });
    });
 
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        status.textContent = "";
 
        const resultados = campos.map(validarCampo);
        const primeiroInvalido = campos.find((_, i) => !resultados[i]);
 
        if (primeiroInvalido) {
            primeiroInvalido.el.focus();
            return;
        }
 
        
        status.textContent = "Mensagem validada com sucesso! Obrigado pelo contato.";
        form.reset();
        campos.forEach((c) => c.el.removeAttribute("aria-invalid"));
    });
});