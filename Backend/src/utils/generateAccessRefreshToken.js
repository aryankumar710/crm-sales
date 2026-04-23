import { Employee } from "../models/employee.model.js";

const generateAccessTokenAndRefreshToken = async (employeeID) => {
  try {
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      throw new APIError(500, "Employee not found while validating tokens");
    }

    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();

    employee.refreshToken = refreshToken;

    await employee.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new APIError(
      500,
      "Something went wrong while generating accessToken and refreshToken",
      error.message
    );
  }
};

export {generateAccessTokenAndRefreshToken}