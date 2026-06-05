import mongoose, { Schema } from "mongoose";

const LeadsSchema = mongoose.Schema(
  {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    clientName: {
      type: String,
      required: true,
    },

    projectInfo: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 10,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    dealValue: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);


export const Leads = mongoose.model("Leads", LeadsSchema)
