const { Schema, model } = require('mongoose');
const Populate = require('../util/autoPopulate');

const taskSchema = new Schema(
	{
		projectOwner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		users: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
			],
			default: [],
		},
		title: {
			type: String,
			required: true,
		},
		notes: {
			type: String,
			default: '',
		},
		project: {
			type: Schema.Types.ObjectId,
		},
		statuses: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Status',
				},
			],
			default: [],
		},
		isComplete: {
			type: Boolean,
			default: false,
		},
		archived: {
			type: Boolean,
			default: false,
		},

		attentionFlag: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

taskSchema.pre('find', Populate('statuses')).pre('findOne', Populate('statuses'));

module.exports = model('Task', taskSchema);
