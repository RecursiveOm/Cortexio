import { useContext } from "react";

import { AuthContext } from "../auth.context.jsx";

import {
    login,
    register,
    logout,
    getMe
} from "../services/auth.api.js";



export const useAuth = () => {


    const context = useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }



    const {
        user,
        setUser,
        loading,
        setLoading
    } = context;




    const handleLogin = async ({
        email,
        password
    }) => {


        setLoading(true);


        try {


            const data = await login({
                email,
                password
            });


            setUser(data.user);


            return data;



        } catch (err) {


            throw err;



        } finally {


            setLoading(false);


        }


    };







    const handleRegister = async ({
        username,
        email,
        password
    }) => {



        setLoading(true);



        try {



            const data = await register({
                username,
                email,
                password
            });



            setUser(data.user);



            return data;




        } catch (err) {



            throw err;




        } finally {



            setLoading(false);



        }



    };








    const handleLogout = async () => {



        setLoading(true);



        try {



            await logout();



            setUser(null);




        } catch (err) {



            throw err;




        } finally {



            setLoading(false);



        }



    };









    const checkAuth = async () => {



        setLoading(true);



        try {



            const data = await getMe();



            setUser(data.user);




        } catch (err) {



            setUser(null);




        } finally {



            setLoading(false);



        }



    };






    return {

        user,

        loading,

        handleLogin,

        handleRegister,

        handleLogout,

        checkAuth

    };


};