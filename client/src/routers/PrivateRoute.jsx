import { PrivateLayout } from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import ManageProject from "../pages/ManageProject";
import ManageEmployee from "../pages/ManageEmployee";

const routes = [
  {
    element: <PrivateLayout />,
    children: [
      {
        path: "",
        element: <div>home</div>,
      },
      {
        path: "option1",
        children: [
          { path: "", element: <Dashboard /> },
          // {
          //   path: 'create',
          //   element: < />,
          // },
          // {
          //   path: 'update/:id',
          //   element: < />,
          // },
          // {
          //   path: ':id',
          //   element: < />,
          // },
        ],
      },
      {
        path: "option2",
        element: <ManageEmployee />,
      },
      {
        path: "option3",
        element: <ManageProject />,
      },
      {
        path: "404",
        element: <div>404</div>,
      },
    ],
  },
];

export default routes;
