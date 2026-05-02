const express = require("express");

const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getSuppliers);
router.get("/:id", getSupplierById);

router.post("/", protect, adminOnly, createSupplier);
router.put("/:id", protect, adminOnly, updateSupplier);
router.delete("/:id", protect, adminOnly, deleteSupplier);

module.exports = router;
