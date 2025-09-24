import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddElection.css";
import { Elections } from "../service/api";
import { userStore } from "../service/store";
import { message } from "antd";
import { AccountApiRequest } from "../service/api";

const AddElection = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("scalesToken");
  const setUser = userStore((state) => state.setUser);
  const User = userStore((state) => state.user);

  if (!token) {
    navigate("/login");
  }
  const loginExtinguisher = async () => {
    if (token) {
      try {
        const res = await AccountApiRequest.currentUser(token);
        setUser(res);
        console.log("User data:", res);
      } catch (err) {
        message.error("Session expired, please login again.");
        localStorage.removeItem("scalesToken");
        setTimeout(() => {
          navigate("/login");
        });
      } finally {
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

  console.log("User:", User);

  const [election, setElection] = useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    candidates: [],
  });

  const [currentCandidate, setCurrentCandidate] = useState({
    name: "",
    position: "",
    image: null,
    department: "",
    level: "",
    manifesto: [""],
  });

  const handleElectionChange = (e) => {
    setElection({
      ...election,
      [e.target.name]: e.target.value,
    });
  };

  const handleCandidateChange = (e) => {
    setCurrentCandidate({
      ...currentCandidate,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCurrentCandidate({
      ...currentCandidate,
      image: file,
    });
  };

  const handleManifestoChange = (index, value) => {
    const newManifesto = [...currentCandidate.manifesto];
    newManifesto[index] = value;
    setCurrentCandidate({
      ...currentCandidate,
      manifesto: newManifesto,
    });
  };

  const addManifestoPoint = () => {
    setCurrentCandidate({
      ...currentCandidate,
      manifesto: [...currentCandidate.manifesto, ""],
    });
  };

  const validateCandidate = () => {
    if (!currentCandidate.name.trim()) {
      alert("Candidate name is required");
      return false;
    }
    if (!currentCandidate.position.trim()) {
      alert("Position is required");
      return false;
    }
    if (!currentCandidate.image) {
      alert("Candidate image is required");
      return false;
    }
    if (!currentCandidate.department.trim()) {
      alert("Department is required");
      return false;
    }
    if (!currentCandidate.level || !/^[1-5]00$/.test(currentCandidate.level)) {
      alert("Level must be 100, 200, 300, 400, or 500");
      return false;
    }
    if (currentCandidate.manifesto.some((point) => !point.trim())) {
      alert("All manifesto points must be filled");
      return false;
    }
    return true;
  };

  const addCandidate = () => {
    if (!validateCandidate()) return;

    setElection({
      ...election,
      candidates: [
        ...election.candidates,
        { ...currentCandidate, id: Date.now() },
      ],
    });
    setCurrentCandidate({
      name: "",
      position: "",
      image: null,
      department: "",
      level: "",
      manifesto: [""],
    });
  };

  const removeCandidate = (id) => {
    setElection({
      ...election,
      candidates: election.candidates.filter(
        (candidate) => candidate.id !== id
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (election.candidates.length < 2) {
      alert("At least two candidates required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", election.name);
      formData.append("type", election.type);
      formData.append("startDate", election.startDate);
      formData.append("endDate", election.endDate);
      election.candidates.forEach((candidate, index) => {
        formData.append(`candidates[${index}][name]`, candidate.name);
        formData.append(`candidates[${index}][position]`, candidate.position);
        formData.append(
          `candidates[${index}][department]`,
          candidate.department
        );
        formData.append(`candidates[${index}][level]`, candidate.level);
        formData.append("file", candidate.image);
        candidate.manifesto.forEach((point, pointIndex) => {
          formData.append(
            `candidates[${index}][manifesto][${pointIndex}]`,
            point
          );
        });
      });

      const res = await Elections.addElection(formData);
      console.log("Election created successfully:", res);
    } catch (error) {
      console.error("Error creating election:", error);
      alert("Failed to create election. Please try again.");
    }
    // Add your API call here to save the election
    console.log("Election data:", election);
    // navigate("/elections");
  };

  return (
    <div className="add-election-container">
      <h1>Create New Election</h1>

      <form onSubmit={handleSubmit} className="election-form">
        <div className="election-details">
          <h2>Election Details</h2>
          <div className="form-group">
            <label>Election Name</label>
            <input
              type="text"
              name="name"
              value={election.name}
              onChange={handleElectionChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={election.type}
              onChange={handleElectionChange}
              required
            >
              <option value="">Select Type</option>
              <option value="General">General</option>
              <option value="Departmental">Departmental</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={election.startDate}
                onChange={handleElectionChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={election.endDate}
                onChange={handleElectionChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="add-candidate-section">
          <h2>Add Candidate</h2>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={currentCandidate.name}
              onChange={handleCandidateChange}
              required={election.candidates.length < 2}
            />
          </div>

          <div className="form-group">
            <label>Position *</label>
            <input
              type="text"
              name="position"
              value={currentCandidate.position}
              onChange={handleCandidateChange}
              required={election.candidates.length < 2}
            />
          </div>

          <div className="form-group">
            <label>Image *</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required={election.candidates.length < 2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                value={currentCandidate.department}
                onChange={handleCandidateChange}
                required={election.candidates.length < 2}
              />
            </div>

            <div className="form-group">
              <label>Level *</label>
              <select
                name="level"
                value={currentCandidate.level}
                onChange={handleCandidateChange}
                required={election.candidates.length < 2}
              >
                <option value="">Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
              </select>
            </div>
          </div>

          <div className="manifesto-section">
            <label>Manifesto Points *</label>
            {currentCandidate.manifesto.map((point, index) => (
              <input
                key={index}
                type="text"
                value={point}
                onChange={(e) => handleManifestoChange(index, e.target.value)}
                placeholder={`Manifesto point ${index + 1}`}
                required={election.candidates.length < 2}
              />
            ))}
            <button
              type="button"
              onClick={addManifestoPoint}
              className="add-point-btn"
            >
              Add Manifesto Point
            </button>
          </div>

          <button
            type="button"
            onClick={addCandidate}
            className="add-candidate-btn"
          >
            Add Candidate
          </button>
        </div>

        <div className="candidates-list">
          <h2>Added Candidates</h2>
          {election.candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-item">
              <div className="candidate-info">
                <h3>{candidate.name}</h3>
                <p>{candidate.position}</p>
              </div>
              <button
                type="button"
                onClick={() => removeCandidate(candidate.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">
          Create Election
        </button>
      </form>
    </div>
  );
};

export default AddElection;
