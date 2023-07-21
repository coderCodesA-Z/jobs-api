const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
	// we don't want all the jobs, hence use { createdBy: req.user.userId }
	const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await Job.findOne({
		_id: jobId,
		createdBy: userId,
	});
	if (!job) {
		throw new NotFoundError(`No job with id : ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);
	res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
	const {
		body: { company, position },
		user: { userId },
		params: { id: jobId },
	} = req;

	if (company === "" || position === "") {
		throw new BadRequestError("Company or Position fields cannot be Empty");
	}
	const job = await Job.findByIdAndUpdate(
		{ _id: jobId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true } // set the new option to true to return the document after update was applied.
		// runValidators to run the validators on the new values
	);
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await Job.findByIdAndRemove({
		_id: jobId,
		createdBy: userId,
	});
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).send();
};

module.exports = {
	createJob,
	deleteJob,
	getAllJobs,
	updateJob,
	getJob,
};
