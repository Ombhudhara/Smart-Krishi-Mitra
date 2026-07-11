import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    favoriteLocation: {
      type: String,
      default: "",
      trim: true,
    },
    lastFetched: {
      type: Date,
      default: Date.now,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);



const Weather = mongoose.model("Weather", WeatherSchema);
export default Weather;
