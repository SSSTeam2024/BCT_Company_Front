import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials } from "features/account/authSlice";
import Cookies from "js-cookie";

const AuthProtected = (props: any) => {
  let token = localStorage.getItem("auth");
  const tokenc = Cookies.get("astk");
  const dispatch = useDispatch<any>();
  /*
    Navigate is un-auth access protected routes via url
    */
  if (!tokenc) {
    return <Navigate to={{ pathname: "/login" }} />;
  }

  axios
    .post(`${process.env.REACT_APP_BASE_URL}/api/companies/getCompanyByToken`, {
      token: tokenc,
    })
    .then((res: any) => {
      dispatch(setCredentials(res));
    });

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
