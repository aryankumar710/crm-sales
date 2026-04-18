import mongoose, { Schema } from "mongoose";

const OrganisationSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase:true
    },

    companyLogo: {
      type: String,
      required: true,
    },

    headOfficeName: {
      type: String,
      required: true,
      trim: true,
    },

    hrAdminEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    superAdminEmail: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    }

  },

  { timestamps: true }
);

// OrganisationSchema.pre("save", async () => {
//   this.password = await bcrypt.hash(this.password, 10);
// });

// OrganisationSchema.methods.isPasswordCorrect = async (password) => {
//   return await bcrypt.compare(this.password, password);
// };

// OrganisationSchema.methods.generateAccessToken = () => {
//   return jwt.sign(
//     {
//       _id: this._id,
//       companyName: this.companyName,
//       companyEmail: this.companyEmail,
//       headOfficeName: this.headOfficeName,
//       adminName: this.adminName,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// OrganisationSchema.methods.generateRefreshToken = () => {
//   return jwt.sign(
//     {
//       _id: this.id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };

export const Organisation = mongoose.model("Organisation", OrganisationSchema);
