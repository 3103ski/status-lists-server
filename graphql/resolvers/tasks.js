const { task_controller } = require('../../controllers/');
const checkAuth = require('../../util/checkAuth');

module.exports = {
	Query: {
		async task(_, { taskId }) {
			return task_controller.get_task(taskId);
		},
		async projectTasks(_, { projectId }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return task_controller.get_project_tasks(projectId);
			}
		},
		async userTasks(_, __, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return task_controller.get_users_tasks(isAuthorized._id);
			}
		},
		async tasksCreatedByUser(_, __, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return task_controller.get_all_tasks_by_user(isAuthorized._id);
			}
		},
	},
	Mutation: {
		async newTask(_, { taskInput, projectId }, context) {
			const isAuthorized = checkAuth(context);
			console.log('check');
			if (isAuthorized) {
				return task_controller.create_task(taskInput, projectId, isAuthorized._id);
			}
		},
		async updatedTask(_, { taskInput, taskId }, context) {
			console.log({ taskInput, taskId });
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return task_controller.update_task(taskInput, taskId, isAuthorized._id);
			}
		},
		async swapTaskPos(_, { swapTaskInput }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				const { projectId, oldIndex, newIndex } = swapTaskInput;
				return task_controller.swap_task_position_in_project(projectId, oldIndex, newIndex);
			}
		},
	},
};
