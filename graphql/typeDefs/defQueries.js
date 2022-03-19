const { gql } = require('apollo-server-express');

const queryTypeDef = gql`
	scalar Date

	type Query {
		# Users
		user(userId: ID): User
		users: [User]

		# projects
		project(projectId: ID): Project
		userProjects: [Project]

		# tasks
		task(taskId: ID): Task
		projectTasks(projectId: ID): [Task]
		userTasks: [Task]
		tasksCreatedByUser: [Task]

		# statuses
		status(statusId: ID): Status
	}
`;

module.exports = queryTypeDef;
