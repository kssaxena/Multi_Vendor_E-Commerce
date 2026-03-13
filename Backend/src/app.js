import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

const allowedOrigins = [
  process.env.ORIGIN_1,
  process.env.ORIGIN_2,
  process.env.ORIGIN_3,
  process.env.ORIGIN_4,
  process.env.ORIGIN_UI,
  process.env.ORIGIN_VA,
  process.env.ORIGIN_A,
  process.env.AMIT_SIR_HOST,
  process.env.AMIT_SIR_HOST_VENDOR,
  process.env.AMIT_SIR_HOST_SUPER_ADMIN,
  process.env.AMIT_SIR_HOST_ADMIN,
];

const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "32kb" })); // For JSON format
app.use(express.text({ type: "text/*", limit: "32kb" })); // For plain text format
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(trackVisitor);

//print function to ensure every step is executed
app.use((req, res, next) => {
  console.log(`Received:`, req.method);
  console.log(`at:`, req.url);
  console.log(`with body:`, req.body);
  next();
});

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("UsersRoom", (userId) => {
//     if (userId) {
//       socket.join(userId);
//       console.log(`User ${userId} joined their room`);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// routers
import vendorRouter from "./routes/vendor.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import categoryRouter from "./routes/category-and-subcategory.routes.js";
import brandRouter from "./routes/brand.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import promotionRouter from "./routes/promotion.routes.js";
import driverRouter from "./routes/delivery-partner.routes.js";
import productPolicyRouter from "./routes/productPolicy.route.js";

//analytics counter
import { trackVisitor } from "./middlewares/trackVisitor.middleware.js";
import analyticsRoutes from "./routes/analytics.routes.js";

//vendor routes
app.use("/api/v1/vendor", vendorRouter);

//product routes
app.use("/api/v1/products", productRouter);

//orders routes
app.use("/api/v1/orders", orderRouter);

//user routes
app.use("/api/v1/users", userRouter);

//admin routes
app.use("/api/v1/admins", adminRouter);

//category and subcategory routes
app.use("/api/v1/categories", categoryRouter);

//brand routes
app.use("/api/v1/brands", brandRouter);

// Payment routes
app.use("/api/v1/payment", paymentRouter);

// promotions routes
app.use("/api/v1/promotion", promotionRouter);

// driver routes
app.use("/api/v1/driver", driverRouter);

// Product Policy routes
app.use("/api/v1/policies", productPolicyRouter);

//analytics counter
app.use("/api/v1/analytics", analyticsRoutes);

export { app };
