import { Employee } from "../models/employee.model.js";
import { Organisation } from "../models/organisation.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createEmployee } from "../utils/createEmployee.js";
import crypto from "crypto";
import { sendInviteEmail } from "../utils/invitationToken.js";

const createEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      employeeRole,
      employeeEmail,
      employeeRole,
      employeePhoneNumber,
      reportingPerson,
    } = req.body;

    if (
      [
        employeeName,
        employeeRole,
        employeeEmail,
        employeePhoneNumber,
        reportingPerson,
      ].some((field) => {
        return field?.trim === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }

    const existingEmployee = await Employee.findOne(employeeEmail);

    if (existingEmployee) {
      throw new APIError(409, "Employee with same email exist");
    }

    const organisationID = req.context.organisationID;

    const generateInviteToken = crypto.randomBytes(32).toString("hex");

    const createEmployee = await createEmployee({
      organisationID: organisationID,
      employeeName: employeeEmail,
      employeeEmail: employeeEmail,
      countryCode: "+91",
      role: role,
      reportingPerson: reportingPerson,
      invitationToken: generateInviteToken,
      session: session,
    });

    const link = `http://localhost:3000/set-password?token=${generateInviteToken}`;

    const sendEmail = sendInviteEmail(employeeEmail, link);

    if (!createEmployee) {
      throw new APIError(500, "Something went wrong while adding employee");
    }

    res.status(200).json(new APIResponse(200, createEmployee, "Employee created"));
  } catch (error) {
    throw new APIError(500, "Error creating organisation");
  }
};
