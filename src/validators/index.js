import { body } from "express-validator";

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
            .isLowercase()
            .withMessage("the name should in lowercase")
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
        body("email").optional().isEmail().withMessage("Email is invalid"),
        body("password").notEmpty().withMessage("Password is required"),
    ];
};
const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldpassword")
        .notEmpty()
        .withMessage("Old password is required"),
        body("new password")
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
export { userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgotValidator };