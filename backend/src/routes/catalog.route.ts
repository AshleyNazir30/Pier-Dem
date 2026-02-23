import { Router } from "express";
import { getCatalog,getCatalogCategories } from "../controllers/catalog.controller";

const catalogRoute = Router();

catalogRoute.get("/", getCatalog);
catalogRoute.get("/categories", getCatalogCategories)
export default catalogRoute;
