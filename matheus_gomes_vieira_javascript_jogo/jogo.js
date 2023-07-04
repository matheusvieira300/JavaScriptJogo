
const cores = ["vermelho", "azul", "verde", "amarelo", "laranja", "roxo", "rosa", "preto", "branco"];


let nivel = 1;
let tempo = 3;
let pontuacao = 0;
let palavraAlvo = "";
let corAlvo = "";

// Referências do html
const nivelElemento = document.getElementById("nivel");
const tempoElemento = document.getElementById("tempo");
const pontuacaoElemento = document.getElementById("pontuacao");
const palavraAlvoElemento = document.getElementById("palavra-alvo");
const containerBotoes = document.getElementById("container-botoes");
const botaoIniciar = document.getElementById("botao-iniciar");


botaoIniciar.addEventListener("click", iniciarJogo);


function iniciarJogo() {
  nivel = 1;
  tempo = 3;
  pontuacao = 0;
  atualizarNivel();
  atualizarPontuacao();
  botaoIniciar.disabled = true;
  botaoIniciar.textContent = "Aguarde...";
  proximaRodada();
  setTimeout(iniciarTempo, 1000);
}


function atualizarNivel() {
  nivelElemento.textContent = nivel;
}


function atualizarPontuacao() {
  pontuacaoElemento.textContent = pontuacao;
}


function iniciarTempo() {
  if (tempo > 0) {
    tempo--;
    tempoElemento.textContent = tempo;
    setTimeout(iniciarTempo, 1000);
  } else {
    finalizarJogo();
  }
}

function finalizarJogo() {
  botaoIniciar.disabled = false;
  botaoIniciar.textContent = "Reiniciar";
  containerBotoes.querySelectorAll(".botao-cor").forEach(botao => {
    botao.disabled = true;
    botao.removeEventListener("click", verificarResposta);
  });
  nivel = 1;
  tempo = 3;
  pontuacao = 0;
  atualizarNivel();
  atualizarPontuacao();
}

// embaralha
function embaralharBotoes() {
  const botoes = Array.from(containerBotoes.querySelectorAll(".botao-cor"));
  for (let i = botoes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [botoes[i].className, botoes[j].className] = [botoes[j].className, botoes[i].className];
  }

  // pra mesclar a cor e o alvo pra quando clicar dar o ponto
  corAlvo = cores[Math.floor(Math.random() * cores.length)];


  palavraAlvoElemento.textContent = corAlvo;
  botoes.forEach(botao => {
    const corBotao = botao.className.split(' ')[1];
    if (corBotao === corAlvo) {
      botao.setAttribute("data-cor-alvo", "true");
    } else {
      botao.setAttribute("data-cor-alvo", "false");
    }
  });
}

// novo alvo
function gerarAlvo() {
  const indiceAleatorio = Math.floor(Math.random() * cores.length);
  corAlvo = cores[indiceAleatorio];
  palavraAlvo = cores[Math.floor(Math.random() * cores.length)];
  palavraAlvoElemento.textContent = palavraAlvo;
}

// verifica se tá certo
function verificarResposta(evento) {
  const botaoClicado = evento.target;
  const corAlvoBotao = botaoClicado.getAttribute("data-cor-alvo");
  
  if (corAlvoBotao === "true") {
    pontuacao++;
    atualizarPontuacao();
    if (pontuacao % 10 === 0) {
      nivel++;
      atualizarNivel();
    }
  } else {
    finalizarJogo();
    return; 
  }

  proximaRodada();
}

function proximaRodada() {
  tempo = obterTempoPorNivel(nivel);
  tempoElemento.textContent = tempo;
  gerarAlvo();
  embaralharBotoes();
  [...containerBotoes.querySelectorAll(".botao-cor")].forEach(botao => {
    botao.disabled = false;
    botao.removeEventListener("click", verificarResposta);
    botao.addEventListener("click", verificarResposta);
  });
}

function obterTempoPorNivel(nivel) {
  switch (nivel) {
    case 1:
      return 3;
    case 2:
      return 2.5;
    case 3:
      return 2;
    case 4:
      return 1.5;
    default:
      return 1;
  }
}

[...containerBotoes.querySelectorAll(".botao-cor")].forEach(botao => {
  botao.addEventListener("click", verificarResposta);
});
