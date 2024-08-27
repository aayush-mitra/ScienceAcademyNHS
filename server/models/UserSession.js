const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema(
  {
    name: String
  },
  {
    timestamps: true,
  }
);

module.exports = UserSession = mongoose.model("UserSession", UserSessionSchema);
