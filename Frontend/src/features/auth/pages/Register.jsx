import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

import "./auth.form.scss";


const Register = () => {


    const navigate = useNavigate();


    const {
        loading,
        handleRegister
    } = useAuth();



    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");



    const handleSubmit = async (e) => {


        e.preventDefault();


        try {


            await handleRegister({
                username,
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

                    <h1>Create Account</h1>

                    <p>
                        Start your personalized AI career journey
                    </p>

                </div>



                <form onSubmit={handleSubmit}>


                    <div className="input-group">

                        <label>Username</label>

                        <input

                            value={username}

                            onChange={(e)=>
                                setUsername(e.target.value)
                            }

                            type="text"

                            name="username"

                            placeholder="Omkar"

                        />

                    </div>



                    <div className="input-group">

                        <label>Email</label>

                        <input

                            value={email}

                            onChange={(e)=>
                                setEmail(e.target.value)
                            }

                            type="email"

                            name="email"

                            placeholder="you@example.com"

                        />

                    </div>




                    <div className="input-group">

                        <label>Password</label>

                        <input

                            value={password}

                            onChange={(e)=>
                                setPassword(e.target.value)
                            }

                            type="password"

                            name="password"

                            placeholder="Create password"

                        />

                    </div>




                    <button
                        disabled={loading}
                        className="button primary-button"
                        type="submit"
                    >

                        {
                            loading
                            ? "Creating..."
                            : "Register"
                        }

                    </button>


                </form>




                <p className="switch-text">

                    Already have an account?

                    <span
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </span>

                </p>


            </div>


        </main>

    );

};


export default Register;