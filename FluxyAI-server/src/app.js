import express from "express";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Custom CORS Middleware to handle credentials and dynamic origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandler);

export default app;