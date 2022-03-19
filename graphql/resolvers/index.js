const userResolvers = require('./users');
const projectResolvers = require('./project');
const taskResolvers = require('./tasks');
const statusResolvers = require('./status');
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
			...projectResolvers.Query,
			...taskResolvers.Query,
			...statusResolvers.Query,
		},
		Mutation: {
			...userResolvers.Mutation,
			...projectResolvers.Mutation,
			...taskResolvers.Mutation,
			...statusResolvers.Mutation,
		},
	},
];
