const express = require('express');

const { fromBuffer } = require('file-type');
const multiparty = require('multiparty');
const fs = require('fs');

const cors = require('../util/cors');
const auth = require('../auth/authenticate');

const { user_controller } = require('../controllers');
const { jsonRESPONSE } = require('../util/responseHelpers');

const userRouter = express.Router();

userRouter
	.route('/avatar/upload')
	.options(cors.cors, (_, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, async (req, res) => {
		let avatar = req.body.avatar;
		let userId = req.user._id;

		if (avatar && userId) {
			let user = await user_controller.upload_avatar(avatar, userId);
			return jsonRESPONSE(200, res, { avatar: user.info.avatar, userId: user.info.userId });
		} else {
			if (!userId) {
				return jsonRESPONSE(500, res, {
					msg: 'We could not find the userId to update your avatar. If the problem persists, try logging out and back in.',
				});
			}
			if (avatar) {
				return jsonRESPONSE(500, res, {
					msg: 'No avatar data was recieved on the server',
				});
			}
		}
	});

userRouter
	.route('/upload-image')
	.options(cors.cors, (_, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, async (req, res) => {
		let image = req.body.image;
		let userId = req.user._id;

		if (image && userId) {
			let uploadRes = await user_controller.upload_user_photo(image, userId);
			return jsonRESPONSE(200, res, { ...uploadRes });
		}
	});

module.exports = userRouter;
