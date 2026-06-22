import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "./auth.form.scss";

const Login = () => {
    const navigate = useNavigate();
    const { loading, handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({ email, password });
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <main className="auth-page">
            <div className="form-container">

                <div className="form-header">
                    <h1>Welcome back</h1>
                    <p>Continue building your AI&#8209;powered career path</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="button primary-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in…" : "Login"}
                    </button>
                </form>

                <p className="switch-text">
                    New to Cortexio?
                    <span onClick={() => navigate("/register")}>Create account</span>
                </p>

            </div>
        </main>
    );
};

export default Login;