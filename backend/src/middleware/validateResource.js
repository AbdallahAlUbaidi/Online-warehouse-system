import ValidationError from "../errors/ApiErrors/ValidationError.js";

export default schema => (req, res, next) => {
	try {
		schema.parse({
			body: req.body,
			params: req.params,
			query: req.query
		});
		next();
	} catch (err) {
		next(new ValidationError(
			err
				.issues
				.map(i => ({ path: i.path, message: i.message }))
		));
	}
};