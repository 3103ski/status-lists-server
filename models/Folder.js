const { Schema, model } = require('mongoose');

const Populate = require('../util/autoPopulate');

const folderSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		folders: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Folder',
				},
			],
			default: [],
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
	},
	{
		timestamps: true,
	}
);

folderSchema
	.pre('find', Populate('folders'))
	.pre('find', Populate('projects'))
	.pre('findOne', Populate('folders'))
	.pre('findOne', Populate('projects'));

module.exports = model('Folder', folderSchema);
