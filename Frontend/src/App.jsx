import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { Registration } from "./pages/Register/Register.page.jsx";
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard.page.jsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { VerticalLayout } from "./layouts/Layout.jsx";
import { Login } from "./pages/Login/Login.page.jsx";
import { AdminRoles } from "./pages/AdminDashboardRoles/AdminRoles.page.jsx";
import { EmployeeDashboard } from "./pages/EmployeeDashboard/EmployeeDashboard.page.jsx";
import { SetPassword } from "./pages/SetPassword/SetPassword.page.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Registration />,
    },
    {
      path: "/adminDashboard",
      element: <VerticalLayout />,
      children: [{ path: "", element: <AdminDashboard /> }],
    },
    {
      path: "/adminDashboard/addEmployee",
      element: <VerticalLayout />,
      children: [{ path: "", element: <AdminDashboard /> }],
    },
    {
      path: "/adminDashboardRoles",
      element: <VerticalLayout/>,
      children:[{path: "", element: <AdminRoles/>}]
    },

    {
      path: "/adminDashboardRoles/createRoles",
      element: <VerticalLayout/>,
      children:[{path: "", element: <AdminRoles/>}]
    },
    {
      path:"/employeeDashboard",
      element: <VerticalLayout/>,
      children:[{path: "", element: <EmployeeDashboard/>}]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/set-password",
      element:<SetPassword/>
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
