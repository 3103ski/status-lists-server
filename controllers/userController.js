const { User, Label, Task } = require('../models');
const { validate_user } = require('./validators');

const auth = require('../auth/authenticate');
const task_controller = require('./taskController');
const { cloudinary } = require('../util/cloudinary');
const { randomNumberBetween } = require('../util/readableStringFunctions');
const checkAuth = require('../util/checkAuth');

//••••••••••••••••••••••••••
//  -- User Profile
//••••••••••••••••••••••••••
const _this = this;

// Auth

exports.create_user = async function ({ displayName, email, password, firstName, lastName, location }) {
	let newUser = await new User({ email });
};

// --->> GETTERS
exports.get_user = async function (userId, populate = true) {
	if (userId) {
		let user;
		if (populate === true) {
			user = await User.findOne({ _id: userId });
		} else {
			user = await User.findById(userId);
		}
		return user;
	}
	return null;
};

exports.get_users = async function () {
	const users = await User.find({ isPublic: true });
	return users;
};

// --->> UPDATERS
// Update user root object
exports.update_user = async function (updateUserInput, userId) {
	const user = await _this.get_user(userId);

	const profileInputError = await validate_user.profile_input(updateUserInput, user);
	if (profileInputError) throw profileInputError;

	const { email, isPublic } = { ...updateUserInput };

	if (email) {
		user.email = email;
		user.info.email = email;
	}

	if (isPublic !== null) user.isPublic = isPublic;

	return user
		.save()
		.then((savedUser) => savedUser)
		.catch((errors) => ({
			msg: 'userController >> update_user >> error saving user updates to db object',
			errors,
		}));
};

// Update user info object nested in user
exports.update_user_info = async function (updateUserInfoInput, userId) {
	const user = await _this.get_user(userId);

	const userInfoError = await validate_user.info_input(updateUserInfoInput, user.info);
	if (userInfoError) return userInfoError;

	user.info = { ...user.info, ...updateUserInfoInput };

	// Save Updates
	return user
		.save()
		.then(async (savedUser) => {
			return savedUser;
		})
		.catch((errors) => ({
			msg: 'userController >> update_user_info >> error while saving updates to db object',
			errors,
		}));
};

//•••••••••••••••••••••••••••••
// -- User Task Labels
//•••••••••••••••••••••••••••••
exports.create_label = async function (label, color = 'transparent', userId) {
	let user = await _this.get_user(userId);
	if (label && user) {
		let newLabel = await new Label({ label, color, userId });
		return newLabel
			.save()
			.then(async (savedLabel) => {
				let labels = await user.labels.map((l) => l._id);
				await labels.push(savedLabel._id);

				user.labels = await [...labels];

				return user
					.save()
					.then(() => {
						return savedLabel;
					})
					.catch((errors) => ({
						msg: 'userController >> create_label >> error saving the user with the new label',
						errors,
					}));
			})
			.catch((errors) => ({
				msg: 'userController >> create_label >> error starting controller method. user or label text missing',
				errors,
			}));
	} else {
		return {
			msg: 'userController >> create_label >> error starting controller method. user or label text missing',
		};
	}
};

exports.get_label = async function (labelId) {
	let label = await Label.findOne({ _id: labelId });
	return label;
};

exports.update_label = async function (labelInput, labelId) {
	return Label.findByIdAndUpdate(labelId, { ...labelInput }, { new: true }, async function (errors, updatedLabel) {
		if (errors) {
			return {
				msg: 'user_controller >> update_label >> error updating the label',
				errors,
			};
		} else {
			console.log({ updatedLabel });
			return updatedLabel;
		}
	});
};

exports.delete_label = async function (labelId, userId) {
	let label = await _this.get_label(labelId);
	let user = await _this.get_user(userId, false);
	if (label && user) {
		let tasksWithLabel = await Task.find({ label: labelId });
		if (tasksWithLabel.length > 0) {
			for (let i = 0; i < tasksWithLabel.length - 1; i++) {
				let task = await task_controller.get_task(tasksWithLabel[i]);
				if (task) {
					task.label = await null;
					await task.save().catch((errors) => ({
						msg: `userController >> delete_label >> error removing the label id from ${
							task.title
						} (${task._id.toString()})`,
						errors,
					}));
				} else {
					console.log('I tried but didnt find the task');
				}
			}
		}

		userLabels = await user.labels.filter((l) => l !== labelId);
		user.labels = await [...userLabels];

		return Label.deleteOne({ _id: labelId })
			.then(() => {
				return user
					.save()
					.then(() => label)
					.catch((errors) => ({
						errors,
						msg: 'user_controller >>> delete_label >>> error saving the update to the user',
					}));
			})
			.catch((errors) => ({ errors, msg: 'user_controller >>> delete_label >>> error deleting the label' }));
	} else {
		return null;
	}
};

//•••••••••••••••••••••••••••••
// -- User Utility
//•••••••••••••••••••••••••••••

// provide new refresh token
exports.refresh_token = async function (token) {
	if (token) {
		const user = await checkAuth(null, token);
		if (user) {
			const refreshToken = await auth.getToken({ _id: user._id });
			return { refreshToken, msg: 'refresh successful' };
		}
		return { msg: 'invalid token', refreshToken: null };
	}
};

/*   NOTE 
>> `	if you do not add the correct cloudinary details to a .env file, this will not work. 
>> `	See cloudinary.js file in 'util' folder for more details 
*/

// replace the user's current avatar in AWS and MDB
exports.upload_avatar = async function (avatar, userId) {
	console.log('made it in the function :: ', { avatar, userId });
	const user = await _this.get_user(userId);

	if (avatar && user) {
		const uploadRes = await cloudinary.uploader.upload(avatar, {
			upload_preset: 'mix_studios',
			folder: 'avatars',
		});

		if (uploadRes) {
			user.info.avatar = uploadRes.public_id;
			return user
				.save()
				.then((user) => user)
				.catch((errors) => ({
					msg: 'userController >> upload_avatar >> error while saving new avatar to user model',
					errors,
				}));
		} else {
			console.log('the avatar did NOT come through correctly. Tinker away.');
		}
	} else {
		console.log('the avatar did NOT come through correctly. Tinker away.');
	}
};

// Adds image to users pictures inside of their info object
exports.upload_user_photo = async function (image, userId) {
	const user = await _this.get_user(userId);

	if (image && user) {
		const uploadRes = await cloudinary.uploader.upload(image, {
			upload_preset: 'mix_studios',
			folder: 'user-pictures',
		});
		user.info.pictures = await [...user.info.pictures, uploadRes.public_id];

		return user
			.save()
			.then((user) => ({ newPhoto: uploadRes.public_id, userId }))
			.catch((errors) => ({
				msg: 'userController >> upload_user_photo >> error while saving new avatar to user model',
				errors,
			}));
	} else {
		// return missing user or image response
	}
};

exports.delete_user_photo = async function (image, userId) {
	const user = await _this.get_user(userId);

	if (image && user) {
		await cloudinary.uploader.destroy(image, (err, res) => {});
	}

	if (user.info.avatar === image) {
		user.info.avatar = await `generic/generic_${randomNumberBetween(1, 8)}.png`;
	}

	if (user.info.profileBanner === image) {
		user.info.profileBanner = await '';
	}

	user.info.pictures = await user.info.pictures.filter((pic) => pic !== image);

	return user
		.save()
		.then((user) => user)
		.catch((errors) => ({
			msg: `userController >> delete_user_photo >> error while deleting the user picture and saving update`,
			errors,
		}));
};
