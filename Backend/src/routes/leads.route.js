import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addLead, getLeads } from "../controllers/leads.controller.js";


const leadsRouter = Router()

leadsRouter.route("/addLead").post(verifyJWT, addLead)
leadsRouter.route("/getLeads").post(verifyJWT, getLeads)

export {leadsRouter}