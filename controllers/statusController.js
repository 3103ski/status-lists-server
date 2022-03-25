const { Status, Like } = require('../models');

const task_controller = require('./taskController.js');
const user_controller = require('./userController.js');

const _this = this;

// returns the newly created status
exports.create_status = async function (statusInput, taskId, userId) {
	let task = await task_controller.get_task(taskId, false);
	let user = await user_controller.get_user(userId, false);

	if (user && task) {
		if (task.users.includes(userId) || task.projectOwner === userId) {
			const { text } = statusInput;
			let status = await new Status({
				projectOwner: task.projectOwner,
				taskCreator: task.createdBy,
				createdBy: user._id,
				text,
				task: task._id,
			});

			task.statuses = await [...task.statuses, status._id];
			task.attentionFlag = await false;

			return task
				.save()
				.then((savedTask) => {
					return status
						.save()
						.then((newStatus) => newStatus)
						.catch((error) => ({
							error,
							msg: 'status_controller >>> create_status >>> there was an error saving the new status',
						}));
				})
				.catch((error) => ({
					error,
					msg: 'status_controller >>> create_status >>> there was an error saving the update the task',
				}));
		} else {
			return {
				error,
				msg: 'status_controller >>> create_status >>> you are not authorized to create a status for this task',
			};
		}
	} else {
		return {
			error,
			msg: 'status_controller >>> create_status >>> there was an error finding the proper user or task data',
		};
	}
};

// returns a single status
exports.get_status = async function (statusId, populate = true) {
	let status;
	if (populate === true) {
		status = await Status.findOne({ _id: statusId });
	} else {
		status = await Status.findById(statusId);
	}
	return status;
};

// returns the status with updated likes
exports.like_status = async function (statusId, userId) {
	let status = await _this.get_status(statusId, false);
	let user = await user_controller.get_user(userId, false);
	if (status && user) {
		let task = await task_controller.get_task(status.task, false);
		if (task) {
			if (task.users.includes(userId) || task.projectOwner === userId || task.createdBy === userId) {
				let newLike = await new Like({ userId, likedStatusId: status._id });
				if (newLike) {
					status.likes = await [...status.likes, newLike._id];
					return status
						.save()
						.then((updatedStatus) => {
							return newLike
								.save()
								.then(() => updatedStatus)
								.catch((error) => ({
									error,
									msg: 'status_controller >>> like_status >>> there was an error saving the like to the DB',
								}));
						})
						.catch((error) => ({
							error,
							msg: 'status_controller >>> like_status >>> there was an error saving the status after adding the like',
						}));
				} else {
					return {
						error,
						msg: 'status_controller >>> like_status >>> there was an error creating the new like',
					};
				}
			}
		} else {
			return {
				error,
				msg: 'status_controller >>> like_status >>> there was an error finding the proper user or task data',
			};
		}
	} else {
		return {
			error,
			msg: 'status_controller >>> like_status >>> either the user or status you are trying to like do not exist',
		};
	}
};

// returns the status with updated likes
exports.unlike_status = async function (statusId, userId) {
	let status = await _this.get_status(statusId, false);
	let like = await Like.findOne({ likedStatusId: statusId, userId });
	let user = await user_controller.get_user(userId, false);

	if (status && user && like) {
		return Like.findByIdAndDelete(like._id, function (errors, docs) {
			if (errors) {
				return {
					msg: 'status_controller >> unlike_status >> there was an error deleting the like from the DB',
					errors,
				};
			}
			status.likes = status.likes.filter((id) => id !== like._id);
			return status
				.save()
				.then((updatedStatus) => {
					updatedStatus;
				})
				.catch((error) => ({
					error,
					msg: 'status_controller >>> unlike_status >>> there was an error saving the update to the status after deleting the like',
				}));
		});
	} else {
		return {
			error,
			msg: 'status_controller >>> unlike_status >>> either the user or status you are trying to like do not exist',
		};
	}
};
