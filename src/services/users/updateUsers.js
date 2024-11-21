const Request = require('../../utils/request');
const apiPaths = require('../../utils/apPaths');
const requestInstance = new Request();

async function updateUser(baseURL, userId, userData) {
    const response = await requestInstance.sendRequest(
        `${baseURL + apiPaths.USERS}/${userId}`,
        'PUT',
        userData,
        process.env.API_TOKEN
    );

    const jsonResponse = await response.json();
    return { status: response.status, json: jsonResponse };
}

async function updateUserUnAuth(baseURL, userId, userData) {
    const response = await requestInstance.sendRequest(
        `${baseURL + apiPaths.USERS}/${userId}`,
        'PUT',
        userData,
        ''
    );

    const jsonResponse = await response.json();
    return { status: response.status, json: jsonResponse };
}

module.exports = {
    updateUser,
    updateUserUnAuth,
};
