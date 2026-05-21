import { Role } from "../models/roles.model.js";

export const createRole = async ({
  roleName,
  roleType,
  parentRole,
  organisationID,
  session,
}) => {
  const role = await Role.findOne({
    roleName: parentRole,
    organisationID
  });

  if (!role) {
    throw new Error("Parent role not found");
  }

  const parentRoleId = role._id;

  // Get last child role
  // const lastRole = await Role.find({
  //   parentRole: parentRoleId,
  //   organisationID
  // })
  // .sort({ order: -1 })
  // .limit(1);
  const option = session ? { session } : {};

 const newRole = await Role.create(
    [
      {
        roleName: roleName,
        roleType: roleType,
        parentRole: parentRoleId,
        organisationID: organisationID,
       // order: lastRole.length ? lastRole.order + 1 : 1,
      },
    ],
    option
  );

  return newRole;
};
1