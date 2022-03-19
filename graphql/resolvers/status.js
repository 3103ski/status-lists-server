const { status_controller } = require('../../controllers/');
const checkAuth = require('../../util/checkAuth');

module.exports = {
	Query: {
		async status(_, { statusId }) {
			return status_controller.get_status(statusId);
		},
	},
	Mutation: {
		async newStatus(_, { statusInput, taskId }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return status_controller.create_status(statusInput, taskId, isAuthorized._id);
			}
		},
		async likeStatus(_, { statusId }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return status_controller.like_status(statusId, isAuthorized._id);
			}
		},
		async unlikeStatus(_, { statusId }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return status_controller.unlike_status(statusId, isAuthorized._id);
			}
		},
	},
};
