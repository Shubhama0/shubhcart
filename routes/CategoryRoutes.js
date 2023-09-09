import express from "express";
import {
  categoryControlller,
  createCategoryController,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
} from "../controller/CategoryController.js";
import { requiresignin } from "../middleware/authmiddleware.js";
import { isadmin } from "../controller/authcontroller.js";



const router = express.Router();

//routes
// create category
router.post(
  "/create-category",
  requiresignin,
  isadmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requiresignin,
  isadmin,
  updateCategoryController
);

//getALl category
router.get("/get-category", categoryControlller);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requiresignin,
  isadmin,
  deleteCategoryCOntroller
);

export default router;