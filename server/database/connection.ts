// Abstraction layer to handle knex configuration per enviornment.
const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];

export default require('knex')(config);
