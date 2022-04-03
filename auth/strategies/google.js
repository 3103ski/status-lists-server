const passport = require('passport');
const GoogleTokenStrategy = require('passport-token-google2').Strategy;

const https = require('https');

const { User, ProjectFolder, Preferences } = require('../../models');
const { validateNewEmail } = require('../authValidators.js');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../../config.js').credentials;

const { cloudinary } = require('../../util/cloudinary');

// async function migrateProjects() {
// 	let users = await User.find();
// 	users = await users.map((user) => user._id);

// 	for (let x = 0; x < users.length - 1; x++) {
// 		let user = await User.findOne({ _id: users[x] });
// 		if (user) {
// 			console.log({ projectFolder: user.projectFolder });

// 			let existingProjectFolder = await ProjectFolder.findOne({ userId: user._id });
// 			if (existingProjectFolder) {
// 				console.log(`user ${user.email} already has a project folder`);
// 				console.log({ existingProjectFolder });
// 				// let folderIds = await existingProjectFolder.projects.map((project) => project._id.toString());
// 				// let incomingIds = await user.projects
// 				// 	.map((project) => project._id.toString())
// 				// 	.filter((id) => !folderIds.includes(id));
// 				// let projects = await [...folderIds, ...incomingIds];
// 				// existingProjectFolder.project = await projects;
// 				// existingProjectFolder.save();
// 			} else {
// 				let projects = await user.projects.map((p) => p._id);
// 				let newProjectFolder = await new ProjectFolder({ userId: user._id, projects });
// 				newProjectFolder
// 					.save()
// 					.then(async (newFolder) => {
// 						user.projectFolder = await newFolder._id;
// 						user.save().then(() => console.log(`Successful save for ${user.email}`));
// 					})
// 					.catch((err) => console.log({ err }));
// 			}
// 		}
// 	}

// 	console.log('Done migrating user projects! Fingers crossed.');
// }

// async function generateMissingPreferenceModels() {
// 	let users = await User.find();
// 	users = await users.map((u) => u._id);

// 	for (let a = 0; a < users.length; a++) {
// 		let user = await User.findOne({ _id: users[a] });
// 		if (user && !user.preferences) {
// 			let newDefaultPreferences = new Preferences({ userId: user._id });
// 			newDefaultPreferences.save().then((savedPreferences) => {
// 				user.preferences = savedPreferences._id;
// 				user.save().then(() => {
// 					console.log(`Saved ${user.email}'s new default settings!`);
// 				});
// 			});
// 		} else {
// 			console.log(`${user.email} already has preferences.`);
// 			console.log({ prefs: user.preferences });
// 		}
// 	}
// }

module.exports.googleStrategy = passport.use(
	new GoogleTokenStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
		async function (_, __, profile, done) {
			const email = profile.emails[0].value;

			return User.findOne({ googleId: profile.id }, async (err, existingUser) => {
				if (err) return done(err, false);
				// migrateProjects();
				if (!err && existingUser) return done(null, existingUser);

				const emailErr = await validateNewEmail(email);

				if (emailErr) return done(emailErr, false);

				let user = await new User({
					email,
					googleId: profile.id,
				});

				user.info.displayName = await `${profile.emails[0].value.split('@')[0]}${profile.name.givenName}`;
				user.info.firstName = await profile.name.givenName;
				user.info.lastName = await profile.name.familyName;

				user.info.email = await email;
				user.info.userId = await user._id.toString();

				let projectFolder = await new ProjectFolder({ userId: user._id });
				return projectFolder.save().then(async (savedProjectFolder) => {
					user.projectFolder = await savedProjectFolder._id;

					return user.save(async (error) => {
						if (error) return done(error, null);
						const avatarUrl = profile._json.picture;

						return https
							.get(avatarUrl, (resp) => {
								resp.setEncoding('base64');

								body = 'data:' + resp.headers['content-type'] + ';base64,';

								resp.on('data', (data) => {
									body += data;
								});

								resp.on('error', (error) => {
									done(error, null);
								});

								return resp.on('end', async () => {
									let userWithAvatar = await User.findOne({
										_id: user._id,
									});

									if (body && userWithAvatar) {
										const uploadRes = await cloudinary.uploader.upload(body, {
											upload_preset: 'status_list_maker',
											folder: 'avatars',
										});

										if (uploadRes) {
											userWithAvatar.info.avatar = uploadRes.public_id;
											userWithAvatar.info.pictures = [uploadRes.public_id];

											return userWithAvatar
												.save()
												.then((userWithAvatar) => done(null, userWithAvatar))
												.catch((errors) => done(errors, null));
										} else {
											console.log('the avatar did NOT come through correctly. Tinker away.');
										}
									} else {
										console.log('the avatar did NOT come through correctly. Tinker away.');
									}
								});
							})
							.on('error', (e) => {
								return done(e, null);
							});
					});
				});
			});
		}
	)
);
