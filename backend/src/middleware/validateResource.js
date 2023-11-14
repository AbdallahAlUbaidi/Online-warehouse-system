export default schema => (req, res, next) => {
	try {
		schema.parse({
			body: req.body,
			params: req.params,
			query: req.query
		});
	} catch (err) {
		next(err);
	}
};