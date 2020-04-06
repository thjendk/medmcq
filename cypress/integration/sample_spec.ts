describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(true);
  });
});

describe('My First Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('https://example.cypress.io');
  });
});

describe('My First Test', function() {
  it('clicks the link "type"', function() {
    cy.visit('https://example.cypress.io');

    cy.contains('type').click();
  });
});
