const { gql } = require('apollo-server-express');

const projectTypeDefs = gql`
	type Project {
		id: ID
		owner: User
		users: [User]
		title: String
		notes: String
		isArchived: Boolean
		bellCount: Int
		tasks: [Task]
		createdAt: Date
	}

	type Task {
		id: ID
		projectOwner: User
		createdBy: User
		users: [User]
		title: String
		notes: String
		project: ID
		statuses: [Status]
		isComplete: Boolean
		attentionFlag: Boolean
		createdAt: Date
	}
	type Like {
		id: ID
		userId: ID
		likedStatusId: ID
		createdAt: Date
	}
	type Status {
		id: ID
		projectOwner: User
		taskCreator: User
		createdBy: User
		text: String
		task: ID
		likes: [Like]
		createdAt: Date
	}
`;

module.exports = projectTypeDefs;
