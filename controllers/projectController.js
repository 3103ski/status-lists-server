const { Project, ProjectFolder } = require('../models');

const user_controller = require('./userController.js');
const project_folder_controller = require('./projectFolderController.js');

const _this = this;

exports.create_project = async function (projectInput, userId) {
	const { title, notes = '' } = projectInput;

	// let projectFolder = await ProjectFolder.findOne({ userId });
	let newProject = await new Project({ title, notes, owner: userId, users: [userId] });

	// console.log(newProject);

	return newProject
		.save()
		.then(async (project) => {
			console.log({ anId: project._id });
			let projectAdded = await project_folder_controller.add_newly_created_project(
				userId,
				project._id.toString()
			);
			// add to folder with controller HERE
			console.log('check after');
			if (projectAdded) {
				console.log('projectAdded to folder correctly');
				return projectAdded;
			}
			return project;
		})
		.catch((error) => {
			console.log({ error });
			return {
				error,
				msg: 'projects_controller >> create_project >> error saving the new project',
			};
		});
};

exports.get_project = async function (projectId, populate = true) {
	let project;

	if (populate === true) {
		project = await Project.findOne({ _id: projectId });
	} else {
		project = await Project.findById(projectId);
	}

	return project;
};

exports.get_user_projects = async function (userId) {
	let projects = await Project.find({ owner: userId });

	return projects;
};

exports.update_project = async function (projectInput, projectId, userId) {
	let project = await _this.get_project(projectId, false);
	console.log(`${project.owner} and ${userId}`);
	if (`${project.owner}` === `${userId}`) {
		console.log('they match');
		return Project.findByIdAndUpdate(projectId, projectInput, { new: true }, function (errors, updatedProject) {
			console.log({ updatedProject });
			console.log({ errors });
			if (errors) {
				return {
					msg: 'project_controller >> update_project >> error updating your project',
					errors,
				};
			} else {
				return updatedProject;
			}
		});
	} else {
		return {
			msg: 'project_controller >> update_project >> you do not own this project',
		};
	}
};
