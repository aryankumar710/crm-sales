import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";


const EmployeeSchema = mongoose.Schema(
  {
    organisationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },

    employeeEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    countryCode: {
      type: String,
      enum: ["+91", "+1", "+44"],
    },

    phoneNumber: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 10,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    reportingPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    password: {
      type: String,
    },

    refreshToken: {
      type: String,
    },

    invitationToken: {
      type: String,
    },
  },
  { timestamps: true }
);

EmployeeSchema.pre("validate", async function(next){
  if(!this.role) return

  const role = await mongoose.model("Role").findById(this.role).session(this.$session())

  if(role?.roleName === "HR Admin" && !this.password){
    console.log(role?.roleName)
    this.invalidate("password", "password required")   
  }
})

EmployeeSchema.pre("validate", async function(next){
  if(!this.role) return

  const role = await mongoose.model("Role").findById(this.role).session(this.$session())

  if(role?.roleName !== "Super Admin" && !this.phoneNumber){
    console.log(role?.roleName)
 
    this.invalidate("phoneNumber", "phone number required") 
  }
})

EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

EmployeeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

EmployeeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      employeeName: this.employeeName,
      employeeEmail: this.employeeEmail,
      phoneNumber: this.phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

EmployeeSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Employee = mongoose.model("Employee", EmployeeSchema);
