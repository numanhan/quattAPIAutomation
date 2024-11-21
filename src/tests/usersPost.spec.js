const { test } = require('@playwright/test');
const path = require('path');
const chai = require('chai');
const { expect } = chai;
const validateSchema = require('../utils/jsonSchemaValidator');
const {
    createUser,
    createUserUnAuth,
} = require('../services/users/createUsers');
const { generateUser } = require('../test-data/userData');

test.describe('API Endpoint: Create User', () => {
    test('Create User - Positive Test (Authorized User)', async ({
        baseURL,
    }) => {
        const userData = generateUser();
        console.log(userData);

        const response = await createUser(baseURL, userData);
        console.log(response);

        expect(response.status).to.equal(201);

        const createdUser = response.json;
        expect(createdUser).to.have.property('id');
        expect(createdUser.name).to.equal(userData.name);
        expect(createdUser.email).to.equal(userData.email);
        expect(createdUser.gender).to.equal(userData.gender);
        expect(createdUser.status).to.equal(userData.status);

        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/singleUserSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });

    test('Create User - Negative Test (Unauthorized User)', async ({
        baseURL,
    }) => {
        const userData = generateUser();
        console.log(userData);

        const response = await createUserUnAuth(baseURL, userData);
        console.log(response);

        expect(response.status).to.equal(401);

        const errorResponse = response.json;
        expect(errorResponse).to.have.property('message');
        expect(errorResponse.message).to.equal('Authentication failed');

        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/errorSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });

    test('Create User - Negative Test (Invalid Data)', async ({ baseURL }) => {
        const userData = {
            name: 'Invalid User',
            gender: 'male',
            status: 'inactive',
        };

        const response = await createUser(baseURL, userData);
        console.log(response);

        expect(response.status).to.equal(422);

        const errorResponse = response.json;
        const errorMessage = errorResponse[0];
        expect(errorMessage).to.have.property('field');
        expect(errorMessage.field).to.equal('email');
        expect(errorMessage).to.have.property('message');
        expect(errorMessage.message).to.equal("can't be blank");

        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/postErrorSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });
});
