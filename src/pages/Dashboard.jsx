import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { userStore } from "../service/store";
import { AccountApiRequest, Elections } from "../service/api";
import "../assets/styles/dashboard.css";

export default function Dashboard() {
  const token = localStorage.getItem("scalesToken");
  const navigate = useNavigate();
  const [electionData, setElectionData] = useState([]);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const User = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  if (!token) {
    navigate("/login");
  }

  const loginExtinguisher = async () => {
    setSubmittingForm(true);
    try {
      if (token) {
        const res = await AccountApiRequest.currentUser(token);
        setUser(res);
      } else {
        throw new Error("No token");
      }
    } catch (err) {
      message.error("Session expired, please login again.");
      localStorage.removeItem("scalesToken");
      navigate("/login");
    } finally {
      setSubmittingForm(false);
    }
  };

  useEffect(() => {
    loginExtinguisher();
  }, []);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await Elections.getElections();
        setElectionData(response.data);
      } catch (error) {
        console.error("Error fetching elections:", error);
        message.error("Failed to load elections.");
      }
    };

    fetchElections();
  }, []);

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2
            className="sidebar-title"
            style={{ color: "white", fontSize: "20px" }}
          >
            {collapsed ? "SUG" : "SUG"}
          </h2>
          <button
            className="collapse-btn"
            style={{ color: "white", fontSize: "20px" }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <ul className="sidebar-nav">
          <li onClick={() => navigate("/dashboard")}>
            🏠 {!collapsed && "Dashboard"}
          </li>
          <li onClick={() => navigate("/candidates")}>
            👥 {!collapsed && "View Candidates"}
          </li>
          <li onClick={() => navigate("/vote")}>
            🗳️ {!collapsed && "Cast Vote"}
          </li>
          <li onClick={() => navigate("/status")}>
            📊 {!collapsed && "Voting Status"}
          </li>
          <li onClick={() => navigate("/results")}>
            🏆 {!collapsed && "Election Results"}
          </li>
          <li onClick={() => navigate("/help")}>❓ {!collapsed && "Help"}</li>
        </ul>
        <div className="sidebar-footer">{!collapsed && "Version 1.0"}</div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h2>Welcome, {User?.name || "Guest"}</h2>
            <p className="election-date">
              Election Date:{" "}
              {electionData[0]
                ? new Date(electionData[0].startDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="status not-voted">Not Voted</p>
          </div>
          <div className="user-info">
            <span>{User?.mat_number || "Matric No."}</span>
          </div>
        </header>

        {/* Quick Actions */}
        <section className="quick-actions">
          <button onClick={() => navigate("/vote")}>Cast Vote</button>
          <button onClick={() => navigate("/candidates")}>
            View Candidates
          </button>
          <button onClick={() => navigate("/guidelines")}>
            Election Guidelines
          </button>
        </section>

        {/* Voting Summary */}

        {/* Election List */}
        <section className="elections-list">
          <h3>Active Elections</h3>
          <div className="elections-grid">
            {electionData.length > 0 ? (
              electionData.map((election, index) => (
                <div
                  key={election._id}
                  className="election-card"
                  onClick={() => navigate(`/elections/${election._id}`)}
                >
                  <h4>{election.name}</h4>
                  <span
                    className={`status-badge ${election.status.toLowerCase()}`}
                  >
                    {election.status}
                  </span>
                  <p>Type: {election.type}</p>
                  <p>
                    {new Date(election.startDate).toLocaleDateString()} -{" "}
                    {new Date(election.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No elections available.</p>
            )}
          </div>
        </section>

        {/* Live Banner */}
        <div className="live-banner">⚡ Voting is now live!</div>
      </main>
    </div>
  );
}
