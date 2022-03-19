const { Schema, model } = require('mongoose');

const likeSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		likedStatusId: {
			type: Schema.Types.ObjectId,
			ref: 'Status',
		},
	},
	{ timestamps: true }
);

module.exports = model('Like', likeSchema);
