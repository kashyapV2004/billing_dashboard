import express from "express";
import {
  addCustomer,
  addItem,
  showAllCustomers,
  showAllItems,
} from "../controller/masterController.js";

const router = express.Router();

router.get("/customers", showAllCustomers);
router.get("/items", showAllItems);

router.post("/customer/addCustomer", addCustomer);
router.post("/items/addItems", addItem);

export default router;
