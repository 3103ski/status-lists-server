const jwt = require('jsonwebtoken');
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { User } = require('../models/');
const { googleStrategy, facebookStrategy, localStrategy } = require('./strategies/');
const config = require('../config.js');

exports.googleStrategy = googleStrategy;
exports.facebookStrategy = facebookStrategy;
exports.local = localStrategy;

// JSON WEBTOKEN AUTH
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use authenticated user to sign token
exports.getToken = (user) => {
	return jwt.sign(user, config.SERCRET_KEY, { expiresIn: config.TOKEN_DURATION });
};

// Setup Passport JSONWebtoken strategy
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SERCRET_KEY;

exports.jwtPassport = passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		User.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				return done(err, false);
			} else if (user) {
				let newLastLogin = Date.now();
				user.lastLogin = newLastLogin;
				user.save();
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
	if (req.user.admin) {
		return next();
	} else {
		const err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		return next(err);
	}
};
