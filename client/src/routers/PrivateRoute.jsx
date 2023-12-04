import { PrivateLayout } from "../components/layout/Layout";

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
          { path: "", element: <div>option children</div> },
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
        element: <div>option 2 children</div>,
      },
      {
        path: "404",
        element: <div>404</div>,
      },
    ],
  },
];

export default routes;
