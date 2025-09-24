import React from "react";
import "./App.css";
import { ConfigProvider } from "antd";
import {
  BrowserRouter as BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import { Header } from "./component/Header";
import NotFound from "./pages/NotFound";
// import TestVideo from "./pages/TestVideo";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./pages/Dashboard";
import ElectionDetails from "./pages/ElectionDetails";
import AddElection from "./pages/AddElection";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f65200",
          },
        }}
      >
        <BrowserRouter>
          {/* <Header /> */}
          <Routes>
            {/* <span> {route.pathname} </span> */}
            <Route index path="/" element={<Homepage />} />
            <Route index path="/dashboard" element={<Dashboard />} />
            <Route index path="/elections/:id" element={<ElectionDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/add-election" element={<AddElection />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
