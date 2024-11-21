const { test } = require('@playwright/test');
const path = require('path');
const chai = require('chai');
const { expect } = chai;
const validateSchema = require('../utils/jsonSchemaValidator');
const {
    updateUser,
    updateUserUnAuth,
} = require('../services/users/updateUsers');
const { createUser } = require('../services/users/createUsers');
const { generateUser } = require('../test-data/userData');
const faker = require('faker');

test.describe('API Endpoint: Update User', () => {
    test('Update User - Positive Test', async ({ baseURL }) => {
        const newUserData = generateUser();
        const createResponse = await createUser(baseURL, newUserData);
        const userId = createResponse.json.id;

        const updatedData = {
            name: 'Updated User Name',
            email: faker.internet.email(),
            gender: 'female',
            status: 'active',
        };

        const response = await updateUser(baseURL, userId, updatedData);
        console.log(response);

        expect(response.status).to.equal(200);

        const updatedUser = response.json;
        expect(updatedUser).to.have.property('id');
        expect(updatedUser.name).to.equal(updatedData.name);
        expect(updatedUser.email).to.equal(updatedData.email);

        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/singleUserSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });

    test('Update User - Negative Test (Invalid Data, non-existing ID)', async ({
        baseURL,
    }) => {
        const userId = 752734;

        const invalidData = {
            name: 'Invalid Update',
            gender: 'male',
            status: 'inactive',
        };

        const response = await updateUser(baseURL, userId, invalidData);
        console.log(response);

        expect(response.status).to.equal(404);

        const errorResponse = response.json;
        expect(errorResponse).to.be.an('object');
        expect(errorResponse).to.have.property('message');
        expect(errorResponse.message).to.equal('Resource not found');

        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/errorSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });

    test('Update User - Negative Test (Unauthenticated)', async ({
        baseURL,
    }) => {
        const userId = 7536393;

        const updatedData = {
            name: 'Unauthenticated Update',
            email: 'unauthenticated_email@example.com',
            gender: 'female',
            status: 'inactive',
        };

        const response = await updateUserUnAuth(baseURL, userId, updatedData);
        console.log(response);

        expect(response.status).to.equal(401);

        const errorResponse = response.json;
        expect(errorResponse).to.have.property('message');
        expect(errorResponse.message).to.include('Authentication failed');

        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/errorSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });
});
