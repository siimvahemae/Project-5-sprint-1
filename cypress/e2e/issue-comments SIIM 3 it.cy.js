
import { faker } from '@faker-js/faker';

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });


    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]'); //SUUR MODAL
    const getIssueComment = () => cy.get('[data-testid="issue-comment"]'); // KOMMENTAARI ALA
    const getConfirmModal = () => cy.get('[data-testid="modal:confirm"]'); // KUSTUTAMINE
    const getTextArea  = () => cy.get('textarea[placeholder="Add a comment..."]');

    it.only('Should create a comment successfully', () => {
        
        const comment = faker.lorem.text();   

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            getTextArea().type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            getIssueComment().should('contain', comment);
            
        });
    });

    it('Should edit a comment successfully', () => {

        const oldComment = 'An old silent pond...';
        const newComment = faker.lorem.lines(3);

        getIssueDetailsModal().within(() => {
            getIssueComment()
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            getTextArea()
                .should('contain', oldComment)
                .clear()
                .type(newComment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            getIssueComment()
                .should('contain', 'Edit')
                .and('contain', newComment);
        });
    });



    it('Should delete a comment successfully', () => {

        const oldComment = 'An old silent pond...';
        const deletionWarningHeadline = "Are you sure you want to delete this comment?";
        const deletionWarningText = "Once you delete, it's gone for good";
        
        getIssueDetailsModal().within(() => {
            getIssueComment()
            .should('contain', oldComment)
            .contains('Delete')
            .click();
        });

        getConfirmModal().should('be.visible');

        getConfirmModal().within(() => {
            cy.contains(deletionWarningHeadline).should('be.visible');
            cy.contains(deletionWarningText).should('be.visible');
            cy.contains('Delete comment').should('be.visible').click();
        });

        getConfirmModal().should('not.exist');

        getIssueDetailsModal().should('be.visible');

        getIssueDetailsModal().within(() => {
            getIssueComment().should('not.exist'); // in case of one comment
            //getIssueComment().should("not.contain", oldComment); // in case of several comments. But it is impossible to test.
        });
    });
});
