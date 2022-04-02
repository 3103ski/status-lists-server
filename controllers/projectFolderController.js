const { ProjectFolder } = require('../models/');
const project_controller = require('./projectController');

const _this = this;

exports.get_project_folder = async function (id, populate = true) {
	let projectFolder = null;
	console.log('check 1.5');
	if (populate === true) {
		projectFolder = await ProjectFolder.findOne({ _id: id });
	} else {
		console.log('check 2');
		projectFolder = await ProjectFolder.findById(id);
	}
	return projectFolder;
};

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

exports.swap_project_position = async function (
	userId,
	projectId,
	projectFolderId,
	oldIndex,
	newIndex,
	newFolder,
	oldFolder
) {
	console.log('check 1');
	let projectFolder = await _this.get_project_folder(projectFolderId);
	console.log({ check3: projectFolder });
	let errMsgPrfx = 'project_folder_controller >>>> swap_project_position >>> ';

	if (projectFolder) {
		if (newFolder || oldFolder) {
			// Do moving between folder stuff here
		} else {
			console.log('check 4');
			let projects = await projectFolder.projects.map((p) => p._id.toString());
			let holdProject = await projects.splice(oldIndex, 1)[0];

			projects.splice(newIndex, 0, holdProject);
			projectFolder.projects = await projects;

			return projectFolder
				.save()
				.then((savedProjectFolder) => {
					console.log('this!!');
					console.log({ projectId, oldIndex, newIndex, userId });
					return { projectId, oldIndex, newIndex, userId };
				})
				.catch((errors) => {
					let msg = errMsgPrfx + 'error saving the project folder';
					console.log({ msg, errors });
					return {
						errors,
						msg,
					};
				});
		}
	} else {
		let msg = errMsgPrfx + 'server could not find the project folder you looked for';
		console.log({ msg });
	}
};
