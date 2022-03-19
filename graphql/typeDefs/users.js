const { gql } = require('apollo-server-express');

const userTypeDef = gql`
	type RefreshToken {
		refreshToken: String
		msg: String
		error: String
	}
	type User {
		id: ID!
		info: UserInfo
		isPublic: Boolean
		googleId: String
		email: String!
		token: String!
		createdAt: String!
	}
	type UserInfo {
		userId: ID!
		firstName: String
		lastName: String
		displayName: String
		location: String
		email: String
		avatar: String
		bio: String
		pictures: [String]
		profileBanner: String
	}

	type Like {
		userId: ID
		likedStatusId: ID
		createdAt: Date
	}
`;

module.exports = userTypeDef;
