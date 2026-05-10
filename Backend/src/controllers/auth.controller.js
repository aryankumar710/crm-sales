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
import { generateAccessTokenAndRefreshToken } from "../utils/generateAccessRefreshToken.js";

//Registration of organisation, hr admin and super admin

const register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
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
        "superAdmin Email and HR Admin Email cannot be same. Please leave superAdmin Email field if both email same"
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

    const createOrganisation = await Organisation.create(
      [
        {
          companyName: companyName,
          companyLogo: logo.url,
          headOfficeName: headOfficeName,
          hrAdminEmail: superAdminEmail || hrAdminEmail,
        },
      ],
      { session }
    );

    console.log(createOrganisation);

    if (!createOrganisation) {
      throw new APIError(
        500,
        "Something went wrong while creating organisation"
      );
    }

    const generateInviteToken = crypto.randomBytes(32).toString("hex");

    let createsuperAdmin = null;

    if (superAdminEmail?.length) {
      const createRole = await Role.create(
        [
          {
            roleName: "Super Admin",
            parentRole: null,
            roleType: "Super Admin",
            organisationID: createOrganisation[0]._id,
          },
        ],
        { session }
      );

      console.log(createRole);

      createsuperAdmin = await Employee.create(
        [
          {
            organisationID: createOrganisation[0]._id,
            employeeName: companyName,
            employeeEmail: superAdminEmail,
            role: createRole[0]._id,
            reportingPerson: null,
            invitationToken: generateInviteToken,
          },
        ],
        { session }
      );

      if (!createsuperAdmin) {
        throw new APIError(500, "Something went wrong while registering admin");
      }

      console.log(createsuperAdmin);

      const link = `http://localhost:3000/set-password?token=${generateInviteToken}`;

      console.log(link);

      await sendInviteEmail(superAdminEmail, link);
    }
    const lastRole = await Role.find({
      parentRole: createsuperAdmin[0]?.role,
      organisationID: createOrganisation[0]._id,
    })
      .sort({ order: -1 })
      .limit(1);
    console.log(lastRole);

    const createRole = await Role.create(
      [
        {
          roleName: "HR Admin",
          parentRole: createsuperAdmin[0]?.role || null,
          roleType: "HR Admin",
          organisationID: createOrganisation[0]._id,
          order: lastRole.length ? lastRole[0].order + 1 : 1,
        },
      ],
      { session }
    );

    console.log(createRole);

    const createAdmin = await Employee.create(
      [
        {
          organisationID: createOrganisation[0]._id,
          employeeName: adminName,
          employeeEmail: hrAdminEmail,
          countryCode: countryCode,
          phoneNumber: phoneNumber,
          role: createRole[0]._id,
          reportingPerson: createsuperAdmin[0]?._id || null,
          password: password,
          invitationToken: null,
        },
      ],
      { session }
    );

    if (!createAdmin) {
      throw new APIError(
        500,
        "Something went wrong while registering superAdmin"
      );
    }
    console.log(createAdmin);

    await session.commitTransaction();

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(createAdmin[0]._id);

    const loggedInEmployee = await Employee.findById(createAdmin[0]._id).select(
      "-password -refreshToken"
    );

    const loggedInOrganisation = await Organisation.findById(
      createOrganisation[0]._id
    );

    const option = {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    };

    res
      .status(201)
      .cookie("accessToken", accessToken, option)
      .cookie("aefreshToken", refreshToken, option)
      .json(
        new APIResponse(
          201,
          { loggedInEmployee, loggedInOrganisation },
          "User fetched"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    throw new APIError(500, "Error creating organisation");
  }
};

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

const getInviteToken = async (req, res) => {
  try {
    const employee = req.employee;
    res.json({
      employeeName: employee.companyName,
      employeeEmail: employee.employeeEmail,
    });
  } catch (error) {
    throw new APIError(500, "Error while token validating" || error.message);
  }
};

const registerSuperAdmin = async (req, res) => {
  try {
    const { employeeName, phoneNumber, password } = req.body;

    if (
      [employeeName, phoneNumber, password].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const superAdmin = await Employee.findById(req.employee._id);
    superAdmin.employeeName = employeeName;
    superAdmin.phoneNumber = phoneNumber;
    superAdmin.password = password;

    await superAdmin.save();

    res.status(200).json(new APIResponse(200, superAdmin));
  } catch (error) {
    throw new APIError(500, "Error while setting password" || error.message);
  }
};

// Login of employee

const loginEmployee = async (req, res) => {
  try {
    const { employeeEmail, password } = req.body;

    if (
      [employeeEmail, password].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const employee = await Employee.findOne({ employeeEmail });

    if (!employee) {
      throw new APIError(404, "Employee not found");
    }

    const passwordVerification = await employee.isPasswordCorrect(password);

    if (passwordVerification === false) {
      throw new APIError(401, "Password Incorrect");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(employee._id);

    const loggedInEmployee = await Employee.findById(employee._id).select(
      "-password -refreshToken"
    );

    if (!loggedInEmployee) {
      throw new APIError(400, "Employee not found");
    }
    const loggedInOrganisation = await Organisation.findById(
      loggedInEmployee?.organisationID
    );
    if (!loggedInOrganisation) {
      throw new APIError(400, "Organisation not found");
    }

    const option = {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new APIResponse(
          200,
          { loggedInEmployee, loggedInOrganisation },
          "Loged In"
        )
      );
  } catch (error) {
    throw new APIError(500, "Error while login", error.message);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new APIError(400, "Unauthorised Access");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_ACCESS_TOKEN
    );

    const employee = await Employee.findById(decodedToken?._id);

    if (!employee) {
      throw new APIError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== employee?.refreshToken) {
      throw new APIError(401, "Refresh Token is expired or used");
    }

    const option = {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(employee._id);

    res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new APIResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new APIError(401, error.message || "Invalid Access Token");
  }
};

const logout = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(
      req.context.employeeID,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const option = {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    };

    res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new APIResponse(200, {}, "User logged Out"));
  } catch (error) {}
};

const getMe = async (req, res) => {
  try {
    const loggedInEmployee = await Employee.findById(
      req.context.employeeID
    ).select("-password -refreshToken");
    const loggedInOrganisation = await Organisation.findById(
      req.context.organisationID
    );

    if (!(loggedInEmployee && loggedInOrganisation)) {
      throw new APIError(400, "Employee or organisation not found");
    }

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          { loggedInEmployee, loggedInOrganisation },
          "Get Me Data "
        )
      );
  } catch (error) {
    throw new APIError(
      500,
      "Error while getting employee or organisation data from getme"
    );
  }
};

export {
  register,
  getInviteToken,
  registerSuperAdmin,
  loginEmployee,
  refreshAccessToken,
  logout,
  getMe,
};
