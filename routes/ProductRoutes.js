import express from "express";
import {
  ProductCountController,
  ProductFiltersController,
  ProductListController,
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controller/ProductController.js";

import formidable from "express-formidable";
// import { requiresignin } from "../middleware/authmiddleware.js";
import { requiresignin } from "../middleware/authmiddleware.js";
import { isadmin } from "../controller/authcontroller.js";
import DropIn from "braintree-web-drop-in-react";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requiresignin,
  isadmin,
  formidable(),
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  requiresignin,
  isadmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/product/:pid", deleteProductController);

//filter product
router.post("/product-filters", ProductFiltersController);

//product count
router.get("/product-count", ProductCountController);

//product per page
router.get("/product-list/:page", ProductListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requiresignin, brainTreePaymentController);

export default router;
