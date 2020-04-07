describe('frontpage', () => {
  it('should close the welcome popup', () => {
    cy.get('.Toastify__close-button').click();
    cy.get('.Toastify__close-button').should('not.exist');
  });

  it('should close the new version popup', () => {
    cy.get('.close').click();
    cy.get('.close').should('not.exist');
  });

  it('should be able to change semester', () => {
    cy.get('.selection').click();
    cy.get('.selection > .visible > :nth-child(2)').should('contain', 'semester');
    cy.get('.selection > .visible > :nth-child(2)').click();
    cy.get('div.text').should('contain', 'Abdomen');
    cy.get('div.text').should('not.contain', 'Inflammation');
  });
});
