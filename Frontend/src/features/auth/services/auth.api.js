import axios from "axios";


const api = axios.create({

    baseURL: "http://localhost:3000/api",

    withCredentials: true

});



export const register = async ({
    username,
    email,
    password
}) => {

    try {

        const response = await api.post(
            "/auth/register",
            {
                username,
                email,
                password
            }
        );


        return response.data;


    } catch (error) {

        throw error.response?.data || {
            message:"Registration failed"
        };

    }

};




export const login = async ({
    email,
    password
}) => {


    try {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );


        return response.data;


    } catch (error) {

        throw error.response?.data || {
            message:"Login failed"
        };

    }

};




export const logout = async () => {


    try {

        const response = await api.get(
            "/auth/logout"
        );


        return response.data;


    } catch (error) {

        throw error.response?.data || {
            message:"Logout failed"
        };

    }

};




export const getMe = async () => {


    try {

        const response = await api.get(
            "/auth/get-me"
        );


        return response.data;


    } catch (error) {

        throw error.response?.data || {
            message:"Authentication check failed"
        };

    }

};




export default {
    register,
    login,
    logout,
    getMe
};