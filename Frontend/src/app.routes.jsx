import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/Components/protected";


const router = createBrowserRouter([

    {
        path: "/",
        element:<Protected><h1>Welcome to Cortexio 🚀</h1></Protected>
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