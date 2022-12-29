import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory} from "react-router-dom";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const data = localStorage.getItem('username');
  const history = useHistory();
  console.log(history);
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/",{from : "Register"})}
        >
          Back to explore
        </Button>
      )}
      {!hasHiddenAuthButtons && (data === null) &&(
        <Stack spacing={2} direction="row">
          <Button className="explore-button" variant="text" onClick={() => history.push("/login",{from : "Product"})}>
            LOGIN
          </Button>
          <Button className="button" variant="contained" onClick={() => history.push("/register",{from : "Product"})}>
            REGISTER
          </Button>
        </Stack>
      )}
      {!hasHiddenAuthButtons && (data !== null) &&(
        <Stack spacing={2} direction="row">
          <Avatar alt={data} src="avatar.png" />
          <p className="secondary-action">{data}</p>
          <Button className="explore-button" variant="text"
          onClick={() => {
            localStorage.clear();
            window.location.reload(false);
          }}>
            LOGOUT
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
