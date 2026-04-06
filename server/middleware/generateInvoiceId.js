export const generateInvoiceId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `INVC${random}`; // total length ~10
};
