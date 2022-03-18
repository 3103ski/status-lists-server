/**
 * 		IMPORTANT :: server will not work as is without
 * 		adding a .env file to the '/server/' directory.
 * 		Starter Template below
 */

module.exports = {
	MONGODB: process.env.MONGO_DB,
	SERCRET_KEY: process.env.SECRET_KEY,
	CLIENT_URL: process.env.CLIENT_URL,
	credentials: {
		AWS_SECRET: process.env.AWS_SECRET_KEY,
		AWS_KEY: process.env.AWS_KEY_ID,
		FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
		FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
	},
	TOKEN_DURATION: 3600, // in seconds
};

//••••••••••••••••
// ~~TEMPLATE~~
//    .env
//••••••••••••••••
//   --- !!! ---  IMPORTANT :: .env will be ignored by git. Make sure you create these variables
//   --- !!! ---  on your production server by adding the same content to a .env file created there.
//   --- !!! ---  These variables should never be public, or saved in any code that is part of a repo.

//  FACEBOOK_CLIENT_ID='',
//  FACEBOOK_CLIENT_SECRET='',
//  GOOGLE_CLIENT_ID='',
//  GOOGLE_CLIENT_SECRET='',
//  SPOTIFY_CLIENT_ID='',
//  SPOTIFY_CLIENT_SECRET='',
//  MONGO_DB=''
//  SECRET_KEY=''
//  CLIENT_URL=''      <-------- Do NOT include 'http://'    example:  'localhost:3000'
