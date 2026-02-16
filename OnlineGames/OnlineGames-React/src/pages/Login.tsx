import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { API_BASE } from "../config/api";
import { motion } from "framer-motion";
import "../styles/login.css"

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-container"
      >
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="login-button-wrapper">
            <div className="login-button-scale">
              <GoogleLogin
                theme="filled_black"
                shape="pill"
                size="large"
                onSuccess={async (cred) => {
                  if (!cred.credential) {
                    console.log("No credential");
                    return;
                  }

                  const res = await fetch(`${API_BASE}/auth/google.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ token: cred.credential }),
                  });

                  const text = await res.text();
                  console.log("RAW google.php response:", text);

                  await refreshUser();
                  navigate("/");
                }}
              />
            </div>
          </div>

          <div className="login-terms">
            By signing in, you agree to our Terms & Privacy Policy
          </div>
        </div>

        <div className="login-footer">
          © {new Date().getFullYear()} Your App Name
        </div>
      </motion.div>
    </div>
  );
}
