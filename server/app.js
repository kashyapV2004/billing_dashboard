import express from "express";
import dashboardRoutes from "./routes/dashboard.js";
import masterRoutes from "./routes/master.js";
import billingsRoutes from "./routes/billings.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/dashboard", dashboardRoutes);
app.use("/master", billingsRoutes);
app.use("/billings", masterRoutes);

app.listen("3000", ()=> {
    console.log("Server in running on port 3000");
});