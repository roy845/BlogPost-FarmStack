import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";
import { register } from "../../Api/ServerAPI";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [passwordEntered, setPasswordEntered] = useState(false);

  const isEmailValid = validator.isEmail(email);

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const enteredPassword = e.target.value;
    setConfirmPassword(enteredPassword);

    // Check if passwords match
    if (enteredPassword.length === 0) {
      // Clear the error message when the password is empty
      setPasswordsMatch(null);
    } else if (password === enteredPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }

    // Check if password is entered
    setPasswordEntered(enteredPassword.length > 0);
  };

  useEffect(() => {
    if (password === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    if (password === confirmPassword) {
      // Implement your registration logic here
      try {
        const { data } = await register({ email, username, password });
        toast.success(data.message);
        navigate("/");
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.detail);
      }
      resetForm();
    } else {
      setPasswordsMatch(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPasswordsMatch(null);
    setPasswordEntered(false);
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
        <Avatar style={{ backgroundColor: "green" }}>
          <PersonOutlineIcon />
        </Avatar>
        <Typography variant="h5" style={{ marginTop: 10 }}>
          Register
        </Typography>
        <TextField
          type="text"
          margin="normal"
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            ),
          }}
        />
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
          error={passwordsMatch === false && passwordEntered}
          helperText={
            passwordsMatch === false && passwordEntered ? (
              "Passwords do not match"
            ) : passwordEntered ? (
              <span style={{ color: "green" }}>Passwords match</span>
            ) : null
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {passwordEntered ? (
                  passwordsMatch === true ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : passwordsMatch === false ? (
                    <ClearIcon style={{ color: "red" }} />
                  ) : null
                ) : (
                  <LockIcon />
                )}
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={handlePasswordChange}
          error={passwordsMatch === false && passwordEntered}
          helperText={
            passwordsMatch === false && passwordEntered ? (
              "Passwords do not match"
            ) : passwordEntered ? (
              <span style={{ color: "green" }}>Passwords match</span>
            ) : null
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {passwordEntered ? (
                  passwordsMatch === true ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : passwordsMatch === false ? (
                    <ClearIcon style={{ color: "red" }} />
                  ) : null
                ) : (
                  <LockIcon />
                )}
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
          style={{ marginTop: 20 }}
          disabled={
            !username ||
            !email ||
            !isEmailValid ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
          onClick={handleRegister}
        >
          Register
        </Button>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          Already have an account?{" "}
          <Link to="/" style={{ marginTop: 10, textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Register;
