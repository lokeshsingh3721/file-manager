import Directory from "../models/dirModel.js";
import { z } from "zod";
import User from "../models/userModel.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { getFileType } from "../utils/getFileType.js";

type ObjectId = mongoose.Types.ObjectId;

const createDirValidation = z.object({
  name: z.string(),
  parent: z.string().optional(),
  lastEdit: z.date().optional(),
  createdAt: z.date().optional(),
  userId: z.string(),
});

export const createDir = async (req: Request, res: Response) => {
  try {
    // zod validation
    const userId = req.headers["userId"];
    const { name, parent, lastEdit, createdAt } = req.body;
    const { success, data } = createDirValidation.safeParse({
      name,
      parent,
      lastEdit,
      createdAt,
      userId,
    });

    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }

    if (data.parent) {
      const parentExist = await Directory.findById({
        _id: data.parent,
      });
      if (!parentExist) {
        return res.status(404).json({
          success: false,
          message: "Parent doesn't exist",
        });
      }
    }

    // check user exist or not
    const userExist = await User.findById({
      _id: data.userId,
    });
    if (!userExist) {
      return res.status(401).json({
        success: false,
        message: "user doesnt exist ",
      });
    }

    const directoryExist = await Directory.findOne({
      name: data.name,
      parent: data.parent ? data.parent : null,
    });

    if (directoryExist) {
      return res.status(400).json({
        success: false,
        message: "Directory already exists",
      });
    }
    const directory = await Directory.create(data);

    res.status(200).json({
      success: true,
      data: directory,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(501).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};

export const getAllRootDir = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["userId"];
    const allDir = await Directory.find({
      parent: null,
      userId,
    });
    return res.status(200).json({
      success: true,
      data: allDir,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const getDirById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers["userId"];
    if (!id || typeof id != "string") {
      return res.status(404).json({
        success: false,
        message: "invalid id",
      });
    }
    const items = await Directory.find({
      parent: id,
      userId,
    });

    res.status(200).json({
      success: true,
      folders: items,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(501).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const deleteDir = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as ObjectId;

    if (!id || typeof id != "string") {
      return res.status(404).json({
        success: false,
        message: "invalid id",
      });
    }

    // recursively delete all the  sub folders

    async function deleteAll(id: ObjectId) {
      const userId = req.headers["userId"];
      const subDirs = await Directory.find({
        parent: id,
        userId,
      });
      for (const dirs of subDirs) {
        deleteAll(dirs._id);
        await Directory.deleteOne({
          _id: dirs._id,
          userId,
        });
      }
    }

    await deleteAll(id);

    // delete the root folder

    await Directory.deleteOne({
      _id: id,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(501).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const updateDir = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parent } = req.body;
    const userId = req.headers["userId"];

    if (!id || !parent || typeof id != "string") {
      return res.status(404).json({
        success: false,
        message: "invalid id",
      });
    }

    const alreadyExist = await Directory.find({
      name,
      parent,
      userId,
    });

    if (alreadyExist.length > 0) {
      return res.status(404).json({
        success: false,
        message: "already exist ",
      });
    }

    const updatedDir = await Directory.findByIdAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        name,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedDir,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(501).json({
        success: false,
        message: error.message,
      });
    }
  }
};
