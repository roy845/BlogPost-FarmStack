import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/auth";
import { DrawerContextProvider } from "./context/drawer";
import { SearchContextProvider } from "./context/search";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <DrawerContextProvider>
          <SearchContextProvider>
            <App />
            <Toaster />
          </SearchContextProvider>
        </DrawerContextProvider>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>
);
