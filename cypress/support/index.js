// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

describe('initial load', () => {
  it('should open the frontpage', () => {
    cy.visit('/');
  });

  it('should close the welcome popup', () => {
    cy.get('.Toastify__close-button').click();
    cy.get('.Toastify__close-button').should('not.exist');
  });

  it('should close the new version popup', () => {
    cy.get('.close').click();
    cy.get('.close').should('not.exist');
  });
});
