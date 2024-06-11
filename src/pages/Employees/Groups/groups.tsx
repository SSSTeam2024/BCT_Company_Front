import React, { useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  ModalBody,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";

import { stations } from "Common/data/stations";
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Selection from "./Select";
import { Map } from "google-maps-react";
import { GoogleApiWrapper } from "google-maps-react";
import { useDeleteGroupMutation } from "features/groups/groupsSlice";
const LoadingContainer = () => <div>Loading...</div>;
const Groups = (props:any) => {
  document.title = " Groups | School Administartion";
  const [showCoupons, setShowCoupons] = useState<boolean>(false);
  const [showCouponDetails, setShowCouponsDetails] = useState<any>({});
const navigate=useNavigate()
  const [modal_AddShippingModals, setmodal_AddShippingModals] =
    useState<boolean>(false);
  function tog_AddShippingModals() {
    navigate("/groups/add-group")
  }
const [ deleGroup]= useDeleteGroupMutation()
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <div className="d-flex align-items-center gap-2 ">
           
              <div className="flex-grow-1 ms-2 user_name">
                {cellProps.groupId}
              </div>
            </div>
          );
        },
      },

      {
        Header: "Starting Point",
        accessor: "pickup_station",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date/Time",
        accessor: "pickup_time",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Destination",
        accessor: "dropdown_station",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: " Date/Time",
        accessor: "dropdown_time",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Intermediate Stops",
        accessor: "midstation_number",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Students",
        accessor: "number_student",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Status",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          switch (cellProps.status) {
            case "Active":
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.status}
                </span>
              );
            case "Inactive":
              return (
                <span className="badge bg-danger-subtle text-danger">
                  {" "}
                  {cellProps.status}
                </span>
              );
        
            default:
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.status}
                </span>
              );
          }
        },
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#couponDetails"
                  data-bs-toggle="offcanvas"
                  className="badge bg-secondary-subtle text-secondary view-item-btn"
                  onClick={() => {
                    setShowCouponsDetails(cellProps);
                    setShowCoupons(!showCoupons);
                  }}
                >
                  <i
                    className="ph ph-eye"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                >
                  <i
                    className="ph ph-pencil-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="badge bg-danger-subtle text-danger remove-item-btn"
                >
                  <i
                    className="ph ph-trash"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Groups" pageTitle="Accounts" />
          <Card id="shipmentsList">
            <Card.Header className="border-bottom-dashed">
              <Row className="g-3">
                <Col xxl={3} lg={6}>
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Search for group ..."
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <Col xxl={3} lg={6}>
                  <Flatpickr
                    className="form-control flatpickr-input"
                    placeholder="Select Date"
                    options={{
                      mode: "range",
                      dateFormat: "d M, Y",
                    }}
                  />
                </Col>
                <Col xxl={2} lg={3}>
                  <select
                    className="form-select"
                    data-choices
                    data-choices-search-false
                    name="choices-single-default"
                  >
                    <option value="">This Month</option>
                    <option defaultValue="all">All</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last 7 days">Last 7 Days</option>
                    <option value="last 30 days">Last 30 Days</option>
                    <option value="this month">This Month</option>
                    <option value="last month">Last Month</option>
                  </select>
                </Col>
                <Col xxl={2} lg={3}>
                  <select
                    className="form-select"
                    data-choices
                    data-choices-search-false
                    name="choices-single-default"
                    id="idStatus"
                  >
                    <option value="">Account Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </Col>
                <Col xxl={2} lg={2} className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    onClick={() => tog_AddShippingModals()}
                    className="add-btn"
                  
                  >
                    <i className="bi bi-plus-circle me-1 align-middle "></i>
                    Add Group
                  </Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className="p-0">
              {/* <div className="table-responsive table-card"> */}
              <TableContainer
                columns={columns || []}
                data={stations || []}
                // isGlobalFilter={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
                className="custom-header-css table align-middle table-nowrap"
                tableClass="table-centered align-middle table-nowrap mb-0 text-center"
                theadClass="text-muted text-center"
                SearchPlaceholder="Search Products..."
              />
              {/* </div> */}
              <div className="noresult" style={{ display: "none" }}>
                <div className="text-center py-4">
                  <div className="avatar-md mx-auto mb-4">
                    <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                      <i className="bi bi-search"></i>
                    </div>
                  </div>
                  <h5 className="mt-2">Sorry! No Result Found</h5>
                  <p className="text-muted mb-0">No Results Found.</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Modal
            className="fade zoomIn"
            size="xl"
            show={modal_AddShippingModals}
            onHide={() => {
              tog_AddShippingModals();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                Create Student Group
              </h5>
            </Modal.Header>
            {/* <Modal.Body className="p-4">
              <div
                id="alert-error-msg"
                className="d-none alert alert-danger py-2"
              ></div>
              <Form className="tablelist-form">
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={10}>
                    <div className="mb-3">
                      <Form.Label htmlFor="customerName-field">
                        Group Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="customerName-field"
                        placeholder="Enter Group name"
                        required
                      />
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="col-lg-10">
                      <div className="mb-3">
                        <label htmlFor="locationSelect" className="form-label">
                          PickUp Station
                        </label>
                        <select
                          className="form-select"
                          name="choices-single-default"
                          id="locationSelect"
                          required
                        >
                          <option value="">Station</option>
                          <option value="High Street (Stop MS20)">
                            High Street (Stop MS20)
                          </option>
                          <option value="Dudley Street">Dudley Street</option>
                          <option value="Allison St (Stop DS2)">
                            Allison St (Stop DS2)
                          </option>
                          <option value="Colmore Row (Stop SH2)">
                            Colmore Row (Stop SH2)
                          </option>
                        </select>
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="col-lg-10">
                      <div className="mb-3">
                        <label htmlFor="locationSelect" className="form-label">
                          DropDown Station
                        </label>
                        <select
                          className="form-select"
                          name="choices-single-default"
                          id="locationSelect"
                          required
                        >
                          <option value="">Station</option>
                          <option value="High Street (Stop MS20)">
                            High Street (Stop MS20)
                          </option>
                          <option value="Dudley Street">Dudley Street</option>
                          <option value="Allison St (Stop DS2)">
                            Allison St (Stop DS2)
                          </option>
                          <option value="Colmore Row (Stop SH2)">
                            Colmore Row (Stop SH2)
                          </option>
                        </select>
                      </div>
                    </div>
                  </Col>

                  <Selection />
                  <Col lg={12} className="mt-2">
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AddShippingModals();
                        }}
                        data-bs-dismiss="modal"
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Close
                      </Button>
                      <Button variant="primary" id="add-btn">
                        Add Group
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Modal.Body> */}
         
          </Modal>
        </Container>
      </div>

      <Offcanvas
        show={showCoupons}
        onHide={() => setShowCoupons(!showCoupons)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Group details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* <div>
                        <img src={showCouponDetails.user_img} alt="" className="img-thumbnail" />
                    </div> */}
          <div className="mt-3">
            <div className="table-responsive">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>
                      <span className="text-muted">Groupe Name</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showCouponDetails.groupId}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Starting Point</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.pickup_station}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Starting Point Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.pickup_time}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="text-muted">Destination</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.dropdown_station}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Destination Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.dropdown_time}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Intermediate Stops</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.midstation_number}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Students</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.number_student}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Status</span>
                    </td>
                    <td>
                      <span
                        className={(() => {
                          switch (showCouponDetails.status) {
                            case "Active":
                              return "badge bg-success-subtle text-success text-uppercase";
                            case "Inactive":
                              return "badge bg-danger-subtle text-danger text-uppercase";
                            case "On Hold":
                              return "badge bg-dark-subtle text-dark text-uppercase";
                            case "Approved":
                              return "badge bg-info-subtle text-info text-uppercase";
                            case "Suspended":
                              return "badge bg-dark-subtle text-danger text-uppercase";
                            case "Pending Approval":
                              return "badge bg-secondary-subtle text-secondary text-uppercase";
                            default:
                              return "badge bg-success-subtle text-success text-uppercase";
                          }
                        })()}
                      >
                        {showCouponDetails.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
  LoadingContainer: LoadingContainer,
  v: "3",
})(Groups);