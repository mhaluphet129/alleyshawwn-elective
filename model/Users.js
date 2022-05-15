const mongoose = require("mongoose");

const Userschema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("User", Userschema);
