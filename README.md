# Totus Tuus

PWA católico: Bíblia, Orações, Catecismo, Encíclicas, Direito Canônico, Santos, Novenas, Liturgia, Objetos Sagrados e Exame de Consciência.

## Como rodar

O Service Worker exige HTTP (não funciona abrindo o `index.html` direto como arquivo). Rode um servidor local na pasta do projeto:

```
python3 -m http.server 8080
```

Depois abra `http://localhost:8080` no navegador do celular ou computador. Para instalar como app, use "Adicionar à tela inicial" (Android) ou "Adicionar à Tela de Início" (iOS/Safari).

Para publicar de verdade, basta subir esta pasta em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, etc.) com HTTPS — o Service Worker exige HTTPS em produção (localhost é exceção).

## O que está pronto com conteúdo completo

- **Orações**: texto integral, por categoria, com busca, favoritos, fonte ajustável e compartilhamento.
- **Novenas**: duas novenas completas (São Miguel e Natal) com os 9 dias; demais como stub "em breve".
- **Santos**: biografias curtas originais, com busca e favoritos.
- **Exame de Consciência**: organizado pelos Dez Mandamentos.
- **Objetos Sagrados**: guia descritivo dos principais itens do altar.
- **Calendário Litúrgico**: cálculo local do tempo, cor e grau litúrgico para qualquer data, mais busca ao vivo das leituras e orações do dia.

## O que é índice + link oficial (por direitos autorais)

O texto integral da Bíblia Ave Maria, do Catecismo, das Encíclicas e do Código de Direito Canônico é protegido por direitos autorais (Editora Ave Maria / Libreria Editrice Vaticana). Em vez de reproduzir esse conteúdo, o app:

- **Bíblia**: busca ao vivo em bible-api.com (tradução Almeida, de domínio público) para os 66 livros do cânon comum; os 7 livros deuterocanônicos (Tobias, Judite, Sabedoria, Eclesiástico, Baruc, 1 e 2 Macabeus) não têm fonte automática gratuita disponível — teria que ser digitado manualmente ou licenciado.
- **Catecismo**: índice de ~28 assuntos comuns com o número dos parágrafos e link direto para o texto oficial em vatican.va.
- **Encíclicas**: 24 encíclicas (Leão XIII, Paulo VI, João Paulo II, Francisco) com resumo e link direto ao texto oficial em vatican.va.
- **Direito Canônico**: os 7 livros do Código com resumo e link para o PDF oficial completo em português.

## Limitações conhecidas

- A busca por palavra na Bíblia só cobre a pequena amostra local, os favoritos e o histórico — não o texto inteiro, que não está embutido no app.
- A API pública de liturgia diária (`liturgia.up.railway.app`) é mantida pela comunidade, não pela CNBB; pode sair do ar.
- Ícones do PWA são placeholders simples — troque os arquivos em `icons/` por uma arte final.
