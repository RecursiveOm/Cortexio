import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/Components/protected";
import Home from "./features/interview/pages/Home";


const router = createBrowserRouter([

    {
        path: "/",
        element:<Protected><Home/></Protected>
    },

    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/register",
        element: <Register />
    },
    {
        path:"/interview/:interviewId",
        element:<Protected> <Home/></Protected>
    }

]);


export default router;