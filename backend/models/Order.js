const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "Cash On Delivery",
    },

    status: {
      type: String,
      enum: ["Pending", "Preparing", "Completed", "Rejected", "Cancelled"],
      default: "Pending",
    },

    stockReduced: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
