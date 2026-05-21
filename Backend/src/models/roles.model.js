import mongoose, { Mongoose, Schema } from "mongoose";

const RoleSchema = mongoose.Schema(
  {
    roleName: {
      type: String,
      trim: true,
      required: true,
    },

    roleType: {
      type: String,
      trim: true,
      required: true,
    },

    parentRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },

    // order: {
    //   type: Number,
    // },

    organisationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
    },
  },
  { timestamps: true }
);

// RoleSchema.virtual("children",{
//     ref: "Role",
//     localField: "_id",
//     foreignField: "parentRole"
// });

// RoleSchema.set("toJSON", {virtuals: true})

// RoleSchema.set("toObject", {virtauls: true})

// RoleSchema.index({ organisationID: 1, parentRole: 1, order: 1}, {unique: true});

export const Role = mongoose.model("Role", RoleSchema);
