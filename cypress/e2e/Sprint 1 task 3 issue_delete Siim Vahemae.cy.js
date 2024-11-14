
const trashButton = '[data-testid="icon:trash"]';
const closeButton = '[data-testid="icon:close"]';
const confirmModal = '[data-testid="modal:confirm"]';
const Title = "This is an issue of type: Task.";
const deletionWarningHeadline = "Are you sure you want to delete this issue?";
const deletionWarningText = "Once you delete, it's gone for good";
const issuesAfterDeleting = 3;
const issuesAfterNOTdeleting = 4;

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