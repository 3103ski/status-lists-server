const { ProjectFolder } = require('../models/');
const project_controller = require('./projectController');

// const _this = this;

exports.add_newly_created_project = async function (userId, projectId) {
	let projectFolder = await ProjectFolder.findOne({ userId });
	let project = await project_controller.get_project(projectId);

	if (project && projectFolder) {
		projectFolder.projects = await [...projectFolder.projects, project._id];
		return projectFolder
			.save()
			.then(() => {
				return project;
			})
			.catch((error) => ({
				error,
				msg: 'project_folder_controller >>> add_newly_created_project >> error saving the newly created project to the projects folder',
			}));
	}
};
