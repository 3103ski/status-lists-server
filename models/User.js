const { Schema, model } = require('mongoose');
// const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// const Populate = require('../util/autoPopulate');

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
// userSchema
// 	.pre('find', Populate('[some-thing]'))

module.exports = model('User', userSchema);
