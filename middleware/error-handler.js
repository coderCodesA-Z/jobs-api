const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong try again later",
	};

	// not needed anymore, handled below
	// if (err instanceof CustomAPIError) {
	//   return res.status(err.statusCode).json({ msg: err.message })
	// }

	// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })

	// mongoose validation error
	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(", ");
		customError.statusCode = 400;
	}

	// email duplicate error
	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		customError.statusCode = 400;
	}

	// mongoose casting error for mongoDB id, error occurs when id's length is reduced or exceeded
	if (err.name === "CastError") {
		customError.msg = `No item found with id : ${err.value}`;
		customError.statusCode = 404;
	}

	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
