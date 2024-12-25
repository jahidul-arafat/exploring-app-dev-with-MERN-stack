// for jest
import request from 'supertest';
import app from "./app.js";

// Create a test suite for the Ski Dictionary API
/*

This test suite now covers all the main API endpoints:

1. GET /dictionary: Checks if it returns an array of terms.
2. POST /dictionary: Tests adding a new term.
3. PUT /dictionary/:term: Tests updating an existing term.
4. DELETE /dictionary/:term: Tests deleting an existing term.
5. PUT /dictionary/:term (error case): Tests updating a non-existent term.
6. DELETE /dictionary/:term (error case): Tests deleting a non-existent term.

The tests are structured to:
    - Add a new term
    - Update that term
    - Delete that term
    - Test error cases for non-existent terms

-t means --testNamePattern.

To run all test case: > npm test
To run both PUT and POST test cases: > npm test -- -t '(POST|PUT) - /dictionary'
To run only GET test cases: > npm test -- -t 'GET - /dictionary'
 */
describe("Ski Dictionary API", () => {
    let newTermId;

    it('GET - /dictionary should return all dictionary terms', async () => {
        const response = await request(app).get('/dictionary');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // check disctionary-route.js
    // check the response JSON received
    it('POST - /dictionary should add a new term', async () => {
        const newTerm = { term: "Test Term", defined: "Test Definition" };
        const response = await request(app)
            .post('/dictionary')
            .send(newTerm)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.term).toEqual(newTerm);

        newTermId = response.body.term.term; // Save the term for later tests i.e. for PUT and DELETE
    });

    it('PUT - /dictionary/:term should update an existing term', async () => {
        const updatedDefinition = "Updated Test Definition";
        const response = await request(app)
            .put(`/dictionary/${newTermId}`)
            .send({ defined: updatedDefinition })
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.updated.defined).toBe(updatedDefinition);
    });

    it('DELETE - /dictionary/:term should delete an existing term', async () => {
        const response = await request(app).delete(`/dictionary/${newTermId}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.removed).toBe(newTermId);
    });

    it('PUT - /dictionary/:term should return 404 for non-existent term', async () => {
        const response = await request(app)
            .put('/dictionary/nonexistentterm')
            .send({ defined: "This should fail" })
            .set('Accept', 'application/json');

        expect(response.status).toBe(404);
        expect(response.body.status).toBe("error");
    });

    it('DELETE - /dictionary/:term should return 404 for non-existent term', async () => {
        const response = await request(app).delete('/dictionary/nonexistentterm');

        expect(response.status).toBe(404);
        expect(response.body.status).toBe("error");
    });
});