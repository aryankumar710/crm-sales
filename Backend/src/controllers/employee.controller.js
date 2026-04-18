import { Employee } from "../models/employee.model.js";
import { Organisation } from "../models/organisation.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIResponse } from "../utils/APIresponse.js";

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

const loginEmployee = async (req, res) => {
  try {
    console.log(req.body);
    const { employeeEmail, password } = req.body;

    if (
      [employeeEmail, password].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new APIError(400, "All fields must be filled");
    }
    // const organisation = await Organisation.findOne({
    //   organisationID: organisationID,
    // });
    // if (!organisation) {
    //   throw new APIError(404, "Organisation not found while login");
    // }
    const employee = await Employee.findOne(employeeEmail);

    if (!employee) {
      throw new APIError(404, "Employee not found");
    }

    const passwordVerification = await employee.isPasswordCorrect(password);

    if (passwordVerification === false) {
      throw new APIError(401, "Password Incorrect");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(employee._id);

    const loggedInEmployee = await Employee.findById(employee._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    console.log(loggedInEmployee);

    res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", refreshToken, options)
      .json(new APIResponse(200, "Loged In", loggedInEmployee));
  } catch (error) {
    throw new APIError(500, "Error while login", error.message);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new APIError(400, "Unauthorised Access");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_ACCESS_TOKEN
    );

    const employee = await Employee.findById(decodedToken?._id);

    if (!employee) {
      throw new APIError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== employee?.refreshToken) {
      throw new APIError(401, "Refresh Token is expired or used");
    }

    const option = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(employee._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new APIResponse(
          200,
          { accessToken, refreshToke: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new APIError(401, error.message || "Invalid Access Token");
  }
};

const logout = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(
      req.employee._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new APIResponse(200, {}, "User logged Out"));
  } catch (error) {}
};

export {
  loginEmployee,
  generateAccessTokenAndRefreshToken,
  refreshAccessToken,
  logout,
};
