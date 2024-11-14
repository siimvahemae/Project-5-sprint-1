// SELECTORS
// 1.ID - #elementId, #secrets ('#username')
// 2.class - .elementClass, .submit_button - ('.ql-editor'), ('.submit_button')
// 2a kuulub kahte klassi -.someOtherClass.submit_Button 
// 3.Tag Selectors - div, span, H1, H2 (titles) - ('h2')
// 4.Attributes - [type="text"], [href="/home"], [name="username"] - ('input[name="title"]'), ('[name="confirm"]')
// 5.Data Attribute Selectors - [data-cy="button-confirm"]
// 6.Combinator Selectors -  div > p, div + p, div ~ p
// 7. XPath Selectors - //div[@id='elementId'

// VARIABLES
// const trashButton = '[data-testid="icon:trash"]';
// const deletionWarningText = "Once you delete, it's gone for good";
// const issuesAfterDeleting = 3;
// let.....
// const randomSentence = faker.lorem.lines(1);  // Näidises oli let
// const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

// CYS
// cy.get('[data-testid="modal:issue-details"]').should("be.visible");
// cy.get(trashButton).should("be.visible").click();
// cy.contains("Delete issue").should("be.visible").click();
// cy.reload();
// cy.contains('button', 'Save')
//  .click()
//  .should('not.exist');
// cy.contains('Add a comment...').should('exist');
// cy.get('[data-testid="issue-comment"]').should('contain', comment);
// cy.get('[data-testid="issue-comment"]')
//  .should('contain', 'Edit')
//  .and('contain', comment);

// WITHIN
// cy.get(confirmModal).within(() => {
    //cy.contains(deletionWarningHeadline).should("be.visible");
    //cy.contains(deletionWarningText).should("be.visible");
    //cy.contains("Delete issue").should("be.visible").click();
  //});


// - SCROLLING
// cy.window().scrollTo('bottom')
// cy.get('#username').scrollIntoView()

// - CLEARING THE FIELD
// cy.get('#username').clear()
// cy.get('[name="title"]').clear().type('New Title');

// - CLICKING ON THE FIELD
// .click()
// cy.get('h2').contains('Password').click()

// - TYPING
// .type('johnDoe')
// .type('{enter}')


// ASSERTIONS
// should("be.visible");
// should('not.be.visible')
// should("not.exist");
// should("have.length",issuesAfterDeleting);
// should('be.enabled')
// should('be.disabled')
// should('have.css', 'display', 'none')
// should("be.visible").click();
// should('have.text', randomSentence);
// .should('have.value', randomWord);
// should('contain', 'This field is required');


// Asserting that Submit button is disabled
// cy.get('.submit_button').should('be.disabled')

// Assert that success message is not visible
// cy.get('#success_message').should('not.be.visible')

// How we can check from html code, that phone number should contain only numbers
// cy.get('[data-testid="phoneNumberTestId"]').should('have.attr', 'type', 'number')

// There are 2 options how to check error message visibility: using CSS or simply be.visible
// none = not visible; block = visible
// cy.get('#input_error_message').should('be.visible')
// cy.get('#input_error_message').should('have.css', 'display', 'block')

// Assert that correct error message is visible and contain given text
// cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')

// Assert that username has tooltip with error message
// cy.get('input[name="username"]').should('have.attr', 'title').should('contain', 'Input field')

// Assert that password error message is visible, and message should contain 'Passwords do not match!
// cy.get('#password_error_message').should('be.visible').should('contain', 'Passwords do not match!')

// Assert than only one list with name Backlog is visible and do steps inside of it
// cy.get('[data-testid="board-list:backlog"]')
  // .should('be.visible')
  // .and('have.length', '1')
  // .within(() => {
    // Assert that this list contains 5 issues and first element with tag p has specified text
    // cy.get('[data-testid="list-issue"]')
      // .should('have.length', '5')
      // .first()
      // .find('p')
      // .contains('Bug')
      // .siblings()
      // .within(() => {
        // Assert that correct avatar and type icon are visible
        // cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        // cy.get('[data-testid="icon:bug"]').should('be.visible');



// VARIA

// cy.log('Username will be filled')?? function reg form 2 project 4

// .wait(1000).trigger('mouseover').trigger('click');  1000ms = 1s

// it.skip('Should validate title is required field if missing', () => {

// it.only('Should validate title is required field if missing', () => {
  


// FAKER

// npm install @faker-js/faker --save-dev
// import { faker } from '@faker-js/faker';




// npx cypress open




describe("Issue deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(Title).click();
      });

  });

  it("Deleting an issue and validate deletion", () => { 

    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get(trashButton).should("be.visible").click();
    cy.get(confirmModal).should("be.visible");
    cy.get(confirmModal).within(() => {
      cy.contains(deletionWarningHeadline).should("be.visible");
      cy.contains(deletionWarningText).should("be.visible");
      cy.contains("Delete issue").should("be.visible").click();
    });
    cy.get(confirmModal).should("not.exist");
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(Title).should("not.exist");
      cy.get('[data-testid="list-issue"]').should("have.length",issuesAfterDeleting);
    });
  });

  it("Canceling deletion an issue and validating it", () => {
    
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get(trashButton).should("be.visible").click();
    cy.get(confirmModal).should("be.visible");
    cy.get(confirmModal).within(() => {
      cy.contains(deletionWarningHeadline).should("be.visible");
      cy.contains(deletionWarningText).should("be.visible");
      cy.contains("Cancel").should("be.visible").click();
    });
    cy.get(confirmModal).should("not.exist");
    cy.get(closeButton).first().click();  
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(Title).should("be.visible");
      cy.get('[data-testid="list-issue"]').should("have.length",issuesAfterNOTdeleting);
    });
  });
});