# Painel de resultados – New Digital Midia

Protótipo de um painel de Business Intelligence (BI) que reúne, em uma única tela, os resultados do site e de vários canais de marketing digital: Instagram, Facebook, X (Twitter), TikTok, Kwai, YouTube e e-mail marketing.

Desenvolvido na **Atividade Extensionista II (ACE II)** do curso de Tecnologia em Análise e Desenvolvimento de Sistemas (ADS) da FACINT.

- **Estudante:** Edgar Alberto de Medeiros Carrillo (RA 202409129)
- **Empresa beneficiada:** New Digital Midia (Aracaju - SE)
- **Polo:** Maringá - PR

> **Atenção:** este é um **protótipo**. Os números são de **demonstração** (fictícios) e a conexão com as redes é **simulada**. Nenhum dado real é lido, enviado ou publicado.

---

## O problema

A empresa acompanha seus resultados em lugares separados (Google Analytics para o site e as métricas de cada rede social). As fontes não se comunicam, então os sócios precisam abrir cada plataforma e juntar os números à mão. O diagnóstico da ACE I apontou esse ponto como fraco: integração de bases de dados (nota 1) e uso de dashboards (nota 2).

## O que o painel faz

**Tela Painel**
- Filtro de período (7 ou 30 dias) e filtro por canal, cada rede com sua cor.
- Quatro números principais (visitas, pessoas alcançadas, cliques e pedidos de contato), comparados ao período anterior.
- Gráfico de linha dia a dia.
- Funil do alcance até o pedido de contato.
- Reação do público: visualizações, curtidas e comentários bons e negativos, para publicações e stories.
- Lista publicação por publicação, ordenável por mais vistas, mais curtidas ou mais comentários negativos, com alerta para os casos críticos.
- Comparação entre os canais conectados e resumo em frases simples.

**Tela Conexões**
- Um cartão para cada rede, com o botão **Conectar** ou **Desconectar**.
- Só os canais conectados aparecem nos resultados.
- A escolha fica salva no navegador.

**Tela Segurança**
- Bloqueio por **PIN** (4 a 6 números), com bloqueio automático após 5 minutos sem uso.
- Espera de 30 segundos depois de 5 PINs errados seguidos.
- Botão **Ocultar números** (borra os valores para compartilhar a tela em reuniões).
- Orientações de LGPD, plano rápido para incidentes e botão para apagar os dados salvos no aparelho.

## Como usar

1. Baixe e extraia o `.zip`.
2. Deixe os três arquivos (`index.html`, `style.css` e `script.js`) **na mesma pasta**.
3. Dê dois cliques no `index.html` para abrir no navegador. Não precisa instalar nada.

A fonte *Plus Jakarta Sans* é carregada da internet. Sem conexão, o painel usa uma fonte comum do sistema e continua funcionando.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Estrutura das três telas |
| `style.css` | Visual: cores, layout, tema claro e escuro, celular |
| `script.js` | Lógica: dados de demonstração, cálculos, gráficos, conexões e segurança |

O `script.js` é dividido em seis partes comentadas em português: (1) canais e dados de demonstração, (2) conexões, (3) funções de apoio, (4) desenho da tela, (5) ações dos botões e (6) segurança.

## Tecnologias

- HTML5, CSS3 e JavaScript puro, sem bibliotecas externas.
- Gráficos desenhados em SVG.
- `localStorage` do navegador para lembrar os canais conectados e o PIN.
- SHA-256 (Web Crypto) para guardar o PIN sem salvar o número em si.

## Personalizando

- **Cores:** mude os valores no começo do `style.css`.
- **Novo canal (ex.: LinkedIn):** acrescente uma linha na lista `CANAIS`, no começo do `script.js`. Botões, tabelas, gráfico e resumo se ajustam sozinhos.
- **Tempo de bloqueio e tentativas do PIN:** ajuste `MINUTOS_PARA_BLOQUEAR`, `MAXIMO_DE_ERROS` e `SEGUNDOS_DE_ESPERA` na parte 6 do `script.js`.

## Segurança: o que protege e o que não protege

Protege:
- Textos vindos das redes são tratados antes de aparecer na página, contra código malicioso.
- Uma política de segurança (CSP) no `index.html` limita o que a página pode carregar e impede o envio de dados para fora.
- O painel nunca guarda senhas das redes e usa conexões somente leitura.

Não protege (limites de um site simples):
- O PIN protege contra quem olha a tela ou pega o aparelho, mas **não substitui um login em servidor**. Quem tiver o arquivo e conhecimento técnico consegue contorná-lo.

## Próximos passos para uso no dia a dia

1. Combinar com os sócios as redes e métricas prioritárias.
2. Conectar as redes e o Google Analytics de verdade, pelas formas oficiais de cada plataforma, guardando as autorizações em um servidor. O Kwai pode exigir importação de planilha (CSV).
3. Hospedar o painel com HTTPS e login, no lugar do PIN de demonstração.
4. Classificar os comentários em bons e negativos automaticamente (análise de sentimento), pois as redes não entregam essa separação pronta.
5. Testar com dados reais de uma cliente e ajustar.
6. Revisar segurança e LGPD antes de usar dados de clientes.
