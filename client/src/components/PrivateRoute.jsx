import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { user } = useContext(UserContext);

  return user ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
