const Request = require('../../utils/request');
const apiPaths = require('../../utils/apPaths');
const requestInstance = new Request();

async function createUser(baseURL, userData) {
    const response = await requestInstance.sendRequest(
        baseURL + apiPaths.USERS,
        'POST',
        userData,
        process.env.API_TOKEN
    );

    const jsonResponse = await response.json();
    return { status: response.status, json: jsonResponse };
}

async function createUserUnAuth(baseURL, userData) {
    const response = await requestInstance.sendRequest(
        baseURL + apiPaths.USERS,
        'POST',
        userData,
        ''
    );

    const jsonResponse = await response.json();
    return { status: response.status, json: jsonResponse };
}

module.exports = {
    createUser,
    createUserUnAuth,
};
