import mongoose, { Schema } from "mongoose"
import { maxLength } from "zod"
import { required } from "zod/mini"

const dealSchema = new Schema({
    investor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    startup: {
        type: Schema.Types.ObjectId,
        ref: "Startup",
        required: true,
    },

    message: {
        type: String,
        trim: true,
        maxLength: [1000, "Message cannot exceed 1000 characters"]
    },

    offerAmount: {
        type: Number,
        required: true,
        min: [10000, "Offer amount cannot be negative"],
    },

    status: {
        type: String,
        enum: [
            "interested",
            "in_discussion",
            "negotiating",
            "accepted",
            "rejected",
            "closed",
        ],
        default: "interested",
    },
    closedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

dealSchema.index({ investor: 1, startup: 1 }, { unique: true });

dealSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "closed") {
        this.closedAt = new Date();
    }
    next();
});

dealSchema.statics.getActiveDeals = function () {
    return this.find({ status: { $ne: "closed" } });
};

dealSchema.methods.isFinalized = function () {
    return ["accepted", "rejected", "closed"].includes(this.status);
};

export const Deal = mongoose.model("Deal", dealSchema);