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
    let createdUserId;
    let unauthTestUserId;

    // Function for getting users.
    const fetchUsers = async (baseURL) => {
        const response = await fetch(`${baseURL}/users`);
        const data = await response.json();
        return data;
    };

    test.beforeAll(async ({ baseURL }) => {
        // Get users and pick random ID
        const users = await fetchUsers(baseURL);
        unauthTestUserId = users[Math.floor(Math.random() * users.length)].id;
        console.log(`Unauthenticated Test User ID: ${unauthTestUserId}`);
    });

    test('Update User - Positive Test', async ({ baseURL }) => {
        const newUserData = generateUser();
        console.log('Generated User Data for Create:', newUserData);

        // Generate a new user
        const createResponse = await createUser(baseURL, newUserData);
        console.log('Create User Response:', createResponse); // Logging the response

        // Check if there's any error 
        if (createResponse.status !== 201) {
            console.error('Error creating user:', createResponse.json);
            throw new Error(`Failed to create user. Status: ${createResponse.status}`);
        }

        createdUserId = createResponse.json.id;
        console.log(`Created User ID for Positive Test: ${createdUserId}`);

        const updatedData = {
            name: 'Updated User Name',
            email: faker.internet.email(),
            gender: 'female',
            status: 'active',
        };

        const response = await updateUser(baseURL, createdUserId, updatedData);
        console.log('Update User Response:', response);

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
        const userId = 1;

        const invalidData = {
            name: 'Invalid Update',
            gender: 'male',
            status: 'inactive',
        };

        const response = await updateUser(baseURL, userId, invalidData);
        console.log('Negative Test Response:', response);

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
        const updatedData = {
            name: 'Unauthenticated Update',
            email: 'unauthenticated_email@example.com',
            gender: 'female',
            status: 'inactive',
        };

        // Trying to update with valid data but unauth user
        const response = await updateUserUnAuth(baseURL, unauthTestUserId, updatedData);
        console.log('Unauthenticated Test Response:', response);

        // Check `401` error status code
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
