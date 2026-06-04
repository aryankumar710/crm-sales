import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { newLead } from "../controllers/leads.controller.js";


const leadsRouter = Router()

leadsRouter.route("/newLead").post(verifyJWT, newLead)

export {leadsRouter}