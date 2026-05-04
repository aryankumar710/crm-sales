import { Employee } from "../models/employee.model";

export const createEmployee = async (
{ organisationID,
  employeeName,
  employeeEmail,
  phoneNumber,
  countryCode,
  role,
  reportingPerson,
  password,
  invitationToken,
  session}
) => {
  const option = session ? { session } : {};

  await Employee.create(
    [
      {
        organisationID: organisationID,
        employeeName: employeeName,
        employeeEmail: employeeEmail,
        phoneNumber: phoneNumber,
        role: role,
        reportingPerson: reportingPerson,
        password: password,
        invitationToken: invitationToken,
      },
    ],
    option
  );
};
