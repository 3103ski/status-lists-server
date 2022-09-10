function jsonRESPONSE(code, res, json) {
	res.statusCode = code;
	console.log({ hdr: res });
	res.setHeader('Content-Type', 'application/json');
	return res.json({ ...json });
}

module.exports = {
	jsonRESPONSE,
};
