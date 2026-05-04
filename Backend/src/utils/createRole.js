import { Role } from "../models/roles.model";

export const createRole = async ({
  roleName,
  roleType,
  parentRole,
  organisationID,
  session,
}) => {
  const lastRole = await Role.findOne({ parentRole, organisationID })
    .sort({ order: -1 })
    .limit(1);
  const option = session ? { session } : {};

  const newRole = await Role.createRole(
    [
      {
        roleName: roleName,
        roleType: roleType,
        parentRole: parentRole._id,
        organisationID: organisationID,
        order: lastRole.length ? lastRole.order + 1 : 1,
      },
    ],
    option
  );
};
1