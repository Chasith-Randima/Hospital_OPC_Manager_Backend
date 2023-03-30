const mongoose = require("mongoose");
const slugify = require("slugify");
//const User = require("./userModel");
//const validator = require("validator");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Hospital must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A Hospital must have less or equal than 40 charactors"],
      minlength: [10, "A Hospital must have more or equal than 10 charactors"],
      //validate:[validator.isAlpha,"Hospital must only contain charactors"]
    },
    slug: String,
    city: {
      type: String,
      required: [true, "A Hospital must be in some city"],
    },

    // duration: {
    //   type: Number,
    //   required: [true, "A Hospital must have a duration"],
    // },

    // maxGroupSize: {
    //   type: Number,
    //   required: [true, "A Hospital must have a max group size"],
    // },
    // difficulty: {
    //   type: String,
    //   required: [true, "A Hospital must have a difficulty"],
    //   enum: {
    //     values: ["easy", "medium", "difficult"],
    //     message: "Difficulty must be either easy , medium or difficult",
    //   },
    // },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ratings must be above 1"],
      max: [5, "Ratings must be belovw 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A Hospital must have a summery"],
    },
    // imageCover: {
    //   type: String,
    //   required: [true, "A Hospital must have a image cover"],
    // },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    // startDates: [Date],
    secretHospital: {
      type: Boolean,
      default: false,
    },
    // startLocation: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     default: "Point",
    //   },
    //   coordinates: [Number],
    //   address: String,
    //   description: String,
    // },
    locations: [
      {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "User",
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

hospitalSchema.virtual("appointments", {
  ref: "Appointment",
  foreignField: "hospitals",
  localField: "_id",
});
hospitalSchema.virtual("patients", {
  ref: "Patient",
  foreignField: "hospitals",
  localField: "_id",
});
hospitalSchema.virtual("users", {
  ref: "User",
  foreignField: "hospitals",
  localField: "_id",
});
// hospitalSchema.virtual("appointments", {
//   ref: "Appointment",
//   foreignField: "hospitals",
//   localField: "_id",
// });
// hospitalSchema.virtual("appointments", {
//   ref: "Appointment",
//   foreignField: "hospitals",
//   localField: "_id",
// });
hospitalSchema.virtual("doctors", {
  ref: "Doctor",
  foreignField: "hospitals",
  localField: "_id",
});

// hospitalSchema.index({ price: 1, ratingsAverage: -1 });
// hospitalSchema.index({ slug: 1 });
// hospitalSchema.index({ startLocation: "2dsphere" });

// hospitalSchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "Hospital",
//   localField: "_id",
// });

hospitalSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// hospitalSchema.pre("save",async function(next){

//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// hospitalSchema.pre("save",function(){
//     console.log("will save documents");
// });

// hospitalSchema.post("save",function(doc, next){
//     console.log(doc);
//     next();
// });

hospitalSchema.pre(/^find/, function (next) {
  this.find({ secretHospital: { $ne: true } });

  this.start = Date.now();

  next();
});

// hospitalSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });

// hospitalSchema.post(/^find/,function(docs,next){

//     console.log(`query got ${Date.now()-this.start}`);
//     next();
// });

// hospitalSchema.pre("aggregate",function(next){

//     this.pipeline().unshift({$match:{secretHospital:{$ne:true}}});
//     next();
// })

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
