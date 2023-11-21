import "./swipeableDrawer.css";
import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
// import SettingsIcon from "@mui/icons-material/Settings";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import DevicesIcon from "@mui/icons-material/Devices";
// import SpeedIcon from "@mui/icons-material/Speed";
// import { speedTestUrl } from "../../context/users/UsersConstants";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useDrawer } from "../../context/drawer";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { UPLOAD_PHOTO_SITE } from "../../constants/constants";

export default function SwipeableTemporaryDrawer() {
  const { state, toggleDrawer /*onOpenSettingsModal, onOpenDeviceModal*/ } =
    useDrawer();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = React.useState(
    +localStorage.getItem("selectedItem") || 0
  );

  const menuItems = [
    {
      name: "Home",
      icon: <HomeIcon />,
      onClick: (index) => {
        navigate("/");
        setSelectedItem(index);
        localStorage.setItem("selectedItem", index);
      },
    },
    {
      name: "Profile",
      icon: <PersonIcon />,
      onClick: (index) => {
        navigate(`/profile/${auth?.user?.username}`);
        setSelectedItem(index);
        localStorage.setItem("selectedItem", index);
      },
    },
    {
      name: "Upload photo",
      icon: <AddAPhotoIcon />,
      onClick: (index) => {
        setSelectedItem(index);
        localStorage.setItem("selectedItem", index);
        window.open(UPLOAD_PHOTO_SITE, "_blank");
      },
    },
    // {
    //   name: "Statistics",
    //   icon: <BarChartIcon />,
    //   onClick: (index) => {
    //     navigate("/statistics");
    //     setSelectedItem(index);
    //     localStorage.setItem("selectedItem", index);
    //   },
    // },
    // {
    //   name: "Device Info",
    //   icon: <DevicesIcon />,
    //   onClick: (index) => {
    //     onOpenDeviceModal();
    //     setSelectedItem(index);
    //     localStorage.setItem("selectedItem", index);
    //   },
    // },
    // {
    //   name: "Speed test",
    //   icon: <SpeedIcon />,
    //   onClick: (index) => {
    //     window.open(speedTestUrl, "_blank");
    //     setSelectedItem(index);
    //     localStorage.setItem("selectedItem", index);
    //   },
    // },
    {
      name: "Logout",
      icon: <LogoutIcon />,
      onClick: (index) => {
        setAuth(null);
        localStorage.removeItem("auth");

        navigate("/");
        toast.success("Logout Successfully");
        setSelectedItem(index);
        document.title = "Login";
      },
    },
  ];

  React.useEffect(() => {
    setSelectedItem(+localStorage.getItem("selectedItem"));
    localStorage.removeItem("selectedItem");
  }, []);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <span className="logo-drawer">
          <img
            src={
              "https://cline-company.com/wp-content/uploads/2012/08/social.png"
            }
            width="82"
            height="52"
            alt=""
            onClick={() => {
              navigate("/");
            }}
          />
          <div className="logoText">Posts App</div>
        </span>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            className="list-item"
            style={{
              backgroundColor: selectedItem === index ? "#2074d4" : "",
              color: selectedItem === index ? "white" : "",
            }}
          >
            <ListItemButton onClick={() => item.onClick(index)}>
              <ListItemIcon
                className="list-item"
                style={{
                  color: selectedItem === index ? "white" : "",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
