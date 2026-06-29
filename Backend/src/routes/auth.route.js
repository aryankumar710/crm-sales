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
  getMe,
  changePassword,
  forgetPassword,
  getChangePasswordToken,
} from "../controllers/auth.controller.js";
import { inviteTokenValidate } from "../middlewares/inviteTokenValidate.js";

const authRouter = Router();

// authRouter.route("/register").post(
//   upload.single("logo"),

//   register
// );

authRouter.route("/register").post(
  upload.single("logo"),
  (req, res) => {
    console.log("========== MULTER TEST ==========");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    return res.status(200).json({
      success: true,
      message: "Multer is working",
      body: req.body,
      file: req.file,
    });
  }
);

authRouter.route("/getInviteDetails").get(inviteTokenValidate, getInviteToken);

authRouter.route("/setPassword").patch(registerSuperAdmin);

authRouter.route("/login").post(loginEmployee);

authRouter.route("/refresh-token").post(refreshAccessToken);

authRouter.route("/logout").post(verifyJWT, logout);

authRouter.route("/getMe").get(verifyJWT, getMe);

authRouter.route("/forgetPassword").post(forgetPassword);

authRouter
  .route("/changePasswordToken")
  .get(inviteTokenValidate, getChangePasswordToken);

authRouter.route("/changePassword").post(changePassword);

export { authRouter };
