const { gql } = require('apollo-server-express');

const projectTypeDefs = gql`
	type Project {
		id: ID
		owner: ID
		users: [ID]
		title: String
		notes: String
		isArchived: Boolean
		bellCount: Int
		tasks: [Task]
		createdAt: Date
	}

	type Task {
		id: ID
		projectOwner: ID
		users: [ID]
		createdBy: ID
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
		projectOwner: ID
		taskCreator: ID
		createdBy: ID
		text: String
		task: ID
		likes: [Like]
		createdAt: Date
	}
`;

module.exports = projectTypeDefs;
