import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import tokenCheck from "../../middleware/tokenCheck.js";
import paymentModel from "../payment/payment.model.js";
import userModel from "../users/users.model.js";
dotenv.config();
const paymentRouter = express.Router();
// 1. Initialize Payment:
paymentRouter.post("/pay", tokenCheck, async (req, res, next) => {
  try {
    const headersList = {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
    const { credits, totalPrice } = req.body;
    if (totalPrice !== credits * 4) {
      const error = new Error("Incorrect price for the given credits");
      res.status(400);
      return next(error);
    }
    const user = req.userInfo;
    const tempTransactionId = `TEMP_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newPayment = await paymentModel.create({
      userId: user._id,
      amount: totalPrice,
      paymentMethod: "online",
      status: "pending",
      credit: credits,
      transactionId: tempTransactionId,
    });
    if (!newPayment) {
      const error = new Error("Unable To Create The Transaction!");
      res.status(400);
      return next(error);
    }
    const requestPayload = {
      return_url: "http://localhost:5173/dashboard",
      website_url: "http://localhost:5173/",
      amount: totalPrice * 100,
      purchase_order_id: newPayment._id.toString(),
      purchase_order_name: "Buy 5x Credits In The Social Key",
      customer_info: {
        name: user.name,
        email: user.email,
      },
      amount_breakdown: [
        {
          label: "Total Price",
          amount: totalPrice * 100,
        },
      ],
      product_details: [
        {
          identity: "credits_5x",
          name: "5x Credits Purchase",
          total_price: totalPrice * 100,
          quantity: 1,
          unit_price: totalPrice * 100,
        },
      ],
      merchant_username: "Shubham Kadariya",
      merchant_extra: "merchant_extra",
    };
    const response = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      requestPayload,
      { headers: headersList }
    );
    if (!response || !response.data) {
      const error = new Error("Invalid response from payment gateway");
      res.status(500);
      return next(error);
    }
    const updatePayment = await paymentModel.findByIdAndUpdate(
      { _id: newPayment._id },
      {
        pidx: response.data.pidx,
      },
      { new: true }
    );
    if (!updatePayment) {
      const error = new Error("Unable To Update The Payment Info!");
      res.status(500);
      return next(error);
    }
    res.status(200).send({
      message: "Payment initialized successfully.",
      data: response.data,
    });
  } catch (error) {
    error.message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable To Process The Transaction!";
    res.status(error.response?.status || 500);
    next(error);
  }
});
// 2. Confirm The Transaction:
paymentRouter.post("/confirm/:pidx", tokenCheck, async (req, res, next) => {
  try {
    const { userInfo: user } = req;
    const { pidx } = req.params;
    if (!pidx) {
      return res.status(400).json({
        success: false,
        message: "Payment ID (pidx) is required",
      });
    }
    const headersList = {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      { pidx },
      { headers: headersList }
    );
    const paymentInfo = response.data;
    if (!paymentInfo || paymentInfo.pidx !== pidx) {
      const error = new Error("Invalid payment information received");
      res.status(400);
      return next(error);
    }
    const { transaction_id, status } = paymentInfo;
    const paymentRecord = await paymentModel.findOne({ pidx: pidx });
    if (!paymentRecord) {
      const error = new Error("Payment record not found in database");
      res.status(400);
      return next(error);
    }
    if (status !== "Completed") {
      const error = new Error("Payment Isn't Completed Yet!");
      res.status(400);
      return next(error);
    }
    paymentRecord.status = "completed";
    paymentRecord.transactionId = transaction_id;
    await paymentRecord.save();
    const currentUser = await userModel.findById(user._id);
    if (!currentUser) {
      const error = new Error("The User Not Found!");
      res.status(400);
      return next(error);
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { credit: currentUser.credit + paymentRecord.credit },
      { new: true }
    );
    if (!updatedUser) {
      const error = new Error("Failed To Update User Credits!");
      res.status(400);
      return next(error);
    }
    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully and user credit updated",
      data: {
        paymentInfo,
        updatedCredits: updatedUser.credit,
      },
    });
  } catch (error) {
    console.error("Payment Verification Error: ", error);
    if (error.response) {
      console.error("Axios Error Response: ", error.response.data);
      console.error("Axios Error Status: ", error.response.status);
    } else if (error.request) {
      console.error("Axios No Response: ", error.request);
    } else {
      console.error("General Error: ", error.message);
    }
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
});

export default paymentRouter;
