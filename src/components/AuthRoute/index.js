import React from "react";
import {
  // BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import { isAuth } from "@/utils/auth";

export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        //   将值转成bool值!!
        if (isAuth()) {
          return <Component></Component>;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                from: location,
              }}
            />
          );
        }
      }}
    ></Route>
  );
}
