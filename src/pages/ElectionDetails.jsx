import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./ElectionDetails.css";
import { message } from "antd";
import { Elections } from "../service/api"; // Adjust the import path as necessary
import { userStore } from "../service/store";
import { useNavigate } from "react-router-dom";
import { AccountApiRequest } from "../service/api"; // Adjust the import path as necessary

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  // const [electionData, setElectionData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const token = localStorage.getItem("scalesToken");

  const User = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  if (!token) {
    navigate("/login");
  }
  const loginExtinguisher = async () => {
    if (token) {
      try {
        const res = await AccountApiRequest.currentUser(token);
        setUser(res);
      } catch (err) {
        localStorage.removeItem("scalesToken");
        setTimeout(() => {
          navigate("/login");
        });
      }
    } else {
      localStorage.removeItem("scalesToken");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  useEffect(() => {
    loginExtinguisher();
  }, []);

  const checkUserVoteStatus = useCallback(() => {
    console.log("Checking user vote status...");
    console.log("User:", User);
    if (!User?.votingHistory || !election?._id) return;

    const vote = User.votingHistory.find(
      (vote) => vote.electionId === election._id
    );

    if (vote) {
      setHasVoted(true);
      setSelectedCandidate(vote.candidateId);
    }
  }, [User, election]);

  const fetchElections = async () => {
    try {
      const response = await Elections.getSingleElections(id);
      console.log("Fetched Elections:", response.data);
      setElection(response.data);
    } catch (error) {
      console.error("Error fetching elections:", error);
      message.error("Failed to load elections.");
    }
  };

  useEffect(() => {
    checkUserVoteStatus();
  }, [checkUserVoteStatus]);

  useEffect(() => {
    fetchElections();
  }, [id]);

  const handleVote = async (candidateId) => {
    try {
      // Simulate API call
      const res = await Elections.castVote(id, candidateId, User._id);
      console.log("Vote response:", res);
      setHasVoted(true);
      setSelectedCandidate(candidateId);
      // Show success message or notification here
    } catch (error) {
      console.error("Error submitting vote:", error);
      message.error("Failed to cast vote. Please try again.");
    }
  };

  if (!election) return <div>Loading...</div>;

  return (
    <div className="election-details">
      <div className="election-header">
        <h1>{election.title}</h1>
        <span className={`status-badge ${election.status.toLowerCase()}`}>
          {election.status}
        </span>
        <div className="election-meta">
          <p>Type: {election.type}</p>
          <p className="dates">
            {new Date(election.startDate).toLocaleDateString()} -{" "}
            {new Date(election.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="candidates-section">
        <h2>Candidates</h2>
        <div className="candidates-grid">
          {election.candidates.map((candidate) => (
            <div
              key={candidate._id}
              className={`candidate-card ${
                selectedCandidate === candidate._id ? "selected" : ""
              }`}
              style={{ position: "relative" }}
            >
              
              <div className="candidate-image">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  loading="lazy"
                />
              </div>
              <div className="candidate-info">
                <h3>{candidate.name}</h3>
                <p className="position">{candidate.position}</p>
                <p className="department">
                  {candidate.department} - {candidate.level} Level
                </p>
                <div className="manifesto">
                  <h4>Manifesto Points:</h4>
                  <ul>
                    {candidate.manifesto.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                <button
                  className="vote-button"
                  onClick={() => handleVote(candidate._id)}
                  disabled={hasVoted}
                >
                  {hasVoted && selectedCandidate === candidate._id
                    ? "Voted ✓"
                    : hasVoted
                    ? "Vote Submitted"
                    : "Vote for Candidate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectionDetails;
