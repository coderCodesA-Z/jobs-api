const mongoose = require("mongoose");

const connectDB = (url) => {
	return mongoose
		.connect(url)
		.then(() => console.log("MongoDB Connection Successful"))
		.catch((err) =>
			console.log(`MongoDB Connection Failed with Error:\n${err}`)
		);
};

module.exports = connectDB;
