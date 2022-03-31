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

	input UpdateLabelInput {
		labelId: ID
		label: String
		color: String
	}

	# /** •••••••••••••• */
	# /** PROJECT INPUTS */
	# /** •••••••••••••• */
	input ProjectInput {
		title: String
		notes: String
		isArchived: Boolean
	}

	input TaskInput {
		title: String
		notes: String
		isComplete: Boolean
		listExpanded: Boolean
		label: ID
		archived: Boolean
		attentionFlag: Boolean
	}

	input StatusInput {
		text: String
	}
`;

module.exports = inputsTypeDef;
