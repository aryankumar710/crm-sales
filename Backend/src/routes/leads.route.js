import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addLead } from "../controllers/leads.controller.js";


const leadsRouter = Router()

leadsRouter.route("/addLead").post(verifyJWT, addLead)

export {leadsRouter}