import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    visitedAt: {
      type: Date,
      default: Date.now,
    },

    // helps count unique visitors per day
    visitDate: {
      type: String, // YYYY-MM-DD
    },
  },
  { timestamps: true },
);

export const Visitor = mongoose.model("Visitor", visitorSchema);
