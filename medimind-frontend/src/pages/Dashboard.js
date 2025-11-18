import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("https://medimind-65y9.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="auth-container">
      <h2>Welcome to MediMind</h2>
      {user ? (
        <>
          <p>Hey <strong>{user.name}</strong>, great to see you!</p>
          <p>Email: {user.email}</p>
          <button
            onClick={logout}
            style={{
              background: "#ff5757",
              marginTop: "15px",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
