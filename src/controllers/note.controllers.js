
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ProjectNote } from "../models/note.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getNotes = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const project = await Project.findById(new mongoose.Types.ObjectId(projectId));

    if (!project){
        throw new ApiError(404, "Project not found");
    }
    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("createdBy", "avatar username fullName");
    
    return res.status(200).json(new ApiResponse(200, notes, "Notes retrieved successfully"));

});

const createNote = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const {content} = req.body;
    const project = await Project.findById(new mongoose.Types.ObjectId(projectId));
    if (!project){
        throw new ApiError(404, "Project not found");
    }   
    const note = await ProjectNote.create({
        content,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    }).populate("createdBy", "avatar username fullName");

    return res.status(201).json(new ApiResponse(201, note, "Note created successfully"));
});

const getNoteDetails = asyncHandler(async (req, res) => {
    const {projectId, noteId} = req.params;
    const project = await Project.findById(new mongoose.Types.ObjectId(projectId));
    if (!project){
        throw new ApiError(404, "Project not found");
    }
    const note = await ProjectNote.findById(
        new mongoose.Types.ObjectId(noteId)
    ).populate("createdBy", "avatar username fullName");

    if (!note){
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note details retrieved successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;
    const project = await Project.findById(new mongoose.Types.ObjectId(projectId));
    if (!project){
        throw new ApiError(404, "Project not found");
    }
    const note = await ProjectNote.findByIdAndUpdate(
        new mongoose.Types.ObjectId(noteId),
        { ...req.body },
        { new: true }
    ).populate("createdBy", "avatar username fullName");

    if (!note){
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { rpojectId, noteId }  = req.params;
    const project = await Project.findById(new mongoose.Types.ObjectId(rpojectId));
    if (!project){
        throw new ApiError(404, "Project not found");
    }
    const note = await ProjectNote.findById(new mongoose.Types.ObjectId(noteId));
    if (!note){
        throw new ApiError(404, "Note not found");
    }
    await ProjectNote.findByIdAndDelete(new mongoose.Types.ObjectId(noteId));
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Note deleted successfully"));
});
export {
    getNotes,
    createNote,
    getNoteDetails,
    updateNote,
    deleteNote 
}

