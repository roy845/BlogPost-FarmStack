import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getUserByUsername, updateProfile } from "../Api/ServerAPI";
import {
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Paper,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockIcon from "@mui/icons-material/Lock";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const Profile = () => {
  const [user, setUser] = useState({
    email: "",
    profilePicture: "",
    username: "",
    password: "",
    created_at: "",
  });

  const [editProfilePicture, setEditProfilePicture] = useState(false);

  const navigate = useNavigate();

  const { username } = useParams();

  const { auth, setAuth } = useAuth();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const toggleEditProfilePicture = () => {
    auth?.user?.id === user?.id && setEditProfilePicture((prev) => !prev);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await updateProfile(user.id, user);
      toast.success(data.message);

      setAuth({ ...auth, user: data.user });

      const authData = {
        access_token: auth.access_token,
        token_type: auth.token_type,
        user: data.user,
      };

      localStorage.setItem("auth", JSON.stringify(authData));

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserByUsername(username);
        setUser({ ...data, password: "" });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [username]);

  return (
    <Layout title="Profile">
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: 20,
            width: "50em",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <main
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h2>Profile</h2>
            <Tooltip title={user?.username}>
              <Avatar
                onClick={toggleEditProfilePicture}
                src={user?.profilePicture}
                sx={{ width: "100px", height: "100px", cursor: "pointer" }}
              />
            </Tooltip>

            {editProfilePicture && (
              <TextField
                type="text"
                margin="normal"
                label="Profile picture"
                variant="outlined"
                name="profilePicture"
                value={user?.profilePicture}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhotoCameraIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              type="text"
              margin="normal"
              label="Username"
              variant="outlined"
              name="username"
              value={user?.username}
              disabled={auth?.user?.id !== user?.id}
              onChange={handleChange}
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
              name="email"
              variant="outlined"
              disabled={auth?.user?.id !== user?.id}
              value={user?.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            {auth?.user?.id === user?.id && (
              <TextField
                margin="normal"
                label="Password"
                type="password"
                name="password"
                variant="outlined"
                value={user?.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              margin="normal"
              label="Join in"
              type="text"
              variant="outlined"
              value={new Date(user?.created_at).toLocaleDateString()}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </main>
          {auth?.user?.id === user?.id && (
            <section
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#2074d4",
                  color: "white",
                  "&:hover": { backgroundColor: "#2074d4" },
                }}
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": { backgroundColor: "red" },
                }}
                onClick={() => navigate("/")}
              >
                Discard
              </Button>
            </section>
          )}
        </Paper>
      </section>
    </Layout>
  );
};

export default Profile;
