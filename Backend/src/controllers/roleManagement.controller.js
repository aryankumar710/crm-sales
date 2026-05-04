import { Role } from "../models/roles.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";
import { createRole } from "../utils/createRole.js";

export const createRole = async (req, res) => {
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

export const roleSelectionApi = async (req, res) => {
  try {
    const organisationID = req.context.organisationID;

    const roles = await Role.find({ organisationID }).select("roleName").lean();

    if (!roles) {
      throw new APIError(409, "Can't fetch roles");
    }

    res.status(200).json(new APIResponse(200, roles, "Role fetched"));
  } catch (error) {
    throw new APIError(500, "Something went wrong while fetching roles");
  }
};

