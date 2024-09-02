import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";

import { RootState } from "../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../features/account/authSlice";
import axios from "axios";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const navigate = useNavigate();
  const [userName, setUserName] = useState<any>("Admin");
  const { success } = useSelector((state: any) => ({
    success: state.Profile.success,
  }));

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser") || "{}");
        setUserName(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser") || "{}");
        setUserName(obj.username);
      }
    }
  }, [success]);

  const logout = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/companies/logoutCompany/${user._id}`
      )
      .then((res: any) => {
        Cookies.remove("astk");
        navigate("/login");
      });
  };
  return (
    <React.Fragment>
      <Dropdown className="ms-sm-3 header-item topbar-user">
        <Dropdown.Toggle
          type="button"
          className="btn bg-transparent border-0 arrow-none"
          id="page-header-user-dropdown"
        >
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={`${process.env.REACT_APP_FILE_URL}/companyFiles/logoFiles/${user.logo_file}`}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {user.name}
              </span>
            </span>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {user.name}!</h6>
          <Dropdown.Item href="/user-profile">
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Profile</span>
          </Dropdown.Item>
          <Dropdown.Item onClick={logout}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
