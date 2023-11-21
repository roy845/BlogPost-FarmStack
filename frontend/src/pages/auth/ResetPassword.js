import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { resetPassword } from "../../Api/ServerAPI";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [passwordEntered, setPasswordEntered] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const enteredPassword = e.target.value;
    setConfirmNewPassword(enteredPassword);

    // Check if passwords match
    if (enteredPassword.length === 0) {
      // Clear the error message when the password is empty
      setPasswordsMatch(null);
    } else if (newPassword === enteredPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }

    // Check if password is entered
    setPasswordEntered(enteredPassword.length > 0);
  };

  const handleResetPassword = async () => {
    try {
      const { data } = await resetPassword(newPassword, token);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.detail);
    }
  };

  useEffect(() => {
    if (newPassword === confirmNewPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [newPassword, confirmNewPassword]);

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
          <LockIcon />
        </Avatar>
        <Typography variant="h5" style={{ marginTop: 10 }}>
          Reset Password
        </Typography>
        <Typography
          variant="body2"
          style={{ marginTop: 20, textAlign: "center", color: "gray" }}
        >
          Enter your new password below. Make sure it's secure and easy to
          remember.
        </Typography>
        <TextField
          margin="normal"
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          label="Confirm New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={confirmNewPassword}
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 20 }}
          disabled={!newPassword || newPassword !== confirmNewPassword}
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          Remember your password?{" "}
          <Link to="/" style={{ marginTop: 10, textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default ResetPassword;
