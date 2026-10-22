---
name: auditar-idor-rotas
description: Mapeia rotas sem autenticação no servidor e testa vulnerabilidades de IDOR (acesso cruzado entre usuários ou empresas). Use ao criar ou revisar rotas de API, Server Actions, middlewares ou páginas protegidas.
---

# Auditoria de Controle de Acesso e IDOR

1. Liste todas as rotas, páginas protegidas, endpoints e funções de servidor que leem, alteram ou apagam dados neste projeto[cite: 3].
2. Entregue uma tabela contendo para cada rota/função:
   - Quem pode chamar[cite: 3].
   - Onde a autenticação e a permissão são verificadas (servidor via middleware/guard/função, banco de dados ou apenas escondida no front-end)[cite: 3].
   - Se um usuário autenticado consegue acessar um registro de outro usuário ou de outra empresa trocando o ID na requisição (IDOR)[cite: 3].
3. Marque como **CRÍTICO** toda rota que retorna ou altera dados sem verificação de autenticação/permissão no servidor (ou onde a verificação existe apenas no front-end)[cite: 3].
4. Para cada caso crítico, escreva a correção no código e um teste automatizado que prove que o usuário A não acessa dados do usuário B[cite: 3].
