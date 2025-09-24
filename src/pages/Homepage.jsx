import "../assets/styles/homepage.css";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className=" ">
      <Link to="/login">Login</Link> <br />
      <Link to="/register">Register</Link> <br />
      <Link to="/add-election">Add election</Link> <br />
      <Link to="/dashboard">Dashboard</Link> <br />
    </div>
  );
}
