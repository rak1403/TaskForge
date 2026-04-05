import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Project Manager",
            link: "https://projectmanager.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgencontent);
    const emailHtml = mailGenerator.generate(options.mailgencontent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from: "mail.projectmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try {
        await transporter.sendMail(mail)
    } catch (error){
        console.error("Email service failed");
        console.error("error ", error);
    }
}

const emailVerificationMailgencontent = (username, verificationUrl) => {
    return {
      body: {
        name: username,
        intro: "Welcome to our app!",
        action: {
          instructions:
            "To verify your email, please click on the button below",
          button: {
            color: "#FED8B1 ",
            text: "Verify your email",
            link: verificationUrl
          },
        },
        outro: "Need help? or have questions? Reply to this email"
      },
    };
};

const ForgotPasswordMailgencontent = (username, passwordresetURL) => {
    return {
      body: {
        name: username,
        intro: "We got a request to reset the password of your account",
        action: {
          instructions:
            "To reset your password please click on the button below",
          button: {
            color: "#FED8B1 ",
            text: "Verify your email",
            link: passwordresetURL,
          },
        },
        outro: "Need help? Just reply to thus email"
      },
    };
};

export { emailVerificationMailgencontent, ForgotPasswordMailgencontent, sendEmail };