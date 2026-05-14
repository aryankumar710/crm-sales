
import { Router } from "express";
//import { loginEmployee, logout, refreshAccessToken } from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNewEmployee, employeeData } from "../controllers/employeeManagement.controller.js";
const employeeRouter = Router()

employeeRouter.route("/addNewEmployee").post(verifyJWT, createNewEmployee)
employeeRouter.route("/employeeData").get(verifyJWT, employeeData)

export {employeeRouter}