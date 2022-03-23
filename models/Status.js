const { Schema, model } = require('mongoose');

const Populate = require('../util/autoPopulate');

const statusSchema = new Schema(
	{
		projectOwner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		taskCreator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		text: {
			type: String,
			requires: true,
		},
		task: {
			type: Schema.Types.ObjectId,
			ref: 'Task',
		},
		likes: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Like',
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

statusSchema.pre('find', Populate('likes')).pre('findOne', Populate('likes'));

module.exports = model('Status', statusSchema);
