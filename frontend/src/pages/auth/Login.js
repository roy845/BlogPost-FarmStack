// Login.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import validator from "validator";
import toast from "react-hot-toast";
import { login } from "../../Api/ServerAPI";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = validator.isEmail(email);

  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  let from = "/";
  if (location.state && location.state.from && location.state.from.pathname) {
    from = location.state.from.pathname;
  }

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const { data } = await login(formData);

      toast.success(data.message);

      setAuth({
        ...auth,
        access_token: data.access_token,
        token_type: data.token_type,
        user: data.user,
      });

      const authData = {
        access_token: data.access_token,
        token_type: data.token_type,
        user: data.user,
      };

      localStorage.setItem("auth", JSON.stringify(authData));

      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.detail);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",
        }}
      >
        <Avatar style={{ backgroundColor: "blue" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" style={{ marginTop: 10 }}>
          Login
        </Typography>
        <TextField
          type="email"
          margin="normal"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />
        {isEmailValid && email ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "green", marginRight: 5 }}>Valid Email</span>
            <CheckIcon style={{ color: "green" }} />
          </div>
        ) : !isEmailValid && email ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "red", marginRight: 5 }}>Invalid Email</span>
            <ClearIcon style={{ color: "red" }} />
          </div>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!email || !isEmailValid || !password}
          style={{ marginTop: 20 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Link
          to="/forgotpassword"
          style={{ marginTop: 10, textDecoration: "none" }}
        >
          Forgot Password ?
        </Link>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ marginTop: 10, textDecoration: "none" }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;
