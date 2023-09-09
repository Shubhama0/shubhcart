import { compare } from "bcrypt";
import { comparepassword, hashpassword } from "../helper/authhelper.js";
import usermodel from "../models/usermodel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registercontroller = async (req, res) => {
  try {
    const { name, email, password, phone, answer } = req.body;

    //validation
    if (!name) {
      return res.send({ message: "Name cannot be empty" });
    }
    if (!email) {
      return res.send({ message: "Email cannot be empty" });
    }
    if (!password) {
      return res.send({ message: "password cannot be empty" });
    }
    if (!phone) {
      return res.send({ message: "phone cannot be empty" });
    }
    if (!answer) {
      return res.send({ message: "answer cannot be empty" });
    }

    //existing user
    const existinguser = await usermodel.findOne({ email });
    if (existinguser) {
      return res.status(201).send({
        sucess: false,
        message: "Already registered please Login",
      });
    }

    // register user
    const hashedpassword = await hashpassword(password);

    // save user
    const user = await new usermodel({
      name,
      email,
      password: hashedpassword,
      phone,
      answer,
    }).save();

    res.status(200).send({
      sucess: true,
      message: "user registered sucessfully",
      user, //user means passed from res.send
    });
  } catch (error) {
    console.log(`error in regcontroller${error}`);
    res.status(500).send({
      sucess: false,
      message: "error in register",
      error,
    });
  }
};

// post method login
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        sucess: false,
        message: "Invalid Email or password",
      });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        sucess: false,
        message: " Email is not registered",
      });
    }

    const match = await comparepassword(password, user.password);
    if (!match) {
      return res.status(201).send({
        sucess: false,
        message: "Invalid Email or password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      sucess: true,
      message: "Login Sucessfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(`error in logincontroller${error}`);
    res.status(500).send({
      sucess: false,
      message: "error in login",
      error,
    });
  }
};

//dummy test controller
//testcontroller
export const testcontroller = async (req, res) => {
  try {
    //console.log('protected routes');
    res.send("protected routes");
  } catch (error) {
    console.log(`error in testcontroller${error}`);
  }
};

//admin access
export const isadmin = async (req, res, next) => {
  try {
    const user = await usermodel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        sucess: false,
        message: "unathorised acess",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(`error in admincontroller${error}`);
    res.status(401).send({
      sucess: false,
      message: "error in admin",
      error,
    });
  }
};

//forgotPasswordController

export const forgotpasswordcontroller = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await usermodel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashpassword(newPassword);
    await usermodel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await usermodel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashpassword(password) : undefined;
    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

//export default {registercontroller};
