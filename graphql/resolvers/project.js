const { project_controller, project_folder_controller } = require('../../controllers/');
const checkAuth = require('../../util/checkAuth');

module.exports = {
	Query: {
		async project(_, { projectId }) {
			return project_controller.get_project(projectId);
		},
		async userProjects(_, __, context) {
			const isAuthorized = checkAuth(context);
			console.log('heard 1');
			if (isAuthorized) {
				console.log('headed into the get method');
				return project_controller.get_user_projects(isAuthorized._id);
			}
		},
	},
	Mutation: {
		async newProject(_, { projectInput }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return project_controller.create_project(projectInput, isAuthorized._id);
			}
		},
		async updatedProject(_, { projectInput, projectId }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return project_controller.update_project(projectInput, projectId, isAuthorized._id);
			}
		},
		async swapProjectPosition(_, { swapProjectInput }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				const { projectId, oldIndex, newIndex, projectFolderId } = swapProjectInput;
				console.log({ swapProjectInput });
				if (swapProjectInput) {
					return project_folder_controller.swap_project_position(
						isAuthorized._id,
						projectId,
						projectFolderId,
						oldIndex,
						newIndex
					);
				}
			}
		},
	},
};
