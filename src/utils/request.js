const fetch = require('node-fetch');
require('dotenv').config();

class Request {
    constructor() {
        this.defaultHeaders = {
            accept: 'application/json',
            'Content-Type': 'application/json',
        };
    }

    async sendRequest(url, method, data, accessToken) {
        const requestOptions = {
            method,
            headers: { ...this.defaultHeaders },
        };

        if (accessToken) {
            requestOptions.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (method !== 'GET') {
            requestOptions.body = data ? JSON.stringify(data) : undefined;
        }

        const response = await fetch(url, requestOptions);
        return response;
    }
}

module.exports = Request;
