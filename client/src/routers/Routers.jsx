import { createBrowserRouter, Outlet } from "react-router-dom";
import privateRoute from "./PrivateRoute";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <div>Not found</div>,
    children: [...privateRoute],
  },
  {
    path: "/login", 
    element: <Login/>,
  },
]);

export default router;