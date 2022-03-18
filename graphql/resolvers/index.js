const userResolvers = require('./users');

// const { PubSub } = require('graphql-subscriptions');
const { GraphQLDateTime } = require('graphql-iso-date');

const customScalarResolver = {
	Date: GraphQLDateTime,
};

module.exports = [
	customScalarResolver,
	{
		// Subscription: {
		// 	...messageResolvers.Subscription,
		// },
		Query: {
			...userResolvers.Query,
		},
		Mutation: {
			...userResolvers.Mutation,
		},
	},
];
