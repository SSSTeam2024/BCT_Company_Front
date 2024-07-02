// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Alert, Button, Form } from "react-bootstrap";

// // Formik Validation
// import * as Yup from "yup";
// import { useFormik } from "formik";

// //redux
// import { useSelector, useDispatch } from "react-redux";
// import { createSelector } from 'reselect';

// import withRouter from "Common/withRouter";

// //Import Breadcrumb
// import Breadcrumb from 'Common/BreadCrumb';

// import avatar from "../../assets/images/users/avatar-1.jpg";

// // actions
// import { editProfile, resetProfileFlag } from "slices/thunk";

// const UserProfile = () => {

//     document.title = "User Profile | Toner eCommerce + Admin React Template";

//     const dispatch = useDispatch<any>();

//     const [email, setemail] = useState("admin@gmail.com");
//     const [name, setname] = useState("Admin");
//     const [idx, setidx] = useState("1");

//     const selectLayoutState = (state: any) => state.Profile;
//     const selectProperties = createSelector(
//         selectLayoutState,
//         (state: any) => ({
//             user: state.user,
//             success: state.success,
//             error: state.error
//         })
//     );

//     const { error, success } = useSelector(selectProperties);

//     useEffect(() => {

//         if (localStorage.getItem("authUser")) {
//             const obj = JSON.parse(localStorage.getItem("authUser") || "{}");
//             if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//                 setname(obj.displayName);
//                 setemail(obj.email);
//                 setidx(obj.uid);
//             } else if (
//                 process.env.REACT_APP_DEFAULTAUTH === "fake" ||
//                 process.env.REACT_APP_DEFAULTAUTH === "jwt"
//             ) {
//                 setname(obj.username);
//                 setemail(obj.email);
//                 setidx(obj.uid);
//             }

//             setTimeout(() => {
//                 dispatch(resetProfileFlag());
//             }, 3000);
//         }
//     }, [dispatch, success, error]);

//     const validation = useFormik({
//         // enableReinitialize : use this flag when initial values needs to be changed
//         enableReinitialize: true,

//         initialValues: {
//             username: name || 'Admin',
//             idx: idx || '1',
//         },
//         validationSchema: Yup.object({
//             username: Yup.string().required("Please Enter Your UserName"),
//         }),
//         onSubmit: (values) => {
//             dispatch(editProfile(values));
//         }
//     });

//     return (
//         <React.Fragment>
//             <div className="page-content">
//                 <Container fluid>
//                     {/* Render Breadcrumb */}
//                     <Breadcrumb title="Toner" pageTitle="Accounts" />

//                     <Row>
//                         <Col lg="12">
//                             {error && error ? <Alert variant="danger">{error}</Alert> : null}
//                             {success ? <Alert variant="success">{success}</Alert> : null}

//                             <Card>
//                                 <Card.Body>
//                                     <div className="d-flex">
//                                         <div className="mx-3">
//                                             <img
//                                                 src={avatar}
//                                                 alt=""
//                                                 className="avatar-md rounded-circle img-thumbnail"
//                                             />
//                                         </div>
//                                         <div className="flex-grow-1 align-self-center">
//                                             <div className="text-muted">
//                                                 <h5>{name}</h5>
//                                                 <p className="mb-1">{email}</p>
//                                                 <p className="mb-0">Id no: #{idx}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>

//                     <h4 className="card-title mb-4">Change User Name</h4>

//                     <Card>
//                         <Card.Body>
//                             <Form
//                                 className="form-horizontal"
//                                 onSubmit={(e) => {
//                                     e.preventDefault();
//                                     validation.handleSubmit();
//                                     return false;
//                                 }}
//                             >
//                                 <div className="form-group">
//                                     <Form.Label>User Name</Form.Label>
//                                     <Form.Control
//                                         name="username"
//                                         className="form-control"
//                                         placeholder="Enter User Name"
//                                         type="text"
//                                         onChange={validation.handleChange}
//                                         onBlur={validation.handleBlur}
//                                         value={validation.values.username || ""}
//                                         isInvalid={
//                                             validation.touched.username && validation.errors.username ? true : false
//                                         }
//                                     />
//                                     {validation.touched.username && validation.errors.username ? (
//                                         <Form.Control.Feedback type="invalid">{validation.errors.username}</Form.Control.Feedback>
//                                     ) : null}
//                                     <Form.Control name="idx" value={idx} type="hidden" />
//                                 </div>
//                                 <div className="text-center mt-4">
//                                     <Button type="submit" variant="danger">
//                                         Update User Name
//                                     </Button>
//                                 </div>
//                             </Form>
//                         </Card.Body>
//                     </Card>
//                 </Container>
//             </div>
//         </React.Fragment>
//     );
// };

// export default withRouter(UserProfile);

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Form,
  Table,
  Dropdown,
} from "react-bootstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "Common/withRouter";
import { RootState } from "../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../features/account/authSlice";
import { editProfile, resetProfileFlag } from "slices/thunk";

const UserProfile = () => {
  document.title = " Profile | Company Administration ";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const dispatch = useDispatch<any>();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);

  const { error, success } = useSelector((state: any) => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }));

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser") || "{}");
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName);
        setemail(obj.email);
        setidx(obj.uid);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username);
        setemail(obj.email);
        setidx(obj.uid);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: name || "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xxl={12}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col lg={3}>
                      <div className="profile-user-img position-relative">
                        <img
                          src={`http://localhost:3000/schoolFiles/${user.logo_file}`}
                          alt=""
                          className="rounded object-fit-cover"
                        />
                        <span className="position-absolute top-0 start-100 translate-middle badge border border-3 border-white rounded-circle bg-success p-1 mt-1 me-1">
                          <span className="visually-hidden">
                            unread messages
                          </span>
                        </span>
                      </div>
                    </Col>
                    <Col lg={9}>
                      <div className="d-flex border-bottom border-bottom-dashed pb-3 mb-3 mt-4 mt-lg-0">
                        <div className="flex-grow-1">
                          <h5>{user.name}</h5>
                          <p className="text-muted mb-0">{user.activity}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Dropdown>
                            <Dropdown.Toggle
                              href="#"
                              className="arrow-none btn btn-ghost-primary btn-sm btn-icon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="ph-dots-three-outline"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <li>
                                <Dropdown.Item href="/#">Action</Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item href="/#">
                                  Another action
                                </Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item href="/#">
                                  Something else here
                                </Dropdown.Item>
                              </li>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      <Row>
                        <Col lg={6}>
                          <div className="table-responsive">
                            <Table className="table-borderless table-sm mb-0">
                              <tbody>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-map-pin"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Location</td>
                                  </div>
                                  <td className="fw-medium">{user.address}</td>
                                </tr>

                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-envelope"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Email</td>
                                  </div>
                                  <td className="fw-medium">{user.email}</td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-phone"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Mobile / Phone No.</td>
                                  </div>
                                  <td className="fw-medium">{user.phone}</td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-book"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Designation</td>
                                  </div>
                                  <td className="fw-medium">{user.activity}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="table-responsive">
                            <Table className="table-borderless table-sm mb-0">
                              <tbody>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-bank"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Bank Name</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.bank_name}
                                  </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-user-list"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Account Name</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.account_name}
                                  </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-credit-card"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Account Number</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.account_number}
                                  </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-receipt"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Sort Code</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.sort_code}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              {/* <RecentOrders /> */}
            </Col>

            {/* <Col xxl={3}>
                    <Acitivity />
                </Col> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
