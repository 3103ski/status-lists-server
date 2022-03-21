const passport = require('passport');
const GoogleTokenStrategy = require('passport-token-google2').Strategy;

const https = require('https');

const { User } = require('../../models');
const { validateNewEmail } = require('../authValidators.js');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../../config.js').credentials;
// const { randomNumberBetween } = require('../../util/readableStringFunctions.js');
const { cloudinary } = require('../../util/cloudinary');

module.exports.googleStrategy = passport.use(
	new GoogleTokenStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
		async function (_, __, profile, done) {
			const email = profile.emails[0].value;
			console.log('In the endpoint');
			return User.findOne({ googleId: profile.id }, async (err, existingUser) => {
				console.log({ existingUser });
				if (err) return done(err, false);
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
				// user.info.avatar = await `generic/generic_${randomNumberBetween(1, 8)}.png`;

				return user.save(async (error) => {
					if (error) return done(error, null);
					const avatarUrl = profile._json.picture;
					console.log('made it to check 2');
					return https
						.get(avatarUrl, (resp) => {
							resp.setEncoding('base64');
							console.log('trying to make avatar', avatarUrl);
							body = 'data:' + resp.headers['content-type'] + ';base64,';
							console.log('check 2.5');
							resp.on('data', (data) => {
								body += data;
							});
							console.log('check 3');
							resp.on('error', (error) => {
								console.log({ hasErrorToThrow: error });
								done(error, null);
							});

							return resp.on('end', async () => {
								console.log('check 4');
								console.log({ body });
								let userWithAvatar = await User.findOne({
									_id: user._id,
								});

								if (body && userWithAvatar) {
									console.log('check 4.5');
									const uploadRes = await cloudinary.uploader.upload(body, {
										upload_preset: 'status_list_maker',
										folder: 'avatars',
									});

									console.log({ madeThisUpload: uploadRes });

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
		}
	)
);
