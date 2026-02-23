import { Request, Response } from "express";
import { getCatalogByLocation, getCategoriesByLocation } from "../services/catalog.service";

export const getCatalog = async (req: Request, res: Response) => {
  try {
    const locationId = req.query.location_id as string;

    if (!locationId) {
      return res.status(400).json({
        error: {
          message: "location_id is required",
          code: "MISSING_LOCATION_ID",
        },
      });
    }

    const catalog = await getCatalogByLocation(locationId);

    res.status(200).json(catalog);
  } catch (error) {
    res.status(500).json({
      error: {
        message: "Failed to fetch catalog",
        code: "CATALOG_FETCH_FAILED",
      },
    });
  }
};

export const getCatalogCategories = async (req: Request, res: Response) => {
  try {
    const locationId = req.query.location_id as string;

    if (!locationId) {
      return res.status(400).json({
        error: {
          message: "location_id is required",
          code: "MISSING_LOCATION_ID",
        },
      });
    }

    const categories = await getCategoriesByLocation(locationId);
    if (categories.length === 0) {
      return res.status(404).json({
        error: {
          message: "No categories found for the given location with items",
          code: "CATEGORIES_NOT_FOUND",
        },
      });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      error: {
        message: "Failed to fetch categories",
        code: "CATEGORIES_FETCH_FAILED",
      },
    });
  }
};

