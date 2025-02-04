import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap everything that needs access to AuthContext */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
