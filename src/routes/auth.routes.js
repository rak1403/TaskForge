import { Router } from "express";
import { changeCurrentPassword, forgotPasswordRequest, getCurrentUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { userRegisterValidator, userLoginValidator, userForgotPasswordValidator, userResetForgotValidator, userChangeCurrentPasswordValidator } from "../validators/index.js";
import { login, logoutUser } from "../controllers/auth.controllers.js";
import { VerifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();
//insecured routes -> do not require verify JWT 
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotValidator(), validate, resetForgotPassword);
//secure routes -> they required verify JWT
router.route("/logout").post(VerifyJWT, logoutUser);
router.route("/current-user").post(VerifyJWT, getCurrentUser);
router.route("/change-password").post(VerifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword);
router.route("/resend-email-verification").post(VerifyJWT, resendEmailVerification);


export default router;