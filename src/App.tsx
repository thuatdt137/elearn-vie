// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { Bounce, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { setLogoutHandler } from "./utils/axios";

function ProtectedRoutes() {
  const { logout, loading, user } = useAuth();

  React.useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  const currentPath = window.location.pathname;
  const unprotectedPaths = ["/signin"];



  if (!user && !unprotectedPaths.includes(currentPath)) {
    return <Navigate to="/signin" replace />;
  }
  if (loading) {
    return <div>Đang tải phiên đăng nhập...</div>;
  }
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
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

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Bọc ProtectedRoutes bên trong Router
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ProtectedRoutes />
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
      </Router>
    </AuthProvider>
  );
}
