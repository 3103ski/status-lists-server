const { gql } = require('apollo-server-express');

const projectTypeDefs = gql`
	type ProjectFolder {
		id: ID
		folders: [Folder]
		projects: [Project]
		userId: ID
		archived: [Project]
	}

	type Folder {
		id: ID
		userId: ID
		folders: [Folder]
		projects: [Project]
		createdAt: Date
		updatedAt: Date
	}

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
		updatedAt: Date
	}

	type Task {
		id: ID
		projectOwner: ID
		users: [ID]
		createdBy: ID
		title: String
		notes: String
		project: ID
		listExpanded: Boolean
		statuses: [Status]
		isComplete: Boolean
		archived: Boolean
		attentionFlag: Boolean
		createdAt: Date
		updatedAt: Date
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
		updatedAt: Date
	}

	type SwapTaskPosReturn {
		projectId: ID
		oldIndex: Int
		newIndex: Int
	}

	input SwapTaskPosInput {
		projectId: ID
		oldIndex: Int
		newIndex: Int
	}
`;

module.exports = projectTypeDefs;
