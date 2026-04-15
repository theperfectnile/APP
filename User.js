const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
 trialStart: { type: Date, default: null },
  trialActive: { type: Boolean, default: false },
});
module.exports = mongoose.model("User", UserSchema);
