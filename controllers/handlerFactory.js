const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    // console.log(req.headers);
    req.body.createdAt = req.requestTime;

    const doc = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      message: "posted successfully...",
      doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // let query = await Model.findById(req.params.id);
    let query;
    if (popOptions) {
      // query = await Model.findById(req.params.id).populate(popOptions[0]);
      if (popOptions.length == 2) {
        query = await Model.findById(req.params.id)
          .populate(popOptions[0])
          .populate(popOptions[1]);
      } else if (popOptions.length == 1) {
        query = await Model.findById(req.params.id).populate(popOptions[0]);
      } else if (popOptions.length == 3) {
        query = await Model.findById(req.params.id)
          .populate(popOptions[0])
          .populate(popOptions[1])
          .populate(popOptions[2]);
      } else if (popOptions.length == 4) {
        query = await Model.findById(req.params.id)
          .populate(popOptions[0])
          .populate(popOptions[1])
          .populate(popOptions[2])
          .populate(popOptions[3]);
      }

      // query = await Model.findById(req.params.id).populate(popOptions[0]);
    } else {
      query = await Model.findById(req.params.id);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      message: "found the document...",
      doc,
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) filter = { user: req.params.id };
    let features;

    if (popOptions) {
      features = new APIFeatures(
        Model.find(filter).populate(popOptions[1]).populate(popOptions[0]),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();
    } else {
      features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    }

    const doc = await features.query;

    let count = await new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();

    let totalCount = await count.query.countDocuments();
    console.log(doc);

    res.status(200).json({
      status: "success",
      message: `${doc.length} documents found...`,
      results: doc.length,
      totalCount,
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that Id", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document updated successfully...",
      doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document deleted successfully...",
    });
  });
