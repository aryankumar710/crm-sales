import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  register,
  getInviteToken,
  registerSuperAdmin,
  loginEmployee,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import { inviteTokenValidate } from "../middlewares/inviteTokenValidate.js";

const authRouter = Router();

authRouter.route("/register").post(
  upload.single("logo"),

  register
);

authRouter.route("/getInviteDetails").get(inviteTokenValidate, getInviteToken);

authRouter.route("/setPassword").post(inviteTokenValidate, registerSuperAdmin);

authRouter.route("/login").post(loginEmployee);

authRouter.route("/refresh-token").post(refreshAccessToken);

authRouter.route("/logout").post(verifyJWT, logout);

export { authRouter };
