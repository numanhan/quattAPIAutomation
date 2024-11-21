const { test } = require('@playwright/test');
const path = require('path');
const chai = require('chai');
const { expect } = chai;
const {
    deleteUser,
    deleteUserUnAuth,
} = require('../services/users/deleteUsers');
const { getAllUsers } = require('../services/users/getUsers');
test.describe('API Endpoint: Delete User', () => {
    let randomUserId;

    test.beforeAll(async ({ baseURL }) => {
        const allUsersResponse = await getAllUsers(baseURL);
        expect(allUsersResponse.status).to.equal(200);

        const users = allUsersResponse.json;
        expect(users).to.be.an('array').that.is.not.empty;

        randomUserId = users[Math.floor(Math.random() * users.length)].id;
        console.log(
            `Selected Random User ID for Positive Test: ${randomUserId}`
        );
    });

    test('Delete User - Positive Test', async ({ baseURL }) => {
        const response = await deleteUser(baseURL, randomUserId);
        console.log('Positive Test Response:', response);

        expect(response.status).to.equal(204);
        console.log('Response code is ' + response.status);

        expect(response.json).to.be.null;
    });

    test('Delete User - Negative Test (Invalid User)', async ({ baseURL }) => {
        const invalidUserId = 3;
        const response = await deleteUser(baseURL, invalidUserId);
        console.log('Negative Test Response:', response);

        expect(response.status).to.equal(404);
        console.log('Response code is ' + response.status);

        const { json } = response;
        expect(json)
            .to.have.property('message')
            .that.includes('Resource not found');
    });

    test('Delete User - Unauthorised Test', async ({ baseURL }) => {
        const userId = 7536397;
        const response = await deleteUserUnAuth(baseURL, userId);
        console.log('Unauthorised Test Response:', response);

        expect(response.status).to.equal(401);
        console.log('Response code is ' + response.status);

        const { json } = response;
        expect(json)
            .to.have.property('message')
            .that.includes('Authentication failed');
    });
});
