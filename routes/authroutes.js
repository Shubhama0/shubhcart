import express from "express";
import {
  registercontroller,
  logincontroller,
  testcontroller,
  isadmin,
  forgotpasswordcontroller,
  updateProfileController,
  orderStatusController,
  getAllOrdersController,
  getOrdersController,
} from "../controller/authcontroller.js";
//import logincontroller from '../controller/authcontroller.js'
import { requiresignin } from "../middleware/authmiddleware.js";

//router obj
const router = express.Router();

//routing
//register method Post
router.post("/register", registercontroller);
//login method Post
router.post("/login", logincontroller);
// dummy test routes middleware
router.get("/test", requiresignin, isadmin, testcontroller);

// protected user routes auth
router.get("/user-auth", requiresignin, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected admin routes auth
router.get("/admin-auth", requiresignin, isadmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Forgot Password || POST
router.post("/forgot-password", forgotpasswordcontroller);

//update profile
router.put("/profile", requiresignin, updateProfileController);

//orders
router.get("/orders", requiresignin, getOrdersController);

//all orders
router.get("/all-orders", requiresignin, isadmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requiresignin,
  isadmin,
  orderStatusController
);

export default router;
