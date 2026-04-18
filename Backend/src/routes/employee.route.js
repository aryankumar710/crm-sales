
import { Router } from "express";
import { loginEmployee, logout, refreshAccessToken } from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const employeeRouter = Router()

employeeRouter.route("/login").post(loginEmployee)

employeeRouter.route("/refresh-token").post(refreshAccessToken)

employeeRouter.route("/logout").post(verifyJWT,logout)

export {employeeRouter}