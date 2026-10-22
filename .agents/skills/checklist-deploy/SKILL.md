---
name: checklist-deploy
description: Executa a auditoria completa de segurança pré-deploy exigindo evidências em arquivo e linha. Use antes de abrir PRs de release ou fazer deploy para produção.
---

# Checklist de Segurança Pré-Deploy

1. Faça uma auditoria de segurança deste projeto cobrindo:
   - Segredos e variáveis de ambiente[cite: 4]
   - Autenticação, autorização e isolamento entre usuários[cite: 4]
   - Validação de entradas e XSS[cite: 4]
   - Configuração da API (CORS, cabeçalhos, erros sem detalhes internos, limites)[cite: 4]
   - Webhooks[cite: 4]
   - Dependências[cite: 4]
   - Logs e dados pessoais[cite: 4]
   - Funcionalidades de IA[cite: 4]
2. Entregue uma tabela com: **Item | Status (`OK` / `ATENÇÃO` / `CRÍTICO`) | Evidência (arquivo e linha) | Correção sugerida**[cite: 4].
3. **Regra obrigatória:** Não marque nada como `OK` sem citar a evidência exata (arquivo e linha)[cite: 4].
