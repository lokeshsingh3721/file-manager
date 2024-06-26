import Directory from "../models/dirModel.js";
import { Request, Response } from "express";
import File from "../models/fileModel.js";
import Recent from "../models/recentModel.js";
import { z } from "zod";
import { getFileType } from "../utils/getFileType.js";

const parseFileType = z.object({
  name: z.string(),
  createdAt: z.date().optional(),
  lastEdit: z.date().optional(),
  size: z.number(),
  parent: z.string(),
  userId: z.string(),
  fileType: z.string().optional(),
});

const parseFileUpdate = z.object({
  name: z.string(),
  fileId: z.string(),
  userId: z.string(),
});

export const createFile = async (req: Request, res: Response) => {
  try {
    // zod validation
    const { name, createdAt, lastEdit, size, parent } = req.body;
    const userId = req.headers["userId"];
    const { success, data } = parseFileType.safeParse({
      name,
      createdAt,
      lastEdit,
      size,
      parent,
      userId,
    });

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "invalid input type",
      });
    }
    // check file already exist within same parent folder
    const hasFile = await File.find({
      name: data.name,
      parent: data.parent,
      userId: data.userId,
    });
    if (hasFile.length > 0) {
      return res.status(404).json({
        success: false,
        message: "file already exists ",
      });
    }
    // get the file type
    const fileType = getFileType(data.name);
    data.fileType = fileType;

    // create a file
    const file = await File.create(data);
    res.status(200).json({
      success: true,
      message: "file created successfully",
      file,
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

export const getFilesByParent = async (req: Request, res: Response) => {
  try {
    const { id: parent } = req.params;

    console.log("parentid", parent);
    if (typeof parent != "string") {
      return res.status(404).json({
        success: false,
        message: "invalid input ",
      });
    }
    // check parent exist or not
    const hasParent = await Directory.findById({
      _id: parent,
    });
    if (!hasParent) {
      res.status(404).json({
        success: false,
        message: "parent doesnt not exist ",
      });
    }
    // get all the files
    const files = await File.find({
      parent,
    });
    res.status(200).json({
      success: true,
      message: "files fetched successfully",
      files,
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

export const getFilesByType = async (req: Request, res: Response) => {
  try {
    const { filetype } = req.params;
    const userId = req.headers["userId"];
    if (typeof filetype != "string") {
      return res.status(404).json({
        success: false,
        message: "invalid input ",
      });
    }
    const files = await File.find({
      fileType: filetype,
      userId,
    });
    return res.status(200).json({
      success: true,
      message: "files fetched successfully",
      files,
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

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["userId"];
    const { parent, id } = req.query;
    if (typeof id != "string") {
      return res.status(404).json({
        success: false,
        message: "invalid input",
      });
    }
    // check file exist or not
    const doesFileExist = await File.find({
      _id: id,
      userId,
    });
    if (doesFileExist.length <= 0) {
      return res.status(404).json({
        success: false,
        message: "file does not exist ",
      });
    }
    // check if file exist in recent
    const fileExistInRecent = await Recent.findOne({
      fileId: id,
      userId,
    });
    if (fileExistInRecent) {
      await Recent.deleteOne({
        fileId: id,
        userId,
      });
    }
    // delete the file
    await File.deleteOne({
      _id: id,
      userId,
    });

    // get all the files
    const files = await File.find({
      parent,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "file deleted successfully",
      files,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(501).json({
        success: false,
        message: error.message,
      });
      console.log(error.message);
    }
  }
};

export const updateFile = async (req: Request, res: Response) => {
  try {
    const { fileId, name } = req.query;
    const userId = req.headers["userId"];
    console.log(fileId, name);
    // zod validation
    const { success, data } = parseFileUpdate.safeParse({
      fileId,
      name,
      userId,
    });
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "invalid input",
      });
    }
    // check file exist or not
    const fileExist = await File.findById({
      _id: data.fileId,
    });
    if (!fileExist) {
      return res.status(404).json({
        success: false,
        message: "file doesnot exist",
      });
    }
    // update file
    await File.findOneAndUpdate({ _id: data.fileId, name: data.name });

    return res.status(200).json({
      success: true,
      message: "update successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(501).json({
        success: false,
        message: error.message,
      });
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.send({
    filename: req.file.filename,
    filepath: `/uploads/${req.file.filename}`,
    size: req.file.size / 1000 + "KB",
  });
};
