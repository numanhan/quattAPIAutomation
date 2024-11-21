const { test } = require('@playwright/test');
const chai = require('chai');
const { expect } = chai;
const {
    deleteUser,
    deleteUserUnAuth,
} = require('../services/users/deleteUsers');
const { getAllUsers } = require('../services/users/getUsers');

let randomUserId;
let unauthTestUserId;

async function setupUsers(baseURL) {
    if (!randomUserId || !unauthTestUserId) {
        console.log('Fetching users...');
        const allUsersResponse = await getAllUsers(baseURL);
        expect(allUsersResponse.status).to.equal(200);

        const users = allUsersResponse.json;
        expect(users).to.be.an('array').that.is.not.empty;

        randomUserId = users[Math.floor(Math.random() * users.length)].id;
        console.log(`Selected Random User ID for Positive Test: ${randomUserId}`);

        const remainingUsers = users.filter(user => user.id !== randomUserId);
        expect(remainingUsers).to.be.an('array').that.is.not.empty;

        unauthTestUserId = remainingUsers[Math.floor(Math.random() * remainingUsers.length)].id;
        console.log(`Selected Random User ID for Unauthorised Test: ${unauthTestUserId}`);
    }
}

test.describe('API Endpoint: Delete User', () => {
    test('Delete User - Positive Test', async ({ baseURL }) => {
        await setupUsers(baseURL); 
        console.log(`Running Positive Test with User ID: ${randomUserId}`);

        const response = await deleteUser(baseURL, randomUserId);
        console.log('Positive Test Response:', response);

        expect(response.status).to.equal(204);
        console.log('Response code is ' + response.status);

        expect(response.json).to.be.null;
    });

    test('Delete User - Unauthorised Test', async ({ baseURL }) => {
        await setupUsers(baseURL); 
        console.log(`Running Unauthorised Test with User ID: ${unauthTestUserId}`);

        const response = await deleteUserUnAuth(baseURL, unauthTestUserId);
        console.log('Unauthorised Test Response:', response);

        expect(response.status).to.equal(404); 
        console.log('Response code is ' + response.status);

        const { json } = response;
        expect(json)
            .to.have.property('message')
            .that.includes('Resource not found');  
    });

    test('Delete User - Negative Test (Invalid User)', async ({ baseURL }) => {
        const invalidUserId = 3; 
        console.log(`Running Negative Test with Invalid User ID: ${invalidUserId}`);
        const response = await deleteUser(baseURL, invalidUserId);
        console.log('Negative Test Response:', response);

        expect(response.status).to.equal(404);
        console.log('Response code is ' + response.status);

        const { json } = response;
        expect(json)
            .to.have.property('message')
            .that.includes('Resource not found');
    });
});
