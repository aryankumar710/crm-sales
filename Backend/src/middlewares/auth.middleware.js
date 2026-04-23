import { Employee } from "../models/employee.model.js";
import { APIError } from "../utils/APIerror.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new APIError(401, "Unnauthorised Access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const employee = await Employee.findById(decodedToken?._id)
      .populate("role")
      .select("-password -refreshToken");

    if (!employee) {
      throw new APIError(401, "Invalid Access Token");
    }

    req.employee = employee;
    next();
  } catch (error) {
    throw new APIError(500, "Invalid Access Token");
  }
};
