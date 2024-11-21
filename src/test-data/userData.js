const faker = require('faker');

function generateUser() {
    return {
        id: faker.datatype.number({ min: 1000000, max: 9999999 }),
        name: faker.name.findName(),
        email: faker.internet.email(),
        gender: faker.helpers.randomize(['male', 'female']),
        status: 'active',
    };
}

module.exports = {
    generateUser,
};
