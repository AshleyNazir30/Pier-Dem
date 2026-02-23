import express, { Application } from "express";
import locationRoute from "./routes/locations.route";
import catalogRoute from "./routes/catalog.route";
import morgan from "morgan";



const app: Application = express();

app.use(
  morgan(":method :url :status :response-time[3] ms")
);
app.use(express.json());

app.use("/api/locations", locationRoute);
app.use("/api/catalog", catalogRoute);

export default app;
