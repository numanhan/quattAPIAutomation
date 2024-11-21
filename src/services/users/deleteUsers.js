const Request = require('../../utils/request');
const apiPaths = require('../../utils/apPaths');
const requestInstance = new Request();

async function deleteUser(baseURL, userId) {
    const response = await requestInstance.sendRequest(
        `${baseURL + apiPaths.USERS}/${userId}`,
        'DELETE',
        null,
        process.env.API_TOKEN
    );

    if (response.status === 204) {
        return { status: response.status, json: null };
    }

    const jsonResponse = await response.json();
    return { status: response.status, json: jsonResponse };
}

async function deleteUserUnAuth(baseURL, userId) {
    const response = await requestInstance.sendRequest(
        `${baseURL + apiPaths.USERS}/${userId}`,
        'DELETE',
        null,
        ''
    );

    const jsonResponse = await response.json();
    return { status: response.status, json: jsonResponse };
}

module.exports = {
    deleteUser,
    deleteUserUnAuth,
};
