const mongoose = require("mongoose");
let dbURL = process.env.DBURL;
module.exports = {
  connectDB: async (cb) => {
    try {
      await mongoose.connect(dbURL);
      return cb();
    } catch (error) {
      return cb(error);
      process.exit(1);
    }
  },
};
