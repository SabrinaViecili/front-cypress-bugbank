/// <reference types="Cypress" />
import dados from '../../fixtures/login.json'

describe('ST-1: Login', () => {

  beforeEach(() => {
    // Dado que eu acesso a página de login
    cy.visit('/')

    // Localização dos campos do form de login
    cy.carregarFormLogin();
  })

  it('CT-01: Validar obrigatoriedade do email', () => {
    const senha = dados['user_padrao']['senha'];

    // Quando eu deixo o campo de e-mail em branco no form de login
    cy.get('@campoSenhaLogin').type(senha);

    // E eu clico no botão [Acessar]
    cy.get('button').contains('Acessar').click();

    // Então a mensagem "É campo obrigatório" deve ser exibida
    cy.get('p').contains('É campo obrigatório').should('exist');

    // E não devo ser direcionado para a home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  })

  it('CT-02: Validar obrigatoriedade de senha', () => {
    const email = dados['user_padrao']['email'];

    // Quando eu deixo o campo de senha em branco no form de login
    cy.get('@campoEmailLogin').type(email);

    // E eu clico no botão [Acessar]
    cy.get('button').contains('Acessar').click();  
    
    // Então a mensagem "É campo obrigatório" deve ser exibida
    cy.get('p').contains('É campo obrigatório').should('exist');
    
    // E não devo ser direcionado para a home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
  })

  it('CT-03: Validar e-mail inválido', () => {
    const emails = dados['emails_invalidos'];
    const senha = dados['user_padrao']['senha'];
    
    emails.forEach((email) =>{
      // Quando eu preencho o campo de email com um email não cadastrado
      cy.get('@campoEmailLogin').clear().type(email);

      cy.get('@campoSenhaLogin').type(senha);

      // E eu clico no botão [Acessar]
      cy.get('button').contains('Acessar').click();
      
      // Então a mensagem "Formato inválido" deve ser exibida
      cy.get('p').contains('Formato inválido').should('exist');

      // E não devo ser direcionado para a home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    })
  })

  it('CT-04: Validar email não cadastrado', () => {
    const email = dados['user_nao_cadastrado']['email'];
    const senha = dados['user_nao_cadastrado']['senha'];

    // Quando eu preencho o campo de email com um email não cadastrado
    cy.get('@campoEmailLogin').type(email);
    cy.get('@campoSenhaLogin').type(senha);

    // E eu clico no botão [Acessar]
    cy.get('button').contains('Acessar').click();

    // Então a mensagem "Usuário ou senha inválido" deve ser exibida
    cy.get('p').contains('Usuário ou senha inválido').should('exist');

    // E não devo ser direcionado para a home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  })

  it('CT-05: Validar senha incorreta', () => {
    // Dado que eu possuo um email cadastrado
    cy.cadastrarUsuario(dados['user_padrao'], 'user_padrao');

    // Quando eu preencho o campo de email com o meu email cadastrado
    cy.get('@campoEmailLogin').type(dados['user_padrao']['email']);

    // E eu preencho o campo de email com a senha incorreta
    cy.get('@campoSenhaLogin').type(dados['user_padrao']['senha'] + '!!');

    // E eu clico no botão [Acessar]
    cy.get('button').contains('Acessar').click();

    // Então a mensagem "Usuário ou senha inválido" deve ser exibida
    cy.get('p').contains('Usuário ou senha inválido').should('exist');

    // E não devo ser direcionado para a home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  })

  it('CT-06: Validar login com sucesso', () => {
    // Dado que eu possuo um email cadastrado
    cy.cadastrarUsuario(dados['user_padrao'], 'user_padrao');

    // Quando eu preencho o campo de email com o email cadastrado
    cy.get('@campoEmailLogin').type(dados['user_padrao']['email']);

    // E eu preencho o campo de senha com a senha correta
    cy.get('@campoSenhaLogin').type(dados['user_padrao']['senha']);

    // E eu clico no botão [Acessar]
    cy.get('button').contains('Acessar').click();

    // Então eu devo ser direcionado para a home como usuário logado
    cy.url().should('eq', Cypress.config().baseUrl + '/home');
  })

})