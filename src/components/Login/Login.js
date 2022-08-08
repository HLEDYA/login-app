import React, { useEffect, useState, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";

const emailReducer = (state, action) => {
  if (action.type === "SET_EMAIL") {
    return { email: action.value, isValid: action.value.includes("@") };
  }
  if (action.type === "CHECK_EMAIL") {
    return { email: state.email, isValid: state.email.includes("@") };
  }
  return { email: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "SET_PW") {
    return { password: action.value, isValid: action.value.trim().length > 6 };
  }
  if (action.type === "CHECK_PW") {
    return {
      password: state.password,
      isValid: state.password.trim().length > 6,
    };
  }
  return { password: "", isValid: false };
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmailState] = useReducer(emailReducer, {
    email: "",
    isValid: undefined,
  });

  const [passwordState, dispatchPasswordState] = useReducer(passwordReducer, {
    password: "",
    isValid: undefined,
  });

  const ctx = useContext(AuthContext);

  useEffect(() => {
    setFormIsValid(emailState.isValid && passwordState.isValid);
    console.log("useEffect called");
  }, [emailState.isValid, passwordState.isValid]);

  const emailChangeHandler = (event) => {
    dispatchEmailState({ type: "SET_EMAIL", value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPasswordState({ type: "SET_PW", value: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmailState({ type: "CHECK_EMAIL" });
  };

  const validatePasswordHandler = () => {
    dispatchPasswordState({ type: "CHECK_PW" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.email, passwordState.password);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.email}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.password}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
