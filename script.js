/* =====================================================================
   PAINEL DE RESULTADOS – New Digital Midia
   Este arquivo tem 6 partes:
     1. Canais e dados de demonstração
     2. Conexões (quais redes estão ligadas ao painel)
     3. Funções de apoio (somar, filtrar, formatar, calcular variação)
     4. Funções que desenham cada parte da tela
     5. Ações dos botões
     6. Segurança (PIN, bloqueio automático, ocultar números e limpeza de dados)

   Para ADICIONAR um canal novo (ex.: LinkedIn), basta incluir uma linha
   na lista CANAIS abaixo. O resto do painel se ajusta sozinho.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. CANAIS E DADOS DE DEMONSTRAÇÃO
   --------------------------------------------------------------------- */

// Cada canal tem:
//   cor / sigla     = identidade visual no painel
//   dados / requisito / api = textos da tela de Conexões
//   alcance         = quantas pessoas viram por dia (demonstração)
//   taxaClique      = parte delas que clicou para ir ao site
//   taxaContato     = parte das visitas que pediu contato
//   parteNegativa   = parte dos comentários que costuma ser negativa
//   tipos           = o que o canal publica ("Story" é tratado como story)
const CANAIS = [
  { id: "instagram", nome: "Instagram", sigla: "Ig", cor: "#E1306C",
    dados: "alcance, curtidas, comentários, publicações e stories",
    requisito: "Conta profissional do Instagram ligada a uma Página do Facebook.",
    api: "API do Instagram (Meta)",
    alcance: 1100, taxaClique: 0.040, taxaContato: 0.05, parteNegativa: 0.08, tipos: ["Publicação", "Story"] },
  { id: "facebook", nome: "Facebook", sigla: "Fb", cor: "#1877F2",
    dados: "alcance, curtidas, comentários, publicações e stories",
    requisito: "Ser administrador da Página do Facebook da empresa.",
    api: "API do Facebook (Meta)",
    alcance: 800, taxaClique: 0.025, taxaContato: 0.04, parteNegativa: 0.12, tipos: ["Publicação", "Story"] },
  { id: "x", nome: "X (Twitter)", sigla: "X", cor: "#6B7280",
    dados: "visualizações, curtidas, respostas e posts",
    requisito: "Conta do X com acesso à API (pode ter custo).",
    api: "API do X",
    alcance: 500, taxaClique: 0.020, taxaContato: 0.03, parteNegativa: 0.22, tipos: ["Post"] },
  { id: "tiktok", nome: "TikTok", sigla: "Tk", cor: "#00B8C4",
    dados: "visualizações, curtidas, comentários, vídeos e stories",
    requisito: "Conta comercial ou de criador no TikTok.",
    api: "API do TikTok",
    alcance: 1500, taxaClique: 0.015, taxaContato: 0.04, parteNegativa: 0.10, tipos: ["Vídeo", "Story"] },
  { id: "kwai", nome: "Kwai", sigla: "Kw", cor: "#FF6A00",
    dados: "visualizações, curtidas e comentários dos vídeos",
    requisito: "Pode ser necessário importar uma planilha (CSV) com os números.",
    api: "Importação de planilha",
    alcance: 900, taxaClique: 0.018, taxaContato: 0.03, parteNegativa: 0.11, tipos: ["Vídeo"] },
  { id: "youtube", nome: "YouTube", sigla: "Yt", cor: "#E62117",
    dados: "visualizações, curtidas, comentários e vídeos",
    requisito: "Ser dono ou gerente do canal do YouTube.",
    api: "API do YouTube",
    alcance: 600, taxaClique: 0.030, taxaContato: 0.06, parteNegativa: 0.06, tipos: ["Vídeo"] },
  { id: "email", nome: "E-mail marketing", sigla: "@", cor: "#14A36B",
    dados: "envios, aberturas e cliques",
    requisito: "Conta na ferramenta de e-mail marketing que a empresa usa.",
    api: "API da ferramenta de e-mail",
    alcance: 300, taxaClique: 0.080, taxaContato: 0.08, parteNegativa: 0, tipos: [] },
];

const ASSUNTOS_DE_PUBLICACAO = [
  "Bastidores da edição de vídeo", "5 dicas de marketing direto", "Do roteiro ao vídeo final",
  "Projeto de site entregue", "Cliente conta o resultado", "Como funciona nosso atendimento",
];
const ASSUNTOS_DE_STORY = [
  "Enquete do dia", "Bastidores de hoje", "Caixinha de perguntas", "Novidade da semana",
];

const TOTAL_DE_DIAS = 60;

// Gerador de números "aleatórios" fixos: assim a demonstração sempre fica igual.
let semente = 7;
function numeroAleatorio() {
  semente = (semente * 16807) % 2147483647;
  return semente / 2147483647;          // devolve um número entre 0 e 1
}

// Pequena variação de -20% a +20% para os números não ficarem iguais todo dia
function variar(valor) {
  return valor * (0.8 + numeroAleatorio() * 0.4);
}

// Cria uma lista de dias. Cada dia guarda os números de cada canal:
//   dia.instagram.alcance, dia.instagram.cliques, dia.facebook.visitas ...
function criarDadosDeDemonstracao() {
  const dias = [];

  for (let i = 0; i < TOTAL_DE_DIAS; i++) {
    const data = new Date();
    data.setDate(data.getDate() - (TOTAL_DE_DIAS - 1 - i));

    const dia = { data };
    for (const canal of CANAIS) {
      // Cada número depende do anterior: vê, clica, visita e pede contato
      const alcance  = variar(canal.alcance);
      const cliques  = variar(alcance * canal.taxaClique);
      const visitas  = cliques * 0.85;                      // nem todo clique vira visita
      const contatos = variar(visitas * canal.taxaContato);
      dia[canal.id] = { alcance, cliques, visitas, contatos };
    }
    dias.push(dia);
  }
  return dias;
}

// Cria as publicações e stories de demonstração (nem todo dia tem uma)
function criarPublicacoesDeDemonstracao() {
  const lista = [];

  for (let i = 0; i < TOTAL_DE_DIAS; i++) {
    for (const canal of CANAIS) {
      for (const tipo of canal.tipos) {
        if (numeroAleatorio() > 0.5) continue;               // este dia não teve publicação

        const ehStory = tipo === "Story";
        const assuntos = ehStory ? ASSUNTOS_DE_STORY : ASSUNTOS_DE_PUBLICACAO;
        const titulo = assuntos[Math.floor(numeroAleatorio() * assuntos.length)];

        const visualizacoes = Math.round(variar(canal.alcance * (ehStory ? 0.3 : 0.6)));
        const curtidas      = Math.round(variar(visualizacoes * 0.07));
        const comentarios   = Math.round(variar(visualizacoes * 0.01));
        const negativos     = Math.round(comentarios * Math.min(0.5, variar(canal.parteNegativa) * (0.5 + numeroAleatorio())));
        const positivos     = comentarios - negativos;

        lista.push({
          indiceDoDia: i, data: todosOsDias[i].data,
          canalId: canal.id, canalNome: canal.nome, canalCor: canal.cor, tipo, ehStory, titulo,
          visualizacoes, curtidas, positivos, negativos,
        });
      }
    }
  }
  return lista;
}

const todosOsDias = criarDadosDeDemonstracao();
const todasAsPublicacoes = criarPublicacoesDeDemonstracao();


/* ---------------------------------------------------------------------
   2. CONEXÕES
   Guarda quais canais estão ligados ao painel. A escolha fica salva no
   navegador (localStorage), então continua ao recarregar a página.
   --------------------------------------------------------------------- */

const CHAVE_DE_ARMAZENAMENTO = "canaisConectados";
const CONECTADOS_NO_INICIO = ["instagram", "facebook", "tiktok"];

function carregarConectados() {
  try {
    const salvo = localStorage.getItem(CHAVE_DE_ARMAZENAMENTO);
    if (salvo) {
      const lista = JSON.parse(salvo);
      // Segurança: só aceitamos ids de canais que existem (ignora qualquer outro conteúdo)
      if (Array.isArray(lista)) return new Set(lista.filter(id => CANAIS.some(canal => canal.id === id)));
    }
  } catch (erro) { /* se o navegador bloquear o armazenamento, usamos o padrão */ }
  return new Set(CONECTADOS_NO_INICIO);
}

function salvarConectados() {
  try {
    localStorage.setItem(CHAVE_DE_ARMAZENAMENTO, JSON.stringify([...conectados]));
  } catch (erro) { /* sem problema: só não vai lembrar depois de recarregar */ }
}

const conectados = carregarConectados();   // conjunto com os ids dos canais ligados

function canaisConectados() {
  return CANAIS.filter(canal => conectados.has(canal.id));
}


/* ---------------------------------------------------------------------
   3. FUNÇÕES DE APOIO
   --------------------------------------------------------------------- */

// Estado atual da tela (o que o usuário escolheu)
let periodoEscolhido = 30;               // 7 ou 30 dias
let canalEscolhido = "todos";            // "todos" ou o id de um canal
let metricaDoGrafico = "visitas";        // "visitas" ou "alcance"
let tipoEscolhido = "tudo";              // "tudo", "publicacoes" ou "stories"
let ordemEscolhida = "visualizacoes";    // "visualizacoes", "curtidas" ou "negativos"

// Últimos N dias
function diasDoPeriodo() {
  return todosOsDias.slice(-periodoEscolhido);
}

// N dias imediatamente antes (usado para comparar)
function diasDoPeriodoAnterior() {
  return todosOsDias.slice(-2 * periodoEscolhido, -periodoEscolhido);
}

// Canais que entram na conta: só os conectados, e só o escolhido se houver filtro
function canaisSelecionados() {
  if (canalEscolhido === "todos") return canaisConectados();
  return canaisConectados().filter(canal => canal.id === canalEscolhido);
}

function nomeDoCanalEscolhido() {
  return canalEscolhido === "todos" ? "Todos os canais" : canaisSelecionados()[0].nome;
}

function corDoCanalEscolhido() {
  return canalEscolhido === "todos" ? "var(--destaque)" : canaisSelecionados()[0].cor;
}

// Soma um campo (ex.: "visitas") em uma lista de dias, para uma lista de canais
function somar(dias, campo, canais = canaisSelecionados()) {
  let total = 0;
  for (const dia of dias) {
    for (const canal of canais) {
      total += dia[canal.id][campo];
    }
  }
  return total;
}

// Publicações e stories do período, respeitando canal e tipo escolhidos.
// anterior = true devolve o período imediatamente antes (para comparar)
function publicacoesDoPeriodo(anterior = false) {
  const fim = anterior ? TOTAL_DE_DIAS - periodoEscolhido : TOTAL_DE_DIAS;
  const inicio = fim - periodoEscolhido;
  const idsDosCanais = canaisSelecionados().map(canal => canal.id);

  return todasAsPublicacoes.filter(pub =>
    pub.indiceDoDia >= inicio && pub.indiceDoDia < fim &&
    idsDosCanais.includes(pub.canalId) &&
    (tipoEscolhido === "tudo" || (tipoEscolhido === "stories") === pub.ehStory)
  );
}

// Soma um campo (ex.: "curtidas") em uma lista de publicações
function somarPublicacoes(lista, campo) {
  return lista.reduce((total, pub) => total + pub[campo], 0);
}

// 12345.6 -> "12.346"
function formatar(numero) {
  return Math.round(numero).toLocaleString("pt-BR");
}

// Porcentagem de mudança entre o período atual e o anterior
function calcularVariacao(atual, anterior) {
  return ((atual - anterior) / anterior) * 100;
}

// Monta o texto "▲ 5,0% que no período anterior".
// quandoSubirEhBom = false para números em que subir é ruim (comentários negativos)
function textoDeVariacao(atual, anterior, quandoSubirEhBom = true) {
  const variacao = calcularVariacao(atual, anterior);
  const subiu = variacao >= 0;
  const bom = subiu === quandoSubirEhBom;
  const numero = Math.abs(variacao).toFixed(1).replace(".", ",");
  return `<div class="variacao ${bom ? "sobe" : "desce"}">${subiu ? "▲ " : "▼ "}${numero}% que no período anterior</div>`;
}

function cartaoDeIndicador(nome, valor, variacaoEmHtml) {
  return `
    <div class="indicador">
      <div class="nome">${nome}</div>
      <div class="numero">${formatar(valor)}</div>
      ${variacaoEmHtml}
    </div>`;
}

// Segurança: troca caracteres especiais por texto comum antes de colocar na página.
// Assim, um título ou comentário vindo de uma rede nunca vira código malicioso.
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Bolinha colorida com a cor do canal
function bolinha(cor) {
  return `<i class="ponto" style="background:${cor}"></i>`;
}


/* ---------------------------------------------------------------------
   4. DESENHO DA TELA
   --------------------------------------------------------------------- */

// 4.1 Aviso de quantos canais estão conectados e mensagem de "nenhum canal"
function desenharAviso() {
  const quantidade = canaisConectados().length;
  const semCanais = quantidade === 0;

  document.getElementById("sem-conexao").hidden = !semCanais;
  document.getElementById("conteudo-painel").hidden = semCanais;
  document.getElementById("aviso-conexoes").hidden = semCanais;
  document.getElementById("aba-conexoes").textContent = `Conexões (${quantidade}/${CANAIS.length})`;

  document.getElementById("aviso-conexoes").innerHTML =
    `Dados de demonstração. Você está vendo <strong>${quantidade} de ${CANAIS.length}</strong> canais. ` +
    `<a href="#" data-ir-para="conexoes">Conectar mais canais</a>`;
}

// 4.2 Botões de canal (só os conectados)
function desenharBotoesDeCanais() {
  // Se o canal escolhido foi desconectado, volta para "Todos"
  if (canalEscolhido !== "todos" && !conectados.has(canalEscolhido)) canalEscolhido = "todos";

  let html = `<button data-canal="todos" class="${canalEscolhido === "todos" ? "ativo" : ""}">Todos</button>`;
  for (const canal of canaisConectados()) {
    html += `<button data-canal="${canal.id}" class="${canalEscolhido === canal.id ? "ativo" : ""}">${bolinha(canal.cor)}${escaparHtml(canal.nome)}</button>`;
  }
  document.getElementById("botoes-canal").innerHTML = html;
}

// 4.3 Os quatro números principais do site
function desenharIndicadores() {
  const atual = diasDoPeriodo();
  const anterior = diasDoPeriodoAnterior();

  const indicadores = [
    { nome: "Visitas no site",             campo: "visitas" },
    { nome: "Pessoas alcançadas",          campo: "alcance" },
    { nome: "Cliques para o site",         campo: "cliques" },
    { nome: "Pessoas que pediram contato", campo: "contatos" },
  ];

  let html = "";
  for (const item of indicadores) {
    const total = somar(atual, item.campo);
    html += cartaoDeIndicador(item.nome, total, textoDeVariacao(total, somar(anterior, item.campo)));
  }
  document.getElementById("indicadores").innerHTML = html;
}

// 4.4 Gráfico de linha (desenhado com SVG)
function desenharGrafico() {
  const dias = diasDoPeriodo();
  const largura = 700, altura = 240;
  const margemEsquerda = 50, margemBaixo = 25, margemTopo = 10;
  const cor = corDoCanalEscolhido();

  document.getElementById("titulo-grafico").textContent = `Dia a dia · ${nomeDoCanalEscolhido()}`;

  // Valor de cada dia (somando os canais escolhidos)
  const valores = dias.map(dia => somar([dia], metricaDoGrafico));
  const maximo = Math.max(...valores) * 1.1;   // folguinha para não encostar no topo

  // Converte "posição do dia" e "valor" em coordenadas na tela
  const posicaoX = i => margemEsquerda + (i / (dias.length - 1)) * (largura - margemEsquerda - 10);
  const posicaoY = v => margemTopo + (1 - v / maximo) * (altura - margemTopo - margemBaixo);

  // Linhas horizontais de referência com o valor
  let desenho = "";
  for (let i = 0; i <= 4; i++) {
    const valor = (maximo / 4) * i;
    const y = posicaoY(valor);
    desenho += `<line x1="${margemEsquerda}" x2="${largura - 10}" y1="${y}" y2="${y}" stroke="var(--linha)" />`;
    desenho += `<text x="${margemEsquerda - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="var(--texto-apoio)">${formatar(valor)}</text>`;
  }

  // A linha do gráfico: "M" move para o primeiro ponto, "L" liga os próximos
  const caminho = valores
    .map((valor, i) => `${i === 0 ? "M" : "L"}${posicaoX(i)} ${posicaoY(valor)}`)
    .join(" ");

  // Área suave embaixo da linha (fecha o caminho descendo até o chão do gráfico)
  const chao = posicaoY(0);
  desenho += `<path d="${caminho} L${posicaoX(valores.length - 1)} ${chao} L${posicaoX(0)} ${chao} Z" fill="${cor}" opacity="0.13" />`;
  desenho += `<path d="${caminho}" fill="none" stroke="${cor}" stroke-width="3" stroke-linejoin="round" />`;

  // Datas do primeiro e do último dia
  const formatarData = data => data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  desenho += `<text x="${margemEsquerda}" y="${altura - 6}" font-size="12" fill="var(--texto-apoio)">${formatarData(dias[0].data)}</text>`;
  desenho += `<text x="${largura - 10}" y="${altura - 6}" text-anchor="end" font-size="12" fill="var(--texto-apoio)">${formatarData(dias[dias.length - 1].data)}</text>`;

  // Área invisível por cima: serve para detectar o mouse/toque
  desenho += `<rect id="area-toque" x="${margemEsquerda}" y="0" width="${largura - margemEsquerda - 10}" height="${altura}" fill="transparent" />`;

  const grafico = document.getElementById("grafico");
  grafico.innerHTML = desenho;

  // Ao passar o mouse, mostra o valor do dia mais próximo
  function mostrarDia(evento) {
    const caixa = grafico.getBoundingClientRect();
    const xDoMouse = ((evento.touches ? evento.touches[0].clientX : evento.clientX) - caixa.left) / caixa.width * largura;
    const indice = Math.round(((xDoMouse - margemEsquerda) / (largura - margemEsquerda - 10)) * (dias.length - 1));
    const posicao = Math.max(0, Math.min(dias.length - 1, indice));

    const nomeDoDia = dias[posicao].data.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
    document.getElementById("detalhe-dia").textContent = `${nomeDoDia}: ${formatar(valores[posicao])}`;
  }
  const areaToque = document.getElementById("area-toque");
  areaToque.addEventListener("mousemove", mostrarDia);
  areaToque.addEventListener("touchmove", mostrarDia, { passive: true });
}

// 4.5 Funil: cada etapa mostra quantas pessoas chegaram até ali
function desenharFunil() {
  const dias = diasDoPeriodo();
  const alcance = somar(dias, "alcance");

  const etapas = [
    { nome: "Foram alcançadas", valor: alcance },
    { nome: "Clicaram no link", valor: somar(dias, "cliques") },
    { nome: "Visitaram o site", valor: somar(dias, "visitas") },
    { nome: "Pediram contato",  valor: somar(dias, "contatos") },
  ];

  let html = "";
  for (const etapa of etapas) {
    const largura = Math.max(2, (etapa.valor / alcance) * 100); // mínimo de 2% para a barra aparecer
    html += `
      <div class="etapa">
        <div class="etapa-titulo"><span>${etapa.nome}</span><strong>${formatar(etapa.valor)}</strong></div>
        <div class="barra-fundo"><div class="barra" style="width:${largura}%"></div></div>
      </div>`;
  }
  document.getElementById("funil").innerHTML = html;
}

// 4.6 Reação do público: visualizações, curtidas e comentários bons/negativos
function desenharReacao() {
  const atual = publicacoesDoPeriodo();
  const anterior = publicacoesDoPeriodo(true);

  const indicadores = [
    { nome: "Visualizações",         campo: "visualizacoes", subirEhBom: true },
    { nome: "Curtidas",              campo: "curtidas",      subirEhBom: true },
    { nome: "Comentários bons",      campo: "positivos",     subirEhBom: true },
    { nome: "Comentários negativos", campo: "negativos",     subirEhBom: false },
  ];

  let html = "";
  for (const item of indicadores) {
    const total = somarPublicacoes(atual, item.campo);
    const antes = somarPublicacoes(anterior, item.campo);
    html += cartaoDeIndicador(item.nome, total, textoDeVariacao(total, antes, item.subirEhBom));
  }
  document.getElementById("indicadores-reacao").innerHTML = html;

  // Barra: quanto dos comentários é bom e quanto é negativo
  const bons = somarPublicacoes(atual, "positivos");
  const ruins = somarPublicacoes(atual, "negativos");
  const total = bons + ruins;
  const percentualBons = total ? Math.round((bons / total) * 100) : 0;

  document.getElementById("sentimento").innerHTML = total === 0
    ? `<p class="texto-apoio">Sem comentários neste período para este canal.</p>`
    : `<div class="barra-sentimento">
         <div class="bons" style="width:${percentualBons}%"></div>
         <div class="ruins" style="width:${100 - percentualBons}%"></div>
       </div>
       <div class="legenda-sentimento">
         <span>${percentualBons}% dos comentários são bons</span>
         <span>${100 - percentualBons}% são negativos</span>
       </div>`;
}

// 4.7 Lista de publicações e stories, uma por uma
function desenharTabelaDePublicacoes() {
  const lista = publicacoesDoPeriodo()
    .sort((a, b) => b[ordemEscolhida] - a[ordemEscolhida])   // maior primeiro
    .slice(0, 8);

  if (lista.length === 0) {
    document.getElementById("tabela-publicacoes").innerHTML = `<tr><td>Nenhuma publicação neste período para este canal.</td></tr>`;
    return;
  }

  let html = `<tr><th>Publicação</th><th>Visualizações</th><th>Curtidas</th><th>Bons</th><th>Negativos</th></tr>`;
  for (const pub of lista) {
    const totalDeComentarios = pub.positivos + pub.negativos;
    const parteNegativa = totalDeComentarios ? pub.negativos / totalDeComentarios : 0;
    const precisaDeAtencao = parteNegativa > 0.2;
    const data = pub.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

    html += `
      <tr class="${precisaDeAtencao ? "alerta" : ""}">
        <td class="titulo-publicacao">${precisaDeAtencao ? "⚠ " : ""}${escaparHtml(pub.titulo)}
          <small>${bolinha(pub.canalCor)}${escaparHtml(pub.canalNome)} · ${escaparHtml(pub.tipo)} · ${data}</small></td>
        <td>${formatar(pub.visualizacoes)}</td>
        <td>${formatar(pub.curtidas)}</td>
        <td>${formatar(pub.positivos)}</td>
        <td>${formatar(pub.negativos)}</td>
      </tr>`;
  }
  document.getElementById("tabela-publicacoes").innerHTML = html;
}

// 4.8 Tabela que compara os canais conectados (independente do botão de canal)
function desenharComparacao() {
  const dias = diasDoPeriodo();

  // Calcula os totais de cada canal
  const linhas = canaisConectados().map(canal => ({
    nome: canal.nome,
    cor: canal.cor,
    alcance:  somar(dias, "alcance",  [canal]),
    visitas:  somar(dias, "visitas",  [canal]),
    contatos: somar(dias, "contatos", [canal]),
  }));

  // Descobre qual canal gerou mais contatos
  const melhorContatos = Math.max(...linhas.map(linha => linha.contatos));

  let html = `<tr><th>Canal</th><th>Alcance</th><th>Visitas</th><th>Contatos</th></tr>`;
  for (const linha of linhas) {
    const ehMelhor = linha.contatos === melhorContatos;
    html += `
      <tr class="${ehMelhor ? "melhor" : ""}">
        <td>${ehMelhor ? "★ " : ""}${bolinha(linha.cor)}${escaparHtml(linha.nome)}</td>
        <td>${formatar(linha.alcance)}</td>
        <td>${formatar(linha.visitas)}</td>
        <td>${formatar(linha.contatos)}</td>
      </tr>`;
  }
  document.getElementById("comparacao").innerHTML = html;
}

// 4.9 Resumo em frases simples
function desenharResumo() {
  const dias = diasDoPeriodo();
  const conectadosAgora = canaisConectados();

  // Frase 1: canal que mais gerou contatos
  let melhorCanal = conectadosAgora[0];
  for (const canal of conectadosAgora) {
    if (somar(dias, "contatos", [canal]) > somar(dias, "contatos", [melhorCanal])) melhorCanal = canal;
  }

  // Frase 2: quanto o canal escolhido representa das visitas
  const visitasEscolhidas = somar(dias, "visitas");
  const visitasTotais = somar(dias, "visitas", conectadosAgora);
  const parte = Math.round((visitasEscolhidas / visitasTotais) * 100);
  const frase2 = canalEscolhido === "todos"
    ? `Somando os canais conectados, o site recebeu <strong>${formatar(visitasTotais)}</strong> visitas.`
    : `${escaparHtml(nomeDoCanalEscolhido())} trouxe <strong>${parte}%</strong> das visitas ao site.`;

  // Frase 3: dia da semana com mais visitas (em média)
  const nomesDosDias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  const visitasPorDia = [0, 0, 0, 0, 0, 0, 0];
  const quantidadePorDia = [0, 0, 0, 0, 0, 0, 0];
  for (const dia of dias) {
    const diaDaSemana = dia.data.getDay();
    visitasPorDia[diaDaSemana] += somar([dia], "visitas");
    quantidadePorDia[diaDaSemana] += 1;
  }
  let melhorDia = 0;
  for (let i = 1; i < 7; i++) {
    if (visitasPorDia[i] / (quantidadePorDia[i] || 1) > visitasPorDia[melhorDia] / (quantidadePorDia[melhorDia] || 1)) {
      melhorDia = i;
    }
  }

  // Frase 4: publicação com mais comentários negativos (pede atenção)
  const publicacoes = publicacoesDoPeriodo();
  let frase4 = "";
  if (publicacoes.length > 0) {
    const pior = publicacoes.reduce((a, b) => (b.negativos > a.negativos ? b : a));
    frase4 = `<li>Atenção: “${escaparHtml(pior.titulo)}” (${escaparHtml(pior.canalNome)}, ${escaparHtml(pior.tipo)}) teve <strong>${pior.negativos}</strong> comentários negativos. Vale ler e responder.</li>`;
  }

  document.getElementById("resumo").innerHTML = `
    <li>O canal que mais gerou contatos foi <strong>${escaparHtml(melhorCanal.nome)}</strong>.</li>
    <li>${frase2}</li>
    <li>O dia com mais visitas costuma ser <strong>${nomesDosDias[melhorDia]}</strong>.</li>
    ${frase4}`;
}

// 4.10 Tela de Conexões: um cartão para cada canal
function desenharConexoes() {
  let html = "";
  for (const canal of CANAIS) {
    const ligado = conectados.has(canal.id);
    html += `
      <article class="conexao">
        <div class="conexao-topo">
          <div class="selo" style="background:${canal.cor}">${escaparHtml(canal.sigla)}</div>
          <div>
            <h3>${escaparHtml(canal.nome)}</h3>
            <span class="estado ${ligado ? "ligado" : "desligado"}">${ligado ? "✓ Conectado" : "Não conectado"}</span>
          </div>
        </div>
        <p>Mostra no painel: ${escaparHtml(canal.dados)}.</p>
        <button data-acao="${ligado ? "desconectar" : "conectar"}" data-id="${canal.id}" class="${ligado ? "" : "principal"}">
          ${ligado ? "Desconectar" : "Conectar " + escaparHtml(canal.nome)}
        </button>
      </article>`;
  }
  document.getElementById("lista-conexoes").innerHTML = html;
}

// Janela que simula a autorização (na versão final, aqui abriria o login oficial da rede)
function abrirJanelaDeConexao(canal) {
  const janela = document.getElementById("janela-conexao");
  janela.innerHTML = `
    <h2>Conectar ${escaparHtml(canal.nome)}</h2>
    <p>O painel vai poder <strong>ver</strong>: ${escaparHtml(canal.dados)}.</p>
    <ul>
      <li>Só leitura: não publica, não apaga e não responde por você.</li>
      <li>Você pode desconectar quando quiser.</li>
    </ul>
    <p class="texto-apoio"><strong>O que é preciso:</strong> ${escaparHtml(canal.requisito)}</p>
    <p class="nota-demo">Demonstração: nenhum login real é feito agora. Na versão final, este botão abre a página oficial de ${escaparHtml(canal.nome)} (${escaparHtml(canal.api)}) para você entrar e autorizar.</p>
    <div class="janela-botoes">
      <button id="botao-cancelar">Cancelar</button>
      <button id="botao-autorizar" class="principal" data-id="${canal.id}">Autorizar (demonstração)</button>
    </div>`;
  janela.showModal();
}

// Redesenha tudo (usado sempre que o usuário muda alguma escolha)
function atualizarTela() {
  desenharAviso();
  desenharBotoesDeCanais();
  desenharConexoes();
  desenharSeguranca();
  if (canaisConectados().length === 0) return;   // nada para mostrar no painel
  desenharIndicadores();
  desenharGrafico();
  desenharFunil();
  desenharReacao();
  desenharTabelaDePublicacoes();
  desenharComparacao();
  desenharResumo();
}


/* ---------------------------------------------------------------------
   5. AÇÕES DOS BOTÕES
   --------------------------------------------------------------------- */

// Marca visualmente qual botão está escolhido dentro de um grupo
function marcarBotaoAtivo(grupo, botaoClicado) {
  grupo.querySelectorAll("button").forEach(b => b.classList.remove("ativo"));
  botaoClicado.classList.add("ativo");
}

function limparDetalheDoDia() {
  document.getElementById("detalhe-dia").textContent = "Passe o mouse (ou toque) no gráfico para ver cada dia.";
}

// Liga um grupo de botões a uma ação.
// Quando alguém clica, chamamos "aoEscolher" com o botão clicado.
function ligarBotoes(idDoGrupo, aoEscolher) {
  const grupo = document.getElementById(idDoGrupo);
  grupo.addEventListener("click", evento => {
    const botao = evento.target.closest("button");
    if (!botao) return;
    marcarBotaoAtivo(grupo, botao);
    aoEscolher(botao);
    limparDetalheDoDia();
  });
}

ligarBotoes("botoes-periodo", botao => { periodoEscolhido = Number(botao.dataset.dias); atualizarTela(); });
ligarBotoes("botoes-canal",   botao => { canalEscolhido = botao.dataset.canal;          atualizarTela(); });
ligarBotoes("botoes-metrica", botao => { metricaDoGrafico = botao.dataset.metrica;      desenharGrafico(); });
ligarBotoes("botoes-tipo",    botao => { tipoEscolhido = botao.dataset.tipo;            atualizarTela(); });
ligarBotoes("botoes-ordem",   botao => { ordemEscolhida = botao.dataset.ordem;          desenharTabelaDePublicacoes(); });

// Troca entre as telas "Painel" e "Conexões"
function mostrarTela(nome) {
  for (const tela of ["painel", "conexoes", "seguranca"]) {
    document.getElementById("tela-" + tela).hidden = nome !== tela;
  }
  document.querySelectorAll("#abas button[data-tela]").forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.tela === nome);
  });
  window.scrollTo(0, 0);
}

document.getElementById("abas").addEventListener("click", evento => {
  const botao = evento.target.closest("button");
  if (botao && botao.dataset.tela) mostrarTela(botao.dataset.tela);
});

// Qualquer link/botão com data-ir-para="conexoes" leva para a tela de Conexões
document.addEventListener("click", evento => {
  const alvo = evento.target.closest("[data-ir-para]");
  if (!alvo) return;
  evento.preventDefault();
  mostrarTela(alvo.dataset.irPara);
});

// Botões "Conectar" e "Desconectar" de cada cartão
document.getElementById("lista-conexoes").addEventListener("click", evento => {
  const botao = evento.target.closest("button");
  if (!botao) return;
  const canal = CANAIS.find(c => c.id === botao.dataset.id);

  if (botao.dataset.acao === "conectar") {
    abrirJanelaDeConexao(canal);
  } else {
    conectados.delete(canal.id);
    salvarConectados();
    atualizarTela();
  }
});

// Botões dentro da janela de autorização
document.getElementById("janela-conexao").addEventListener("click", evento => {
  const botao = evento.target.closest("button");
  if (!botao) return;
  if (botao.id === "botao-autorizar") {
    conectados.add(botao.dataset.id);
    salvarConectados();
    atualizarTela();
  }
  document.getElementById("janela-conexao").close();
});

// "Conectar todos" e "Desconectar todos"
document.getElementById("botao-conectar-todos").addEventListener("click", () => {
  CANAIS.forEach(canal => conectados.add(canal.id));
  salvarConectados();
  atualizarTela();
});
document.getElementById("botao-desconectar-todos").addEventListener("click", () => {
  conectados.clear();
  salvarConectados();
  atualizarTela();
});

// Botão "Atualizar dados" (na versão final, buscaria os números nas plataformas)
document.getElementById("botao-atualizar").addEventListener("click", () => {
  const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("ultima-atualizacao").textContent = `Atualizado hoje às ${hora}`;
});


/* ---------------------------------------------------------------------
   6. SEGURANÇA
   Atenção: tudo aqui roda no navegador. O PIN protege contra quem olha a tela
   ou pega o aparelho, mas não substitui um login em servidor (versão final).
   --------------------------------------------------------------------- */

const CHAVE_DO_PIN = "pinProtegido";
const MINUTOS_PARA_BLOQUEAR = 5;      // tempo sem uso até bloquear sozinho
const MAXIMO_DE_ERROS = 5;            // erros seguidos de PIN antes de esperar
const SEGUNDOS_DE_ESPERA = 30;        // quanto tempo esperar depois dos erros

let errosDePin = 0;
let esperaAte = 0;                    // hora (em milissegundos) até a qual o PIN fica travado
let temporizadorDeInatividade = null;
let confirmandoLimpeza = false;

// Lê o PIN guardado. Guardamos só um "resumo" (hash) e um sal, nunca o PIN em si.
function lerPinGuardado() {
  try { return JSON.parse(localStorage.getItem(CHAVE_DO_PIN)); } catch (erro) { return null; }
}

function pinEstaAtivo() {
  return lerPinGuardado() !== null;
}

function pinEhValido(pin) {
  return /^\d{4,6}$/.test(pin);       // de 4 a 6 números
}

// Transforma o PIN em um resumo SHA-256, misturado com um "sal" aleatório
async function gerarResumoDoPin(pin, sal) {
  const bytes = new TextEncoder().encode(sal + pin);
  const resumo = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(resumo)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function segundosDeEspera() {
  return Math.max(0, Math.ceil((esperaAte - Date.now()) / 1000));
}

// Confere um PIN digitado e controla as tentativas erradas
async function conferirPin(digitado) {
  const guardado = lerPinGuardado();
  if (!guardado) return true;
  if (segundosDeEspera() > 0) return false;

  const resumo = await gerarResumoDoPin(digitado, guardado.sal);
  if (resumo === guardado.resumo) { errosDePin = 0; return true; }

  errosDePin++;
  if (errosDePin >= MAXIMO_DE_ERROS) {
    esperaAte = Date.now() + SEGUNDOS_DE_ESPERA * 1000;
    errosDePin = 0;
  }
  return false;
}

function mensagemDeErroDePin() {
  const espera = segundosDeEspera();
  return espera > 0 ? `Muitas tentativas. Aguarde ${espera} segundos.` : "PIN incorreto.";
}

function mostrarMensagemDoPin(texto) {
  document.getElementById("mensagem-pin").textContent = texto;
}

// --- Ativar, remover, bloquear e desbloquear ---

async function ativarPin() {
  const campo = document.getElementById("pin-campo");
  if (!pinEhValido(campo.value)) return mostrarMensagemDoPin("Use de 4 a 6 números.");
  if (!window.crypto || !crypto.subtle) return mostrarMensagemDoPin("Este navegador não permite criar o PIN aqui.");

  const sal = Array.from(crypto.getRandomValues(new Uint8Array(8)), b => b.toString(16).padStart(2, "0")).join("");
  const resumo = await gerarResumoDoPin(campo.value, sal);
  try {
    localStorage.setItem(CHAVE_DO_PIN, JSON.stringify({ sal, resumo }));
  } catch (erro) {
    return mostrarMensagemDoPin("Não foi possível salvar o PIN neste navegador.");
  }
  campo.value = "";
  mostrarMensagemDoPin("PIN ativado. O painel bloqueia sozinho após 5 minutos sem uso.");
  reiniciarContagemDeInatividade();
  desenharSeguranca();
}

async function removerPin() {
  const campo = document.getElementById("pin-campo");
  if (!(await conferirPin(campo.value))) {
    campo.value = "";
    return mostrarMensagemDoPin(mensagemDeErroDePin());
  }
  try { localStorage.removeItem(CHAVE_DO_PIN); } catch (erro) { /* ignora */ }
  campo.value = "";
  clearTimeout(temporizadorDeInatividade);
  mostrarMensagemDoPin("PIN removido.");
  desenharSeguranca();
}

function bloquear() {
  if (!pinEstaAtivo()) return;
  document.body.classList.add("bloqueado");
  document.getElementById("tela-bloqueio").hidden = false;
  document.getElementById("pin-bloqueio").focus();
}

function desbloquear() {
  document.body.classList.remove("bloqueado");
  document.getElementById("tela-bloqueio").hidden = true;
  reiniciarContagemDeInatividade();
}

async function tentarDesbloquear() {
  const campo = document.getElementById("pin-bloqueio");
  const mensagem = document.getElementById("mensagem-bloqueio");

  if (await conferirPin(campo.value)) {
    mensagem.textContent = "";
    desbloquear();
  } else {
    mensagem.textContent = mensagemDeErroDePin();
  }
  campo.value = "";
}

// --- Bloqueio automático por falta de uso ---

function reiniciarContagemDeInatividade() {
  clearTimeout(temporizadorDeInatividade);
  if (!pinEstaAtivo()) return;
  temporizadorDeInatividade = setTimeout(bloquear, MINUTOS_PARA_BLOQUEAR * 60 * 1000);
}

// Qualquer clique, tecla ou toque conta como "uso"
["click", "keydown", "touchstart", "mousemove"].forEach(tipo => {
  document.addEventListener(tipo, () => {
    if (!document.body.classList.contains("bloqueado")) reiniciarContagemDeInatividade();
  }, { passive: true });
});

// --- Ocultar números (para compartilhar a tela) ---

function alternarPrivacidade() {
  const ligado = document.body.classList.toggle("numeros-ocultos");
  const botao = document.getElementById("botao-privacidade");
  botao.setAttribute("aria-pressed", ligado);
  botao.textContent = ligado ? "Mostrar números" : "Ocultar números";
}

// --- Apagar os dados salvos no aparelho (precisa clicar duas vezes) ---

function apagarDadosDoAparelho() {
  const botao = document.getElementById("botao-limpar");

  if (!confirmandoLimpeza) {
    confirmandoLimpeza = true;
    botao.textContent = "Clique de novo para confirmar";
    setTimeout(() => { confirmandoLimpeza = false; botao.textContent = "Apagar dados deste aparelho"; }, 5000);
    return;
  }

  try {
    localStorage.removeItem(CHAVE_DE_ARMAZENAMENTO);
    localStorage.removeItem(CHAVE_DO_PIN);
  } catch (erro) { /* ignora */ }

  conectados.clear();
  CONECTADOS_NO_INICIO.forEach(id => conectados.add(id));
  clearTimeout(temporizadorDeInatividade);
  confirmandoLimpeza = false;
  botao.textContent = "Apagar dados deste aparelho";
  document.getElementById("mensagem-limpeza").textContent = "Dados apagados. O painel voltou às configurações iniciais.";
  atualizarTela();
}

// --- Desenho da tela de Segurança ---

function desenharSeguranca() {
  const ativo = pinEstaAtivo();

  document.getElementById("estado-pin").textContent = ativo ? "✓ PIN ativo" : "PIN não ativado";
  document.getElementById("acoes-pin").innerHTML = ativo
    ? `<button data-acao="bloquear" class="principal">Bloquear agora</button>
       <button data-acao="remover">Remover PIN (digite o PIN atual acima)</button>`
    : `<button data-acao="ativar" class="principal">Ativar PIN</button>`;

  const item = (bom, textoBom, textoRuim) =>
    `<li><span class="${bom ? "ok" : "atencao"}">${bom ? "✓" : "✗"}</span> ${bom ? textoBom : textoRuim}</li>`;

  document.getElementById("lista-verificacoes").innerHTML =
    item(true,  "Conexões somente leitura: o painel nunca publica, apaga nem responde.", "") +
    item(true,  "Senhas das redes nunca ficam guardadas neste painel.", "") +
    item(true,  "Textos vindos das redes são tratados contra código malicioso.", "") +
    item(true,  "Política de segurança do navegador limita o que a página pode carregar e enviar.", "") +
    item(ativo, "Bloqueio por PIN ativo.", "Bloqueio por PIN desativado (recomendado ativar).") +
    item(ativo, `Bloqueio automático após ${MINUTOS_PARA_BLOQUEAR} minutos sem uso.`, "Bloqueio automático desativado (depende do PIN).");
}

// --- Ligações dos botões de segurança ---

document.getElementById("acoes-pin").addEventListener("click", evento => {
  const botao = evento.target.closest("button");
  if (!botao) return;
  if (botao.dataset.acao === "ativar") ativarPin();
  if (botao.dataset.acao === "remover") removerPin();
  if (botao.dataset.acao === "bloquear") bloquear();
});

document.getElementById("botao-desbloquear").addEventListener("click", tentarDesbloquear);
document.getElementById("pin-bloqueio").addEventListener("keydown", evento => {
  if (evento.key === "Enter") tentarDesbloquear();
});
document.getElementById("botao-privacidade").addEventListener("click", alternarPrivacidade);
document.getElementById("botao-limpar").addEventListener("click", apagarDadosDoAparelho);

// Primeira vez que a página abre
atualizarTela();
if (pinEstaAtivo()) bloquear();          // se há PIN, o painel já abre bloqueado
reiniciarContagemDeInatividade();
