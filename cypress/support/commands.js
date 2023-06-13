/**
 * Localiza os campos do form de login e os salva com Aliases.
 */
Cypress.Commands.add('carregarFormLogin', () => {
    cy.get('div[class="card__login"]', {log: false}).within({log: false}, () => {
        cy.get('input[name="email"]', {log: false}).as('campoEmailLogin');
        cy.get('input[name="password"]', {log: false}).as('campoSenhaLogin');
    })

    // Log
    const log = Cypress.log({
        name: 'carregarFormLogin',
        displayName: 'formLogin',
        message: 'Carregar o formulário de login',
        consoleProps: () => {
            return {
                Email: 'campoEmailLogin',
                Senha: 'campoSenhaLogin'
            }
        }
    })
})

/**
 * Realiza o login com um usuário já cadastrado.
 * @param {string} email O email do usuário
 * @param {string} senha A senha do usuário
 */
Cypress.Commands.add('fazerLogin', (email, senha) => {
    cy.visit('/', {log: false});
    cy.carregarFormLogin();
    cy.get('@campoEmailLogin', {log: false}).type(email, {log: false});
    cy.get('@campoSenhaLogin', {log: false}).type(senha, {log: false});
    cy.get('button', {log: false}).contains('Acessar', {log: false}).click({log: false});

    // Log
    const log = Cypress.log({
        name: 'fazerLogin',
        displayName: 'login',
        message: `Fazer login com email: ${email} / senha: ${senha}`,
        consoleProps: () => {
            return {
                Email: `${email}`,
                Senha: `${senha}`
            }
        }
    })
})


/**
 * Localiza os campos do form de cadastro e os salva com Aliases.
 */
Cypress.Commands.add('carregarFormCadastro', () => {
    cy.get('div[class="card__register', {log: false}).within({log: false}, () => {
        cy.get('input[name="email"]', {log: false}).as('campoEmailCadastro');
        cy.get('input[name="name"]', {log: false}).as('campoNomeCadastro');
        cy.get('input[name="password"]', {log: false}).as('campoSenhaCadastro');
        cy.get('input[name="passwordConfirmation"]', {log: false}).as('campoConfirmacaoCadastro');
        cy.get('label[id="toggleAddBalance"]', {log: false}).as('toggleSaldoCadastro');
    })

    // Log
    const log = Cypress.log({
        name: 'carregarFormCadastro',
        displayName: 'formCadastro',
        message: 'Carregar o formulário de cadastro',
        consoleProps: () => {
            return {
                Email: 'campoEmailCadastro',
                Nome: 'campoNomeCadastro',
                Senha: 'campoSenhaCadastro',
                Confirmacao: 'campoConfirmacaoCadastro',
                Saldo: 'toggleSaldoCadastro'
            }
        }
    })
})

/**
 * Cadastra um novo usuário, e salva seu número de conta usando a tag como Alias.
 * @param {object} dados_usuario Dados de cadastro, contém email, nome e senha
 * @param {string} tag Tag que compõe o Alias do número de conta
 * @param {boolean} saldo Determina se a conta criada possui saldo ou não
 */
Cypress.Commands.add('cadastrarUsuario', (dados_usuario, tag, saldo = false) => {
    cy.visit('/', {log: false});

    cy.contains('button', 'Registrar', {log: false}).click({log: false});

    cy.carregarFormCadastro();

    cy.get('@campoEmailCadastro', {log: false}).type(dados_usuario['email'], {force: true, log: false});
    cy.get('@campoNomeCadastro', {log: false}).type(dados_usuario['nome'], {force: true, log: false});
    cy.get('@campoSenhaCadastro', {log: false}).type(dados_usuario['senha'], {force: true, log: false});
    cy.get('@campoConfirmacaoCadastro', {log: false}).type(dados_usuario['senha'], {force: true, log: false});

    if(saldo) {
        cy.get('@toggleSaldoCadastro', {log: false}).click({force: true, log: false});
    }

    cy.get('button', {log: false}).contains('Cadastrar', {log: false}).click({force: true, log: false});

    // Salvar número e dígito da conta cadastrada
    cy.get('p', {log: false})
      .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'), {log: false})
      .then({log:false}, elem => {
        const match = elem.text().match(new RegExp('\\d+-\\d+'))[0];
        const numero = match.split('-')[0];
        const digito = match.split('-')[1];
        cy.wrap(numero, {log: false}).as(`${tag}_numero`);
        cy.wrap(digito, {log: false}).as(`${tag}_digito`);
    })

    cy.visit('/', {log: false})
    
    // Log
    const log = Cypress.log({
        name: 'cadastrarUsuario',
        displayName: 'cadastro',
        message: `Usuário cadastrado: ${dados_usuario['email']} /
        ${dados_usuario['nome']} / ${dados_usuario['senha']}`,
        consoleProps: () => {
            return {
                Email: dados_usuario['email'],
                Nome: dados_usuario['nome'],
                Senha: dados_usuario['senha'],
            }
        }
    })
})


/**
 * Localiza os campos do form de transferência e os salva com Aliases.
 */
Cypress.Commands.add('carregarFormTransferencia', () => {
    cy.get('input[name="accountNumber"]', {log: false}).as('campoNumeroTransfer');
    cy.get('input[name="digit"]', {log: false}).as('campoDigitoTransfer');
    cy.get('input[name="transferValue"]', {log: false}).as('campoValorTransfer');
    cy.get('input[name="description"]', {log: false}).as('campoDescricaoTransfer');

    const log = Cypress.log({
        name: 'carregarFormTransferencia',
        displayName: 'formTransfer',
        message: 'Carregar o formulário de transferência',
        consoleProps: () => {
            return {
                Numero: 'campoNumeroTransfer',
                Digito: 'campoDigitoTransfer',
                Valor: 'campoValorTransfer',
                Descricao: 'campoDescricaoTransfer'
            }
        }
    })
})

/**
 * Envia uma transferência para a conta informada. Espera que o usuário de origem já esteja logado.
 * @param {string} numero O número da conta de destino
 * @param {string} digito O dígito da conta de destino
 * @param {number} valor O valor a ser enviado na transferência
 */
Cypress.Commands.add('enviarTransferencia', (numero, digito, valor) => {
    cy.visit('/transfer', {log: false});
    cy.carregarFormTransferencia();
    
    cy.get('@campoNumeroTransfer', {log: false}).type(numero, {log: false});
    cy.get('@campoDigitoTransfer', {log: false}).type(digito, {log: false});
    cy.get('@campoValorTransfer', {log: false}).type(valor, {log: false});
    cy.get('@campoDescricaoTransfer', {log: false})
      .type(`Transferência para ${numero}-${digito} no valor de R$ ${valor}`, {log: false});

    cy.get('button', {log: false}).contains('Transferir agora', {log: false}).click({log: false});

    // Log
    const log = Cypress.log({
        name: 'enviarTransferencia',
        displayName: 'Transferir',
        message: `Envia transferência de R$ ${valor} para ${numero}-${digito}`,
        consoleProps: () => {
            return {
                Valor: `R$ ${valor}`,
                Destino: `${numero}-${digito}`
            }
        }
    })
})
