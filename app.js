const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/userRoute");
const doctorRouter = require("./routes/doctorRoute");
const patientRouter = require("./routes/patientRoute");
const hospitalRouter = require("./routes/hospitalRoute");
const appointmentRouter = require("./routes/appointmentRoute");
const ticketRouter = require("./routes/ticketRoute");

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/tickets", ticketRouter);

module.exports = app;
