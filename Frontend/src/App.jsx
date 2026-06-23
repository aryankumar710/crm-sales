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
import { Profile } from "./pages/Profile/Profile.page.jsx";
import { ForgetPassword } from "./pages/ForgetPassword/ForgetPassword.page.jsx";
import { ChangePassword } from "./pages/ChangePassword/ChangePassword.page.jsx";
import { ProtectedRoute } from "./layouts/ProtectedRoute.jsx";
import { AddEmployee } from "./pages/AdminDashboardEmployeeManagement/AddEmployee.page.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    { path: "/forgetPassword", element: <ForgetPassword /> },
    { path: "/change-password", element: <ChangePassword /> },
    {
      path: "/register",
      element: <Registration />,
    },
    {
      path: "/set-password",
      element: <SetPassword />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <VerticalLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "adminDashboard",
          children: [
            { path: "", element: <AdminDashboard /> },
            { path: "addEmployee", element: <AdminDashboard /> },
          ],
        },
        // {
        //   path: "adminDashboard/addEmployee",
        //   element: <AdminDashboard />,
        // },
        {
          path: "adminDashboardRoles",
          children: [
            { path: "", element: <AdminRoles /> },
            { path: "createRoles", element: <AdminRoles /> },
          ],
        },
        //       {
        //   path: "adminDashboardRoles/createRoles",
        //   element: <AdminRoles />,
        // },

        {
          path: "employeeDashboard",
          element: <EmployeeDashboard />,
        },
        {
          path: "employeeDashboard/addLead",
          element: <EmployeeDashboard />,
        },

        {
          path: "leads",
          element: <Leads />,
        },
        {
          path: "leads/addLead",
          element: <Leads />,
        },

        {
          path: "team",
          element: <Team />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
