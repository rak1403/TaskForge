import { body } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";
import { AvailableTaskStatues } from "../utils/constants.js";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is required")
            .isLength({min: 3})
            .withMessage("username shoud be atleast 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required"),
        body("fullName")
            .trim()
            .optional()

    ];
};
const userLoginValidator = () => {
    return [
        body("email").isEmail().withMessage("Email is invalid"),
        body("password").notEmpty().withMessage("Password is required"),
    ];
};
const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),
        body("newPassword")
        .notEmpty()
        .withMessage("new password is required"),
    ];
};
const userForgotPasswordValidator = () => {
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid")
    ];
};
const userResetForgotValidator = () => {
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("Password is required"),
    ];
};

const createProjectValidator = () => {
    return [
        body("name")
        .notEmpty()
        .withMessage("name is required"),
        body("description")
        .optional(),
    ];
};
const addMembertoProjectValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email is invalid"),
        body("role")
        .trim()
        .notEmpty()
        .withMessage("role is required")
        .isIn(AvailableUserRole)
        .withMessage("role is invalid"),
    ]
};

const createTaskValidator = () => {
    return [
        body("title")
        .trim()
        .notEmpty()
        .withMessage("title is required"),
        body("description")
        .optional(),
        body("status")
        .optional()
        .isIn(AvailableTaskStatues)
        .withMessage("status is invalid"),
    ]
};

const createSubTaskValidator = () => {
    return [
        body("title")
        .trim()
        .notEmpty()
        .withMessage("title is required"),
        body("isCompleted")
        .optional()
        .isBoolean()
        .withMessage("isCompleted should be a boolean value"),
    ]
};


const createNoteValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Note title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),

    body("content").trim().notEmpty().withMessage("Note content is required"),
  ];
};

export { userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgotValidator, createProjectValidator, addMembertoProjectValidator, createTaskValidator, createSubTaskValidator, createNoteValidator };