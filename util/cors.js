const cors = require('cors');

const whitelist = [
	`${process.env.CLIENT_URL}`,
	'http://localhost:3000',
	'http://13.58.190.176:3003/',
	'http://75.2.60.5',
	'https://localhost:3001',
	'https://localhost:3443',
	'https://13.58.190.176:3443',
	'https://75.2.60.5',
];
const corsOptionsDelegate = (req, callback) => {
	let corsOptions;

	// Standard requests have 'req.header', axios has 'res.headers'
	if (whitelist.indexOf(req.header('Origin')) !== -1 || whitelist.indexOf(req.headers.origin) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = {
			origin: false,
		};
	}
	callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
