import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addLead, editLead, getFunnelData, getLeads } from "../controllers/leads.controller.js";


const leadsRouter = Router()

leadsRouter.route("/addLead").post(verifyJWT, addLead)
leadsRouter.route("/getLeads").get(verifyJWT, getLeads)
leadsRouter.route("/getFunnelData").get(verifyJWT, getFunnelData)
leadsRouter.route("/updateLeadDetails").patch(verifyJWT, editLead)

export {leadsRouter}