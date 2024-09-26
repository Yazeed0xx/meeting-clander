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
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
});

const info = models.info || mongoose.model("info", informationSchema);

export default info;
