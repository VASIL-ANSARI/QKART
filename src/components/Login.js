import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState(() => {
    const state = { username: "", password: "" };
    return state;
  });
  const [hidden, setHidden] = useState(() => {
    const hidden = false;
    return hidden;
  });

  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    if (validateInput(formData) === true) {
      const requestBody = {
        username: formData.username,
        password: formData.password,
      };
      axios
        .post(config.endpoint + "/auth/login", requestBody)
        .then((response) => {
          console.log(response);
          setHidden(false);
          if (response.data.success === true) {
            enqueueSnackbar("Logged in successfully", {
              variant: "success",
              persist: false,
            });
            persistLogin(
              response.data.token,
              response.data.username,
              response.data.balance
            );
          } else if (response.data.success === false) {
            enqueueSnackbar(response.data.message, {
              variant: "error",
              persist: false,
            });
          }
        })
        .catch((error) => {
          setHidden(false);
          console.log(error.response.data);
          if (error.response.status === 400) {
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
              persist: false,
            });
          } else {
            enqueueSnackbar(
              "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
              {
                variant: "error",
                persist: false,
              }
            );
          }
        });
    }
  };

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if (data.username.length === 0) {
      setHidden(false);
      enqueueSnackbar("Username is a required field", {
        variant: "warning",
        persist: false,
      });
      return false;
    }
    if (data.password.length === 0) {
      setHidden(false);
      enqueueSnackbar("Password is a required field", {
        variant: "warning",
        persist: false,
      });
      return false;
    }
    return true;
  };

  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    const jsonBody = {username : username, token : token, balance : balance};
    console.log(jsonBody);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("balance", balance);
    redirectToMainPage();
  };

  const redirectToMainPage = () => {
    history.push("/",{from : "Login"});
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={(event) => {
              const newState = {
                username: event.target.value,
                password: state.password,
              };
              setState(newState);
            }}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            onChange={(event) => {
              const newState = {
                password: event.target.value,
                username: state.username,
              };
              setState(newState);
            }}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          {hidden && (
            <div className="progress">
              <CircularProgress></CircularProgress>
            </div>
          )}

          {!hidden && (
            <Button
              className="button"
              variant="contained"
              onClick={(event) => {
                event.preventDefault();
                setHidden(true);
                const data = state;
                console.log(data);
                login(data);
              }}
            >
              LOGIN TO QKART
            </Button>
          )}
          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" to="../register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
