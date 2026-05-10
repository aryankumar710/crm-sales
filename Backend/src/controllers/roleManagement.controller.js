import { Role } from "../models/roles.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createRole } from "../utils/createRole.js";
import { Employee } from "../models/employee.model.js";

const createRoleAPI = async (req, res) => {
  try {
    const { roleName, parentRole, roleType } = req.body;

    if (
      [roleName, parentRole].some((field) => {
        return field.trim === "";
      })
    ) {
      throw new APIError(400, "All filed must be field");
    }

    const organisationID = req.context.organisationID;

    const existingRole = await Role.findOne({
      roleName,
      organisationID,
    });

    if (!existingRole) {
      throw new APIError(409, "Role with same name exist");
    }

    const createRole = await createRole({
      roleName: roleName,
      parentRole: parentRole,
      roleType: roleType,
      organisationID: organisationID,
    });

    if (!createRole) {
      throw new APIError(500, "Something went wrong while adding role");
    }

    res.status(200).json(new APIResponse(200, createRole, "Role created"));
  } catch (error) {
    throw new APIError(500, "something went wrong while creating new role");
  }
};

const roleNameApi = async (req, res) => {
  try {
    const organisationID = req.context.organisationID;

    const roles = await Role.find({ organisationID }).select("roleName").lean();

    if (!roles) {
      throw new APIError(409, "Can't fetch roles");
    }

    const roleList = roles.map((obj) => obj.roleName);

    res.status(200).json(new APIResponse(200, roles, "Role fetched"));
  } catch (error) {
    throw new APIError(500, "Something went wrong while fetching roles");
  }
};

const roleSelectionEmployeeList = async (req, res) => {
  try {
    const organisationID = req.context.organisationID;
    const { roleName } = req.query;
    console.log(roleName)
    if(!roleName){
      throw new APIError(409,"Error")
    }
    const role = await Role.findOne({roleName:roleName, organisationID: organisationID,})
    console.log(role)
    if(!role){
      throw new APIError(409, "Role not found while fetch api for rple selection employee list")
    }

    const getList = await Employee.find({
      role: role._id,
      organisationID: organisationID,
    })
      .select("employeeName")
      .lean();
      console.log(getList)
    if (!getList) {
      throw new APIError(409, "Employee List not fetched");
    }

    res.status(200).json(new APIResponse(200, getList, "Role Selection Employee List Fetched"))
  } catch (error) {
    throw new APIError(500, "Something went wrong while fetching role selection employee list")
    console.log(error)
  }
};

export { createRoleAPI, roleNameApi, roleSelectionEmployeeList };
