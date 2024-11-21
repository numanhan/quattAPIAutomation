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

        const randomUser = users[Math.floor(Math.random() * users.length)];

        console.log(`Found User: ${randomUser.email}`);
        console.log(`User Name: ${randomUser.name}`);

        expect(randomUser).to.not.be.undefined;
        expect(randomUser.name).to.be.a('string');
        expect(randomUser.email).to.include('@');
    });

    test('Validate User can get a user by ID successfully', async ({
        baseURL,
    }) => {
        const userId = 7536428;
        const response = await getUserById(baseURL, userId);
        console.log(response);

        expect(response.status).to.equal(200);

        expect(response.json).to.be.an('object');
        expect(response.json).to.have.all.keys(
            'id',
            'name',
            'email',
            'gender',
            'status'
        );
        expect(response.json.id).to.equal(userId);

        const { isSchemaValid } = validateSchema(
            response.json,
            path.join(__dirname, '../jsonSchemas/singleUserSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });

    test('Validate User gets 404 for non-existent user ID', async ({
        baseURL,
    }) => {
        const invalidUserId = 9999999;
        const response = await getUserById(baseURL, invalidUserId);

        expect(response.status).to.equal(404);

        expect(response.json).to.be.an('object');
        expect(response.json).to.have.property('message');
    });

    test('Validate Unauthenticated User can get user by ID', async ({
        baseURL,
    }) => {
        const response = await getAllUsersUnAuth(baseURL);
        console.log(response);

        expect(response.status).to.equal(200);
        const users = response.json;
        expect(users).to.be.an('array').that.is.not.empty;

        const randomUser = users[Math.floor(Math.random() * users.length)];

        const userId = randomUser.id;

        console.log(`Selected User ID: ${userId}`);

        const unauthResponse = await getUserByIdUnAuth(baseURL, userId);

        console.log(unauthResponse);

        expect(unauthResponse.status).to.equal(200);

        const errorResponse = unauthResponse.json;
        expect(errorResponse).to.be.an('object');

        const { isSchemaValid } = validateSchema(
            unauthResponse.json,
            path.join(__dirname, '../jsonSchemas/singleUserSchema.json')
        );
        expect(isSchemaValid).to.be.true;
    });
});
