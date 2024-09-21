Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
  cy.get('[name="firstName"]').type('Ítalo');
  cy.get('[name="lastName"]').type('Costa');
  cy.get('#email').type('italocosta.mateus@gmail.com');
  cy.get('[name="open-text-area"]').type('Uma ajudinha por favor.');

  cy.contains('button', 'Enviar').click();
});

Cypress.Commands.add('selectProductByText', (selector, value) => {
  cy.get(selector).select(value).should('have.value', value);
});
