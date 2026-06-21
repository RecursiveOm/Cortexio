import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

import "./auth.form.scss";


const Login = () => {


    const navigate = useNavigate(); 


    const {
        loading,
        handleLogin
    } = useAuth();


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");



    const handleSubmit = async (e) => {


        e.preventDefault();


        try {


            await handleLogin({
                email,
                password
            });


            navigate("/");


        } catch (error) {


            alert(error.message);


        }

    };




    return (

        <main className="auth-page">


            <div className="form-container">


                <div className="form-header">


                    <h1>
                        Welcome Back
                    </h1>


                    <p>
                        Continue building your AI powered career path
                    </p>


                </div>




                <form onSubmit={handleSubmit}>


                    <div className="input-group">


                        <label>
                            Email
                        </label>


                        <input

                            value={email}

                            onChange={(e) =>
                                setEmail(e.target.value)
                            }

                            type="email"

                            name="email"

                            placeholder="you@example.com"

                        />


                    </div>





                    <div className="input-group">


                        <label>
                            Password
                        </label>


                        <input

                            value={password}

                            onChange={(e) =>
                                setPassword(e.target.value)
                            }

                            type="password"

                            name="password"

                            placeholder="••••••••"

                        />


                    </div>





                    <button

                        disabled={loading}

                        className="button primary-button"

                        type="submit"

                    >

                        {
                            loading
                                ? "Logging in..."
                                : "Login"
                        }

                    </button>



                </form>





                <p className="switch-text">


                    New to Cortexio?


                    <span
                        onClick={() =>
                            navigate("/register")
                        }
                    >

                        Create account

                    </span>


                </p>



            </div>


        </main>

    );

};


export default Login;