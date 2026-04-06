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
    const [rows] = await db.promise().query("SELECT * FROM items");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const selectCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.promise().query(
      `SELECT id, name, address, pan_card, gst_number
       FROM customers
       WHERE id = ? AND status = TRUE`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Customer selected successfully",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error selecting customer",
      error: error.message,
    });
  }
};

export const selectItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.promise().query(
      `SELECT id, name, selling_price
       FROM items
       WHERE id = ? AND status = TRUE`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json({
      message: "Item fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching item",
      error: error.message,
    });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { customerId, items } = req.body;
    // items = [{ itemId: 1, quantity: 2 }, { itemId: 2, quantity: 1 }]

    // 1. Get Customer
    const [customerRows] = await db
      .promise()
      .query("SELECT * FROM customers WHERE id = ? AND status = TRUE", [
        customerId,
      ]);

    if (customerRows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = customerRows[0];

    // 2. Calculate subtotal
    let subtotal = 0;

    for (let item of items) {
      const [itemRows] = await db
        .promise()
        .query("SELECT * FROM items WHERE id = ? AND status = TRUE", [
          item.itemId,
        ]);

      if (itemRows.length === 0) {
        return res
          .status(404)
          .json({ message: `Item ${item.itemId} not found` });
      }

      const dbItem = itemRows[0];
      subtotal += dbItem.selling_price * item.quantity;
    }

    // 3. GST Logic
    let gstAmount = 0;

    if (!customer.gst_number) {
      gstAmount = subtotal * 0.18;
    }

    const totalAmount = subtotal + gstAmount;

    // 4. Generate Invoice ID
    const invoiceId = generateInvoiceId();

    // 5. Insert into invoices table
    await db.promise().query(
      `INSERT INTO invoices (invoice_id, customer_id, subtotal, gst_amount, total_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [invoiceId, customerId, subtotal, gstAmount, totalAmount],
    );

    // 6. Insert into invoice_items table
    for (let item of items) {
      const [itemRows] = await db
        .promise()
        .query("SELECT selling_price FROM items WHERE id = ?", [item.itemId]);

      await db.promise().query(
        `INSERT INTO invoice_items (invoice_id, item_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [invoiceId, item.itemId, item.quantity, itemRows[0].selling_price],
      );
    }

    res.json({
      message: "Invoice created successfully",
      invoiceId,
      subtotal,
      gstAmount,
      totalAmount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
