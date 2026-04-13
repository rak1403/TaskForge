import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const project = await Project.findById(projectId);

    if (!project){
        throw new ApiError(404, "Project not found");
    }

    const Tasks = await Task.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("assignedTo", "avatar username fullName")

    return res
        .status(200)
        .json(
            new ApiResponse(200, Tasks, "tasks fetched successfully"),
        )
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId)
  if (!project){
    throw new ApiError(404, "Project not found");
  }
  const files = req.files || [];
  const attachments = files.map((file) => {
    return {
        url: `${process.env.SERVER_URL}/images/${file.originalname}`,
        mimetype: file.mimetype,
        size: file.size,
    }
  })

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments
  });
  return res
    .status(201)
    .json(
        new ApiResponse(201, task, "Task created successfully")
    )
});

const updateTask = asyncHandler(async (req, res) => {
  //task
});

const getTaskbyId = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        _id: 1,
                        username: 1,
                        fullName: 1,
                        avatar: 1
                    }
                ]
            }
        },
        {
            $lookup: {
                fro: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $lookup: {
                                        _id: 1,
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0]
                            }
                        }
                    }
                ],
            }
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0]
                }
            }
        }

    ]);

    if (!task || task.length === 0){
        throw new ApiError(404, "task not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "task fetched successfully",
            )
        )
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId} = req.params;
    const task = await Task.findById(taskId);
    if (!task){
        throw new ApiError(404, "task not found");
    }
    await Subtask.deleteMany({
        task: new mongoose.Types.ObjectId(taskId)
    })
    await Task.findByIdAndDelete(taskId);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "task deleted successfully"
            )
        )
});

const createSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, isCompleted } = req.body;
    const task = await Task.findById(taskId);
    if (!task){
        throw new ApiError(404, "task not found");
    }
    const subTask = await Subtask.create({
        title,
        isCompleted: isCompleted || false,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
        task: new mongoose.Types.ObjectId(taskId),
    });
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                subTask,
                "subtask created successfully"
            )
        )
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const { title, isCompleted } = req.body;

  const subTask = await Subtask.findById(new mongoose.Types.ObjectId(subtaskId));
  if (!subTask) {
    throw new ApiError(404, "subtask not found");
  }
  if (title !== undefined) {
    subTask.title = title;
  }
  if (isCompleted !== undefined) {
    subTask.isCompleted = isCompleted;
  }
  await subTask.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subTask,
        "subtask updated successfully"
      )
    );
});

const deleteSubTask = asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    const subTask = await Subtask.findById(new mongoose.Types.ObjectId(subtaskId));
    if (!subTask) {
        throw new ApiError(404, "subtask not found");
    }
    await Subtask.findByIdAndDelete(new mongoose.Types.ObjectId(subtaskId));
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "subtask deleted successfully"
            )
        )
});

export {
    createSubTask,
    createTask,
    getTaskbyId,
    getTasks,
    updateSubTask,
    updateTask,
    deleteSubTask,
    deleteTask
}