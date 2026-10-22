---
name: auditar-segredos
description: Varre o repositório em busca de segredos expostos, arquivos .env e separa chaves públicas de chaves secretas no front-end e servidor. Use quando o usuário pedir para auditar variáveis de ambiente, chaves de API ou segurança de credenciais.
---

# Auditoria de Segredos e Chaves

1. Liste todos os lugares deste projeto onde existem, ou podem existir, segredos: chaves de API, tokens, strings de conexão, chaves privadas, arquivos `.env` versionados, configurações de ferramentas e de MCP, scripts de CI e qualquer código que rode no navegador.
2. Liste cada serviço externo usado neste projeto (banco, autenticação, pagamento, e-mail, IA, armazenamento) e classifique cada chave como:
   - **Pública:** pode ir para o navegador (ex: chave anon/publishable do Supabase, publishable do Stripe, config do Firebase).
   - **Secreta:** restrita ao servidor (ex: service_role/secret do Supabase, secret key do Stripe, chaves de provedores de IA)[cite: 3].
3. Para cada achado, informe: arquivo e linha, tipo de segredo, se ele chega ao cliente (bundle do front-end) e o risco[cite: 2].
4. **Regra crítica:** Nunca mostre o valor completo do segredo; exiba no máximo os 4 primeiros caracteres[cite: 2].
5. Aponte qualquer chave secreta usada fora do servidor, proponha a correção e indique quais chaves precisam ser rotacionadas[cite: 2, 3].
