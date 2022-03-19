const { Schema, model } = require('mongoose');

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
		attentionFlag: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

taskSchema
	.pre('find', Populate('statuses'))
	.pre('findOne', Populate('statuses'))
	.pre('find', Populate('projectOwner'))
	.pre('findOne', Populate('projectOwner'))
	.pre('find', Populate('createdBy'))
	.pre('findOne', Populate('createdBy'))
	.pre('find', Populate('users'))
	.pre('findOne', Populate('users'));

module.exports = model('Task', taskSchema);
