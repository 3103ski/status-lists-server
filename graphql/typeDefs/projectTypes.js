const { gql } = require('apollo-server-express');

const projectTypeDefs = gql`
	type Project {
		owner: User
		title: String
		notes: String
		isArchived: Boolean
		bellCount: Int
		tasks: [Task]
		createdAt: Date
	}

	type Task {
		projectOwner: User
		users: [User]
		title: String
		notes: String
		project: ID
		statuses: [Status]
		isComplete: Boolean
		attentionFlag: Boolean
		createdAt: Date
	}

	type Status {
		projectOwner: User
		user: User
		text: String
		task: ID
		likes: [Like]
		createdAt: Date
	}
`;

module.exports = projectTypeDefs;
