const { user_controller } = require('../../controllers/');
const checkAuth = require('../../util/checkAuth');

module.exports = {
	Query: {
		async user(_, { userId }) {
			return user_controller.get_user(userId);
		},
		async users() {
			return user_controller.get_users();
		},
	},
	Mutation: {
		async refreshToken(_, { token }) {
			return user_controller.refresh_token(token);
		},
		async uploadAvatar(_, { avatar }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return user_controller.upload_avatar(avatar, isAuthorized._id);
			}
		},
		async deletePicture(_, { image }, context) {
			const isAuthorized = checkAuth(context);
			if (isAuthorized) {
				return user_controller.delete_user_photo(image, isAuthorized._id);
			}
		},
		async updateUser(_, { updateUserInput }, context) {
			const isAuthorized = await checkAuth(context);
			if (isAuthorized) {
				return user_controller.update_user(updateUserInput, isAuthorized._id);
			}
		},
		async updateUserInfo(_, { updateUserInfoInput }, context) {
			console.log({ msg: 'got here', updateUserInfoInput });
			const isAuthorized = await checkAuth(context);
			if (isAuthorized) {
				return user_controller.update_user_info(updateUserInfoInput, isAuthorized._id);
			}
		},
		async label(_, { label, color }, context) {
			const isAuthorized = await checkAuth(context);
			if (isAuthorized) {
				return user_controller.create_label(label, color, isAuthorized._id);
			}
		},
		async updatedLabel(_, { updateLabelInput }, context) {
			const isAuthorized = await checkAuth(context);
			if (isAuthorized) {
				const { label, color, labelId } = updateLabelInput;
				return user_controller.update_label({ label, color }, labelId);
			}
		},
		async deletedLabel(_, { labelId }, context) {
			const isAuthorized = await checkAuth(context);
			if (isAuthorized) {
				return user_controller.delete_label(labelId, isAuthorized._id);
			}
		},
	},
};
