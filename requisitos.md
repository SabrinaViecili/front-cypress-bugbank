Cadastro:
• Os campos Nome, E-mail, Senha e Confirmação de senha são de preenchimento obrigatório
  
• Tentativa de cadastro sem preencher nome deve visualizar a mensagem "Nome não pode ser vazio"
  
• Tentativa de cadastro sem preencher e-mail deve visualizar a mensagem "E-mail não pode ser vazio"
  
• Tentativa de cadastro sem preencher senha deve visualizar a mensagem “Senha não pode ser vazio”
  
• Tentativa de cadastro sem preencher confirmação de senha deve visualizar a mensagem "Confirmar senha não pode ser vazio"

• Deixar ativo a opção "Criar conta com saldo" deve criar conta com saldo de R$ 1.000,00
  
• Deixar inativo a opção "Criar conta com saldo" deve criar conta com saldo de R$ 0,00
  
• Senha e confirmação de senha precisam ser iguais
  
• Cadastrar conta com sucesso deve exibir número da conta criada

Login:
• E-mail e Senha são campos obrigatórios.
  
• Tentativa de acesso sem preencher campos obrigatórios deve exibir a mensagem “Usuário e senha precisam ser preenchidos”.
  
• Não deve autorizar o acesso para usuários inválidos ou não cadastrados.
  
• Usuários válidos e cadastros são direcionados para a Home.

Transferencia:
• Só é permitido transferência para contas válidas
  
• Só é permitido transferência quando saldo é igual ou maior que valor para transferir
  
• Tentativa de transferência para conta inválida deve exibir mensagem de erro "Conta inválida ou inexistente"
  
• Número e digito da conta aceitam apenas números
  
• Campo descrição é um campo de preenchimento obrigatório
  
• Valor de transferência não pode ser igual ou menor que zero
  
• Ao realizar transferência com sucesso deve ser debitado o valor da conta e exibir a mensagem de “Transferência realizada com sucesso”
  
• Ao realizar uma transferência com sucesso deve ser redirecionado para o extrato

Extrato: • Deve exibir o saldo disponível no momento
  
• Cada transação deve exibir data que foi realizada, tipo da transação (Abertura de conta / Transferência enviada / Transferência recebida)- Quando valor for de saída da conta deve estar em vermelho e iniciar com o sinal de menos/negativo(-)
  
• Quando valor for de entrada na conta deve estar em verde
  
• Transações sem comentário devem exibir (-)