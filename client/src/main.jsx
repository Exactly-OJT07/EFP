import axios from "axios";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Spin } from "antd";
import "./index.css";
import router from "./router";

const BASE_URL = import.meta.env.VITE_BASR_URL_API;
axios.defaults.baseURL = BASE_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<Spin />}>
    <RouterProvider router={router} />
  </Suspense>
);
