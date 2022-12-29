import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState(() => {
    const state = { username: "", password: "", confirmPassword: "" };
    return state;
  });
  const [hidden, setHidden] = useState(() => {
    const hidden = false;
    return hidden;
  });

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (formData) => {
    if (validateInput(formData) === true) {
      const requestBody = {
        username: formData.username,
        password: formData.password,
      };
      axios
        .post(config.endpoint + "/auth/register", requestBody)
        .then((response) => {
          console.log(response);
          setHidden(false);
          if (response.data.success === true) {
            enqueueSnackbar("Registered Successfully", {
              variant: "success",
              persist: false,
            });
          } else if (response.data.success === false) {
            enqueueSnackbar(response.data.message, {
              variant: "error",
              persist: false,
            });
          }
        })
        .catch((error) => {
          setHidden(false);
          console.log(error);
          enqueueSnackbar(error.message, {
            variant: "error",
            persist: false,
          });
        });
      }
  };

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
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
    if (data.username.length < 6) {
      setHidden(false);
      enqueueSnackbar("Username must be at least 6 characters", {
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
    if (data.password.length < 6) {
      setHidden(false);
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
        persist: false,
      });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setHidden(false);
      enqueueSnackbar("Passwords do not match", {
        variant: "warning",
        persist: false,
      });
      return false;
    }
    return true;
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
          <h2 className="title">Register</h2>
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
                confirmPassword: state.confirmPassword,
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
                confirmPassword: state.confirmPassword,
              };
              setState(newState);
            }}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            onChange={(event) => {
              const newState = {
                confirmPassword: event.target.value,
                username: state.username,
                password: state.password,
              };
              setState(newState);
            }}
            type="password"
            fullWidth
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
                console.log(data, hidden);
                register(data);
              }}
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="#">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
