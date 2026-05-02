const Medicine = require("../models/Medicine");
const Supplier = require("../models/Supplier");

const createMedicine = async (req, res) => {
  try {
    const { name, category, supplier, price, quantity, expiryDate } = req.body;

    if (!name || !category || !supplier || !price || !quantity || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "All fields including supplier are required",
      });
    }

    const supplierExists = await Supplier.findById(supplier);

    if (!supplierExists) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    const medicine = await Medicine.create({
      name,
      category,
      supplier,
      price,
      quantity,
      expiryDate,
    });

    const populatedMedicine = await Medicine.findById(medicine._id).populate(
      "supplier",
      "name company phone",
    );

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: populatedMedicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .populate("supplier", "name company phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      "supplier",
      "name company phone",
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { supplier } = req.body;

    if (supplier) {
      const supplierExists = await Supplier.findById(supplier);

      if (!supplierExists) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }
    }

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("supplier", "name company phone");

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};
