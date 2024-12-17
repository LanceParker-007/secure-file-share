import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.routes.js";
import fileRouter from "./routes/file.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: `${process.env.FRONTEND_URI}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`SERVER is up and running on port ${process.env.PORT}!`);
});

// User routes
app.use("/api/v1/user", userRouter);
// File routes
app.use("/api/v1/file", fileRouter);

// Error handler middleware
app.use(errorHandler);

export default app;
