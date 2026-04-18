import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { APIError } from "./utils/APIerror.js";

const app = express();

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

import { organisationRouter } from "./routes/organisation.route.js";

import { employeeRouter } from "./routes/employee.route.js";

app.use("/api/v1", organisationRouter)


app.use("/api/v1", employeeRouter)

app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data
    });
  }

    res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

export { app };
