// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import React from "react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { setLogoutHandler } from "./utils/axios";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import Student from "./pages/Admin/Management/Student";
import { ScrollToTop } from "./components/common/ScrollToTop";

const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Đang tải phiên đăng nhập...</div>;
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const isLoggedOut = localStorage.getItem("isLoggedOut");
  const storedUser = localStorage.getItem("user");
  if (!storedUser && (isLoggedOut === "true" || !isLoggedOut)) {
    return <Navigate to="/signin" replace />;
  }
  if (loading) return <div>Đang tải phiên đăng nhập...</div>;
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

function AppRoutes() {
  const { logout } = useAuth();
  React.useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/student" element={<Student />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </AuthProvider>
    </Router>
  );
}