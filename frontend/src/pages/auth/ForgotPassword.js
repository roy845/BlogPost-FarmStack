import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../Api/ServerAPI";
import toast from "react-hot-toast";
import validator from "validator";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = validator.isEmail(email);

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const { data } = await forgotPassword(email);
      toast.success(data.message);
      setEmail("");
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.detail);
      setLoading(false);
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
          <EmailIcon />
        </Avatar>
        <Typography variant="h5" style={{ marginTop: 10 }}>
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          style={{ marginTop: 20, textAlign: "center", color: "gray" }}
        >
          If you've forgotten your password, don't worry! Enter your email
          address, and we'll send you instructions on how to reset your
          password.
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

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 20 }}
          disabled={!email || !isEmailValid || loading}
          onClick={handleResetPassword}
        >
          {loading ? (
            <CircularProgress size={24} style={{ marginRight: 5 }} />
          ) : (
            "Send Email"
          )}
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

export default ForgotPassword;
