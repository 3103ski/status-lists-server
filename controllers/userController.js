const { User } = require('../models');
const { validate_user } = require('./validators');

const auth = require('../auth/authenticate');

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
exports.get_user = async function (userId) {
	if (userId) {
		const user = await User.findOne({ _id: userId });
		if (user) return user;
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
