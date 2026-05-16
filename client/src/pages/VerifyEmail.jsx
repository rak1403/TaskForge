import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        await axiosInstance.get(`/auth/verify-email/${verificationToken}`);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };
    verify();
  }, [verificationToken]);

  return (
    <div className="login-page">
      <div className="login-card glass text-center">
        <div className="login-header">
          <div className="logo-icon">
            <Mail size={32} color="var(--primary)" />
          </div>
          <h1>Email Verification</h1>
        </div>

        {status === "verifying" && (
          <div className="status-box">
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            <p>Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="status-box">
            <CheckCircle size={48} color="var(--accent-emerald)" />
            <h3>Verified!</h3>
            <p>Your email has been successfully verified. You can now log in.</p>
            <Link to="/login" className="btn btn-primary w-full mt-4">
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="status-box">
            <XCircle size={48} color="var(--accent-rose)" />
            <h3>Verification Failed</h3>
            <p>The link is invalid or has expired. Please try resending the verification email.</p>
            <Link to="/register" className="btn btn-ghost w-full mt-4">
              Back to Sign Up
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%); padding: 20px; }
        .login-card { width: 100%; max-width: 440px; padding: 40px; text-align: center; }
        .login-header { margin-bottom: 32px; }
        .logo-icon { width: 64px; height: 64px; background: rgba(99, 102, 241, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .status-box { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .status-box p { color: var(--text-secondary); }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 16px; }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
