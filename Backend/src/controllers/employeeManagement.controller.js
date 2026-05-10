import { Employee } from "../models/employee.model.js";
import { Organisation } from "../models/organisation.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createEmployee } from "../utils/createEmployee.js";
import crypto from "crypto";
import { sendInviteEmail } from "../utils/invitationToken.js";
import {Role} from "../models/roles.model.js"

const createNewEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      employeeRole,
      employeeEmail,
      employeePhoneNumber,
      reportingPerson,
    } = req.body;

    console.log(req.body)

    if (
      [
        employeeName,
        employeeRole,
        employeeEmail,
        employeePhoneNumber,
        reportingPerson,
      ].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const existingEmployee = await Employee.findOne({employeeEmail:employeeEmail});
    console.log(existingEmployee)

    if (existingEmployee) {
      throw new APIError(409, "Employee with same email exist");
    }

    const organisationID = req.context.organisationID;

    const generateInviteToken = await crypto.randomBytes(32).toString("hex");

    const employeeRoleId = await Role.findOne({roleName:employeeRole, organisationID:organisationID}).select("_id")
    console.log(employeeRoleId)

    const reportingPersonId = await Employee.findOne({employeeName:reportingPerson , organisationID:organisationID}).select("_id")
    console.log(reportingPersonId)

    const employeeData = await createEmployee({
      organisationID: organisationID,
      employeeName: employeeName,
      employeeEmail: employeeEmail,
      countryCode: "+91",
      role: employeeRoleId._id,
      reportingPerson: reportingPersonId._id,
      invitationToken: generateInviteToken,
      
    });

    console.log(employeeData)

    const link = `http://localhost:3000/set-password?token=${generateInviteToken}`;

    const sendEmail = sendInviteEmail(employeeEmail, link);

    if (!employeeData) {
      throw new APIError(500, "Something went wrong while adding employee");
    }

    res.status(200).json(new APIResponse(200, employeeData, "Employee created"));
  } catch (error) {
    console.log(error.message)
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
    
  }
};

export {createNewEmployee}
