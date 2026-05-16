import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass">
        <div className="login-header">
          <div className="logo-icon">
            <Mail size={32} color="var(--primary)" />
          </div>
          <h1>Forgot Password</h1>
          <p>We'll send you a link to reset your password</p>
        </div>

        {submitted ? (
          <div className="success-state">
            <CheckCircle size={48} color="var(--accent-emerald)" />
            <h3>Check your email</h3>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="btn btn-primary w-full mt-4">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
            </button>

            <div className="login-footer">
              <Link to="/login" className="back-link">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        /* Reuse Login styles */
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%);
          padding: 20px;
        }
        .login-card { width: 100%; max-width: 440px; padding: 40px; }
        .login-header { text-align: center; margin-bottom: 32px; }
        .logo-icon { width: 64px; height: 64px; background: rgba(99, 102, 241, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .login-header h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 4px; }
        .login-header p { color: var(--text-secondary); font-size: 0.95rem; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
        .input-field { padding-left: 44px; width: 100%; }
        .login-footer { margin-top: 32px; text-align: center; }
        .back-link { display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; }
        .back-link:hover { color: var(--primary); }
        .success-state { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .success-state p { color: var(--text-secondary); }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 16px; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
