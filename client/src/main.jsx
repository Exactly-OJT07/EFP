import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Spin } from "antd";
import "./index.css";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<Spin />}>
    <RouterProvider router={router} />
  </Suspense>
);
