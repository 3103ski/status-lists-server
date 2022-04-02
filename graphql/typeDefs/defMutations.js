const { gql } = require('apollo-server-express');

const mutationTypeDefs = gql`
	type Mutation {
		# Users
		updateUser(updateUserInput: UpdateUserInput): User
		updateUserInfo(updateUserInfoInput: UpdateUserInfoInput): User

		uploadAvatar(avatar: String): User
		refreshToken(token: String): RefreshToken
		deletePicture(image: String): User

		# Labels
		label(label: String, color: String, addToTaskId: ID): Label
		updatedLabel(updateLabelInput: UpdateLabelInput): Label
		deletedLabel(labelId: ID): Label

		# Projects
		newProject(projectInput: ProjectInput): Project
		updatedProject(projectInput: ProjectInput, projectId: ID): Project

		swapProjectPosition(swapProjectInput: swapProjectInput): swapProjectReturn

		#  Tasks
		newTask(taskInput: TaskInput, projectId: ID): Task
		updatedTask(taskInput: TaskInput, taskId: ID): Task

		swapTaskPos(swapTaskInput: SwapTaskPosInput): SwapTaskPosReturn

		#  Statuses
		newStatus(statusInput: StatusInput, taskId: ID): Status
		likeStatus(statusId: ID): Status
		unlikeStatus(statusId: ID): Status
	}
`;

module.exports = mutationTypeDefs;
