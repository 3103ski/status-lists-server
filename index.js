require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const { ApolloServer } = require('apollo-server-express');

const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const cors = require('./util/cors.js');

const userRouter = require('./routes/userProfiles');
const authRouter = require('./auth/authRoutes.js');

const { MONGODB } = require('./config');
const { jsonRESPONSE } = require('./util/responseHelpers.js');

/**  TEMPLATE NOTICE !!!!!!
 *
 * Please look to the config file and see what variables are necessary in a .env file so this will start correctly.
 *
 * No guarantees you wont need to tweak or update things, but most of the work should be in the config and .env to get running
 *
 */

async function startApolloServer() {
	////•••••••••••••••••
	// Setup server, database connection and port
	////•••••••••••••••••
	const PORT = process.env.PORT || 5009;
	const app = express();

	const httpServer = createServer(app);

	const schema = makeExecutableSchema({ typeDefs, resolvers });

	////•••••••••••••••••
	//  Setup Subscription Server
	////•••••••••••••••••
	// const subscriptionServer = SubscriptionServer.create(
	// 	{
	// 		schema,
	// 		execute,
	// 		subscribe,
	// 	},
	// 	{
	// 		server: httpServer,
	// 		path: '/subscriptions',
	// 	}
	// );

	////•••••••••••••••••
	//  Setup Apollo Server
	////•••••••••••••••••
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }) => ({ req }),
		// >>>> ••• Use this plugin for subscriptions
		// plugins: [
		// 	{
		// 		async serverWillStart() {
		// 			return {
		// 				async drainServer() {
		// 					subscriptionServer.close();
		// 				},
		// 			};
		// 		},
		// 	},
		// ],
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app: app });

	////•••••••••••••••••
	//  App Setup
	////•••••••••••••••••

	app.use(express.json({ limit: '40mb' }));
	app.use(express.urlencoded({ limit: '40mb', extended: true }));

	app.set('views', path.join(__dirname, 'views'));

	app.use(express.static(path.join(__dirname, 'views')));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(passport.initialize());

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, headers');
		next();
	});

	////•••••••••••••••••
	//  Routers
	////•••••••••••••••••
	app.use('/auth', authRouter);
	app.use('/user-profile', userRouter);

	app.get('/', cors.cors, (req, res) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		res.sendFile(express.static(path.join(__dirname, 'views/index.html')));
	});

	////•••••••••••••••••
	// server endpoint error handling
	////•••••••••••••••••

	app.use(function (req, res, next) {
		next(createError(404));
	});

	app.use(function (err, req, res, next) {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		console.log('we are here');
		console.log({ err });
		return jsonRESPONSE(500, res, err);
	});

	////•••••••••••••••••
	// Connect to MongoDB & GraphQL then run app on server PORT
	////•••••••••••••••••
	await mongoose.connect(MONGODB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});
	console.log('MongoDB :: CONNECTED  ::  Mongoose');

	httpServer.listen(PORT, () => console.log(`Server  :: RUNNING    ::  http://localhost:5000`));
}
startApolloServer();
