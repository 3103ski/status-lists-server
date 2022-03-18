const { User } = require('../../models/');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

const config = require('../../config.js');
const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = config.credentials;

module.exports.facebookPassport = passport.use(
	new FacebookTokenStrategy(
		{
			clientID: FACEBOOK_CLIENT_ID,
			clientSecret: FACEBOOK_CLIENT_SECRET,
			fbGraphVersion: 'v3.0',
		},

		function (_, __, profile, done) {
			User.findOne({ facebookId: profile.id }, async (err, user) => {
				if (err) {
					return done(err, false);
				}
				if (!err && user) {
					return done(null, user);
				} else {
					user = new User({
						email: profile.emails[0].value,
					});

					user.facebookId = profile.id;

					user.save((err) => {
						if (err) {
							return done(err, false);
						} else {
							return done(null, user);
						}
					});
				}
			});
		}
	)
);
