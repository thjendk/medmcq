describe('quiz, not logged in', () => {
  it('should be able to load 20 questions', () => {
    cy.contains('20').click();
    cy.contains('Start!').click();
    cy.url().should('include', '/quiz');
    cy.get('.top-nav > .ui > .header').should('contain', 20);
  });

  it('should be able to answer questions', () => {
    cy.get(':nth-child(2) > .fluid > :nth-child(3)').click();
    cy.get('.top-nav > .ui > :nth-child(3)').click();
    cy.get('.column > :nth-child(2) > .fluid > :nth-child(1)').click();
    cy.get('.top-nav > .ui > :nth-child(3)').click();
    cy.get('.fluid > :nth-child(5)').click();
    cy.get('.header > div').should('contain', 3);
  });

  it('should be able to open public comments', () => {
    cy.contains('offentlig').click();
    cy.contains('Skjul').should('exist');
    cy.contains('privat').should('not.exist');
  });

  it('should not be able to vote for tags, when not logged in', () => {
    cy.get('.ui > Icon > .up').should('not.exist');
    cy.get('.ui > Icon > .down').should('not.exist');
  });
});
