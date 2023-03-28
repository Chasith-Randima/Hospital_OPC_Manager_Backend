const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        "Patient must have a name...Please tell us your name...",
      ],
    },
    nic: {
      type: String,
      required: [true, "Patient must have a NIC number"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Patient must have a date of birth"],
    },
    city: {
      type: String,
      required: [true, "A patient must have a city..."],
    },
    email: {
      type: String,
      required: [
        true,
        "Patient must have a email...Please tell us your email...",
      ],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email..."],
    },
    role: {
      type: String,
      enum: ["patient"],
      default: "patient",
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

    passwordChangedAt: {
      type: Date,
    },
    hospitals: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
        required: [true, "Appointment must belong to a hospital"],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

patientSchema.virtual("appointments", {
  ref: "Appointment",
  foreignField: "patients",
  localField: "_id",
});
patientSchema.virtual("tickets", {
  ref: "Ticket",
  foreignField: "patients",
  localField: "_id",
});

patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

patientSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

patientSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

patientSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000.1
    );
    return JWTTimeStamp < changedTimestamp;
  }
};

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
