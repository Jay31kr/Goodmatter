import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import startupRoutes from "./routes/startup.routes.js"
import dealRoutes from "./routes/deal.route.js"
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({
    origin:process.env.CLIENT_ORIGIN,
    credentials:true
}));

app.use(express.json({limit : "1mb"}));
app.use(express.urlencoded({extended :true , limit:"1mb"}));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/startup" , startupRoutes);
app.use("/api/v1/deal" , dealRoutes);


app.use(errorHandler);


export {app};
