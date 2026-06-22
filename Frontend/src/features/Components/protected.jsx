import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/hooks/useAuth.js";



const Protected = ({ children }) => {


    const {
        loading,
        user
    } = useAuth();


    const navigate = useNavigate();




    useEffect(() => {


        if (!loading && !user) {

            navigate("/login");

        }


    }, [loading, user, navigate]);





    if (loading) {


        return (

            <main>

                <h1>
                    Loading...
                </h1>

            </main>

        );


    }





    if (!user) {


        return null;


    }





    return children;


};



export default Protected;