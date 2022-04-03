const { Preferences } = require('../models');

exports.update_preferences = async function (updatePreferencesInput, userId) {
	let preferences = await Preferences.findOne({ userId });
	if (preferences) {
		console.log({ preferences });
		for (let key in updatePreferencesInput) {
			preferences[key] = await updatePreferencesInput[key];
		}

		return preferences
			.save()
			.then((savedPreferences) => savedPreferences)
			.catch((error) => console.log({ error }));
	} else {
		console.log('still not working');
	}
};
