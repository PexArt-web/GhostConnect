const mongoose = require("mongoose");
const dbURL = process.env.DBURL;
module.exports = {
  connectDB: async (cb) => {
    try {
      const connectDataBase = await mongoose.connect(dbURL);
      return cb();
    } catch (error) {
      return cb(error);
    }
  },
};
