/// <reference types="Cypress" />
import dados from '../../fixtures/transferencia.json'

describe('ST-3: Transferência', () => {

    beforeEach(() => {
        // Contas cadastradas para testes de transferência
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', true);
        cy.cadastrarUsuario(dados['user_secundario'], 'user_secundario', true);

        // Dado que eu estou logado como um usuário válido

        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);

        // E que eu acesso a página de transferência
        cy.get('#btn-TRANSFERÊNCIA').click();

        // Localização dos campos do form de transferência
        cy.carregarFormTransferencia();
    })

    it('CT-01: Validar que o campo numero da conta nao aceita letras e caracteres especiais', () => {
        const numero = 'we@r'
        const digito = '4';
        const valor = '100';
        const descricao = 'Transferência com número em branco';

        // Quando eu informo letras ou caracteres especiais no número da conta
        cy.get('@campoNumeroTransfer').type(numero);
        cy.get('@campoDigitoTransfer').type(digito);
        cy.get('@campoValorTransfer').type(valor);
        cy.get('@campoDescricaoTransfer').type(descricao);

        // E eu clico no botão [Transferir agora]
        cy.get('button').contains('Transferir agora').click();

        /// Então eu devo ser notificado que o campo de dígito da conta é obrigatório
        cy.get('p').contains('Conta inválida ou inexistente').should('exist');

        // E o meu saldo não deve ser alterado
        cy.visit('/home');
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');
    })

    it('CT-02: Validar obrigatoriedade do dígito da conta', () => {
        const numero = '123';
        const valor = '100';
        const descricao = 'Transferência com dígito em branco';

        // Quando eu deixo o campo de dígito da conta em branco
        cy.get('@campoNumeroTransfer').type(numero);
        cy.get('@campoValorTransfer').type(valor);
        cy.get('@campoDescricaoTransfer').type(descricao);

        // E eu clico no botão [Transferir agora]
        cy.get('button').contains('Transferir agora').click();

        // Então eu devo ser notificado que o campo de dígito da conta é obrigatório
        cy.get('p').contains('Conta inválida ou inexistente').should('exist');

        // E o meu saldo não deve ser alterado
        cy.visit('/home');
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');

    })

    it('CT-03: Validar número de conta inválido', () => {
        const digito = '4';
        const valor = '100';
        const descricao = 'Transferência com número inválido';

        dados['numeros_invalidos'].forEach( (numero) => {
            // Quando eu preencho o campo de número da conta com uma entrada inválida
            cy.get('@campoNumeroTransfer').type(numero);
            cy.get('@campoDigitoTransfer').type(digito);
            cy.get('@campoValorTransfer').type(valor);
            cy.get('@campoDescricaoTransfer').type(descricao);

            // E eu clico no botão [Transferir agora]
            cy.get('button').contains('Transferir agora').click();

            // Então eu devo ser notificado que o número da conta está mal formatado
            cy.get('p').contains('Conta inválida ou inexistente').should('exist');

            // E o meu saldo não deve ser alterado
            cy.visit('/home');
            cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');

            // Volta para a página de transferência
            cy.get('#btn-TRANSFERÊNCIA').click();
        })
    })

    it('CT-04: Validar dígito de conta inválido', () => {
        const numero = '123';
        const valor = '100';
        const descricao = 'Transferência com dígito inválido';

        dados['digitos_invalidos'].forEach( (digito) => {
            // Quando eu preencho o campo de dígito da conta com uma entrada inválida
            cy.get('@campoNumeroTransfer').type(numero);
            cy.get('@campoDigitoTransfer').type(digito);
            cy.get('@campoValorTransfer').type(valor);
            cy.get('@campoDescricaoTransfer').type(descricao);

            // E eu clico no botão [Transferir agora]
            cy.get('button').contains('Transferir agora').click();

            // Então eu devo ser notificado que o dígito da conta está mal formatado
            cy.get('p').contains('Conta inválida ou inexistente').should('exist');

            // E o meu saldo não deve ser alterado
            cy.visit('/home');
            cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');

            // Volta para a página de transferência
            cy.get('#btn-TRANSFERÊNCIA').click();
        })
    })

    it('CT-05: Validar transferência para conta não cadastrada', () => {
        const numero = dados['conta_nao_cadastrada']['numero'];
        const digito = dados['conta_nao_cadastrada']['digito'];
        const valor = '100';
        const descricao = 'Transferência para conta não cadastrada';

        // Quando eu preencho o campo de número e dígito com uma conta não cadastrada
        cy.get('@campoNumeroTransfer').type(numero);
        cy.get('@campoDigitoTransfer').type(digito);

        cy.get('@campoValorTransfer').type(valor);
        cy.get('@campoDescricaoTransfer').type(descricao);

        // E eu clico no botão [Transferir agora]
        cy.get('button').contains('Transferir agora').click();

        // Então a mensagem "Conta inválida ou inexistente" deve ser exibida
        cy.get('p').contains('Conta inválida ou inexistente').should('exist');

        // E o meu saldo não deve ser alterado
        cy.visit('/home');
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');
    })

    it('CT-06: Validar obrigatoriedade do valor', () => {
        // Quando eu deixo o campo de valor em branco
        cy.get('@user_secundario_numero').then(numero => {
            cy.get('@campoNumeroTransfer').type(numero);
        })
        cy.get('@user_secundario_digito').then(digito => {
            cy.get('@campoDigitoTransfer').type(digito);
        })

        cy.get('@campoDescricaoTransfer').type('Transferência com valor em branco');

        // E eu clico no botão [Transferir agora]
        cy.get('button').contains('Transferir agora').click();

        // Então eu devo ser notificado que o campo de valor é obrigatório
        cy.get('p').contains('transferValue must be a `number` type, but the final value was: `NaN` (cast from the value `""`).').should('exist');

        // E o meu saldo não deve ser alterado
        cy.visit('/home');
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');

        // E o saldo da outra conta não deve ser alterado
        cy.fazerLogin(dados['user_secundario']['email'], dados['user_secundario']['senha']);
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');
    })

    it('CT-07: Validar valor inválido', () => {
        dados['valores_invalidos'].forEach(valor => {
            // Quando eu preencho o campo de valor com uma entrada inválida
            cy.get('@user_secundario_numero').then(numero => {
                cy.get('@campoNumeroTransfer').type(numero);
            })
            cy.get('@user_secundario_digito').then(digito => {
                cy.get('@campoDigitoTransfer').type(digito);
            })
            
            cy.get('@campoValorTransfer').type(valor);
            cy.get('@campoDescricaoTransfer').type('Transferência com valor inválido');

            // E eu clico no botão [Transferir agora]
            cy.get('button').contains('Transferir agora').click();

            // Então a mensagem "Valor da transferência não pode ser 0 ou negativo" deve ser exibida
            cy.get('p').contains('Valor da transferência não pode ser 0 ou negativo').should('exist');

            // E o meu saldo não deve ser alterado
            cy.visit('/home');
            cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');

            // E o saldo da outra conta não deve ser alterado
            cy.fazerLogin(dados['user_secundario']['email'], dados['user_secundario']['senha']);
            cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');

            // Reset
            cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);
            cy.get('#btn-TRANSFERÊNCIA').click();
        })
    })

    it('CT-08: Validar transferência sem saldo suficiente', () => {
        // Quando eu preencho o campo de valor com um número maior que o meu saldo
        cy.get('@user_secundario_numero').then(numero => {
            cy.get('@campoNumeroTransfer').type(numero);
        })
        cy.get('@user_secundario_digito').then(digito => {
            cy.get('@campoDigitoTransfer').type(digito);
        })
        cy.get('@campoValorTransfer').type('50000');
        cy.get('@campoDescricaoTransfer').type('Transferência sem saldo suficiente');
        
        // E eu clico no botão [Transferir agora]
        cy.get('button').contains('Transferir agora').click();

        // Então a mensagem "Você não tem saldo suficiente para essa transação" deve ser exibida
        cy.get('p').contains('Você não tem saldo suficiente para essa transação').should('exist');

        // E o meu saldo não deve ser alterado
        cy.visit('/home');
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');

        // E o saldo da outra conta não deve ser alterado
        cy.fazerLogin(dados['user_secundario']['email'], dados['user_secundario']['senha']);
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');
    })

    it('CT-10: Validar transferência com sucesso', () => {
        // Quando eu preencho os dados válidos da outra conta
        cy.get('@user_secundario_numero').then(numero => {
            cy.get('@campoNumeroTransfer').type(numero);
        })
        cy.get('@user_secundario_digito').then(digito => {
            cy.get('@campoDigitoTransfer').type(digito);
        })

        cy.get('@campoValorTransfer').type('1000');
        cy.get('@campoDescricaoTransfer').type('Transferência com sucesso');

        // E eu clico no botão [Transferir agora]
        cy.get('button').contains('Transferir agora').click();

        // Então a mensagem "Transferencia realizada com sucesso" deve ser exibida
        cy.get('p').contains('Transferencia realizada com sucesso').should('exist');
        cy.get('a').contains('Fechar').click();

        // E eu devo ser direcionado para a página de extrato
        //cy.url().should('eq', Cypress.config().baseUrl + 'bank-statement');

        // E o meu saldo deve ser reduzido pelo valor
        cy.visit('/home');
        cy.get('#textBalance > span').contains('R$ 0,00').should('exist');

        // E o saldo da outra conta deve ser aumentado pelo valor
        cy.fazerLogin(dados['user_secundario']['email'], dados['user_secundario']['senha']);
        cy.get('#textBalance > span').contains('R$ 2.000,00').should('exist');
    })
})