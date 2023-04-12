const Appointment = require("../models/appointmentModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

exports.createOneAppointment = factory.createOne(Appointment);
exports.getOneAppointment = factory.getOne(Appointment, [{ path: "tickets" }]);
exports.getAllAppointment = factory.getAll(Appointment);
exports.updateOneAppointment = factory.updateOne(Appointment);
exports.deleteOneAppointment = factory.deleteOne(Appointment);

exports.searchAppointment = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  let date = new Date();
  //   console.log(date.setHours(0, 0, 0));
  //   console.log(date.setDate(date.getDate() + 1));
  // console.log(date.setHours(0, 0, 0, 0));
  // console.log(date.toISOString());
  let date2 = new Date();
  // console.log(date2.setHours(0, 0, 0, 0));
  date2 = date2.setDate(date.getDate() + 1);
  // console.log(typeof date, typeof date2);
  date = date.toISOString();
  // console.log(new Date(date2).toISOString());
  date2 = new Date(date2).toISOString();

  //   console.log(req.query);
  if (search.length != 0) {
    await Appointment.find({
      arrived: true,
      // appointmentDate: [gte]date,
      // "appointmentDate[lte]": date2,
      $or: [
        //   name: { $regex: search, $options: "i" },
        { name: { $regex: search, $options: "i" } },
        // { arrived: { $regex: true, $options: "i" } },
        // { _id: { $regex: search, $options: "i" } },
        //   _id: { $regex: search, $options: "i" },
        // { active: { $regex: search, $options: "i" } },
        // { patients: { $regex: search, $options: "i" } },
        // { hospitals: { $regex: search, $options: "i" } },
        // { appointmentDate: { $regex: search, $options: "i" } },
      ],
    })
      .then((data) => {
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          satus: "failed",
          message: err,
        });
      });
  }
});
exports.searchPatientsAppointment = catchAsync(async (req, res, next) => {
  const { search, id } = req.query;
  // console.log(typeof id, typeof search);
  if (search.length != 0) {
    await Appointment.find({
      $or: [
        //   name: { $regex: search, $options: "i" },
        { name: { $regex: search, $options: "i" } },
        { patients: { $regex: [id], $options: "i" } },
        //   _id: { $regex: search, $options: "i" },
        // { active: { $regex: search, $options: "i" } },
        // { patients: { $regex: search, $options: "i" } },
        // { hospitals: { $regex: search, $options: "i" } },
        // { appointmentDate: { $regex: search, $options: "i" } },
      ],
    })
      .then((data) => {
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          satus: "failed",
          message: err,
        });
      });
  }
});

// --------------- appointments cound by time ---------------------------
exports.getAppointmentStatsclsoded = catchAsync(async (req, res, next) => {
  // console.log(date.setHours(0, 0, 0, 0));
  // console.log(date.toISOString());
  let date = new Date();
  let date2 = new Date();
  date = date.setUTCHours(0, 0, 0, 0);
  date = new Date(date);
  date2 = date2.setUTCHours(0, 0, 0, 0);
  date2 = new Date(date2);
  date2 = date2.setDate(date.getDate() + 1);
  // console.log(typeof date, typeof date2);
  date = date.toISOString();
  // console.log(new Date(date2).toISOString());
  date2 = new Date(date2).toISOString();
  // console.log(date);
  // console.log(date2);
  date = new Date(date);
  date2 = new Date(date2);
  // const stats = await Appointment.find(
  //   // {
  //   //   "appointmentDate[gte]": date,
  //   //   "appointmentDate[gte]": date2,
  //   // },
  //   { appointmentDate: { $gte: date, $lte: date2 } }
  // );

  const timeArray = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  let countArray = [];

  for (let i = 0; i < timeArray.length; i++) {
    const stats = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: date, $lte: date2 },
          appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       // $lte: date2,
      //     },
      //   },
      // },
      // {
      //   $group: {
      //     _id: { $toUpper: "$appointmentDate" },
      //     numAppointments: { $sum: 1 },

      //     // numRatings: { $sum: "$ratingsQuantity" },
      //     // avgRating: { $avg: "$ratingsAverage" },
      //     // avgPrice: { $avg: "$price" },
      //     // minPrice: { $min: "$price" },
      //     // maxPrice: { $max: "$price" },
      //   },
      // },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       $lte: date2,
      //     },
      //   },
      // },

      // {
      //   $sort: { avgPrice: 1 },
      // },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    if (stats[0] != undefined) {
      console.log(stats[0].count);
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
    // console.log(stats[0].count);
  }

  // const stats = await Appointment.aggregate([
  //   {
  //     $match: {
  //       appointmentDate: { $gte: date, $lte: date2 },
  //       appointmentTime: { $gte: "13:00", $lte: "14:00" },
  //     },
  //   },
  //   { $group: { _id: null, count: { $sum: 1 } } },
  //   // {
  //   //   $match: {
  //   //     appointmentDate: {
  //   //       $gte: date,
  //   //       // $lte: date2,
  //   //     },
  //   //   },
  //   // },
  //   // {
  //   //   $group: {
  //   //     _id: { $toUpper: "$appointmentDate" },
  //   //     numAppointments: { $sum: 1 },

  //   //     // numRatings: { $sum: "$ratingsQuantity" },
  //   //     // avgRating: { $avg: "$ratingsAverage" },
  //   //     // avgPrice: { $avg: "$price" },
  //   //     // minPrice: { $min: "$price" },
  //   //     // maxPrice: { $max: "$price" },
  //   //   },
  //   // },
  //   // {
  //   //   $match: {
  //   //     appointmentDate: {
  //   //       $gte: date,
  //   //       $lte: date2,
  //   //     },
  //   //   },
  //   // },

  //   // {
  //   //   $sort: { avgPrice: 1 },
  //   // },
  //   // {
  //   //   $match: { _id: { $ne: 'EASY' } }
  //   // }
  // ]);

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    countArray,
    // },
  });
});
// exports.getAppointmentStatsMonth = catchAsync(async (req, res, next) => {
//   // console.log(date.setHours(0, 0, 0, 0));
//   // console.log(date.toISOString());
//   // let date = new Date();
//   // let date2 = new Date();
//   // date = date.setUTCHours(0, 0, 0, 0);
//   // // date = date.setUTCDate(1);
//   // date = new Date(date);
//   // // date2 = date2.setUTCHours(0, 0, 0, 0);
//   // date2 = date2.setUTCDate(0);
//   // date2 = new Date(date2);
//   // date2 = date2.setUTCMonth(date.getUTCMonth() + 1);
//   // date2 = new Date(date2);
//   // date2 = date2.setUTCDate(0);
//   // // date2 = date2.setDate(date.getDate());
//   // // console.log(typeof date, typeof date2);
//   // date = date.toISOString();
//   // // console.log(new Date(date2).toISOString());
//   // date2 = new Date(date2).toISOString();
//   // console.log(date);
//   // console.log(date2);
//   // date = new Date(date);
//   // date2 = new Date(date2);
//   // console.log(date);
//   // console.log(date2);
//   // const stats = await Appointment.find(
//   //   // {
//   //   //   "appointmentDate[gte]": date,
//   //   //   "appointmentDate[gte]": date2,
//   //   // },
//   //   { appointmentDate: { $gte: date, $lte: date2 } }
//   // );

//   let date = new Date();
//   let date2 = new Date();

//   date2 = date2.setUTCMonth(date.getUTCMonth() + 1);
//   date2 = new Date(date2);

//   newDate = new Date(
//     `${date.toISOString().split("-")[0]}-${date.toISOString().split("-")[1]}`
//   );
//   newDate2 = new Date(
//     `${date2.toISOString().split("-")[0]}-${date2.toISOString().split("-")[1]}`
//   );
//   console.log(date);
//   console.log(date2);
//   console.log(newDate);
//   console.log(newDate2);

//   const daysArray = [
//     "01",
//     "02",
//     "03",
//     "04",
//     "05",
//     "06",
//     "07",
//     "08",
//     "10",
//     "11",
//     "12",
//     "13",
//     "14",
//     "15",
//     "16",
//     "17",
//     "18",
//     "19",
//     "20",
//     "21",
//     "22",
//     "23",
//     "24",
//     "25",
//     "26",
//     "27",
//     "28",
//     "29",
//     "30",
//     "31",
//   ];

//   let countArray = [];
//   let firstDate = new Date();
//   let dateMonth = new Date(
//     firstDate.getUTCFullYear(),
//     firstDate.getUTCMonth(),
//     1
//   );
//   console.log(dateMonth);

//   for (let i = 0; i <= daysArray.length; i++) {
//     let date1 = `${newDate}-${daysArray[i]}`;

//     let date2 = `${newDate}-${daysArray[i + 1]}`;
//     console.log(date1);
//     console.log(date2);
//     const stats = await Appointment.aggregate([
//       {
//         $match: {
//           appointmentDate: { $gte: newDate, $lte: newDate2 },
//           appointmentDate: {
//             $gte: date1,
//             $lte: date2,
//           },
//         },
//       },
//       { $group: { _id: null, count: { $sum: 1 } } },
//     ]);
//     if (stats[0] && stats[0].count) {
//       console.log(stats[0].count);
//       countArray.push(stats[0].count);
//     } else {
//       countArray.push(0);
//     }
//     console.log(countArray);
//   }
//   console.log(countArray);
//   res.status(200).json({
//     status: "success",
//     // results: stats.length,
//     // data: {
//     countArray,
//     // },
//   });
// });
// ===================== NOT DOING ENYTHING USEFULL ===================================
exports.getAppointmentStatsMonth = catchAsync(async (req, res, next) => {
  const year = new Date(new Date().getUTCFullYear());
  const month = new Date(new Date().getUTCMonth() + 1);
  const day = new Date(new Date().getUTCDate());
  // console.log(year);
  // console.log(month);
  // console.log(day);
  let tryDate = new Date();

  const plan = await Appointment.aggregate([
    {
      // { $group: { _id: null, count: { $sum: 1 } } },
      $group: {
        _id: { appointmentDate: "2023-04-08" },
        Total: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

// ===================== NOT DOING ENYTHING USEFULL ===================================

exports.getAppointmentStats = catchAsync(async (req, res, next) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // let date = new Date();
  let dateOne = new Date();
  let date = new Date(dateOne.getFullYear(), dateOne.getMonth(), 1);
  let lastDay = new Date(dateOne.getFullYear(), dateOne.getMonth() + 1, 0);
  // console.log("this is last day", lastDay);
  let date2 = new Date();
  let nextDate = new Date(date2.setDate(date.getDate() + 1)).toISOString();

  date = new Date(date);
  let tempDate;

  let length = new Date(date.getYear(), date.getMonth(), 0).getDate();
  // console.log("mongth size", length);
  let countArray = [];
  for (let i = 1; i <= length; i++) {
    // console.log("-----one check-----");
    // console.log(date);
    // console.log(nextDate);
    // console.log(date == lastDay);

    const stats = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: date, $lte: date2 },
          // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       // $lte: date2,
      //     },
      //   },
      // },
      // {
      //   $group: {
      //     _id: { $toUpper: "$appointmentDate" },
      //     numAppointments: { $sum: 1 },

      //     // numRatings: { $sum: "$ratingsQuantity" },
      //     // avgRating: { $avg: "$ratingsAverage" },
      //     // avgPrice: { $avg: "$price" },
      //     // minPrice: { $min: "$price" },
      //     // maxPrice: { $max: "$price" },
      //   },
      // },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       $lte: date2,
      //     },
      //   },
      // },

      // {
      //   $sort: { avgPrice: 1 },
      // },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    if (stats[0] != undefined) {
      console.log(stats[0].count);
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
    // console.log("-----one check  end -----");
    if (date == lastDay) {
      break;
    }

    tempDate = nextDate;
    nextDate = new Date(nextDate);
    nextDate = new Date(date2.setDate(nextDate.getDate() + 1)).toISOString();
    date = new Date(tempDate);
  }

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    countArray,
    // },
  });
});

// -------------- ALL appointments count by month WITHOUT HOSPITAL--------------------------------------
exports.getAppointmentStatsByMonthl = catchAsync(async (req, res, next) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // console.log(req.query);
  let month = req.query.month;
  // console.log(month);
  // let date = new Date();
  let dateOne = new Date(new Date().setMonth(month));
  // console.log(dateOne);
  let date = new Date(dateOne.getFullYear(), dateOne.getMonth(), 1);
  // console.log(date);
  let lastDay = new Date(dateOne.getFullYear(), dateOne.getMonth() + 1, 0);
  // console.log("this is last day", lastDay);
  let date2 = new Date();
  date2.setUTCMonth(month);
  // console.log(date2);
  // let nextDate = new Date(date2.setDate(date.getDate() + 1)).toISOString();

  date = new Date(date);
  let tempDate;

  let length = new Date(date.getYear(), date.getMonth(), 0).getDate();
  // console.log("mongth size", length);
  let countArray = [];
  for (let i = 1; i <= length; i++) {
    // console.log("-----one check-----");
    // console.log(date);
    // console.log(nextDate);
    // console.log(date == lastDay);

    const stats = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: date, $lte: date2 },
          // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       // $lte: date2,
      //     },
      //   },
      // },
      // {
      //   $group: {
      //     _id: { $toUpper: "$appointmentDate" },
      //     numAppointments: { $sum: 1 },

      //     // numRatings: { $sum: "$ratingsQuantity" },
      //     // avgRating: { $avg: "$ratingsAverage" },
      //     // avgPrice: { $avg: "$price" },
      //     // minPrice: { $min: "$price" },
      //     // maxPrice: { $max: "$price" },
      //   },
      // },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       $lte: date2,
      //     },
      //   },
      // },

      // {
      //   $sort: { avgPrice: 1 },
      // },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    if (stats[0] != undefined) {
      console.log(stats[0].count);
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
    // console.log("-----one check  end -----");
    if (date == lastDay) {
      break;
    }

    tempDate = nextDate;
    nextDate = new Date(nextDate);
    nextDate = new Date(date2.setDate(nextDate.getDate() + 1)).toISOString();
    date = new Date(tempDate);
  }

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    countArray,
    // },
  });
});

// -------------- ALL appointments count by month --------------------------------------

// --------------appointments count by month for given hospital route --appointmentTimeStatsByMonth?month=04-------------------------
exports.getAppointmentStatsByMonth = catchAsync(async (req, res, next) => {
  let year = new Date().getFullYear();

  let month = req.query.month;
  let hospitalId = req.query.hospitalId;
  // console.log(month, hospitalId);
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  let daysForMonth = getDaysInMonth(year, month);
  // console.log(daysForMonth);

  let currentDay = `${year}-${month}-${01}`;
  let nextDay;
  let stats;
  let countArray = [];

  let ObjectId = new mongoose.Types.ObjectId(hospitalId);

  for (let i = 1; i <= daysForMonth; i++) {
    // console.log(`${year}-${month}-${i}`);
    // console.log(`${year}-${month}-${i + 1}`);
    currentDay = new Date(`${year}-${month}-${i}`);
    nextDay = new Date(`${year}-${month}-${i + 1}`);
    let nextDayNew = new Date(
      new Date(currentDay).setDate(currentDay.getDate() + 1)
    );

    stats = await Appointment.aggregate([
      {
        $match: {
          $and: [
            { appointmentDate: { $gte: currentDay, $lte: nextDayNew } },

            { hospitals: { $in: [ObjectId] } },
          ],
          // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    // ---date object
    // console.log(stats);
    if (stats && stats[0] && stats[0].count != undefined) {
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
    // console.log(currentDay);
    // console.log(nextDay);
    // console.log(
    //   new Date(new Date(currentDay).setDate(currentDay.getDate() + 1))
    // );
  }

  // if (stats[0] != undefined) {
  //   console.log(stats[0].count);
  //   countArray.push(stats[0].count);
  // } else {
  //   countArray.push(0);
  // }
  // console.log("-----one check  end -----");
  // if (date == lastDay) {
  //   break;
  // }

  //   tempDate = nextDate;
  //   nextDate = new Date(nextDate);
  //   nextDate = new Date(date2.setDate(nextDate.getDate() + 1)).toISOString();
  //   date = new Date(tempDate);
  // }

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    stats,
    countArray,
    // },
  });
});
// --------------appointments count by month for given hospital -------------------------

// --------------appointments count by year -------------------------
exports.getAppointmentStatsByYearClosed = catchAsync(async (req, res, next) => {
  let year = new Date().getFullYear();

  // let month = req.query.month;
  //   const getDaysInMonth = (year, month) => {
  //     return new Date(year, month, 0).getDate();
  //   };
  let MonthSForYear = 12;
  // console.log(MonthSForYear);

  let currentDay = `${year}-${01}-${01}`;
  // let nextDay;

  let nextDay;
  let stats;
  let countArray = [];

  for (let i = 1; i <= MonthSForYear; i++) {
    // console.log(`${year}-${i}-${01}`);
    // console.log(`${year}-${i + 1}-${01}`);
    currentDay = new Date(`${year}-${i}-${01}`);
    nextDay = new Date(`${year}-${i + 1}-${01}`);
    let nextDayNew = new Date(
      new Date(currentDay).setMonth(currentDay.getMonth() + 1)
    );

    // ---date object
    // console.log(currentDay);
    // console.log(nextDay);
    console.log(
      new Date(new Date(currentDay).setMonth(currentDay.getMonth() + 1))
    );

    stats = await Appointment.aggregate([
      {
        $match: {
          $and: [
            { appointmentDate: { $gte: currentDay, $lte: nextDayNew } },
            // { hospitals: { $in: ["641ffecd4e86b8852a090c16"] } },
          ],
          // hospitals: "642a5e5683051d9a2c583fc6",
          // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      // {
      //   $match: {
      //     appointmentDate: { $gte: currentDay, $lte: nextDayNew },
      //     // hospitals: "642a5e5683051d9a2c583fc6",
      //     // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
      //   },
      // },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    if (stats && stats[0] && stats[0].count != undefined) {
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
  }

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    stats,
    countArray,
    // },
  });
});

// --------------appointments count by year -------------------------
// --------------appointments count by year for given hospital  appointmentTimeStatsByYear-------------------------
exports.getAppointmentStatsByYear = catchAsync(async (req, res, next) => {
  let year = new Date().getFullYear();
  let hospitalId = req.query.hospitalId;

  // let month = req.query.month;
  //   const getDaysInMonth = (year, month) => {
  //     return new Date(year, month, 0).getDate();
  //   };
  let MonthSForYear = 12;
  // console.log(MonthSForYear);

  let currentDay = `${year}-${01}-${01}`;
  // let nextDay;

  let nextDay;
  let stats;
  let countArray = [];

  let ObjectId = new mongoose.Types.ObjectId(hospitalId);

  // let ObjectId = new mongoose.Types.ObjectId("641ffecd4e86b8852a090c16");

  let data = [];

  for (let i = 1; i <= MonthSForYear; i++) {
    // console.log(`${year}-${i}-${01}T00:00:00.000Z`);
    // console.log(`${year}-${i + 1}-${01}T00:00:00.000Z`);
    // currentDay = new Date(Date.UTC(`${year}-${i}-${01}`));
    // nextDay = new Date(Date.UTC(`${year}-${i + 1}-${01}`));
    currentDay = new Date(Date.UTC(year, i, 01, 0, 0, 0, 0));
    nextDay = new Date(Date.UTC(year, i + 1, 01, 0, 0, 0, 0));
    let nextDayNew = new Date(
      new Date(currentDay).setMonth(currentDay.getMonth() + 1)
    );

    // ---date object
    // console.log(currentDay);
    // console.log(nextDay);
    // console.log(
    //   new Date(new Date(currentDay).setMonth(currentDay.getMonth() + 1))
    // );

    // stats = await Appointment.find({
    //   hospitals: { $in: "641ffecd4e86b8852a090c16" },
    //   appointmentDate: { $gte: currentDay },
    //   appointmentDate: { $lte: nextDayNew },
    // });

    // console.log(stats.length);

    stats = await Appointment.aggregate([
      {
        $match: {
          $and: [
            { appointmentDate: { $gte: currentDay, $lte: nextDayNew } },
            { hospitals: { $in: [ObjectId] } },
          ],
          // hospitals: "642a5e5683051d9a2c583fc6",
          // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      // {
      //   $match: {
      //     appointmentDate: { $gte: currentDay, $lte: nextDayNew },
      //     // hospitals: "642a5e5683051d9a2c583fc6",
      //     // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
      //   },
      // },
      { $group: { _id: "$appointmentDate", count: { $sum: 1 } } },
    ]);

    // if (stats.length != 0) {
    //   console.log(stats.length);
    //   countArray.push(stats.length);
    //   console.log(stats);
    // } else {
    //   countArray.push(0);
    // }

    // stats = "";
    // console.log(stats);

    data.push(stats);

    if (stats && stats[0] && stats[0].count != undefined) {
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
  }

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    stats,
    countArray,
    data,
    // },
  });
});

// --------------appointments count by year for given hospital -------------------------

exports.getAppointmentsByTimeHospital = catchAsync(async (req, res, next) => {
  const hospitalId = req.query.hospitalId;

  const ObjectId = new mongoose.Types.ObjectId(hospitalId);

  stats = await Appointment.aggregate([
    {
      $match: {
        hospitals: { $in: [ObjectId] },
      },
    },
    { $group: { _id: "$appointmentTime", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getAppointmentsByTime = catchAsync(async (req, res, next) => {
  stats = await Appointment.aggregate([
    { $group: { _id: "$appointmentTime", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getAppointmentsByDateHospital = catchAsync(async (req, res, next) => {
  const hospitalId = req.query.hospitalId;
  // console.log(hospitalId, "0000000000000000000000");
  const ObjectId = new mongoose.Types.ObjectId(hospitalId);
  stats = await Appointment.aggregate([
    {
      $match: {
        hospitals: { $in: [ObjectId] },
      },
    },
    { $group: { _id: "$appointmentDate", count: { $sum: 1 } } },
  ]);
  // console.log(stats);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getAllAppointmentsByDate = catchAsync(async (req, res, next) => {
  stats = await Appointment.aggregate([
    { $group: { _id: "$appointmentDate", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getAllAppointmentsByMonthHospital = catchAsync(
  async (req, res, next) => {
    stats = await Appointment.aggregate([
      { $group: { _id: "$appointmentDate", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: "success",
      message: "done..",
      stats,
    });
  }
);
// -----------------------------------------------------------------------------------------------------
