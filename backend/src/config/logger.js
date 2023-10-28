import logger from "pino";


const log = logger({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			ignore: "pid,hostname",
		}
	}
});


export default log;