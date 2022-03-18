const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { SERCRET_KEY } = require('../config');

module.exports = (context = null, checkToken = null) => {
	const authHeader = context ? context.req.headers.authorization : null;
	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];

		if (token) {
			try {
				const user = jwt.verify(token, SERCRET_KEY);
				return user;
			} catch (err) {
				throw new AuthenticationError('Invalid/Expired token');
			}
		}

		throw new Error("Authentication token must be 'Beearer [token]'");
	}
	if (checkToken) {
		try {
			const user = jwt.verify(checkToken, SERCRET_KEY);
			return user;
		} catch (err) {
			throw new AuthenticationError('Invalid/Expired token');
		}
	}

	throw new Error('Authorization header must be provided');
};
