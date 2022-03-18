function jsonRESPONSE(code, res, json) {
	res.statusCode = code;
	res.setHeader('Content-Type', 'application/json');
	return res.json({ ...json });
}

module.exports = {
	jsonRESPONSE,
};
