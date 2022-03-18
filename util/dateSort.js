module.exports = function dateSort(arr) {
	return arr.sort(function (a, b) {
		return new Date(b.createdAt) - new Date(a.createdAt);
	});
};
