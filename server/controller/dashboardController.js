export const showAllInvoices = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT b.*, c.name AS customer_name
      FROM bills b
      JOIN customers c ON b.customer_id = c.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const viewInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.promise().query(
      `
      SELECT b.*, c.name, c.address, c.pan_card, c.gst_number
      FROM bills b
      JOIN customers c ON b.customer_id = c.id
      WHERE b.invoice_id = ?
    `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
