import axios from "axios";
import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://rxxkvz-5000.csb.app/api/users/login",
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        setToken(response.data.token);
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
