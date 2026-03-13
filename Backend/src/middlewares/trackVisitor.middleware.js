import { Visitor } from "../models/visitor.model.js";

export const trackVisitor = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // check if this IP already visited today (for unique count)
    const alreadyVisited = await Visitor.findOne({
      ip,
      visitDate: today,
    });

    if (!alreadyVisited) {
      await Visitor.create({
        ip,
        userAgent: req.headers["user-agent"],
        visitDate: today,
      });
    }
  } catch (err) {
    console.log("Visitor tracking error:", err.message);
  }

  next();
};
