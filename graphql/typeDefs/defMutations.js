const { gql } = require('apollo-server-express');

const mutationTypeDefs = gql`
	type Mutation {
		# Users
		updateUser(updateUserInput: UpdateUserInput): User
		updateUserInfo(updateUserInfoInput: UpdateUserInfoInput): User

		uploadAvatar(avatar: String): User
		refreshToken(token: String): RefreshToken
		deletePicture(image: String): User
	}
`;

module.exports = mutationTypeDefs;
