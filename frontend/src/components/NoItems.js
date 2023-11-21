import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Error } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  card: {
    minWidth: 300,
    maxWidth: 500,
    padding: "32px",
    textAlign: "center",
    border: "2px solid blue",
    borderColor: "blue",
    backgroundColor: "white",
  },
  header: {
    textAlign: "center",
    paddingBottom: 0,
    color: "black",
  },
  icon: {
    fontSize: 64,
    marginBottom: "16px",
    color: "red",
  },
  button: {
    marginTop: "16px",
    backgroundColor: "#1775ee",
    color: "#fff",
    dialogContent: {
      overflowY: "auto",
    },
  },
}));

const NoItems = ({ type }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">No {type} to display</Typography>}
        />
        <CardContent>
          <Error className={classes.icon} />
          <Typography variant="body1" style={{ color: "black" }}>
            There are no {type} data to display yet
          </Typography>

          <CircularProgress
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#1775ee",
              marginTop: 10,
              marginLeft: 125,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NoItems;
