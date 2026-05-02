const express = require("express");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerById);

router.post("/", protect, adminOnly, createCustomer);
router.put("/:id", protect, adminOnly, updateCustomer);
router.delete("/:id", protect, adminOnly, deleteCustomer);

module.exports = router;
