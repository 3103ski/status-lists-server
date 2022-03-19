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
			type: Schema.Types.ObjectId,
			ref: 'Like',
		},
	},
	{ timestamps: true }
);

statusSchema
	.pre('find', Populate('likes'))
	.pre('findOne', Populate('likes'))
	.pre('find', Populate('projectOwner'))
	.pre('findOne', Populate('projectOwner'))
	.pre('find', Populate('taskCreator'))
	.pre('findOne', Populate('taskCreator'))
	.pre('find', Populate('user'))
	.pre('findOne', Populate('user'));

module.exports = model('Status', statusSchema);
