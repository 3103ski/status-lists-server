const log = (msg, varObj, ...rest) => {
	console.log({ msg, ...varObj, ...rest });
};

module.exports = { log };
