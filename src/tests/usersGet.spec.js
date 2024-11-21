const { test } = require('@playwright/test');
const path = require('path');
const chai = require('chai');
const { expect } = chai;
const validateSchema = require('../utils/jsonSchemaValidator');
const {
    getAllUsers,
    getAllUsersUnAuth,
    getUserById,
    getUserByIdUnAuth,
} = require('../services/users/getUsers');

test.describe('API Endpoint: Users Endpoint', () => {
    test('Validate Authorised User can get all users', async ({ baseURL }) => {
        const response = await getAllUsers(baseURL);
        console.log(response);

        expect(response.status).to.equal(200);
        console.log('Response code is ' + response.status);

        const users = response.json;
        expect(users).to.be.an('array');

        expect(users.length).to.equal(10);

        users.forEach((user) => {
            expect(user).to.have.all.keys(
                'id',
                'name',
                'email',
                'gender',
                'status'
            );
        });

        const activeUsers = users.filter((user) => user.status === 'active');
        expect(activeUsers.length).to.be.above(5);

        const { isSchemaValid } = validateSchema(
            response,
            path.join(__dirname, '../jsonSchemas/usersSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });

    test('Validate Unauthorised User can get users but different data', async ({
        baseURL,
    }) => {
        const response = await getAllUsersUnAuth(baseURL);
        console.log(response);

        expect(response.status).to.equal(200);
        console.log('Response code is ' + response.status);

        const { isSchemaValid } = validateSchema(
            response,
            path.join(__dirname, '../jsonSchemas/usersSchema.json')
        );
        expect(isSchemaValid).to.be.true;

        const users = response.json;
        expect(users).to.be.an('array');

        expect(users.length).to.equal(10);

        users.forEach((user) => {
            expect(user).to.have.all.keys(
                'id',
                'name',
                'email',
                'gender',
                'status'
            );
        });

        const specificUser = users.find(
            (user) => user.email === 'gandhi_arya@heathcote.example'
        );

        if (!specificUser) {
            console.error(
                "Error: User with email 'mrs_saini_jitender@toy.test' not found in the response."
            );
        }

        expect(specificUser).to.not.be.undefined;
        if (specificUser) {
            expect(specificUser.name).to.equal('Arya Gandhi');
        }
    });

    test('Validate User can get a user by ID successfully', async ({
        baseURL,
    }) => {
        const userId = 7536428; // Example of a valid user ID
        const response = await getUserById(baseURL, userId);
        console.log(response);
        // Check if the status code is 200 (OK)
        expect(response.status).to.equal(200);

        // Validate the response contains the expected fields (id, name, email, gender, status)
        expect(response.json).to.be.an('object');
        expect(response.json).to.have.all.keys(
            'id',
            'name',
            'email',
            'gender',
            'status'
        );
        expect(response.json.id).to.equal(userId); // Check if the returned ID matches the requested ID

        // Optionally, validate the response schema
        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/singleUserSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });

    test('Validate User gets 404 for non-existent user ID', async ({
        baseURL,
    }) => {
        const invalidUserId = 9999999; // Example of a non-existent user ID
        const response = await getUserById(baseURL, invalidUserId);

        // Check if the status code is 404 (Not Found)
        expect(response.status).to.equal(404);

        // Validate that the response contains an appropriate error message
        expect(response.json).to.be.an('object');
        expect(response.json).to.have.property('message');
    });

    test("Validate Unauthenticated User can't get user by ID", async ({
        baseURL,
    }) => {
        const userId = 7527345;
        const response = await getUserByIdUnAuth(baseURL, userId);

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
});
