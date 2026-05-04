import mongoose, { Schema } from "mongoose";

const dealSchema = new Schema(
  {
    investor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startup: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      index: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    offerAmount: {
      type: Number,
      required: true,
      min: [10000, "Offer must be at least 10,000"],
    },

    status: {
      type: String,
      enum: ["interested", "accepted", "rejected", "withdrawn", "closed"],
      default: "interested",
      index: true,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);



dealSchema.index({ investor: 1, startup: 1 }, { unique: true,
  partialFilterExpression: {
      status: { $in: ["interested", "accepted"] },
    },
 });



dealSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "accepted") {
      this.acceptedAt = new Date();
    }

    if (["rejected", "withdrawn", "closed"].includes(this.status)) {
      this.closedAt = new Date();
    }
  }
  return;
});



// get only active deals
dealSchema.statics.getActiveDeals = function () {
  return this.find({
    status: { $in: ["interested", "accepted"] },
  });
};

// check if deal is finished
dealSchema.methods.isFinalized = function () {
  return ["rejected", "withdrawn", "closed"].includes(this.status);
};

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;
