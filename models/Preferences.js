const { Schema, model } = require('mongoose');

const preferencesSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		showDaysSinceTaskUpdate: {
			type: Boolean,
			default: false,
		},
		autoBell: {
			type: Boolean,
			default: false,
		},
		daysUntilAutoBell: {
			type: Number,
			default: 2,
		},
		bellUpgradeToClock: {
			type: Boolean,
			default: false,
		},
		daysUntilBellUpgrade: {
			type: Number,
			default: 2,
		},
		removeBellOnNewStatus: {
			type: Boolean,
			default: true,
		},
		showLabelColorsInNav: {
			type: Boolean,
			default: false,
		},
		showLabelsInTaskLinks: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

module.exports = model('Preferences', preferencesSchema);
