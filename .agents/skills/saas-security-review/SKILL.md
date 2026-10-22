---
name: saas-security-review
description: Realiza auditoria de segurança em aplicações SaaS (segredos expostos, separação de chaves públicas/secretas, rotas sem autenticação no servidor, IDOR, regras de acesso ao banco RLS, XSS e validação de pacotes). Use ao revisar código, PRs, rotas de API, Server Actions, componentes que renderizam HTML ou antes do deploy.
---

# SaaS Security Code Review

Ao revisar arquivos alterados, novas funcionalidades ou o repositório completo, aplique estas diretrizes de verificação:

## 1. Auto-Revisão e Dependências (Prompts 02 e 09)

- Revise o código procurando entradas não validadas, verificação de permissão ausente, segredos no código e mensagens de erro que expõem detalhes internos.
- Para cada dependência sugerida ou adicionada, informe se o nome exato existe no registro oficial (ex: npm), quem mantém, a data da última versão e o volume aproximado de downloads.
- Se não tiver certeza de que o pacote existe, declare isso explicitamente em vez de supor e sinalize nomes parecidos com pacotes populares.

## 2. Segredos e Chaves de Serviços Externos (Prompts 03 e 04)

- Liste todos os lugares onde existem ou podem existir segredos: chaves de API, tokens, strings de conexão, chaves privadas, arquivos `.env` versionados, configurações de ferramentas/MCP, scripts de CI e código que rode no navegador (bundle do front-end).
- Classifique as chaves de serviços externos (banco, autenticação, pagamento, e-mail, IA, armazenamento) em:
  - **Pública:** pode ir para o navegador (ex: chave anon/publishable do Supabase, publishable do Stripe, config do Firebase).
  - **Secreta:** restrita ao servidor (ex: service_role/secret do Supabase, secret key do Stripe, chaves de provedores de IA).
- Para cada achado, informe: arquivo e linha, tipo de segredo, se chega ao cliente e o risco.
- **Regra Estrita:** Nunca mostre o valor completo do segredo; exiba no máximo os 4 primeiros caracteres. Aponte chaves secretas fora do servidor, proponha a correção e indique quais chaves precisam ser rotacionadas.

## 3. Proteção de Rotas, IDOR e Banco de Dados (Prompts 05, 06 e 07)

- Liste todas as rotas, páginas protegidas, endpoints e funções de servidor que leem, alteram ou apagam dados.
- Entregue uma tabela informando: quem pode chamar; onde a permissão é verificada (servidor via middleware/guard/função, banco de dados ou apenas escondida no front-end); e se um usuário autenticado consegue acessar dados de outro usuário ou empresa trocando o ID na requisição (IDOR).
- Revise as regras do banco (Row Level Security do Supabase / Security Rules do Firebase) buscando tabelas sem regra, regras com `true`, regras que só exigem login sem filtrar pelo dono do registro/organização.
- Marque como **CRÍTICO** toda rota ou acesso onde a verificação existe apenas no front-end ou sem isolamento de dados.
- Para cada caso crítico, escreva a correção e um teste automatizado que prove que o usuário A não acessa nem altera dados do usuário B.

## 4. Prevenção de XSS no Front-End (Prompt 08)

- Encontre todos os pontos em que conteúdo vindo do usuário ou de APIs externas é renderizado como HTML: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`, templates sem escape, markdown renderizado e atributos `href`/`src` dinâmicos.
- Para cada ponto, mostre um payload de exemplo que o exploraria e a correção usando o escape do próprio framework ou uma biblioteca de sanitização consolidada.

## 5. Formato de Relatório e Checklist Pré-Deploy (Prompt 10)

- Em auditorias pré-deploy (cobrindo segredos, auth, isolamento de usuários, validação/XSS, CORS/cabeçalhos/limites da API, webhooks, dependências, logs sem dados pessoais e IA), entregue uma tabela com:
  **Item | Status (`OK` / `ATENÇÃO` / `CRÍTICO`) | Evidência (arquivo e linha) | Correção sugerida**
- Nunca marque um item como `OK` sem citar o arquivo e a linha exata como evidência.
