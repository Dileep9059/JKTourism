import Login from "./components/auth/Login";
import Missing from "./components/Missing";
import PersistLogin from "./components/auth/PersistLogin";
import Register from "./components/auth/Register";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/auth/Layout";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "@/components/Home";
import Sidebar from "./components/Sidebar";
import Chats from "./features/chats/Chats";
import SettingsAccount from "./features/settings/account/SettingsAccount";
import SettingsNotifications from "./features/settings/notifications/SettingsNotifications";
import SettingsProfile from "./features/settings/profile/SettingsProfile";
import AdminTasks from "./features/tasks/AdminTasks";
import UsersData from "./features/users/UsersData";
import OuterLayout from "./components/layout/structure/OuterLayout";
import Dashboard from "./features/dashboard/Dashboard";
import Settings from "./features/settings/Settings";
import Mutation from "@/features/mutation/page/Mutation";
import FileManager from "./components/FileManager/FileManager";
import Plantrip from "./components/PlanTrip/Plantrip";
import PrivacyPolicy from "./components/footer/PrivacyPolicy";
import ContactUs from "./components/contactus/ContactUs";
import Categories from "./components/categories/Categories";
import DestinationCategories from "./components/categories/DestinationCategories";
import DestinationCategory from "./components/categories/DestinationCategory";
import DestinationDetails from "./components/categories/DestinationDetails";

const ROLES = {
  MASTER_ADMIN: "ROLE_MASTER_ADMIN",
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  DISTRICT_ADMIN: "ROLE_DISTRICT_ADMIN",
  TEHSILDAR: "ROLE_TEHSILDAR",
  NAIB_TEHSILDAR: "ROLE_NAIB_TEHSILDAR",
  PATWARI: "ROLE_PATWARI"
};

const roleRoutes = [
  {
    role: ROLES.MASTER_ADMIN,
    basePath: "masterAdmin",
    routes: [
      { path: "", element: <Dashboard /> },
      { path: "users", element: <UsersData /> },
      { path: "mutation", element: <Mutation /> },
      { path: "tasks", element: <AdminTasks /> },
      { path: "chats", element: <Chats /> },
      { path: "fileManager", element: <FileManager /> },
    ],
  },
  {
    role: ROLES.SUPER_ADMIN,
    basePath: "superAdmin",
    routes: [
      { path: "", element: <Dashboard /> },
      { path: "users", element: <UsersData /> },
    ],
  },
  {
    role: ROLES.DISTRICT_ADMIN,
    basePath: "districtAdmin",
    routes: [
      { path: "", element: <Dashboard /> },
      { path: "users", element: <UsersData /> },
    ],
  },
  {
    role: ROLES.TEHSILDAR,
    basePath: "tehsildar",
    routes: [{ path: "", element: <Dashboard /> }],

  },
  {
    role: ROLES.NAIB_TEHSILDAR,
    basePath: "naibTehsildar",
    routes: [{ path: "", element: <Dashboard /> }],
  },
  {
    role: ROLES.PATWARI,
    basePath: "patwari",
    routes: [
      { path: "", element: <Dashboard /> },
      { path: "mutation", element: <Mutation /> },
    ],
  },
];

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            {/* Public routes */}
            <Route element={<OuterLayout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/plan-trip" element={<Plantrip />} />
              <Route path="/policy" element={<PrivacyPolicy />} />

              <Route path="/categories" element={<Categories />} />
              <Route path="/most-visited-destinations" element={<DestinationCategories />} />
              <Route path="/most-visited-destinations/:categoryName" element={<DestinationCategory />} />
              <Route path="/most-visited-destinations/:categoryName/:placeName" element={<DestinationDetails />} />
            </Route>

            {/* Protected routes inside Sidebar */}
            <Route element={<Sidebar />}>
              {/* Role-based routes */}
              {roleRoutes.map(({ role, basePath, routes }) => (
                <Route
                  key={role}
                  element={<RequireAuth allowedRoles={[role]} />}
                >
                  {routes.map(({ path, element }) => (
                    <Route
                      key={path}
                      path={`${basePath}/${path}`}
                      element={element}
                    />
                  ))}
                </Route>
              ))}

              {/* Common authenticated settings routes */}
              <Route
                element={
                  <RequireAuth
                    allowedRoles={Object.values(ROLES)}
                  />
                }
              >
                <Route element={<Settings />}>
                  <Route path="profile" element={<SettingsProfile />} />
                  <Route path="profile/account" element={<SettingsAccount />} />
                  <Route
                    path="profile/notifications"
                    element={<SettingsNotifications />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
