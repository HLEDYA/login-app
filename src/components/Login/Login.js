import React, {
  useEffect,
  useState,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";
import Input from "../UI/Input/Input";

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
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

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
    if (formIsValid) {
      ctx.onLogin(emailState.email, passwordState.password);
    } else if (!emailState.isValid) {
      emailInputRef.current.activate();
    } else {
      passwordInputRef.current.activate();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          type="email"
          label="E-mail"
          value={emailState.email}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
          isValid={emailState.isValid}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          type="password"
          label="Password"
          value={passwordState.password}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
          isValid={passwordState.isValid}
        />

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
