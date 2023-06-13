/// <reference types="Cypress" />
import dados from '../../fixtures/home.json'

describe('ST-5: Home', () => {

    it('CT-01: Validar saldo zero', () => {
        // Dado que eu estou logado como um usuário sem saldo
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', false);
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);

        // Quando eu acesso a página de home
        cy.visit('/home');

        // Então o saldo exibido na home deve ser igual a R$ 0,00
        cy.get('#textBalance > span').contains('R$ 0,00').should('exist');
    })

    it('CT-02: Validar saldo positivo', () => {
        // Dado que eu estou logado como um usuário com saldo
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario', true);
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);

        // Quando eu acesso a página de home
        cy.visit('/home');

        // Então o saldo exibido na home deve ser igual a R$ 1.000,00
        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');
    })

    it('CT-04: Validar exibição do número da conta', () => {
        // Dado que eu estou logado como um usuário válido
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario');
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);

        // Quando eu acesso a página de home
        cy.visit('/home');

        // Então o número da conta correto deve ser exibido na barra lateral
        cy.get('@user_primario_numero').then((numero) => {
            cy.get('@user_primario_digito').then((digito) => {
                cy.get('#textAccountNumber > span').contains(`${numero}-${digito}`).should('exist');
            })
        })
    })

    it('CT-05: Validar direcionamento do link para transferência', () => {
        // Dado que eu estou logado como um usuário válido
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario');
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);

        // Quando eu acesso a página de home
        cy.visit('/home');

        // E eu clico no botão [Transferência]
        cy.get('#btn-TRANSFERÊNCIA').click();

        // Então eu devo ser direcionado para a página de transferência
        cy.url().should('eq', Cypress.config().baseUrl + '/transfer');
    })

    it('CT-06: Validar direcionamento do link para extrato', () => {
        // Dado que eu estou logado como um usuário válido
        cy.cadastrarUsuario(dados['user_primario'], 'user_primario');
        cy.fazerLogin(dados['user_primario']['email'], dados['user_primario']['senha']);

        // Quando eu acesso a página de home
        cy.visit('/home');

        // E eu clico no botão [Extrato]
        cy.get('#btn-EXTRATO').click();

        // Então eu devo ser direcionado para a página de extrato
        cy.url().should('eq', Cypress.config().baseUrl + '/bank-statement');
    })
})