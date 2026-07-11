import Listing from "../models/Listing.js";
import Notification from "../models/Notification.js";

/**
 * Get all active marketplace listings.
 * GET /api/listings
 */
export const getListings = async (req, res) => {
  try {
    const { category, q } = req.query;
    const query = { status: "Active" };

    if (category) {
      query.category = category;
    }

    if (q) {
      query.$or = [
        { cropName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    const listings = await Listing.find(query)
      .populate("seller", "fullName phone profileImage email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error in getListings controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching listings." });
  }
};

/**
 * Get listing by ID.
 * GET /api/listings/:id
 */
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller", "fullName phone profileImage email");
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }
    return res.status(200).json({ success: true, listing });
  } catch (error) {
    console.error("Error in getListingById controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching listing details." });
  }
};

/**
 * Search active listings.
 * GET /api/listings/search
 */
export const searchListings = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Search query is required." });
    }

    const listings = await Listing.find({
      status: "Active",
      $or: [
        { cropName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ],
    }).populate("seller", "fullName phone profileImage");

    return res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error in searchListings controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error searching listings." });
  }
};

/**
 * Register interest / contact seller.
 * POST /api/listings/:id/contact
 */
export const contactSeller = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }

    // Notify the seller
    await Notification.create({
      recipient: listing.seller,
      title: "Marketplace Inquiry",
      message: `User ${req.user.fullName} (${req.user.phone}) is interested in purchasing your listing for ${listing.cropName}.`,
      type: "marketplace",
    });

    return res.status(200).json({
      success: true,
      message: "Seller has been notified. They will contact you shortly.",
    });
  } catch (error) {
    console.error("Error in contactSeller controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error sending inquiry to seller." });
  }
};

/**
 * Get listings owned by logged-in user.
 * GET /api/listings/my
 */
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error in getMyListings controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving your listings." });
  }
};

/**
 * Create a new listing.
 * POST /api/listings
 */
export const createListing = async (req, res) => {
  try {
    const {
      cropName,
      description,
      price,
      quantity,
      unit,
      category,
      images,
      location,
      state,
      district,
      isOrganic,
      deliveryAvailable,
      pickupAvailable,
      stock,
      minimumOrder,
      maximumOrder,
      pricePerUnit,
    } = req.body;

    if (!cropName || !description || !price || !quantity || !location) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const listing = await Listing.create({
      cropName,
      description,
      price,
      quantity,
      unit: unit || "kg",
      category: category || "Other",
      images: images || [],
      location,
      state: state || "",
      district: district || "",
      isOrganic: !!isOrganic,
      deliveryAvailable: !!deliveryAvailable,
      pickupAvailable: pickupAvailable !== undefined ? !!pickupAvailable : true,
      stock: stock !== undefined ? Number(stock) : Number(quantity),
      minimumOrder: minimumOrder !== undefined ? Number(minimumOrder) : 1,
      maximumOrder: maximumOrder !== undefined ? Number(maximumOrder) : null,
      pricePerUnit: pricePerUnit !== undefined ? Number(pricePerUnit) : Number(price),
      seller: req.user._id,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully.",
      listing,
    });
  } catch (error) {
    console.error("Error in createListing controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error creating listing." });
  }
};

/**
 * Update an existing listing.
 * PUT /api/listings/:id
 */
export const updateListing = async (req, res) => {
  try {
    const {
      cropName,
      description,
      price,
      quantity,
      unit,
      category,
      images,
      location,
      state,
      district,
      isOrganic,
      deliveryAvailable,
      pickupAvailable,
      status,
      stock,
      minimumOrder,
      maximumOrder,
      pricePerUnit,
    } = req.body;

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }

    // Verify ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this listing." });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          cropName: cropName !== undefined ? cropName : listing.cropName,
          description: description !== undefined ? description : listing.description,
          price: price !== undefined ? price : listing.price,
          quantity: quantity !== undefined ? quantity : listing.quantity,
          unit: unit !== undefined ? unit : listing.unit,
          category: category !== undefined ? category : listing.category,
          images: images !== undefined ? images : listing.images,
          location: location !== undefined ? location : listing.location,
          state: state !== undefined ? state : listing.state,
          district: district !== undefined ? district : listing.district,
          isOrganic: isOrganic !== undefined ? !!isOrganic : listing.isOrganic,
          deliveryAvailable: deliveryAvailable !== undefined ? !!deliveryAvailable : listing.deliveryAvailable,
          pickupAvailable: pickupAvailable !== undefined ? !!pickupAvailable : listing.pickupAvailable,
          status: status !== undefined ? status : listing.status,
          stock: stock !== undefined ? Number(stock) : listing.stock,
          minimumOrder: minimumOrder !== undefined ? Number(minimumOrder) : listing.minimumOrder,
          maximumOrder: maximumOrder !== undefined ? Number(maximumOrder) : listing.maximumOrder,
          pricePerUnit: pricePerUnit !== undefined ? Number(pricePerUnit) : listing.pricePerUnit,
          updatedBy: req.user._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully.",
      listing,
    });
  } catch (error) {
    console.error("Error in updateListing controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error updating listing." });
  }
};

/**
 * Delete a listing.
 * DELETE /api/listings/:id
 */
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }

    // Verify ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this listing." });
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Listing deleted successfully." });
  } catch (error) {
    console.error("Error in deleteListing controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error deleting listing." });
  }
};

/**
 * Toggle listing active status.
 * PUT /api/listings/:id/status
 */
export const toggleListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update status." });
    }

    listing.status = status !== undefined ? status : (listing.status === "Active" ? "Inactive" : "Active");
    await listing.save();

    return res.status(200).json({
      success: true,
      message: `Listing status updated to ${listing.status}.`,
      listing,
    });
  } catch (error) {
    console.error("Error in toggleListingStatus controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error toggling listing status." });
  }
};
