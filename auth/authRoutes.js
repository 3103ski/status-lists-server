const express = require('express');
// const axios = require('axios');
const passport = require('passport');

const cors = require('../util/cors');
const auth = require('./authenticate.js');

// const { cloudinary } = require('../util/cloudinary');
// const https = require('https');

const { User } = require('../models');
const { jsonRESPONSE } = require('../util/responseHelpers.js');
// const { randomNumberBetween } = require('../util/readableStringFunctions.js');
const { validatePassword, validateNewEmail, validateDisplayName } = require('./authValidators.js');

const authRouter = express.Router();

authRouter
	.route('/signup')
	.options(cors.cors, (_, res) => res.sendStatus(200))
	.post(cors.cors, loginMiddleware, async (req, res) => {
		/** --> Req Body */
		const { email, password, confirmPassword, displayName } = req.body;

		/** --> PASSWORD format validation already done in middlware */
		/** --> PASSWORD match validation */
		if (password !== confirmPassword)
			return jsonRESPONSE(400, res, {
				errors: {
					password: 'Passwords do not match',
				},
			});

		/** --> EMAIL Validation */
		const emailErrors = await validateNewEmail(email);
		if (emailErrors) return jsonRESPONSE(emailErrors.status, res, emailErrors);

		/** --> DISPLAY NAME Validation */
		const displayNameErrors = await validateDisplayName(displayName);
		if (displayNameErrors) return jsonRESPONSE(displayNameErrors.status, res, displayNameErrors);
		console.log('about to try and register the new user');
		/** --> REGISTER New User */
		return User.register(new User({ email }), password, async (err, user) => {
			if (err) return jsonRESPONSE(500, res, { errors: err });

			user.info.displayName = await displayName;
			user.info.email = await email;
			user.info.userId = await user._id;
			// user.info.avatar = `generic/generic_${randomNumberBetween(1, 8)}.png`;

			return user.save(async (err) => {
				if (err)
					return jsonRESPONSE(500, res, {
						errors: { server: 'There was a server error' },
					});
				let populated_user = await User.findOne({ _id: user.id });
				if (populated_user) {
					return passport.authenticate('local')(req, res, () =>
						jsonRESPONSE(200, res, {
							token: auth.getToken({ _id: populated_user._id }),
							success: true,
							status: 'Registration Successful',
							user: populated_user,
						})
					);
				}
			});
		});
	});

authRouter
	.route('/google/token')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, passport.authenticate('google-token'), (req, res) => {
		return jsonRESPONSE(200, res, {
			success: true,
			token: auth.getToken({ _id: req.user._id }),
			status: 'You are successfully logged in!',
			user: req.user,
		});
	});

authRouter.post('/login', cors.cors, loginMiddleware, passport.authenticate('local'), async (req, res) => {
	let user = await User.findOne({ _id: req.user.id });

	return user
		? jsonRESPONSE(200, res, {
				success: true,
				token: auth.getToken({ _id: req.user._id }),
				status: 'You are successfully logged in!',
				user: user,
		  })
		: jsonRESPONSE(400, res);
});

authRouter
	.route('/change-password')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.cors, loginMiddleware, passport.authenticate('local'), (req, res) => {
		User.findByUsername(req.user.email).then((user) => {
			const { newPassword, confirmNewPassword } = req.body;
			if (newPassword === confirmNewPassword)
				return user.setPassword(newPassword, () => {
					user.save();
					return jsonRESPONSE(200, res, {
						user: req.user,
						token: auth.getToken({ _id: user._id }),
						user,
						success: true,
					});
				});

			return jsonRESPONSE(400, res, {
				errors: { confirmNewPassword: 'Passwords do not match' },
			});
		});
	});

async function loginMiddleware(req, res, next) {
	const { password, newPassword, confirmNewPassword, email, displayName = null, confirmPassword } = req.body;
	console.log({ displayName, email });
	let missingFieldsErrors = {};
	if (email === '') missingFieldsErrors.email = 'You need to enter your login email';
	if (password === '') missingFieldsErrors.password = 'You need to enter a password';
	if (displayName === '') missingFieldsErrors.displayName = 'Display name is required for signup';
	if (newPassword === '')
		missingFieldsErrors.newPassword = 'We can not assign you a new password if you do not provide one.';
	if (confirmNewPassword === '')
		missingFieldsErrors.confirmNewPassword = 'You need to confirm the new password please.';
	if (confirmPassword === '') missingFieldsErrors.confirmPassword = 'You need to confirm the new password please.';

	if (Object.keys(missingFieldsErrors).length > 0)
		return jsonRESPONSE(400, res, { errors: missingFieldsErrors, status: 400, msg: 'MISSING_INPUT' });

	if (password) {
		const pwError = await validatePassword(password);
		if (pwError)
			return jsonRESPONSE(pwError.status, res, {
				status: pwError.status,
				msg: pwError.msg,
				errors: pwError.errors,
			});
	}

	if (newPassword) {
		if (newPassword !== confirmNewPassword)
			return jsonRESPONSE(400, res, {
				errors: { confirmNewPassword: 'Passwords do not match' },
			});
		const npwError = await validatePassword(newPassword, 'newPassword');
		const cnpwError = await validatePassword(confirmNewPassword, 'confirmNewPassword');

		if (npwError)
			return jsonRESPONSE(npwError.status, res, {
				status: npwError.status,
				msg: npwError.msg,
				errors: npwError.errors,
			});
		if (cnpwError)
			return jsonRESPONSE(cnpwError.status, res, {
				status: cnpwError.status,
				msg: cnpwError.msg,
				errors: cnpwError.errors,
			});
	}

	next();
}

module.exports = authRouter;
