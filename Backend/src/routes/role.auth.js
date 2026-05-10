import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { roleNameApi, roleSelectionEmployeeList } from "../controllers/roleManagement.controller.js";


const roleRouter = Router()

roleRouter.route("/roleNameApi").get(verifyJWT, roleNameApi)
roleRouter.route("/roleSelectionEmployeeList").get(verifyJWT, roleSelectionEmployeeList)

export {roleRouter}

