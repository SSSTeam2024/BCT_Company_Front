import React from "react";
import { Card, Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Profile from "./Profile";
import Trips from "./Trips";
import NonAttendance from "./NonAttendance";

const SingleProfile = () => {
  document.title = "Profile | Company Administration";
  const singleAccount = useLocation();
  console.log(singleAccount);

  return (
    <React.Fragment>
      <div className="page-content">
        <Card.Body>
          <Tab.Container defaultActiveKey="arrow-profile">
            <Nav
              as="ul"
              justify
              variant="pills"
              className="arrow-navtabs nav-success bg-light mb-4"
            >
              <Nav.Item
                as="li"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <Nav.Link eventKey="arrow-profile">
                  <span className="d-block d-sm">
                    <i className="bi bi-person-bounding-box"></i>
                  </span>
                  <span className="d-none d-lg-block">Profile</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="arrow-trips">
                  <span className="d-block d-sm">
                    <i className="bi bi-bus-front-fill"></i>
                  </span>
                  <span className="d-none d-sm-block">Attendance</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="arrow-attendance">
                  <span className="d-block d-sm">
                    <i className="bi bi-exclamation-circle-fill"></i>
                  </span>
                  <span className="d-none d-sm-block">Complains</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="arrow-payment">
                  <span className="d-block d-sm">
                    <i className="bi bi-cash-stack"></i>
                  </span>
                  <span className="d-none d-sm-block">Payment</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="text-muted">
              <Tab.Pane eventKey="arrow-profile">
                <Profile {...singleAccount.state} />
              </Tab.Pane>
              <Tab.Pane eventKey="arrow-trips">
                <Trips />
              </Tab.Pane>
              <Tab.Pane eventKey="arrow-attendance">
                <NonAttendance />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </div>
    </React.Fragment>
  );
};

export default SingleProfile;
