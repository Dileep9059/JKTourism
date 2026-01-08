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
import TravelAgent from "./components/travelagent/TravelAgent";
import TourGuide from "./components/tourguide/TourGuide";
import HomeStay from "./components/homestays/HomeStay";
import HouseBoat from "./components/houseboats/HouseBoat";
import Shopping from "./components/shopping/Shopping";
import ShoppingLocation from "./components/shopping/ShoppingLocation";
import Activities from "./components/activities/Activities";
import ActivityName from "./components/activities/ActivityName";
import Experience from "./components/experience/Experience";
import ExperienceName from "./components/experience/ExperienceName";
import Gallery from "./components/gallery/Gallery";
import Event from "./components/event/Event";
import EventDetail from "./components/event/EventDetail";
import AdminDashboard from "./components/admin/AdminDashboard";
import Feedbacks from "./components/admin/feedback/Feedbacks";
import Category from "./components/admin/categories/Category";
import AddActivity from "./components/admin/activity/AddActivity";
import ShowActivities from "./components/admin/activity/ShowActivities";
import UploadActivityData from "./components/admin/activity/UploadActivityData";
import AddCuisines from "./components/admin/cuisine/AddCusisine";
import CusineData from "./components/admin/cuisine/CuisineData";
import AddDestination from "./components/admin/destination/AddDestination";
import DestinationData from "./components/admin/destination/DestinaionData";
import UploadDestinationData from "./components/admin/destination/UploadDestinationData";
import EventData from "./components/admin/event/EventData";
import AddEvent from "./components/admin/event/AddEvent";
import ExperienceData from "./components/admin/experiences/ExperienceData";
import AddExperience from "./components/admin/experiences/AddExperience";
import AddShopping from "./components/admin/shopping/AddShopping";
import ShoppingData from "./components/admin/shopping/ShoppingData";
import TransportServices from "./components/transport-services/TransportServices";
import Hotelsearch from "./components/hotelsearch/Hotelsearch";
import Hotellist from "./components/hotellist/Hotellist";
import Hoteldetail from "./components/hoteldetail/Hoteldetail";

const ROLES = {
  MASTER_ADMIN: "ROLE_MASTER_ADMIN",
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  ADMIN: "ROLE_ADMIN"
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
    role: ROLES.ADMIN,
    routes: [
      { path: "activity", element: <ShowActivities /> },
      { path: "activity/add", element: <AddActivity /> },
      { path: "activity/upload", element: <UploadActivityData /> },
      { path: "cuisine", element: <CusineData /> },
      { path: "cuisine/add", element: <AddCuisines /> },
      { path: "category", element: <Category /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "destination", element: <DestinationData /> },
      { path: "destination/add", element: <AddDestination /> },
      { path: "destination/upload", element: <UploadDestinationData /> },
      { path: "event", element: <EventData /> },
      { path: "event/add", element: <AddEvent /> },
      { path: "experiences", element: <ExperienceData /> },
      { path: "experiences/add", element: <AddExperience /> },
      { path: "shopping-location", element: <ShoppingData /> },
      { path: "shopping-location/add", element: <AddShopping /> },
      { path: "feedback", element: <Feedbacks /> },
    ],
  }
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

              <Route path="/homestays" element={<HomeStay />} />
              <Route path="/houseboats" element={<HouseBoat />} />
              <Route path="/tour-guide" element={<TourGuide />} />
              <Route path="/travel-agent" element={<TravelAgent />} />
              <Route path="/transport-services" element={<TransportServices />} />

              <Route path="/shopping" element={<Shopping />} />
              <Route path="/shopping/:shoppingLocation" element={<ShoppingLocation />} />

              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:activityName" element={<ActivityName />} />

              <Route path="/experience" element={<Experience />} />
              <Route path="/experience/:experienceName" element={<ExperienceName />} />

              <Route path="/events" element={<Event />} />
              <Route path="/events/:id" element={<EventDetail />} />

              <Route path="/gallery" element={<Gallery />} />
              <Route path="/hotel-search" element={<Hotelsearch />} />
              <Route path="/hotel-list" element={<Hotellist />} />
              <Route path="/hotel-detail" element={<Hoteldetail />} />
            </Route>

            <Route element={<Sidebar />}>
              {/* Role-based routes */}
              {roleRoutes.map(({ role, routes }) => (
                <Route
                  key={role}
                  element={<RequireAuth allowedRoles={[role]} />}
                >
                  {routes.map(({ path, element }) => (
                    <Route
                      key={path}
                      path={path}
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
