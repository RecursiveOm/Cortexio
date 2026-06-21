import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";


const router = createBrowserRouter([

    {
        path: "/",
        element: <h1>Welcome to Cortexio 🚀</h1>
    },

    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/register",
        element: <Register />
    }

]);


export default router;