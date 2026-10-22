---
name: revisar-xss
description: Encontra pontos vulneráveis a Cross-Site Scripting (XSS) no front-end e sugere sanitização. Use ao revisar componentes que renderizam HTML, markdown ou links dinâmicos.
---

# Varredura de XSS (Cross-Site Scripting)

1. Encontre todos os pontos em que conteúdo vindo do usuário ou de APIs externas é renderizado como HTML: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`, templates sem escape, markdown renderizado e atributos `href`/`src` dinâmicos.
2. Para cada ponto encontrado, mostre um payload de exemplo que o exploraria[cite: 4].
3. Escreva a correção usando o mecanismo de escape do próprio framework ou uma biblioteca de sanitização consolidada[cite: 4].
