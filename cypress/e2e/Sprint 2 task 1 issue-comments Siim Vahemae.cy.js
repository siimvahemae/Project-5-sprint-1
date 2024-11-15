
import { faker } from '@faker-js/faker';

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]')
    const getIssueComment = () => cy.get('[data-testid="issue-comment"]')
    const getConfirmModal = () => cy.get('[data-testid="modal:confirm"]')
    const getTextArea  = () => cy.get('textarea[placeholder="Add a comment..."]')
    const deletionWarningHeadline = "Are you sure you want to delete this comment?"
    const deletionWarningText = "Once you delete, it's gone for good"
    const commentPrevious = 'An old silent pond...'
    const commentFresh = faker.lorem.text()
    const commentEdited = faker.lorem.lines(3)

    // Sorry for not using ; . They are not essential :)

    it('Should create, edit and delete a comment successfully', () => {

        // Should create, fresh, comment nr 2, before 'An old silent pond...'

        getIssueDetailsModal().within(() => {
            getIssueComment().should('contain', commentPrevious)
            cy.contains('Add a comment...')
                .click()

            getTextArea().type(commentFresh)

            cy.contains('button', 'Save')
                .click()
                .should('not.exist')

            cy.contains('Add a comment...').should('exist')
            getIssueComment().should('contain', commentFresh)
            getIssueComment().should('contain', commentPrevious)
        })

        // Should edit freshly added comment

        getIssueDetailsModal().within(() => {
            getIssueComment()
                .first()
                .contains('Edit')
                .click()
                .should('not.exist')

            getTextArea()
                .should('contain', commentFresh)
                .clear()
                .type(commentEdited)

            cy.contains('button', 'Save')
                .click()
                .should('not.exist')

            getIssueComment()
                .should('contain', 'Edit')
                .and('contain', commentEdited)
                .and('contain', commentPrevious)
        })

        // Should delete edited comment

        getIssueDetailsModal().within(() => {
            getIssueComment()
            .should('contain', commentEdited)
            .contains('Delete')
            .click()
        })

        getConfirmModal().should('be.visible')

        getConfirmModal().within(() => {
            cy.contains(deletionWarningHeadline).should('be.visible')
            cy.contains(deletionWarningText).should('be.visible')
            cy.contains('Delete comment').should('be.visible').click()
        })

        getConfirmModal().should('not.exist')

        getIssueDetailsModal().should('be.visible')

        getIssueDetailsModal().within(() => {
            getIssueComment().should('not.contain', commentEdited)
            getIssueComment().should('contain', commentPrevious)

        })
    })
})
