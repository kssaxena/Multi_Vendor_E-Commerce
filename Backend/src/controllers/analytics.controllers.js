import { Visitor } from "../models/visitor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getVisitorStats = asyncHandler(async (req, res) => {
  const totalVisits = await Visitor.countDocuments();

  const today = new Date().toISOString().slice(0, 10);

  const todayVisits = await Visitor.countDocuments({
    visitDate: today,
  });

  const uniqueVisitors = await Visitor.aggregate([
    {
      $group: {
        _id: "$ip",
      },
    },
    {
      $count: "uniqueVisitors",
    },
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalVisits,
      todayVisits,
      uniqueVisitors: uniqueVisitors[0]?.uniqueVisitors || 0,
    }),
  );
});
