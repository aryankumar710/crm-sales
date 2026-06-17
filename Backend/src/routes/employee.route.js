import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createNewEmployee,
  employeeData,
  getProfileData,
  getTeamData,
  updateProfileData,
} from "../controllers/employeeManagement.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const employeeRouter = Router();

employeeRouter.route("/addNewEmployee").post(verifyJWT, createNewEmployee);
employeeRouter.route("/employeeData").get(verifyJWT, employeeData);
employeeRouter.route("/teamData").get(verifyJWT, getTeamData);
employeeRouter.route("/profileData").get(verifyJWT, getProfileData);
employeeRouter.route("/updateProfileData").patch(verifyJWT, updateProfileData);
employeeRouter.route("/changeProfilePhoto").patch(verifyJWT, upload.single("profilePhoto"))

export { employeeRouter };
