const Request = require('../../utils/request');
const apiPaths = require('../../utils/apPaths');
const requestInstance = new Request();

async function getAllUsers(baseURL) {
    const response = await requestInstance.sendRequest(
        baseURL + apiPaths.USERS,
        'GET',
        null,
        process.env.API_TOKEN
    );

    const jsonResponse = await response.json(); // Wait for JSON response
    return { status: response.status, json: jsonResponse }; // Return status and JSON
}

async function getAllUsersUnAuth(baseURL) {
    const response = await requestInstance.sendRequest(
        baseURL + apiPaths.USERS,
        'GET',
        null,
        ''
    );

    const jsonResponse = await response.json(); // Wait for JSON response
    return { status: response.status, json: jsonResponse }; // Return status and JSON
}

async function getUserById(baseURL, userId) {
    const response = await requestInstance.sendRequest(
        `${baseURL + apiPaths.USERS}/${userId}`,
        'GET',
        null,
        process.env.API_TOKEN
    );

    const jsonResponse = await response.json(); // Wait for JSON response
    return { status: response.status, json: jsonResponse }; // Return status and JSON
}

async function getUserByIdUnAuth(baseURL, userId) {
    const response = await requestInstance.sendRequest(
        `${baseURL + apiPaths.USERS}/${userId}`,
        'GET',
        null,
        ''
    );

    const jsonResponse = await response.json(); // Wait for JSON response
    return { status: response.status, json: jsonResponse }; // Return status and JSON
}

module.exports = {
    getAllUsers,
    getAllUsersUnAuth,
    getUserById,
    getUserByIdUnAuth,
};
