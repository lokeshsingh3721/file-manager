import express from "express";
import {
  createDir,
  deleteDir,
  getAllRootDir,
  getDirById,
  updateDir,
} from "../controllers/DirController.js";
import authMiddleware from "../middleware/Auth.js";

const directoryRouter = express.Router();

directoryRouter.post("/create", authMiddleware, createDir);
directoryRouter.get("/getAllRootDir", authMiddleware, getAllRootDir);
directoryRouter.get("/:id", authMiddleware, getDirById);
directoryRouter.delete("/:id", authMiddleware, deleteDir);
directoryRouter.put("/:id", authMiddleware, updateDir);

export { directoryRouter };
