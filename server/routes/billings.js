import express from "express";
import {
  selectCustomer,
  selectItem,
  showAllCustomers,
  showAllItems,
} from "../controller/billingsController.js";

const router = express.Router();

router.get("/showCustomers", showAllCustomers);
router.get("/showItems", showAllItems);
router.get("/showCustomers/:id", selectCustomer);
router.get("/showItems/:id", selectItem);

export default router;
