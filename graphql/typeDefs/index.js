const queries = require('./defQueries');
const mutations = require('./defMutations');
const inputs = require('./defInputs');

const users = require('./users');
const projectTypes = require('./projectTypes');

module.exports = [queries, mutations, inputs, users, projectTypes];
