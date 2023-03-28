const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name...Please tell us your name..."],
    },
    email: {
      type: String,
      required: [true, "User must have a email...Please tell us your email..."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email..."],
    },
    doctorId: {
      type: String,
      required: [true, "Doctor's must have a ID"],
    },
    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
    },
    password: {
      type: String,
      required: [true, "Please choose a password..."],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password...."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same..",
      },
    },

    passwordChangedAt: Date,
    hospitals: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

doctorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "hospitals",
    // select: "-__v -passwordChangedAt",
  });

  next();
});

doctorSchema.virtual("appointments", {
  ref: "Appointment",
  foreignField: "doctors",
  localField: "_id",
});

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

doctorSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

doctorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

doctorSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000.1
    );
    return JWTTimeStamp < changedTimestamp;
  }
};

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
