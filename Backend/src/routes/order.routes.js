import { Router } from "express";
import {
  CreateOrder,
  CancelOrder,
  GetVendorOrders,
  getUserAllOrders,
  getVendorAllOrders,
} from "../controllers/order.controllers.js";
import {
  VerifyUser,
  VerifyVendorUser,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Middleware to verify the user
// router.use(VerifyUser);

//routes for orders
router.route("/create-order").post(CreateOrder);
router.route("/cancel-order/:orderId").delete(CancelOrder);
router.route("/get-vendor-orders/:vendorId").get(GetVendorOrders);
router.route("/all-products-of/:userId").get(VerifyUser, getUserAllOrders);
router
  .route("/all-products-of-vendor/:vendorId")
  .get(VerifyVendorUser, getVendorAllOrders);

export default router;
