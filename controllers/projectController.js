const { Project } = require('../models');

const user_controller = require('./userController.js');
const _this = this;

exports.create_project = async function (projectInput, userId) {
	const { title, notes = '' } = projectInput;
	let user = await user_controller.get_user(userId, false);
	let newProject = await new Project({ title, notes, projectOwner: userId });

	user.projects = await [...user.projects, newProject._id];
	return user
		.save()
		.then((updatedUser) => {
			return newProject
				.save()
				.then((project) => project)
				.catch((error) => ({
					error,
					msg: 'projects_controller >> create_project >> error saving the new project',
				}));
		})
		.catch((error) => ({
			error,
			msg: 'projects_controller >> create_project >> error saving the new project id to the user',
		}));
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
	if (project.owner._id === userId) {
		return Project.findByIdAndUpdate(projectId, projectInput, { new: true }, function (errors, updatedProject) {
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
			errors,
		};
	}
};
