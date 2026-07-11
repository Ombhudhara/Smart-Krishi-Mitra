import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Helper to sum revenue matching a query
const getSumRevenue = async (matchQuery) => {
  const result = await Transaction.aggregate([
    { $match: matchQuery },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Helper for Role-Based Dashboard Summary (API 1)
const getRoleSummary = async (userId, role) => {
  const isFarmer = role === "Farmer";
  const isVendor = role === "Vendor";
  const isCustomer = role === "Customer";
  const isAdmin = role === "Admin";

  if (isFarmer) {
    const [
      totalCropListings,
      activeListings,
      soldListings,
      totalRevenue,
      totalTransactions,
      pendingOrders,
      completedOrders,
      unreadNotifications,
      unreadMessages
    ] = await Promise.all([
      Listing.countDocuments({ seller: userId }),
      Listing.countDocuments({ seller: userId, status: "Active" }),
      Listing.countDocuments({ seller: userId, status: "Sold Out" }),
      getSumRevenue({ seller: userId, paymentStatus: "Completed" }),
      Transaction.countDocuments({ seller: userId }),
      Transaction.countDocuments({ seller: userId, orderStatus: "Pending" }),
      Transaction.countDocuments({ seller: userId, orderStatus: "Completed" }),
      Notification.countDocuments({ user: userId, isRead: false, deleted: { $ne: true } }),
      Message.countDocuments({ receiver: userId, isRead: false, deleted: { $ne: true } })
    ]);

    return {
      totalCropListings,
      activeListings,
      soldListings,
      totalRevenue,
      totalTransactions,
      pendingOrders,
      completedOrders,
      unreadNotifications,
      unreadMessages
    };
  }

  if (isVendor) {
    const [
      inventoryCount,
      marketplaceListings,
      orders,
      revenue,
      notifications,
      messages
    ] = await Promise.all([
      Listing.countDocuments({ seller: userId }),
      Listing.countDocuments({ seller: userId, status: "Active" }),
      Transaction.countDocuments({ seller: userId }),
      getSumRevenue({ seller: userId, paymentStatus: "Completed" }),
      Notification.countDocuments({ user: userId, isRead: false, deleted: { $ne: true } }),
      Message.countDocuments({ receiver: userId, isRead: false, deleted: { $ne: true } })
    ]);

    return {
      inventoryCount,
      marketplaceListings,
      orders,
      revenue,
      notifications,
      messages
    };
  }

  if (isCustomer) {
    const [
      orders,
      purchasedCrops,
      savedListings,
      notifications,
      messages
    ] = await Promise.all([
      Transaction.countDocuments({ buyer: userId }),
      Transaction.countDocuments({ buyer: userId, orderStatus: "Completed" }),
      Listing.countDocuments({ favorites: userId }),
      Notification.countDocuments({ user: userId, isRead: false, deleted: { $ne: true } }),
      Message.countDocuments({ receiver: userId, isRead: false, deleted: { $ne: true } })
    ]);

    return {
      orders,
      purchasedCrops,
      savedListings,
      notifications,
      messages
    };
  }

  if (isAdmin) {
    const [
      totalUsers,
      totalFarmers,
      totalVendors,
      totalCustomers,
      totalListings,
      totalTransactions,
      totalRevenue,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "Farmer" }),
      User.countDocuments({ role: "Vendor" }),
      User.countDocuments({ role: "Customer" }),
      Listing.countDocuments(),
      Transaction.countDocuments(),
      getSumRevenue({ paymentStatus: "Completed" }),
      User.countDocuments({ accountStatus: "Active" })
    ]);

    return {
      totalUsers,
      totalFarmers,
      totalVendors,
      totalCustomers,
      totalListings,
      totalTransactions,
      totalRevenue,
      activeUsers
    };
  }

  return {};
};

// Helper for Recent Activities (API 2)
const getRecentActivities = async (userId, role) => {
  const isAdmin = role === "Admin";
  const isCustomer = role === "Customer";
  const userMatch = isAdmin 
    ? {} 
    : (isCustomer ? { buyer: userId } : { seller: userId });

  const listingMatch = isAdmin ? {} : { seller: userId };

  const [listings, txs, notifications] = await Promise.all([
    Listing.find(listingMatch).sort({ createdAt: -1 }).limit(10).lean(),
    Transaction.find(userMatch).sort({ createdAt: -1 }).limit(10).lean(),
    Notification.find({ user: userId, deleted: { $ne: true } }).sort({ createdAt: -1 }).limit(10).lean()
  ]);

  const activityList = [];

  listings.forEach((l) => {
    activityList.push({
      id: l._id,
      title: "Listing Created",
      description: `Crop listing for ${l.cropName} created at ₹${l.price}/${l.unit || "kg"}.`,
      time: l.createdAt,
      type: "listing"
    });
  });

  txs.forEach((tx) => {
    const isSeller = tx.seller.toString() === userId.toString();
    activityList.push({
      id: tx._id,
      title: isSeller ? "Crop Sold" : "Order Placed",
      description: isSeller 
        ? `Sold ${tx.quantity} kg of ${tx.cropName} to buyer (Invoice: ${tx.invoiceNumber}).`
        : `Purchased ${tx.quantity} kg of ${tx.cropName} from seller (Invoice: ${tx.invoiceNumber}).`,
      time: tx.createdAt,
      type: isSeller ? "sale" : "purchase",
      amount: tx.totalAmount
    });
  });

  notifications.forEach((n) => {
    activityList.push({
      id: n._id,
      title: n.title,
      description: n.description,
      time: n.createdAt,
      type: "notification"
    });
  });

  return activityList
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
};

// Helper for Dashboard Statistics (API 3)
const getDashboardStatistics = async (userId, role) => {
  const isAdmin = role === "Admin";
  const isCustomer = role === "Customer";
  const userMatch = isAdmin 
    ? {} 
    : (isCustomer ? { buyer: userId } : { seller: userId });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const startOfMonth = new Date();
  startOfMonth.setDate(startOfMonth.getDate() - 30);

  const [
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    todayOrders,
    weeklyOrders,
    monthlyOrders,
    completedTransactions,
    pendingTransactions,
    cancelledTransactions,
    unreadNotifications,
    unreadMessages
  ] = await Promise.all([
    getSumRevenue({ ...userMatch, paymentStatus: "Completed", createdAt: { $gte: today } }),
    getSumRevenue({ ...userMatch, paymentStatus: "Completed", createdAt: { $gte: startOfWeek } }),
    getSumRevenue({ ...userMatch, paymentStatus: "Completed", createdAt: { $gte: startOfMonth } }),
    Transaction.countDocuments({ ...userMatch, createdAt: { $gte: today } }),
    Transaction.countDocuments({ ...userMatch, createdAt: { $gte: startOfWeek } }),
    Transaction.countDocuments({ ...userMatch, createdAt: { $gte: startOfMonth } }),
    Transaction.countDocuments({ ...userMatch, orderStatus: "Completed" }),
    Transaction.countDocuments({ ...userMatch, orderStatus: "Pending" }),
    Transaction.countDocuments({ ...userMatch, orderStatus: "Cancelled" }),
    Notification.countDocuments({ user: userId, isRead: false, deleted: { $ne: true } }),
    Message.countDocuments({ receiver: userId, isRead: false, deleted: { $ne: true } })
  ]);

  const listingMatch = isAdmin ? {} : { seller: userId };
  const viewsAndRatings = await Listing.aggregate([
    { $match: listingMatch },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);

  const totalViews = viewsAndRatings.length > 0 ? viewsAndRatings[0].totalViews : 0;
  const avgRating = viewsAndRatings.length > 0 ? (viewsAndRatings[0].avgRating || 0) : 0;

  return {
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    todayOrders,
    weeklyOrders,
    monthlyOrders,
    completedTransactions,
    pendingTransactions,
    cancelledTransactions,
    marketplaceViews: totalViews,
    averageListingRating: parseFloat(avgRating.toFixed(2)),
    unreadNotifications,
    unreadMessages
  };
};

// Helper for Marketplace Overview (API 4)
const getMarketplaceOverview = async () => {
  const [
    activeListings,
    soldListings,
    draftListings,
    aggregates,
    mostViewedCropDoc,
    latestListingDoc
  ] = await Promise.all([
    Listing.countDocuments({ status: "Active" }),
    Listing.countDocuments({ status: "Sold Out" }),
    Listing.countDocuments({ status: "Inactive" }),
    Listing.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalWishlist: { $sum: "$wishlistCount" },
          avgRating: { $avg: "$rating" }
        }
      }
    ]),
    Listing.findOne({ status: "Active" }).sort({ views: -1 }).select("cropName views").lean(),
    Listing.findOne({ status: "Active" })
      .sort({ createdAt: -1 })
      .select("cropName price unit location createdAt")
      .populate("seller", "fullName")
      .lean()
  ]);

  const highestSelling = await Transaction.aggregate([
    { $match: { orderStatus: "Completed" } },
    { $group: { _id: "$cropName", totalQty: { $sum: "$quantity" } } },
    { $sort: { totalQty: -1 } },
    { $limit: 1 }
  ]);

  const totalViews = aggregates.length > 0 ? aggregates[0].totalViews : 0;
  const wishlistCount = aggregates.length > 0 ? aggregates[0].totalWishlist : 0;
  const averageRating = aggregates.length > 0 ? (aggregates[0].avgRating || 0) : 0;
  const highestSellingCrop = highestSelling.length > 0 ? highestSelling[0]._id : "N/A";
  const mostViewedCrop = mostViewedCropDoc ? mostViewedCropDoc.cropName : "N/A";

  return {
    activeListings,
    soldListings,
    draftListings,
    totalViews,
    wishlistCount,
    averageRating: parseFloat(averageRating.toFixed(2)),
    mostViewedCrop,
    highestSellingCrop,
    latestListing: latestListingDoc
  };
};

// Helper for Notification Summary (API 5)
const getNotificationSummary = async (userId) => {
  const [unreadCount, latestNotifications] = await Promise.all([
    Notification.countDocuments({ user: userId, isRead: false, deleted: { $ne: true } }),
    Notification.find({ user: userId, deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("category title description priority isRead createdAt")
      .lean()
  ]);

  return {
    unreadCount,
    latestNotifications
  };
};

// Helper for Message Summary (API 6)
const getMessageSummary = async (userId) => {
  const [unreadMessages, latestConversations, latestMessageDoc] = await Promise.all([
    Message.countDocuments({ receiver: userId, isRead: false, deleted: { $ne: true } }),
    Conversation.find({ participants: userId, conversationStatus: "Active" })
      .sort({ lastMessageTime: -1 })
      .limit(5)
      .populate("participants", "fullName role profileImage")
      .populate("lastMessage", "text sender createdAt")
      .lean(),
    Message.findOne({ $or: [{ sender: userId }, { receiver: userId }], deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .select("text sender receiver createdAt")
      .lean()
  ]);

  return {
    unreadMessages,
    latestConversations,
    latestMessage: latestMessageDoc
  };
};

// Helper for Transaction Summary (API 7)
const getTransactionSummary = async (userId, role) => {
  const isAdmin = role === "Admin";
  const isCustomer = role === "Customer";
  const userMatch = isAdmin 
    ? {} 
    : (isCustomer ? { buyer: userId } : { seller: userId });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const startOfMonth = new Date();
  startOfMonth.setDate(startOfMonth.getDate() - 30);

  const [
    recentTransactions,
    pendingPayments,
    completedPayments,
    cancelledOrders,
    totalEarnings,
    monthlyEarnings,
    weeklyEarnings,
    todayEarnings
  ] = await Promise.all([
    Transaction.find(userMatch)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("buyer", "fullName")
      .populate("seller", "fullName")
      .lean(),
    Transaction.countDocuments({ ...userMatch, paymentStatus: "Pending" }),
    Transaction.countDocuments({ ...userMatch, paymentStatus: "Completed" }),
    Transaction.countDocuments({ ...userMatch, orderStatus: "Cancelled" }),
    getSumRevenue({ ...userMatch, paymentStatus: "Completed" }),
    getSumRevenue({ ...userMatch, paymentStatus: "Completed", createdAt: { $gte: startOfMonth } }),
    getSumRevenue({ ...userMatch, paymentStatus: "Completed", createdAt: { $gte: startOfWeek } }),
    getSumRevenue({ ...userMatch, paymentStatus: "Completed", createdAt: { $gte: today } })
  ]);

  return {
    recentTransactions,
    pendingPayments,
    completedPayments,
    cancelledOrders,
    totalEarnings,
    monthlyEarnings,
    weeklyEarnings,
    todayEarnings
  };
};

// Helper for Quick Actions (API 8)
const getQuickActions = async (userId, role) => {
  const isAdmin = role === "Admin";
  const isCustomer = role === "Customer";
  const userMatch = isAdmin 
    ? {} 
    : (isCustomer ? { buyer: userId } : { seller: userId });

  const listingMatch = isAdmin ? {} : { seller: userId };

  const [
    pendingListings,
    pendingOrders,
    pendingTransactions,
    pendingNotifications,
    pendingMessages
  ] = await Promise.all([
    Listing.countDocuments({ ...listingMatch, status: "Inactive" }),
    Transaction.countDocuments({ ...userMatch, orderStatus: "Pending" }),
    Transaction.countDocuments({ ...userMatch, paymentStatus: "Pending" }),
    Notification.countDocuments({ user: userId, isRead: false, deleted: { $ne: true } }),
    Message.countDocuments({ receiver: userId, isRead: false, deleted: { $ne: true } })
  ]);

  return {
    pendingListings,
    pendingOrders,
    pendingTransactions,
    pendingNotifications,
    pendingMessages
  };
};

/**
 * Get unified dashboard summary.
 * GET /api/dashboard/summary
 */
export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.accountStatus !== "Active") {
      return res.status(403).json({ success: false, message: "User account is suspended or inactive." });
    }

    const role = user.role;

    // Parallel calls to gather all dashboard widgets dynamically from MongoDB
    const [
      summaryData,
      recentActivities,
      statistics,
      marketplace,
      notifications,
      messages,
      transactions,
      quickActions
    ] = await Promise.all([
      getRoleSummary(userId, role),
      getRecentActivities(userId, role),
      getDashboardStatistics(userId, role),
      getMarketplaceOverview(),
      getNotificationSummary(userId),
      getMessageSummary(userId),
      getTransactionSummary(userId, role),
      getQuickActions(userId, role)
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data: {
        summary: summaryData,
        recentActivities,
        statistics,
        marketplace,
        notifications,
        messages,
        transactions,
        quickActions,

        // Flat legacy keys for compatibility with FarmerDashboard.jsx / ProfilePage.jsx
        totalListings: summaryData.totalCropListings || summaryData.inventoryCount || 0,
        totalRevenue: summaryData.totalRevenue || summaryData.revenue || 0,
        unreadNotifications: notifications.unreadCount || 0,
        totalSales: summaryData.soldListings || summaryData.completedOrders || 0,
      }
    });
  } catch (error) {
    console.error("Error in getSummary dashboard controller:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard data"
    });
  }
};

/**
 * Get dashboard statistics.
 * GET /api/dashboard/stats
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const statistics = await getDashboardStatistics(userId, user.role);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: statistics,
      // Legacy formatting support for profile/dashboard sub-calls
      stats: {
        listings: statistics.completedTransactions + statistics.pendingTransactions, // approx listings count
        purchases: statistics.completedTransactions,
        sales: statistics.completedTransactions
      }
    });
  } catch (error) {
    console.error("Error in getStats dashboard controller:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics"
    });
  }
};

/**
 * Get recent activity list.
 * GET /api/dashboard/activity
 */
export const getActivity = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const recentActivities = await getRecentActivities(userId, user.role);

    return res.status(200).json({
      success: true,
      message: "Recent activities fetched successfully",
      data: recentActivities,
      activities: recentActivities // Legacy key compatibility
    });
  } catch (error) {
    console.error("Error in getActivity dashboard controller:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch recent activities"
    });
  }
};
