export class Request {
	constructor(body, header, params) {
		this.body = body || {};
		this.header = header || {};
		this.params = params || {};
	}
}


export class Response {
	constructor(body) {
		this.body = body || {};
		this.statusCode = null;
	}

	status(statusCode) {
		this.statusCode = statusCode;
		return this;
	}

	json(body) {
		this.body = body || {};
		return this;
	}

	sendStatus(statusCode) {
		this.statusCode = statusCode;
	}

}