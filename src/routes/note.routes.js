import { Router } from "express";
import {
  getNotes,
  createNote,
  getNoteDetails,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";

import {
  VerifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { createNoteValidator } from "../validators/index.js";

import { UserRolesEnum, AvailableUserRole } from "../utils/constants.js";

const router = Router();

router.use(VerifyJWT);
router
  .route("/:projectId/notes")
  .get(validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]), getNotes)
  .post(validateProjectPermission([UserRolesEnum.ADMIN]), createNoteValidator(), validate, createNote);

router
    .route("/:projectId/notes/:noteId")
    .get(validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]), getNoteDetails)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), createNoteValidator(), validate, updateNote)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote)
 export default router;