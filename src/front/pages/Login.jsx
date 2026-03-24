import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { loginService } from "../services/authService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginService(email, password);
      dispatch({ type: "set_token", payload: data.token });
      dispatch({ type: "set_user", payload: data.user });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.message || "Login failed";
      if (msg.toLowerCase().includes("email")) {
        setError("No account found with that email address");
      } else if (msg.toLowerCase().includes("password")) {
        setError("Incorrect password");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const eyeStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div className="home-wrapper">
      <h2 className="view-title">Login</h2>

      <div className="login-box">

        <form className="cyber-form" onSubmit={handleSubmit}>

          <label className="cyber-label">Email</label>
          <input
            type="email"
            className="cyber-input"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
          />

          <label className="cyber-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="cyber-input"
              placeholder="********"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              style={{ paddingRight: "36px" }}
            />
            <button type="button" style={eyeStyle} onClick={() => setShowPassword(v => !v)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className="cyber-btn-success login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          {error && (
            <p style={{ color: "#ff4d4d", textAlign: "center", margin: "8px 0 0", fontSize: "0.875rem" }}>
              {error}
            </p>
          )}

          <p className="signup-link">
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>

        </form>

      </div>
    </div>
  );
};
