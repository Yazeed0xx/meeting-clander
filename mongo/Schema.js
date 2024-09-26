import mongoose, { Schema, models } from "mongoose";

const informationSchema = new Schema({
  person: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date, // Changed to Date
    required: true,
  },
  end: {
    type: Date, // Changed to Date
    required: true,
  },
  second: {
    type: String, // Ensure this field exists
    required: true,
  },
});

const info = models.info || mongoose.model("info", informationSchema);

export default info;
