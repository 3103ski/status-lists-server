const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Populate = require('../util/autoPopulate');

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		info: {
			userId: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
			firstName: {
				type: String,
				default: '',
			},
			lastName: {
				type: String,
				default: '',
			},
			displayName: {
				type: String,
				default: '',
			},
			location: {
				type: String,
				default: '',
			},
			email: {
				type: String,
				default: '',
			},
			avatar: {
				type: String,
				default: '',
			},
			bio: {
				type: String,
				default: '',
			},
			pictures: {
				type: Array,
				default: [],
			},
			profileBanner: {
				type: String,
				default: '',
			},
		},
		preferences: {
			type: Schema.Types.ObjectId,
			ref: 'Preferences',
		},
		projects: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Project',
				},
			],
			default: [],
		},
		labels: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Label',
				},
			],
			default: [],
		},
		projectFolder: {
			type: Schema.Types.ObjectId,
			ref: 'ProjectFolder',
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
		accountConfirmed: {
			type: Boolean,
			default: false,
		},
		acceptedTermsOfUse: {
			type: Boolean,
			default: false,
		},
		googleId: {
			type: String,
			default: '',
		},
		lastLogin: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

//••••• Do any populating here
userSchema
	.pre('find', Populate('projects'))
	.pre('findOne', Populate('projects'))
	.pre('find', Populate('labels'))
	.pre('findOne', Populate('labels'))
	.pre('find', Populate('preferences'))
	.pre('findOne', Populate('preferences'))
	.pre('find', Populate('projectFolder'))
	.pre('findOne', Populate('projectFolder'));

module.exports = model('User', userSchema);
