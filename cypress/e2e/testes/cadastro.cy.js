/// <reference types="Cypress" />
import dados from '../../fixtures/cadastro.json'

describe('ST-2: Cadastro', () => {
    
    beforeEach(() => {
        // Dado que eu acesso a página de cadastro
        cy.visit('/');
        cy.get('button').contains('Registrar').click();

        // Localização dos campos do form de cadastro
        cy.carregarFormCadastro();
    })

    it('CT-01: Validar obrigatoriedade do nome', () => {
        const email = dados['user_padrao']['email'];
        const senha = dados['user_padrao']['senha'];

        // Quando eu deixo o campo de nome em branco no form de cadastro
        cy.get('@campoEmailCadastro').type(email, {force: true});
        cy.get('@campoSenhaCadastro').type(senha, {force: true});
        cy.get('@campoConfirmacaoCadastro').type(senha, {force: true});
        
        // E eu clico no botão [Cadastrar]
        cy.get('button').contains('Cadastrar').click({force: true});

        // Então a mensagem "Nome não pode ser vazio" deve ser exibida
        cy.get('p').contains('Nome não pode ser vazio').should('exist');

        // E o cadastro não deve ser realizado
        cy.get('p')
          .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'))
          .should('not.exist')
    })

    it('CT-02: Validar obrigatoriedade do email', () => {
        const nome = dados['user_padrao']['nome'];
        const senha = dados['user_padrao']['senha'];

        // Quando eu deixo o campo de email em branco no form de cadastro
        cy.get('@campoNomeCadastro').type(nome, {force: true});
        cy.get('@campoSenhaCadastro').type(senha, {force: true});
        cy.get('@campoConfirmacaoCadastro').type(senha, {force: true});

        // E eu clico no botão [Cadastrar]
        cy.get('button').contains('Cadastrar').click({force: true});

        // Então a mensagem "É campo obrigatório" deve ser exibida
        cy.get('p').contains('É campo obrigatório').should('exist');

        // E o cadastro não deve ser realizado
        cy.get('p')
          .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'))
          .should('not.exist')
    })

    it('CT-03: Validar email inválido', () => {
        const nome = dados['user_padrao']['nome'];
        const senha = dados['user_padrao']['senha'];

        dados['emails_invalidos'].forEach( (email) => {
            // Quando eu preencho o campo de email com um email inválido
            cy.get('@campoEmailCadastro').clear({force: true}).type(email, {force: true});
            cy.get('@campoNomeCadastro').clear({force: true}).type(nome, {force: true});
            cy.get('@campoSenhaCadastro').clear({force: true}).type(senha, {force: true});
            cy.get('@campoConfirmacaoCadastro').clear({force: true}).type(senha, {force: true});

            // E eu clico no botão [Cadastrar]
            cy.get('button').contains('Cadastrar').click({force: true});

            // Então a mensagem "Formato inválido" deve ser exibida
            cy.get('p').contains('Formato inválido').should('exist');

            // E o cadastro não deve ser realizado
            cy.get('p')
              .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'))
              .should('not.exist');
            
        })  
    })

    it('CT-04: Validar obrigatoriedade da senha', () => {
        const email = dados['user_padrao']['email'];
        const nome = dados['user_padrao']['nome'];
        const confirmacao = dados['user_padrao']['senha'];

        // Quando eu deixo o campo de senha em branco no form de cadastro
        cy.get('@campoEmailCadastro').type(email, {force: true});
        cy.get('@campoNomeCadastro').type(nome, {force: true});
        cy.get('@campoConfirmacaoCadastro').type(confirmacao, {force: true});

        // E eu clico no botão [Cadastrar]
        cy.get('button').contains('Cadastrar').click({force: true});

        // Então a mensagem "É campo obrigatório" deve ser exibida
        cy.get('p').contains('É campo obrigatório').should('exist');

        // E o cadastro não deve ser realizado
        cy.get('p')
          .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'))
          .should('not.exist')
    })

    it('CT-05: Validar obrigatoriedade da confirmação de senha', () => {
        const email = dados['user_padrao']['email'];
        const nome = dados['user_padrao']['nome'];
        const senha = dados['user_padrao']['senha'];

        // Quando eu deixo o campo de confirmação de senha em branco no form de cadastro
        cy.get('@campoEmailCadastro').type(email, {force: true});
        cy.get('@campoNomeCadastro').type(nome, {force: true});
        cy.get('@campoSenhaCadastro').type(senha, {force: true});

        // E eu clico no botão [Cadastrar]
        cy.get('button').contains('Cadastrar').click({force: true});

        // Então a mensagem "É campo obrigatório" deve ser exibida
        cy.get('p').contains('É campo obrigatório').should('exist');

        // E o cadastro não deve ser realizado
        cy.get('p')
          .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'))
          .should('not.exist');
    })

    it('CT-06: Validar igualdade entre senha e confirmação de senha', () => {
        const email = dados['user_padrao']['email'];
        const nome = dados['user_padrao']['nome'];
        const senha = dados['user_padrao']['senha'];
        const confirmacao = dados['user_padrao']['senha'] + '!!';

        // Quando eu preencho os campos de senha e confirmação com senhas diferentes
        cy.get('@campoEmailCadastro').type(email, {force: true});
        cy.get('@campoNomeCadastro').type(nome, {force: true});
        cy.get('@campoSenhaCadastro').type(senha, {force: true});
        cy.get('@campoConfirmacaoCadastro').type(confirmacao, {force: true});

        // E eu clico no botão [Cadastrar]
        cy.get('button').contains('Cadastrar').click({force: true});

        // Então a mensagem "As senhas não são iguais" deve ser exibida
        cy.get('p').contains('As senhas não são iguais').should('exist');

        // E o cadastro não deve ser realizado
        cy.get('p')
          .contains('/A conta \d+-\d+ foi criada com sucesso/')
          .should('not.exist');
    })

    it('CT-07: Validar criação de conta com saldo', () => {
        const email = dados['user_padrao']['email'];
        const nome = dados['user_padrao']['nome'];
        const senha = dados['user_padrao']['senha'];

        // Quando eu preencho todos os campos com dados válidos
        cy.get('@campoEmailCadastro').type(email, {force: true});
        cy.get('@campoNomeCadastro').type(nome, {force: true});
        cy.get('@campoSenhaCadastro').type(senha, {force: true});
        cy.get('@campoConfirmacaoCadastro').type(senha, {force: true});

        // E eu seleciono a opção de criar conta com saldo
        cy.get('@toggleSaldoCadastro').click({force: true});

        // E eu clico no botão [Cadastrar]
        cy.get('button').contains('Cadastrar').click({force: true});

        // Então o cadastro deve ser realizado
        cy.get('p')
          .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'))
          .should('exist');

        // E o saldo da conta deve ser igual a R$ 1.000,00
        cy.fazerLogin(dados['user_padrao']['email'], dados['user_padrao']['senha']);

        cy.get('#textBalance > span').contains('R$ 1.000,00').should('exist');
    })

    it('CT-08: Validar criação de conta sem saldo', () => {
        const email = dados['user_padrao']['email'];
        const nome = dados['user_padrao']['nome'];
        const senha = dados['user_padrao']['senha'];

        // Quando eu preencho todos os campos com dados válidos
        cy.get('@campoEmailCadastro').type(email, {force: true});
        cy.get('@campoNomeCadastro').type(nome, {force: true});
        cy.get('@campoSenhaCadastro').type(senha, {force: true});
        cy.get('@campoConfirmacaoCadastro').type(senha, {force: true});

        // E eu não seleciono a opção de criar conta com saldo

        // E eu clico no botão [Cadastrar]
        cy.get('button').contains('Cadastrar').click({force: true});

        // Então o cadastro deve ser realizado
        cy.get('p')
          .contains(new RegExp('^A conta \\d+-\\d+ foi criada com sucesso$'))
          .should('exist');

        // E o saldo da conta deve ser igual a R$ 0,00
        cy.fazerLogin(dados['user_padrao']['email'], dados['user_padrao']['senha']);

        cy.get('#textBalance > span').contains('R$ 0,00').should('exist');
    })
})