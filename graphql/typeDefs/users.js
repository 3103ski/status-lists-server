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
		labels: [Label]
		projectFolder: ProjectFolder
		projects: [Project]
		email: String!
		token: String!
		preferences: Preferences
		createdAt: String!
	}

	type Label {
		id: ID
		userId: ID
		label: String
		color: String
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

	type Preferences {
		id: ID
		userId: ID
		showDaysSinceTaskUpdate: Boolean
		autoBell: Boolean
		daysUntilAutoBell: Int
		bellUpgradeToClock: Boolean
		daysUntilBellUpgrade: Int
		removeBellOnNewStatus: Boolean
		showLabelColorsInNav: Boolean
		showLabelsInTaskLinks: Boolean
	}
`;

module.exports = userTypeDef;
