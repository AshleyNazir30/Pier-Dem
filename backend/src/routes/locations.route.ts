import { Router, IRouter } from "express";
import { getLocations } from "../controllers/locations.controller";

const locationsRoute: IRouter = Router();

locationsRoute.get("/", getLocations);

export default locationsRoute;
