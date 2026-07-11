import Transaction from "../models/Transaction.js";

/**
 * Get transactions involving the logged-in user.
 * GET /api/transactions
 */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search, sortBy, order, page = 1, limit = 10 } = req.query;

    const query = {
      $or: [{ buyer: userId }, { seller: userId }],
    };

    // Filter by search term
    if (search) {
      query.$or.push(
        { cropName: { $regex: search, $options: "i" } },
        { invoiceNumber: { $regex: search, $options: "i" } }
      );
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // Default new first
    }

    const skipIndex = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate("buyer", "fullName email phone")
      .populate("seller", "fullName email phone")
      .sort(sortOptions)
      .skip(skipIndex)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    return res.status(200).json({
      success: true,
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getTransactions controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching transactions." });
  }
};

/**
 * Get transaction by ID.
 * GET /api/transactions/:id
 */
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("buyer", "fullName email phone address state district village")
      .populate("seller", "fullName email phone address state district village");

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    // Verify participant
    const userId = req.user._id.toString();
    if (
      transaction.buyer._id.toString() !== userId &&
      transaction.seller._id.toString() !== userId
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to view this transaction." });
    }

    return res.status(200).json({ success: true, transaction });
  } catch (error) {
    console.error("Error in getTransactionById controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching transaction details." });
  }
};

/**
 * Update transaction status (delivery or payment status).
 * PUT /api/transactions/:id/status
 */
export const updateTransactionStatus = async (req, res) => {
  try {
    const { status, type = "delivery" } = req.body; // type can be 'delivery' or 'payment'
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    const userId = req.user._id.toString();
    if (
      transaction.buyer.toString() !== userId &&
      transaction.seller.toString() !== userId
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this transaction." });
    }

    if (type === "payment") {
      transaction.paymentStatus = status;
    } else {
      transaction.deliveryStatus = status;
    }

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction status updated successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Error in updateTransactionStatus controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error updating status." });
  }
};

/**
 * Download Invoice text report.
 * GET /api/transactions/:id/invoice
 */
export const downloadInvoice = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("buyer", "fullName email phone")
      .populate("seller", "fullName email phone");

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    const invoiceText = `
===================================================
             SMART KRISHI MITRA INVOICE            
===================================================
Invoice Number : ${transaction.invoiceNumber}
Date           : ${new Date(transaction.createdAt).toLocaleDateString()}
---------------------------------------------------
SELLER DETAILS:
Name  : ${transaction.seller.fullName}
Email : ${transaction.seller.email}
Phone : ${transaction.seller.phone}

BUYER DETAILS:
Name  : ${transaction.buyer.fullName}
Email : ${transaction.buyer.email}
Phone : ${transaction.buyer.phone}
---------------------------------------------------
TRANSACTION DETAILS:
Crop Name      : ${transaction.cropName}
Quantity       : ${transaction.quantity} kg
Price per kg   : Rs. ${transaction.price}
Total Amount   : Rs. ${transaction.totalAmount}

Payment Status : ${transaction.paymentStatus}
Delivery Status: ${transaction.deliveryStatus}
---------------------------------------------------
           Thank you for using Smart Krishi Mitra! 
===================================================
`;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${transaction.invoiceNumber}.txt`);
    return res.send(invoiceText);
  } catch (error) {
    console.error("Error in downloadInvoice controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error downloading invoice." });
  }
};

/**
 * Helper to log a new transaction (typically invoked on buy click)
 * POST /api/transactions
 */
export const createTransaction = async (req, res) => {
  try {
    const {
      sellerId,
      cropName,
      quantity,
      price,
      listingId,
      paymentMethod,
      paymentGateway,
      transactionId,
      invoicePdf,
      deliveryAddress,
      buyerPhone,
      sellerPhone,
    } = req.body;

    if (!sellerId || !cropName || !quantity || !price) {
      return res.status(400).json({ success: false, message: "Please provide all required transaction fields." });
    }

    const invoiceNumber = "SKM-" + Math.floor(100000 + Math.random() * 900000);

    const transaction = await Transaction.create({
      buyer: req.user._id,
      seller: sellerId,
      listing: listingId || null,
      cropName,
      quantity,
      price,
      totalAmount: quantity * price,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: "Completed", // auto-completed for demonstration
      deliveryStatus: "Pending",
      invoiceNumber,
      paymentGateway: paymentGateway || "",
      transactionId: transactionId || "",
      invoicePdf: invoicePdf || "",
      deliveryAddress: deliveryAddress || "",
      buyerPhone: buyerPhone || req.user.phone || "",
      sellerPhone: sellerPhone || "",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Error in createTransaction controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error creating transaction." });
  }
};
