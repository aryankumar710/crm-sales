import jwt from "jsonwebtoken";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Organisation } from "../models/organisation.model.js";
import { Employee } from "../models/employee.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Role } from "../models/roles.model.js";
import mongoose from "mongoose";

const sendInviteEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Set your password",
    html: `
      <h2>Welcome!</h2>
      <p>Click below to set your password:</p>
      <a href="${link}">${link}</a>
    `,
  });
};

const registerOrganisation = async (req, res) => {
const session = await mongoose.startSession(); 
session.startTransaction()
  try {
    const {
      companyName,
      headOfficeName,
      adminName,
      hrAdminEmail,
      superAdminEmail,
      countryCode,
      phoneNumber,
      password,
    } = req.body;

    if (
      [
        companyName,
        headOfficeName,
        adminName,
        hrAdminEmail,
        countryCode,
        phoneNumber,
        password,
      ].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
      
    }

    if (superAdminEmail === hrAdminEmail) {
      throw new APIError(
        409,
        "Founder Email and HR Admin Email cannot be same. Please leave Founder Email field if both email same"
      );
      
    }

    const existedOrganisation = await Organisation.findOne({ hrAdminEmail });

    if (existedOrganisation) {
      throw new APIError(
        409,
        "Company with same email address exists. Please try other email"
      );
      
    }

    const organisationLogoPath = req.file?.path;

    if (!organisationLogoPath) {
      throw new APIError(400, "Organisation logo is missing");
      
    }

    const logo = await uploadOnCloudinary(organisationLogoPath, companyName);
    console.log(organisationLogoPath);

    if (!logo.url) {
      throw new APIError(409, "Logo is not uploaded properly");
      
    }

    const createOrganisation = await Organisation.create([{
      companyName: companyName,
      companyLogo: logo.url,
      headOfficeName: headOfficeName,
      hrAdminEmail: superAdminEmail || hrAdminEmail,
    }], {session});

    console.log(createOrganisation)

    if (!createOrganisation) {
      throw new APIError(
        500,
        "Something went wrong while creating organisation"
      );
      
    }

    const generateInviteToken = crypto.randomBytes(32).toString("hex");

    let createFounder = null;

    if (superAdminEmail?.length) {
      const createRole = await Role.create([{
        roleName: "Super Admin",
        parentRole: null,
        organisationID: createOrganisation[0]._id,
      }], {session});

      console.log(createRole)

      createFounder = await Employee.create([{
        organisationID: createOrganisation[0]._id,
        employeeName: companyName,
        employeeEmail: superAdminEmail,
        role: createRole[0]._id,
        reportingPerson: null,
        invitationToken: generateInviteToken,
      }], {session});

      if (!createFounder) {
        throw new APIError(500, "Something went wrong while registering admin");
        
      }

      console.log(createFounder)


      const link = `http://localhost:3000/set-password?token=${generateInviteToken}`;

      console.log(link)

      await sendInviteEmail(superAdminEmail, link);
    }
    const lastRole = await Role.find({
      parentRole: createFounder[0]?.role,
      organisationID: createOrganisation[0]._id,
    })
      .sort({ order: -1 })
      .limit(1);
      console.log(lastRole)

    const createRole = await Role.create([{
      roleName: "HR Admin",
      parentRole: createFounder[0]?.role || null,
      organisationID: createOrganisation[0]._id,
      order: lastRole.length ? lastRole[0].order + 1 : 1,
    }], {session});

    console.log(createRole)

    const createAdmin = await Employee.create([{
      organisationID: createOrganisation[0]._id,
      employeeName: adminName,
      employeeEmail: hrAdminEmail,
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      role: createRole[0]._id,
      reportingPerson: createFounder[0]?._id || null,
      password: password,
      invitationToken: null,
    }], {session});

    if (!createAdmin) {
      throw new APIError(500, "Something went wrong while registering founder"); 
    }
    console.log(createAdmin)

    await session.commitTransaction()
    res
      .status(201)
      .json(new APIResponse(201, createAdmin, createFounder, "User fetched"));
  } catch (error) {
    await session.abortTransaction();
    throw new APIError(500, "Error creating organisation", error.message);
    
  }
};

const getInviteToken = async (req, res) => {
  try {
    const employee = req.employee;
    res.json({
      employeeName: employee.companyName,
      employeeEmail: employee.employeeEmail,
      role: employee.role.roleName,
    });
  } catch (error) {
    throw new APIError(500, "Error while token validating" || error.message);
  }
};

const registerFounder = async (req, res) => {
  try {
    const { employeeName, phoneNumber, password } = req.body;

    if (
      [employeeName, phoneNumber, password].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const founder = await Employee.findById(req.employee._id);
    founder.employeeName = employeeName;
    founder.phoneNumber = phoneNumber;
    founder.password = password;

    await founder.save();

    res.status(200).json(new APIResponse(200, founder));
  } catch (error) {
    throw new APIError(500, "Error while setting password" || error.message);
  }
};

export { registerOrganisation, getInviteToken, registerFounder };
