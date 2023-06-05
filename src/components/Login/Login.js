import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
  if (action.type === "USER_EMAIL") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "EMAIL_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_PASSWORD") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "PASSWORD_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const collegeReducer = (state, action) => {
  if (action.type === "USER_COLLEGE") {
    return { value: action.val, isValid: action.val.trim().length > 0 };
  }
  if (action.type === "COLLEGE_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 0 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  // const [enteredCollegeName, setEnteredCollegeName] = useState("");
  // const [collegeNameIsValid, setCollegeNameIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, disPatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, disPatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  const [collegeState, disPatchCollege] = useReducer(collegeReducer, {
    value: "",
    isValid: null,
  });

  const authctx = useContext(AuthContext);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;
  const { isValid: collegeIsValid } = collegeState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("cheking form validity");
      setFormIsValid(emailIsValid && passwordIsValid && collegeIsValid);
    }, 500);

    return () => {
      console.log("cleanUp");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid, collegeIsValid]);

  const emailChangeHandler = (event) => {
    disPatchEmail({ type: "USER_EMAIL", val: event.target.value });
    setFormIsValid(
      event.target.value.includes("@") &&
        passwordState.value.trim().length > 6 &&
        collegeState.value.trim().length > 0
    );
  };

  const passwordChangeHandler = (event) => {
    disPatchPassword({ type: "USER_PASSWORD", val: event.target.value });
    setFormIsValid(
      emailState.value.includes("@") &&
        event.target.value.trim().length > 6 &&
        collegeState.value.trim().length > 0
    );
  };

  const collegeNameChangeHandler = (event) => {
    disPatchCollege({ type: "USER_COLLEGE", val: event.target.value });
    setFormIsValid(
      emailState.value.includes("@") &&
        passwordState.value.trim().length > 6 &&
        event.target.value.trim().length > 0
    );
  };

  const validateEmailHandler = () => {
    disPatchEmail({ type: "EMAIL_BLUR" });
  };

  const validatePasswordHandler = () => {
    disPatchPassword({ type: "PASSWORD_BLUR" });
  };

  const validateCollegeNameHandler = () => {
    disPatchCollege({ type: "COLLEGE_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authctx.onLogIn(emailState.value, passwordState.value, collegeState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          type="email"
          label="E-MAIL"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <Input
          id="collegename"
          type="text"
          label="CollegeName"
          isValid={collegeIsValid}
          value={collegeState.value}
          onChange={collegeNameChangeHandler}
          onBlur={validateCollegeNameHandler}
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
