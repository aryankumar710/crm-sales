import mongoose from "mongoose";

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
  },
  { timestamps: true }
);


export const Leads = mongoose.model("Leads", LeadsSchema)
