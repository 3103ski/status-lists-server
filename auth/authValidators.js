// const { jsonRESPONSE } = require('../util/responseHelpers.js');
const { User } = require('../models/index.js');
const {
	hasSpace,
	isLessThan,
	isGreaterThan,
	hasAtLeastOneCap,
	hasAtLeastOneCharacter,
	hasAtLeastOneLower,
	containsANumber,
} = require('../util/readableStringFunctions.js');

/**
 * •••••••••••
 * ---->> Password
 * •••••••••••
 */

function validatePassword(newPassword, errorKey = 'password') {
	if (isLessThan(6, newPassword))
		return {
			status: 400,
			msg: 'PW_6_CHAR_MIN',
			errors: { [errorKey]: 'Passwords must be at least 6 characters long' },
		};
	if (!hasAtLeastOneLower(newPassword))
		return {
			status: 400,
			msg: 'PW_MUST_INCLUDE_LOWERCASE',
			errors: { [errorKey]: 'Passwords must include at least 1 lower case letter' },
		};
	if (!hasAtLeastOneCap(newPassword))
		return {
			status: 400,
			msg: 'PW_MUST_INCLUDE_UPPERCASE',
			errors: { [errorKey]: 'Passwords must include at least 1 capital letter' },
		};
	if (!containsANumber(newPassword))
		return {
			status: 400,
			msg: 'PW_MUST_INCLUDE_NUMBER',
			errors: { [errorKey]: 'Passwords must include at least 1 number' },
		};
	if (!hasAtLeastOneCharacter(newPassword))
		return {
			status: 400,
			msg: 'PW_MUST_INCLUDE_SPECIAL',
			errors: {
				[errorKey]: 'Passwords must include at least 1 special character (i.e. !@#$%^&*)',
			},
		};
	return null;
}

/**
 * •••••••••••
 * ---->> EMAIL
 * •••••••••••
 */

const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

async function validateNewEmail(newEmail) {
	/** ---->> Check email format */
	const emailFormatError = await validateEmailFormat(newEmail);
	if (emailFormatError) return emailFormatError;

	/** ---->> Check if email is taken */
	const user = await User.findByUsername(newEmail);
	if (user) {
		const authMethod = (await user.googleId)
			? ' using Google'
			: user.spotifyId
			? ' using Spotify.'
			: user.facebookId
			? ' using Facebook.'
			: '';
		const errors = { email: `${newEmail} is already registered${authMethod}` };
		return { errors, status: 400, msg: 'EMAIL_ALREADY_REGISTERED' };
	}
	return null;
}

function validateEmailFormat(emailAddress) {
	if (!emailRegex.test(emailAddress))
		return {
			errors: { email: 'Please enter a valid email address' },
			status: 400,
			msg: 'INVALID_EMAIL_FORMAT',
		};
	return null;
}

/**
 * ••••••••••••••
 * ---->> DISPLAY NAME
 * ••••••••••••••
 */

async function validateDisplayName(displayName) {
	/** Display names must be unique */
	const searchResults = await User.find({ displayName });
	const exists = (await searchResults.length) > 0;

	if (exists)
		return {
			status: 400,
			msg: 'DISPNAME_TAKEN',
			errors: { displayName: 'This display name is taken' },
		};

	/** Check if new display name has a space in it */
	// if (hasSpace(displayName))
	// 	return {
	// 		status: 400,
	// 		msg: 'DISPNAME_NO_SPACES_ALLOWED',
	// 		errors: { displayName: 'Spaces are not allowed in display names' },
	// 	};

	/** Name can not be longer than 15 characters */
	if (isGreaterThan(15, displayName))
		return {
			status: 400,
			msg: 'DISPNAME_CHAR_MAX',
			errors: { displayName: 'Display name cant be more than 15 characters' },
		};

	return null;
}

module.exports = {
	validatePassword,
	validateEmailFormat,
	validateNewEmail,
	validateDisplayName,
};
