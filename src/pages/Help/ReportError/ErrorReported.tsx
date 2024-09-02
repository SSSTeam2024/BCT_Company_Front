import React, { useState } from "react";
import { Container, Row, Card, Col, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { selectCurrentUser } from "../../../features/account/authSlice";
import { useGetAllErrorReportsByCompanyIDQuery } from "features/ReportError/reportErrorSlice";

const ErrorReported = () => {
  document.title = "Reported Errors | Company Administration";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: AllRequestedFeatures = [] } =
    useGetAllErrorReportsByCompanyIDQuery(user?._id!);

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Reference</span>,
      selector: (cell: any) => {
        return <span>{cell?.ref!}</span>;
      },
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="font-weight-bold fs-13">Title</span>,
      selector: (row: any) => row.title,
      sortable: true,
      width: "160px",
    },
    {
      name: <span className="font-weight-bold fs-13">Section</span>,
      selector: (row: any) => row.section,
      sortable: true,
      width: "150px",
    },
    {
      name: <span className="font-weight-bold fs-13">Details</span>,
      selector: (row: any) => <span>{row.details}</span>,
      sortable: true,
      width: "200px",
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.date,
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      selector: (cell: any) => {
        switch (cell.status) {
          case "Pending":
            return <span className="badge bg-danger"> {cell.status} </span>;
          case "Answered":
            return <span className="badge bg-success"> {cell.status} </span>;
          default:
            return <span className="badge bg-dark"> {cell.status} </span>;
        }
      },
      sortable: true,
      width: "90px",
    },
  ];

  const navigate = useNavigate();

  function tog_AddNewRequestFeature() {
    navigate("/new-error-report");
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Reported Errors" pageTitle="Help" />
          <Col lg={12}>
            <Card>
              <Card.Body>
                <Row className="g-lg-2 g-4">
                  <Col lg={3} className="col-lg-auto">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for something..."
                        // value={searchTerm}
                        // onChange={handleSearchChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={2} className="col-lg-auto">
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                      //   onChange={handleSelectPeriod}
                    >
                      <option value="all">All Days</option>
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option defaultValue="This Month">This Month</option>
                      <option value="Last Month">Last Month</option>
                    </select>
                  </Col>
                  <Col lg={4}></Col>
                  <Col lg={3} className="col-lg-auto">
                    <Button
                      variant="secondary"
                      onClick={() => tog_AddNewRequestFeature()}
                      className="add-btn"
                    >
                      <i className="bi bi-plus-circle me-1 align-middle "></i>{" "}
                      New Error Report
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={AllRequestedFeatures}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default ErrorReported;
