
import { Employee } from "../models/employee.model.js";
import {APIError} from "../utils/APIerror.js"
export const inviteTokenValidate = async(req, res)=> {
    const {token} = req.body.token || req.query.token;

    const employee = await Employee.findOne({
    invitationToken: token,
  })

  if (!employee) {
    throw new APIError(400, "Invalid or expired token");
  }

  req.employee = employee;
  next()
}