const { gql } = require('apollo-server-express');

const queryTypeDef = gql`
	scalar Date

	type Query {
		# Users
		user(userId: ID): User
		users: [User]
	}
`;

module.exports = queryTypeDef;
