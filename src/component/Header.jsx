import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/media/logo.png";
import { motion } from "framer-motion";

export function Header() {
  const navigator = useNavigate();
  const location = useLocation();
  const notShow = [
    "/register",
    "/login",
    "/forgot-password",
    "/",
    "/dashboard",
    "/verify-email",
    "/create-new-password",
  ];
  return (
    !notShow.includes(location.pathname) && (
      <motion.div
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="nav-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 14px",
          maxWidth: "1000px",
          margin: "10px auto 0",
          opacity: 1,
          transform: "none",
          width: "95%",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          height={34}
          className="logo pointer"
          onClick={() => {
            navigator("/");
          }}
        />
        <input
          type="button"
          className="secondary-button"
          value="Login"
          onClick={() => {
            navigator("/login");
          }}
        />
      </motion.div>
    )
  );
}
