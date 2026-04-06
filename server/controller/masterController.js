import db from "../config/db.js";

export const showAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM customers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const showAllItems = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM items");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const { name, address, pan_card, gst_number } = req.body;
    const [result] = await db
      .promise()
      .query(
        "insert into customers(name, address, pan_card, gst_number) values(?, ?, ?, ?)",
        [name, address, pan_card, gst_number || null],
      );
    res.json({
      message: "Customer Created Successfully...",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, selling_price } = req.body;
    const [result] = await db
      .promise()
      .query("INSERT INTO items (name, selling_price) VALUES (?, ?)", [
        name,
        selling_price,
      ]);

    res.json({ message: "Item created Successfully..", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
