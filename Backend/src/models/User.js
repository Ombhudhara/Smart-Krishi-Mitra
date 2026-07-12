import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, "Please provide a valid phone number (10-15 digits)"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: {
        values: ["Farmer", "Vendor", "Customer", "Admin"],
        message: "{VALUE} is not a valid role. Allowed roles: Farmer, Vendor, Customer, Admin",
      },
      default: "Customer",
    },
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other", "Prefer not to say", ""],
        message: "Invalid gender selection",
      },
      default: "",
    },
    dob: {
      type: String,
      default: "",
      trim: true,
    },
    village: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Village name cannot exceed 100 characters"],
    },
    taluka: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Taluka name cannot exceed 100 characters"],
    },
    district: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "District name cannot exceed 100 characters"],
    },
    state: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "State name cannot exceed 100 characters"],
    },
    pincode: {
      type: String,
      default: "",
      trim: true,
      match: [/^[0-9]{6}$|^$/, "Pincode must be exactly 6 digits"],
    },
    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    farmName: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Farm name cannot exceed 100 characters"],
    },
    farmSize: {
      type: String,
      default: "",
      trim: true,
    },
    soilType: {
      type: String,
      default: "",
      trim: true,
    },
    cropsGrown: {
      type: [String],
      default: [],
    },
    preferredLanguage: {
      type: String,
      default: "English",
      trim: true,
    },
    notificationSettings: {
      emailAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: true },
      weatherAlerts: { type: Boolean, default: true },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    accountStatus: {
      type: String,
      enum: {
        values: ["Active", "Suspended", "Pending"],
        message: "{VALUE} is not a valid account status",
      },
      default: "Active",
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    bookmarks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
