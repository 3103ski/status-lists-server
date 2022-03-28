const { Schema, model } = require('mongoose');

const Populate = require('../util/autoPopulate');

const projectFolderSchema = new Schema({
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
	archived: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Project',
			},
		],
		default: [],
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

projectFolderSchema
	.pre('find', Populate('folders'))
	.pre('find', Populate('projects'))
	.pre('find', Populate('archived'))
	.pre('findOne', Populate('folders'))
	.pre('findOne', Populate('projects'))
	.pre('findOne', Populate('archived'));

module.exports = model('ProjectFolder', projectFolderSchema);
