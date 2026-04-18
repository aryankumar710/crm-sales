import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { getInviteToken, registerFounder, registerOrganisation } from "../controllers/organisation.controller.js";
import { inviteTokenValidate } from "../middlewares/inviteTokenValidate.js";

const organisationRouter = Router();

organisationRouter.route("/organisationRegister").post(
upload.single("logo"),

  registerOrganisation
);

organisationRouter.route("/getInviteDetails").get(inviteTokenValidate, getInviteToken);
organisationRouter.route("/setPassword").post(inviteTokenValidate, registerFounder)


export { organisationRouter };
