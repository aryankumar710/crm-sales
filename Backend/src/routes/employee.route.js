import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNewEmployee, employeeData, getTeamData } from "../controllers/employeeManagement.controller.js";
const employeeRouter = Router()

employeeRouter.route("/addNewEmployee").post(verifyJWT, createNewEmployee)
employeeRouter.route("/employeeData").get(verifyJWT, employeeData)
employeeRouter.route("/teamData").get(verifyJWT, getTeamData)

export {employeeRouter}