const mongoose = require("mongoose");
const slugify = require("slugify");
// const Patient = require("./patientModel");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Appointment must have a patient name.."],
    },
    appointmentDate: {
      type: Date,
      required: [true, "A appointment must have a date"],
    },
    appointmentTime: {
      type: String,
      required: [true, "Ap appointment must have time"],
    },
    hospitals: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
        required: [true, "Appointment must belong to a hospital"],
      },
    ],
    tickets: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Ticket",
        // required: [true, "Appointment must belong to a hospital"],
      },
    ],
    patients: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Patient",
        required: [true, "Review must belong to a tour"],
      },
    ],
    doctors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
        required: [true, "Review must belong to a tour"],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

appointmentSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: "hospitals",
    // select: '-__v -passwordChangedAt',
  });
  this.populate({
    path: "patients",
  });
  this.populate({
    path: "tickets",
  });

  next();
});

// appointmentSchema.virtual("tickets", {
//   ref: "Ticket",
//   foreignField: "appointment",
//   localField: "_id",
// });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
