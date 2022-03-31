const { Schema, model } = require('mongoose');

const labelSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		label: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			default: '#fff',
		},
	},
	{ timestamps: true }
);

module.exports = model('Label', labelSchema);
