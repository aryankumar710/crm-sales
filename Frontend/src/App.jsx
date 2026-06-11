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
import { AddLeads } from "./pages/AddLeads/AddLeads.page.jsx";
import { Leads } from "./pages/Leads/Leads.page.jsx";
import { Team } from "./pages/Team/Team.page.jsx";

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
      element: <VerticalLayout />,
      children: [{ path: "", element: <AdminRoles /> }],
    },

    {
      path: "/adminDashboardRoles/createRoles",
      element: <VerticalLayout />,
      children: [{ path: "", element: <AdminRoles /> }],
    },
    {
      path: "/employeeDashboard",
      element: <VerticalLayout />,
      children: [
        { path: "", element: <EmployeeDashboard /> },
        { path: "addLead", element: <EmployeeDashboard /> },
      ],
    },
    {
      path: "/leads",
      element: <VerticalLayout/>,
      children: [{path: "", element: <Leads/>},
        {path: "addLead", element: <Leads/>}
      ]
    },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/set-password",
      element: <SetPassword />,
    },
    {
      path: "/team",
      element: <VerticalLayout/>,
      children: [{path: "", element: <Team/>}]
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
