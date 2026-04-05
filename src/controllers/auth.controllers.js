import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgencontent, ForgotPasswordMailgencontent, sendEmail } from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const generateaccessandrefreshtoken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accesstoken = user.generateAccessToken();
        const refreshtoken = user.generateRefreshToken();

        user.refreshToken = refreshtoken;
        await user.save({validateBeforeSave: false});
        return { accesstoken, refreshtoken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh tokens"
        )
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body;

    const Userexisted = await User.findOne({
        $or: [{username}, {email}]
    })

    if (Userexisted){
        throw new ApiError(409, "User with username or email already exists", []);

    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail(
        {
            email: user?.email,
            subject: "Please verify your email",
            mailgencontent: emailVerificationMailgencontent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
            ),
        }
    );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user: createdUser},
                "user registered successfully and verification email has been sent to your mailID"
            )
        )
});

const login = asyncHandler(async (req, res) => {
    const {email, password, username} = req.body;

    if (!email){
        throw new ApiError(400, "email is required");
    }

    const user = await User.findOne({email});

    if (!user){
        throw new ApiError (400, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid){
        throw new ApiError(400, "Invalid credentials");
    }

    const {accesstoken, refreshtoken} = await generateaccessandrefreshtoken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    const options = {
        httpOnly:true,
        secure: true
    }
    return res 
        .status(200)
        .cookie("accessToken", accesstoken, options)
        .cookie("refreshToken", refreshtoken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accesstoken,
                    refreshtoken
                },
                "User logged in successfully"
            )
        )
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true
        },
    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        )
});

const verifyEmail = asyncHandler(async (req, res) => {
    const {verificationToken} = req.params

    if (!verificationToken){
        throw new ApiError(400, "Email verification token is missing");
    }

    let hashedToken = crypto
        .createHash("sha256")
            .update(verificationToken)
            .digest("hex")
        
    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {$gt: Date.now()}
    })

    if (!user){
        throw new ApiError(400, "token is invalid or expired");
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    user.isEmailVerified = true
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: true
                },
                "Email is verified"
            )
        );
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);

    if (!user){
        throw new ApiError(404, "User does not exist");
    }

    if (user.isEmailVerified){
        throw new ApiError(409, "Email is already verified");
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user?.email,
      subject: "Please verify your email",
      mailgencontent: emailVerificationMailgencontent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
      ),
    });


    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "verification email has been sent to your mailID",
        ),
      );

});

const refreshAccessToken = asyncHandler (async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized access");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user){
            throw new ApiError(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true
        }
        const {accesstoken, refreshtoken: newRefreshtoken} = await generateaccessandrefreshtoken(user._id);
        user.refreshToken = newRefreshtoken;
        await user.save();
        return res
            .status(200)
            .cookie("accessToken", accesstoken, options)
            .cookie("refreshToken", newRefreshtoken, options)
            .json(
                new ApiResponse(
                    200,
                    {accesstoken, refreshtoken: newRefreshtoken},
                    "access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

const forgotPasswordRequest = asyncHandler (async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});

    if (!user){
        throw new ApiError(404, "User does not exist");
    }
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})
    await sendEmail({
        email: user?.email,
        subject: "Password reset request",
        mailgencontent: ForgotPasswordMailgencontent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
        ),
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "password reset mail has been sent to your mailID"
            )
        )
});

const resetForgotPassword = asyncHandler (async (req, res) => {
    const { resetToken } = req.params
    const { newPassword } = req.body

    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")
    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if (!user){
        throw new ApiError(489, "Token is invalid or expired")
    }

    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      throw new ApiError(400, "New password cannot be same as old password");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave: false})
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset successfully"
            )
        );
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid){
        throw new ApiError(400, "Invalid old password");
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
    throw new ApiError(400, "New password cannot be same as old password");
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password is now changed successfully"
            )
        )
});
export { registerUser, generateaccessandrefreshtoken, login, logoutUser, getCurrentUser, verifyEmail, resendEmailVerification, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, changeCurrentPassword };