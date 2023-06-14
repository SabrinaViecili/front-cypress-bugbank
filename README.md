# cypress-bugbank
 Esse é um projeto de testes front-end do site bugbank utilizando Cypress.
 Para navegar na aplicação basta acessar: https://bugbank.netlify.app/

 ## Pré-requisitos

Para executar esse projeto é necessário:

- git
- Node.js
- NPM
- Editor de texto

## Instalação das dependências de desenvolvimento

Uma vez que todas as dependências já estão listadas no arquivo `package.json`, basta executar o comando `npm install` na raiz do projeto.

## Execução do projeto

`npm run test` - executa o Cypress em modo headless

`npx cypress open`- executa o modo interativo do Cypress

## A tela gráfica do cypress será aberta:
<img width="627" alt="abrircypress" src="https://user-images.githubusercontent.com/71040642/232140210-a9ed78c2-e96d-42ee-a083-9a335df9b8f6.png">
<br>
* Nessa aba mostrada acima, após clicar em E2E testing, deve escolher um navegador. Para os meus testes usei o Chrome.
<br>
<br>
* Quando um navegador for escolhido será aberto outra tela, possuindo as especs dos testes:
<br>
<img width="521" alt="specs" src="https://user-images.githubusercontent.com/71040642/232141098-ed7e0f88-44d2-467b-97e8-6088884f4f54.png">
<br>
<br>
* É só selecionar a spec desejada que o teste será rodado com sucesso.

## Arquitetura

Esse projeto foi contruído com a arquitetura comum de testes front-end e explorando os recursos do Cypress. A estrutura do projeto é a seguinte:

`cenarios` - arquivos csv com os possiveis cenarios de testes mapeados, assim como possiveis bugs e melhorias;


`integration e2e` - arquivos de teste (separados em subpastas que representam os endpoints) - Utilizada para os arquivos de testes;

`fixtures` - Utilizado para os arquivos de dados fixos, como mocks que serão usados ​​nos testes;

`support/requests` - arquivos com os métodos de request. Todos esses arquivos são adicionados ao `index.js` e os métodos de request são comandos customizados do Cypress (tornam-se acessíveis através do objeto `cy` em qualquer contexto de teste do projeto);

`support/schemas` - Utilizada para arquivos de importação e comandos personalizados que podemos criar dentro do Cypress;




