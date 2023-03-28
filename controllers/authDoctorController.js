const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_DOCTOR, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (doctor, statusCode, req, res) => {
  const token = signToken(doctor._id);

  res.cookie("jwt_doctor", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.sequre || req.headers["x-forwarded-proto"] === "https",
  });

  doctor.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message: "Succesfull...",
    token,
    data: {
      doctor,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.create({
    name: req.body.name,
    email: req.body.email,
    doctorId: req.body.doctorId,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    hospitals: req.body.hospitals,
  });

  if (!doctor) {
    return next(new AppError("There was an error signing up...", 500));
  }

  createSendToken(doctor, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please enter a valid email or password...", 400));
  }

  const doctor = await Doctor.findOne({ email }).select("+password");

  if (!doctor) {
    return next(new AppError("Incorrect Email or Password...", 401));
  }

  if (!doctor || !(await doctor.correctPassword(password, doctor.password))) {
    return next(new AppError("Incorrect Email or Password ...", 401));
  }

  createSendToken(doctor, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt_doctor", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully...",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt_doctor) {
    token = req.cookies.jwt_doctor;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in... Please login to get access...")
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_DOCTOR
  );

  const currentDoctor = await Doctor.findById(decoded.id);

  if (!currentDoctor) {
    return next(
      new AppError(
        "The user belong to this token does no longer exists...",
        401
      )
    );
  }

  if (currentDoctor.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Password was recently changed... Please login again...",
        401
      )
    );
  }

  req.doctor = currentDoctor;
  res.locals.doctor = currentDoctor;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
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
  const doctor = await Doctor.findById(req.doctor.id).select("+password");

  if (!doctor) {
    return next(
      new AppError(
        "There is no user with this id ... Please login again...",
        401
      )
    );
  }

  if (
    !(await doctor.correctPassword(req.body.currentPassword, doctor.password))
  ) {
    return next(new AppError("Your current password is wrong...", 401));
  }

  doctor.password = req.body.password;
  doctor.passwordConfirm = req.body.passwordConfirm;
  await doctor.save();

  createSendToken(doctor, 200, req, res);
});
