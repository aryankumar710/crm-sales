import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { APIError } from "./utils/APIerror.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

import { authRouter } from "./routes/auth.route.js";

app.use("/api/v1", authRouter);

import { roleRouter } from "./routes/role.auth.js";
app.use("/api/v1", roleRouter);

import { employeeRouter } from "./routes/employee.route.js";
app.use("/api/v1", employeeRouter)

import { leadsRouter } from "./routes/leads.route.js";
app.use("/api/v1", leadsRouter)

app.use((err, req, res, next) => {
  console.error("============= GLOBAL ERROR =============");
  console.error(err);
  console.error(err.stack);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
});

export { app };
