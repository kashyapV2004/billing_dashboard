import express from "express";
import {
  showAllInvoices,
  viewInvoice,
} from "../controller/dashboardController.js";
const router = express.Router();

router.get("/", showAllInvoices);
router.get("/viewInvoice/:id", viewInvoice);

export default router;
