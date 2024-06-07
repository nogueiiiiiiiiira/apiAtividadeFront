import React, { useState } from "react";
import { apiAtividade } from "../api/server";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await apiAtividade.get(`/users?username=${username}&password=${password}`);
      const user = response.data;
      if (user) {
        window.location.href = "/telaPrincipal";
      } else {
        setError("Username or password is incorrect");
      }
    } catch (error) {
      setError("Error logging in");
    }
  };

  return (
    <div className="container">
      <h2>Bem-Vindo!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-control"
          />
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
