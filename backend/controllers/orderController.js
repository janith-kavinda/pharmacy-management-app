const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!deliveryAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: "Delivery address and phone are required",
      });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicine);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found",
        });
      }

      if (medicine.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${medicine.name} has only ${medicine.quantity} items available`,
        });
      }

      orderItems.push({
        medicine: medicine._id,
        name: medicine.name,
        price: medicine.price,
        quantity: item.quantity,
      });

      totalAmount += medicine.price * item.quantity;
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod: paymentMethod || "Cash On Delivery",
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel this order",
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be approved",
      });
    }

    for (const item of order.items) {
      const medicine = await Medicine.findById(item.medicine);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `${item.name} not found`,
        });
      }

      if (medicine.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${medicine.name} has only ${medicine.quantity} items available`,
        });
      }
    }

    if (!order.stockReduced) {
      for (const item of order.items) {
        const medicine = await Medicine.findById(item.medicine);

        medicine.quantity -= item.quantity;
        await medicine.save();
      }

      order.stockReduced = true;
    }

    order.status = "Preparing";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order approved and moved to preparing",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be rejected",
      });
    }

    order.status = "Rejected";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Preparing") {
      return res.status(400).json({
        success: false,
        message: "Only preparing orders can be completed",
      });
    }

    order.status = "Completed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order completed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Only rejected orders can be deleted",
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  cancelMyOrder,
  getAllOrders,
  approveOrder,
  rejectOrder,
  completeOrder,
  deleteOrder,
};
