const { gql } = require('apollo-server-express');

const inputsTypeDef = gql`
	# /** ••••••••••• */
	# /** USER INPUTS */
	# /** ••••••••••• */

	input UpdateUserInput {
		email: String
		displayName: String
		isPublic: Boolean
	}

	input UpdateUserInfoInput {
		displayName: String
		firstName: String
		lastName: String
		title: String
		location: String
		bio: String
		avatar: String
		profileBanner: String
	}
`;

module.exports = inputsTypeDef;
