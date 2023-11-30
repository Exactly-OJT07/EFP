import { createBrowserRouter, Outlet } from "react-router-dom";
import privateRoute from "./routers/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <div>Not found</div>,
    children: [...privateRoute],
  },
]);

export default router;
