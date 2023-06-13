/// <reference types="Cypress" />
import dados from '../../fixtures/extrato.json'

describe('ST-4: Extrato', () => {

    it.only('CT-01: Validar conta sem saldo', () => {
        // Dado que eu crio uma conta sem saldo
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', false);

        // Quando eu acesso a página de extrato
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);
        cy.get('#btn-EXTRATO').click();

        // Então o saldo exibido deve ser igual a R$ 0,00
        // cy.get('#textBalanceAvailable').contains('R$ 0,00').should('exist');
        cy.get('#textBalanceAvailable').should('have.text', 'R$\xa00,00');

        // E o histórico de transferências deve conter a transferência de abertura de conta
        cy.get('p').contains('Abertura de conta').should('exist');
    })

    it('CT-02: Validar conta com saldo', () => {
        // Dado que eu crio uma conta com saldo
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', true);

        // Quando eu acesso a página de extrato
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);
        cy.get('#btn-EXTRATO').click();

        // Então o saldo exibido deve ser igual a R$ 1.000,00
        cy.get('#textBalanceAvailable').contains('R$ 1.000,00').should('exist');

        // E o histórico de transferências deve conter a transferência de abertura de conta
        cy.get('p').contains('Abertura de conta').should('exist');
    })

    it('CT-03: Validar transferência enviada', () => {
        // Dado que eu possuo duas contas cadastradas
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', true);
        cy.cadastrarUsuario(dados['user_secundario'], 'user_secundario', true);

        // E que eu envio uma transferência com sucesso para a outra conta
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha'])
        cy.get('@user_secundario_numero').then((numero) => {
            cy.get('@user_secundario_digito').then((digito) => {
                cy.enviarTransferencia(numero, digito, 250);
            })
        })

        // Quando eu acesso a página de extrato
        cy.visit('/bank-statement');

        // Então o saldo exibido deve ser igual ao esperado
        cy.get('#textBalanceAvailable').contains('R$ 750,00').should('exist');

        // E o histórico de transferências deve conter a transferência enviada
        cy.get('p').contains('Transferência enviada').should('exist');

        // E o valor da transferência enviada deve estar formatado corretamente
        cy.get('p').contains('Transferência enviada').parents().its(1).within(() => {
            cy.get('#textTransferValue').contains('-R$ 250,00').should('exist');
        })
    })

    it('CT-04: Validar transferência recebida: conta com saldo', () => {
        // Dado que eu possuo duas contas cadastras
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', true);
        cy.cadastrarUsuario(dados['user_secundario'], 'user_secundario', true);

        // E que eu recebo uma transferência com sucesso da outra conta
        cy.fazerLogin(dados['user_secundario']['email'], dados['user_secundario']['senha']);
        cy.get('@user_primario_numero').then((numero) => {
            cy.get('@user_primario_digito').then((digito) => {
                cy.enviarTransferencia(numero, digito, 300);
            })
        })

        // Quando eu acesso a página de extrato
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);
        cy.visit('/bank-statement');

        // Então o saldo exibido deve ser igual ao esperado
        cy.get('#textBalanceAvailable').contains('R$ 1.300,00').should('exist');

        // E o histórico de transferências deve conter a transferência recebida
        cy.get('p').contains('Transferência recebida').should('exist');

        // E o valor da transferência recebida deve estar formatado corretamente
        cy.get('p').contains('Transferência recebida').parents().its(1).within(() => {
            cy.get('#textTransferValue').contains('R$ 300,00').should('exist');
        })
    })

    it('CT-05: Validar transferência recebida: conta sem saldo', () => {
        // Dado que eu possuo duas contas cadastras
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', false);
        cy.cadastrarUsuario(dados['user_secundario'], 'user_secundario', true);

        // E que eu recebo uma transferência com sucesso da outra conta
        cy.fazerLogin(dados['user_secundario']['email'], dados['user_secundario']['senha']);
        cy.get('@user_primario_numero').then((numero) => {
            cy.get('@user_primario_digito').then((digito) => {
                cy.enviarTransferencia(numero, digito, 300);
            })
        })

        // Quando eu acesso a página de extrato
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);
        cy.visit('/bank-statement');

        // Então o saldo exibido deve ser igual ao esperado
        cy.get('#textBalanceAvailable').contains('R$ 300,00').should('exist');

        // E o histórico de transferências deve conter a transferência recebida
        cy.get('p').contains('Transferência recebida').should('exist');

        // E o valor da transferência recebida deve estar formatado corretamente
        cy.get('p').contains('Transferência recebida').parents().its(1).within(() => {
            cy.get('#textTransferValue').contains('R$ 300,00').should('exist');
        })
    })
})