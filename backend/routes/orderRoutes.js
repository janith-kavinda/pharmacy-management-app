const express = require("express");

const {
  createOrder,
  getMyOrders,
  cancelMyOrder,
  getAllOrders,
  approveOrder,
  rejectOrder,
  completeOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// Customer routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelMyOrder);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/approve", protect, adminOnly, approveOrder);
router.put("/:id/reject", protect, adminOnly, rejectOrder);
router.put("/:id/complete", protect, adminOnly, completeOrder);
router.delete("/:id", protect, adminOnly, deleteOrder);

module.exports = router;
