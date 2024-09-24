/// <reference types="Cypress" />

describe('Central de Atendimento ao CLiente TAT', () => {
  const THREE_SECONDS_IN_MS = 3000;

  beforeEach(() => {
    cy.visit('src/index.html');
  });

  it('Vefificar Título CAC TAT', () => {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT');
  });

  it('Preencher campos obrigatórios e enviar formulário', () => {
    cy.clock();
    cy.get('[name="firstName"]').type('Ítalo');
    cy.get('[name="lastName"]').type('Costa');
    cy.get('#email').type('italocosta.mateus@gmail.com');
    cy.get('[name="open-text-area"]').type('Uma ajudinha por favor.');

    cy.contains('button', 'Enviar').click();

    cy.get('.success').should('be.visible');
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get('.success').should('not.be.visible');
  });

  it('Exibir mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock();
    cy.get('[name="firstName"]').type('Ítalo');
    cy.get('[name="lastName"]').type('Costa');
    cy.get('#email').type('italocosta.mateus.com');
    cy.get('[name="open-text-area"]').type('Uma ajudinha por favor.', {
      delay: 0,
    });

    cy.contains('button', 'Enviar').click();

    cy.get('.error').should('be.visible');
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get('.error').should('not.be.visible');
  });

  it('Validar se campo telefone só aceita números', () => {
    cy.get('#phone').type('Teste texto').should('have.value', '');
  });

  it('Exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock();
    cy.get('[name="firstName"]').type('Ítalo');
    cy.get('[name="lastName"]').type('Costa');
    cy.get('#email').type('italocosta.mateus@gmail.com');
    cy.get('#phone-checkbox').check().should('be.checked');
    cy.get('[name="open-text-area"]').type('Uma ajudinha por favor.');

    cy.contains('button', 'Enviar').click();

    cy.get('.error').should('be.visible');
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get('.error').should('not.be.visible');
  });

  it('Preencher e limpar os camos nome, sobrenome, email e telefone', () => {
    cy.get('[name="firstName"]')
      .type('Ítalo')
      .should('have.value', 'Ítalo')
      .clear()
      .should('have.value', '');
    cy.get('[name="lastName"]')
      .type('Costa')
      .should('have.value', 'Costa')
      .clear()
      .should('have.value', '');
    cy.get('#email')
      .type('italocosta.mateus@gmail.com')
      .should('have.value', 'italocosta.mateus@gmail.com')
      .clear()
      .should('have.value', '');
    cy.get('#phone')
      .type('98981993759')
      .should('have.value', '98981993759')
      .clear()
      .should('have.value', '');
  });

  it('Exibir mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock();
    cy.contains('button', 'Enviar').click();

    cy.get('.error').should('be.visible');
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get('.error').should('not.be.visible');
  });

  it('Enviar o formulário com sucesso utilizando comandos customizados', () => {
    cy.fillMandatoryFieldsAndSubmit();

    cy.get('.success').should('be.visible');
  });

  it('Selecionar um produto por seu texto', () => {
    cy.selectProductByText('#product', 'youtube');
    cy.selectProductByText('#product', 'mentoria');
    cy.selectProductByText('#product', 'blog');
  });

  it('Marcar o tipo de atendimento "Feedback"', () => {
    cy.get('input[value="feedback"]').should('have.value', 'feedback');
  });

  it('Marcar cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(($radio) => {
        cy.wrap($radio).check().should('be.checked');
      });
  });

  it('Marcar ambos checkboxers, depois desmarcar o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked');
  });

  it('Selecionar um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json')
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('Selecionar um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('Selecionar um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile');
    cy.get('input[type="file"]#file-upload')
      .selectFile('@sampleFile', { action: 'drag-drop' })
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('Verificar que a política de privacidade abre em outra aba sem a necessidade de um click', () => {
    cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank');
  });

  it('Acessar a página de Política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a[href="privacy.html"]')
      .invoke('removeAttr', 'target')
      .should('not.have.attr', 'target');

    cy.get('a[href="privacy.html"]').click();
    cy.contains('Talking About Testing').should('be.visible');
  });

  it('Exibir e esconder as mensagens de sucesso e erro usando o .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible');

    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible');
  });

  it('Preencher a área de texto utilizando o comando .invoke()', () => {
    const longText = Cypress._.repeat('TextoTextoTexto', 100);

    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText);
  });

  it('Fazer um requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').then(
      (response) => {
        const { status, statusText, body } = response;
        expect(status).to.eq(200);
        expect(statusText).to.eq('OK');
        expect(body).to.include('CAC TAT');
      },
    );
  });

  it.only('Encontrar ícone de gato', () => {
    cy.get('#cat').should('not.be.visible').invoke('show').should('be.visible');
  });
});
