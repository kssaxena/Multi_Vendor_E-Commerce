import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // The user who placed the order
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendorUser",
    required: true, // The vendor fulfilling the order
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true, // Product details
      },
      quantity: {
        type: Number,
        required: true, // Quantity of the product in the order
        min: 1,
      },
      price: {
        type: Number,
        required: true, // Price at the time of order
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true, // Total cost of the order
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending", // Current status of the order
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending", // Payment status
  },
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  placedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the order was placed
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the order was last updated
  },
});

// Middleware to update the `updatedAt` timestamp before saving
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Order = mongoose.model("Order", orderSchema);