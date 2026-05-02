const Medicine = require("../models/Medicine");
const Supplier = require("../models/Supplier");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    const totalCustomers = await User.countDocuments({ role: "customer" });

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const lowStockMedicines = await Medicine.countDocuments({
      quantity: { $lte: 10 },
    });

    const completedOrders = await Order.find({
      status: "Completed",
    });

    const totalSales = completedOrders.reduce(
      (total, order) => total + order.totalAmount,
      0,
    );

    res.status(200).json({
      success: true,
      data: {
        totalMedicines,
        totalSuppliers,
        totalCustomers,
        totalOrders,
        pendingOrders,
        lowStockMedicines,
        totalSales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
