import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import login from "../image/login.jpg"
import Card from "@mui/material/Card"; 
import CardContent from "@mui/material/CardContent"; // CardContent to wrap the content inside the card
import TextField from "@mui/material/TextField"; // For form inputs
import Button from "@mui/material/Button"; 

const Signup = () => {
  const [name, setName] = useState(""); // Added name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://rxxkvz-5000.csb.app/api/users/signup",
        {
          name, // Include name in the request
          email,
          password,
        }
      );

      alert("Signup successful", res.data);
      navigate("/");
    } catch (error) {
      alert("Signup failed", error.response?.data || error.message);
    }
  };

  return (
    <div   style={{
      backgroundImage: `url(${login})`, // Set the background image
      backgroundSize: "cover", // Cover the whole div with the background image
      backgroundPosition: "center", // Center the image
      minHeight: "100vh", // Make the div cover the whole screen height
      display: "flex", // Use flexbox to center the card
      justifyContent: "center", // Horizontally center the card
      alignItems: "center", // Vertically center the card
    }}>
      <Card
        sx={{
          width: 350, // Set the width of the card
          padding: 3, // Add padding inside the card
          borderRadius: 2, // Round the corners
          boxShadow: 3, // Add a shadow for the card
        }}
      >
         <CardContent>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
            <TextField
                  label="Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                onChange={(e) => setName(e.target.value)}
              />
               <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setPassword(e.target.value)}
                />
              <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Sign up
            </Button>
            </form>
          </CardContent>  
        </Card>  
    </div>
  );
};

export default Signup;
