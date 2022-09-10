// --> React
import React from 'react';

// --> Packages
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

// --> Project Imports
import { TOKEN_TITLE } from 'config';
import { GQL_SERVER_URL } from 'routes.js';
import App from 'App';

const cache = new InMemoryCache({
	typePolicies: {
		AudioUpload: {
			keyFields: ['id'],
		},
		AudioCollection: {
			keyFields: ['id'],
		},
		AudioPlaylist: {
			keyFields: ['id'],
			fields: {
				songs: {
					merge(existing = [], incoming = []) {
						return [...incoming];
					},
					keyFields: ['id'],
				},
			},
		},
		BookmarkCategory: {
			keyFields: ['id'],
		},
		Project: {
			keyFields: ['id', 'userId'],
		},
		Proposal: {
			keyFields: ['id'],
		},
		Message: {
			keyFields: ['id'],
			fields: {
				replies: {
					merge(existing = [], incoming = []) {
						return [...incoming];
					},
					keyFields: ['id'],
				},
			},
		},
		Review: {
			keyFields: ['id'],
		},
		User: {
			keyFields: ['id'],
		},
		UserService: {
			keyFields: ['id', 'userId'],
		},
		UserInfo: {
			keyFields: ['displayName', 'userId'],
		},
		UserBookmarks: {
			keyFields: ['id'],
		},
	},
});

const httpLink = createHttpLink({
	uri: `${GQL_SERVER_URL}`,
});

const authLink = setContext(() => {
	const token = localStorage.getItem(TOKEN_TITLE);
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

async function persist() {
	await persistCache({
		cache,
		storage: new LocalStorageWrapper(window.localStorage),
	});
}

persist();

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache,
});

const Provider = () => (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

export default Provider;
