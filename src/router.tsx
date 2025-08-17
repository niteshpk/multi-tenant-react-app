import { createBrowserRouter, Navigate } from "react-router-dom";
import { GuardedRoute } from "./routes/GuardedRoute";
import { Dashboard } from "./routes/Dashboard";
import { Devices } from "./routes/Devices";

const routes = [
  { path: "/", element: <GuardedRoute element={<Dashboard />} /> },
  { path: "/dashboard", element: <GuardedRoute element={<Dashboard />} /> },
  {
    path: "/devices",
    element: <GuardedRoute flag="devices.fitbit" element={<Devices />} />,
  },
  { path: "*", element: <Navigate to="/" replace /> }, // fallback
];

export function createAppRouter(basename?: string) {
  return createBrowserRouter(routes, { basename });
}
