
import { faker } from '@faker-js/faker';

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });


    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]') // Issue details modal.
    const getPlaceholderNumber = () => cy.get('[placeholder="Number"]')
    const estimatedHours1 =  faker.number.int({ min: 9, max: 14 })
    const estimatedHours2 =  faker.number.int({ min: 15, max: 18 })
    const getIconStopWatch = () => cy.get('[data-testid="icon:stopwatch"]')
    const getModalTracking = () => cy.get('[data-testid="modal:tracking"]') // Time tracking modal.

    // Sorry about not using ; . They are not essential :)
    

    it("Should add, edit and remove time estimation successfully in issue details modal", () => {
        
        getIssueDetailsModal().should("be.visible")
        
        getIssueDetailsModal().within(() => {
            cy.contains("4h logged").should("be.visible")
            cy.contains("8h estimated").should("be.visible")
            getPlaceholderNumber().should("be.visible").should("have.value", "8")
                .click()
                .clear()
                .type(estimatedHours1)
                cy.contains("4h logged").should("be.visible")
                cy.contains(estimatedHours1 + "h estimated").should("be.visible")
            getPlaceholderNumber().should("be.visible").should("have.value", estimatedHours1)
                .click()
                .clear()
                .type(estimatedHours2)
                cy.contains("4h logged").should("be.visible")
                cy.contains(estimatedHours2 + "h estimated").should("be.visible")
            getPlaceholderNumber().should("be.visible").should("have.value", estimatedHours2)
                .click()
                .type("{backspace}")
                .type("{backspace}")
            getPlaceholderNumber().should("be.visible").should("have.value", "")
            cy.contains("4h logged").should("be.visible")
            cy.contains(estimatedHours2 + "h estimated").should("not.exist")
        });
    });


    it("Should test time logging functionality in both modals", () => {

        getIssueDetailsModal().should("be.visible")

        // Testing in time tracking modal.

        getIconStopWatch().click()

            getModalTracking().within(() => {
                cy.contains("4h logged").should("be.visible")
                cy.contains("8h estimated").should("be.visible")
                getPlaceholderNumber().first().should("be.visible").should("have.value", "4")
                    .click()
                    .clear()
                    .type(estimatedHours1)
                getPlaceholderNumber().last().should("be.visible").should("have.value", "")
                    .click()
                    .clear()
                    .type(estimatedHours2)
                getPlaceholderNumber().first().should("be.visible").should("have.value", estimatedHours1)
                getPlaceholderNumber().last().should("be.visible").should("have.value", estimatedHours2)
                cy.contains(estimatedHours1 + "h logged").should("be.visible")
                cy.contains(estimatedHours2 + "h remaining").should("be.visible")
                cy.contains("button", "Done")
                .click()
        });

        getModalTracking().should("not.exist")

        getIssueDetailsModal().should("be.visible")
        
        // Testing in issue details modal, if numbers are changed and correct there.

            getIssueDetailsModal().within(() => {
                cy.contains(estimatedHours1 + "h logged").should("be.visible")
                cy.contains(estimatedHours2 + "h remaining").should("be.visible")
        });

        // Testing in time tracking modal, if numbers are still correct there.

        getIconStopWatch().click()

            getModalTracking().within(() => {
                cy.contains(estimatedHours1 + "h logged").should("be.visible")
                cy.contains(estimatedHours2 + "h remaining").should("be.visible")
                getPlaceholderNumber().first().should("be.visible").should("have.value", estimatedHours1)
                getPlaceholderNumber().last().should("be.visible").should("have.value", estimatedHours2)
                cy.get('[data-testid="icon:close"]').click()
        });

        getModalTracking().should("not.exist")

        getIssueDetailsModal().should("be.visible")

    });
});
