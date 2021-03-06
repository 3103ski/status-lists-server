const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../../models');

module.exports.local = passport.use(
	new LocalStrategy({ usernameField: 'email' }, User.authenticate())
);
