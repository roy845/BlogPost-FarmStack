import { createContext, useContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${auth?.access_token}`;

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth };
