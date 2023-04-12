const Patient = require("../models/patientModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_PATIENT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (patient, statusCode, req, res) => {
  const token = signToken(patient._id);

  res.cookie("jwt_patient", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.sequre || req.headers["x-forwarded-proto"] === "https",
  });

  patient.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message: "Succesfull...",
    token,
    data: {
      patient,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const patient = await Patient.create({
    name: req.body.name,
    email: req.body.email,
    city: req.body.city,
    nic: req.body.nic,
    dateOfBirth: req.body.dateOfBirth,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  if (!patient) {
    return next(new AppError("There was an error signing up...", 500));
  }

  createSendToken(patient, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please enter a valid email or password...", 400));
  }

  const patient = await Patient.findOne({ email }).select("+password");

  if (!patient) {
    return next(new AppError("Incorrect Email or Password...", 401));
  }

  if (
    !patient ||
    !(await patient.correctPassword(password, patient.password))
  ) {
    return next(new AppError("Incorrect Email or Password ...", 401));
  }

  createSendToken(patient, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt_patient", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully...",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  console.log(req.headers.authorization);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt_patient) {
    token = req.cookies.jwt_patient;
  }

  // console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in... Please login to get access...")
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_PATIENT
  );

  console.log(decoded);

  const currentPatient = await Patient.findById(decoded.id);

  if (!currentPatient) {
    return next(
      new AppError(
        "The user belong to this token does no longer exists...",
        401
      )
    );
  }

  if (currentPatient.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Password was recently changed... Please login again...",
        401
      )
    );
  }

  req.patient = currentPatient;
  res.locals.patient = currentPatient;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.patient.role)) {
      return next(
        new AppError(
          "You do not have the permission to perform this action...",
          403
        )
      );
    }
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const patient = await Patient.findById(req.params.id).select("+password");

  if (!patient) {
    return next(
      new AppError(
        "There is no user with this id ... Please login again...",
        401
      )
    );
  }

  if (
    !(await patient.correctPassword(req.body.currentPassword, patient.password))
  ) {
    return next(new AppError("Your current password is wrong...", 401));
  }

  patient.password = req.body.password;
  patient.passwordConfirm = req.body.passwordConfirm;
  await patient.save();

  createSendToken(patient, 200, req, res);
});
