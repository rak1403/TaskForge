import { Router } from "express";
import {
  createSubTask,
  createTask,
  getTaskbyId,
  getTasks,
  updateSubTask,
  updateTask,
  deleteSubTask,
  deleteTask,
} from "../controllers/task.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createTaskValidator,
  createSubTaskValidator,
} from "../validators/index.js";
import { AvailableTaskStatues, UserRolesEnum } from "../utils/constants.js";
import { VerifyJWT, validateTaskPermission } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(VerifyJWT);

router
  .route("/:projectId/tasks")
  .get(getTasks)
  .post(createTaskValidator(), validate, createTask);

router
  .route("/:projectId/tasks/:taskId")
  .get(validateTaskPermission([UserRolesEnum.ADMIN]), getTaskbyId)
  .put(validateTaskPermission([UserRolesEnum.ADMIN]), createTaskValidator(), validate, updateTask)
  .delete(validateTaskPermission([UserRolesEnum.ADMIN]), deleteTask);

router
  .route("/:projectId/tasks/:taskId/subtasks")
  .post(validateTaskPermission([UserRolesEnum.ADMIN]), createSubTaskValidator(), validate, createSubTask);

router
  .route("/:projectId/subtasks/:subtaskId")
  .put(validateTaskPermission([UserRolesEnum.ADMIN]), createSubTaskValidator(), validate, updateSubTask)
  .delete(validateTaskPermission([UserRolesEnum.ADMIN]), deleteSubTask);

export default router;


