import { createBrowserRouter } from "react-router-dom";
import { GuardedRoute } from "./routes/GuardedRoute";
import { Dashboard } from "./routes/Dashboard";
import { Devices } from "./routes/Devices";

export const router = createBrowserRouter([
  { path: "/", element: <GuardedRoute element={<Dashboard />} /> },
  { path: "/dashboard", element: <GuardedRoute element={<Dashboard />} /> },
  {
    path: "/devices",
    element: <GuardedRoute flag="devices.fitbit" element={<Devices />} />,
  },
]);
