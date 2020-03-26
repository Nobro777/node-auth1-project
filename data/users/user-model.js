const knex = require('knex');
const knexConfig = require('../../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
    find,
    findBy,
    findById,
    insert,
};

function find() {
    return db('users');
}

function findBy(filter) {
    return db('users').where(filter);
}

function insert(user) {
    return db('users')
        .insert(user)
    .then(ids => ({ ids }));
}

function findById(id) {
    return db('users')
    .where({ id })
    .first();
}