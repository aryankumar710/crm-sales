import { Employee } from "../models/employee.model.js";
import { Organisation } from "../models/organisation.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createEmployee } from "../utils/createEmployee.js";
import crypto from "crypto";
import { sendInviteEmail } from "../utils/invitationToken.js";
import { Role } from "../models/roles.model.js";

const createNewEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      employeeRole,
      employeeEmail,
      phoneNumber,
      reportingPerson,
     
    } = req.body;

    //    console.log(req.body)

    if (
      [
        employeeName,
        employeeRole,
        employeeEmail,
        phoneNumber,
        reportingPerson,
        
      ].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const existingEmployee = await Employee.findOne({
      employeeEmail: employeeEmail,
    });
    //   console.log(existingEmployee)

    if (existingEmployee) {
      throw new APIError(409, "Employee with same email exist");
    }

    const organisationID = req.context.organisationID;

    const generateInviteToken = await crypto.randomBytes(32).toString("hex");

    const employeeRoleId = await Role.findOne({
      roleName: employeeRole,
      organisationID: organisationID,
    }).select("_id");
    //  console.log(employeeRoleId)

    const reportingPersonId = await Employee.findOne({
      employeeName: reportingPerson,
      organisationID: organisationID,
    }).select("_id");
    //  console.log(reportingPersonId)

    const employeeData = await createEmployee({
      organisationID: organisationID,
      employeeName: employeeName,
      employeeEmail: employeeEmail,
      countryCode: "+91",
      role: employeeRoleId._id,
      reportingPerson: reportingPersonId._id,
      phoneNumber: phoneNumber,
    
      invitationToken: generateInviteToken,
    });

    // console.log(employeeData)

    const link = `http://localhost:3000/set-password?token=${generateInviteToken}`;

    const sendEmail = sendInviteEmail(employeeEmail, link);

    if (!employeeData) {
      throw new APIError(500, "Something went wrong while adding employee");
    }

    res
      .status(200)
      .json(new APIResponse(200, employeeData, "Employee created"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const employeeData = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const organisationID = req.context.organisationID;
    const roleType = req.context.roleType
    
    if(roleType!== "HR Admin"){
      throw new APIError(409, "Invalid Access")
    }
    let totalEmployees = await Employee.countDocuments({
      organisationID: organisationID,
    });
    let getList = "";
    
    if (req.query.roleName) {
      const role = await Role.findOne({
        roleName: req.query.roleName,
        organisationID: organisationID,
      });
      console.log(role);
      if (!role) {
        throw new APIError(
          409,
          "Role not found while fetch api for role selection employee list"
        );
      }

      totalEmployees = await Employee.countDocuments({
      organisationID: organisationID,
      role: role._id
    });
    
      getList = await Employee.find({
        role: role._id,
        organisationID: organisationID,
      })
        .populate("role reportingPerson")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      if (getList.length===0) {
        throw new APIError(409, "Employee List not fetched");
      }
    } else {
      getList = await Employee.find({ organisationID: organisationID })
        .populate("role reportingPerson")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();
    }

    res.status(200).json(
      new APIResponse(
        200,
        {
          getList,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalEmployees / limit),
          },
        },
        "Employee data fetched"
      )
    );
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createNewEmployee, employeeData };
