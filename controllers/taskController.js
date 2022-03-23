const { Task } = require('../models');

const user_controller = require('./userController');
const project_controller = require('./projectController');
const status_controller = require('./statusController');

const _this = this;

exports.create_task = async function (taskInput, projectId, userId) {
	let project = await project_controller.get_project(projectId, false);
	let user = await user_controller.get_user(userId);

	if (project && user) {
		if (project.owner === userId || project.users.includes(userId)) {
			let { title, notes = '' } = taskInput;

			let users = (await project.owner) === userId ? [] : [userId];
			let newTask = await new Task({
				title,
				notes,
				projectOwner: project.owner,
				project: projectId,
				users,
				createdBy: userId,
			});

			// add new task to its project
			project.tasks = await [newTask._id, ...project.tasks];
			return project
				.save()
				.then(async () => {
					// save the new task if it was added to the project successfully
					return newTask
						.save()
						.then(async (savedTask) => {
							await status_controller.create_status({ text: 'Task Created' }, savedTask._id, userId);

							let populated_task = await _this.get_task(savedTask._id);

							return populated_task;
						})
						.catch((error) => ({
							error,
							msg: 'task_controller >> create_task >>> error saving the new task',
						}));
				})
				.catch((error) => ({
					error,
					msg: 'task_controller >> create_task >>> error saving the updates to the project',
				}));
		} else {
			return {
				error,
				msg: 'task_controller >> create_task >>> you are not a part of the project you are attempting to edit',
			};
		}
	} else {
		return { error, msg: 'task_controller >> create_task >>> error finding the user or project' };
	}
};

exports.get_task = async function (taskId, populate = true) {
	let task;
	if (populate) {
		task = await Task.findOne({ _id: taskId });
	} else {
		task = await Task.findById(taskId);
	}
	return task;
};

exports.get_project_tasks = async function (projectId) {
	let tasks = await Task.find({ project: projectId });
	return tasks;
};

exports.get_users_tasks = async function (userId) {
	let tasks = await Task.find({ projectOwner: userId });
	return tasks;
};

exports.get_all_tasks_by_user = async function (userId) {
	let tasks = await Task.find({ createdBy: userId });
	return tasks;
};

exports.update_task = async function (taskInput, taskId, userId) {
	let task = await _this.get_task(taskId, false);
	let user = await user_controller.get_user(userId);

	if (user && task) {
		if (task.createdBy === userId || task.projectOwner === userId || project.users.includes(userId)) {
			return Task.findByIdAndUpdate(taskId, taskInput, { new: true }, function (errors, updatedTask) {
				if (errors) {
					return {
						msg: 'task_controller >> update_task >> error updating your task',
						errors,
					};
				} else {
					return updatedTask;
				}
			});
		} else {
			return {
				msg: 'task_controller >> update_task >> you are not authorized to update this task',
				errors,
			};
		}
	} else {
		return {
			msg: 'task_controller >> update_task >> there was an error locating the user or task',
			errors,
		};
	}
};
