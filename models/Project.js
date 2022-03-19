const { Schema, model } = require('mongoose');
const Populate = require('../util/autoPopulate');

const projectSchema = new Schema(
	{
		owner: {
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
		isArchived: {
			type: Boolean,
			default: false,
		},
		bellCount: {
			type: Number,
			default: 0,
		},
		tasks: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Task',
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

projectSchema
	.pre('find', Populate('tasks'))
	.pre('findOne', Populate('tasks'))
	.pre('find', Populate('owner'))
	.pre('findOne', Populate('owner'));

module.exports = model('Project', projectSchema);
