const mongoose = require("mongoose");
const slugify = require("slugify");
// const Appointment = require("./appointmentModel");

const ticketSchema = new mongoose.Schema(
  {
    appointment: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Appointment",
        required: [true, "Ticket must belong to a appointment"],
      },
    ],
    patients: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Patient",
        required: [true, "Ticket must belong to a appointment"],
      },
    ],
    pharmacists: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Ticket must belong to a appointment"],
      },
    ],
    diagnosis: {
      type: String,
      required: [true, "Ticket must have a diagnosis.."],
    },
    prescription: {
      type: String,
      required: [true, "Ticket must have a prescriptions..."],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ticketSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patients",
    // select: '-__v -passwordChangedAt',
  });
  this.populate({
    path: "pharmacists",
  });
  this.populate({
    path: "appointment",
  });

  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
