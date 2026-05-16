import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/auth/reset-password/${resetToken}`, { newPassword: password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass">
        <div className="login-header">
          <div className="logo-icon">
            <Lock size={32} color="var(--primary)" />
          </div>
          <h1>Reset Password</h1>
          <p>Create a new strong password for your account</p>
        </div>

        {success ? (
          <div className="success-state">
            <CheckCircle size={48} color="var(--accent-emerald)" />
            <h3>Success!</h3>
            <p>Your password has been updated. Redirecting to login...</p>
            <Link to="/login" className="btn btn-primary w-full mt-4">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>New Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        /* Reuse Login styles */
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%); padding: 20px; }
        .login-card { width: 100%; max-width: 440px; padding: 40px; }
        .login-header { text-align: center; margin-bottom: 32px; }
        .logo-icon { width: 64px; height: 64px; background: rgba(99, 102, 241, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .login-header h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 4px; }
        .login-header p { color: var(--text-secondary); font-size: 0.95rem; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
        .input-field { padding-left: 44px; width: 100%; }
        .success-state { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .success-state p { color: var(--text-secondary); }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 16px; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
