import React, { useMemo, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { selectCurrentUser } from "../../features/account/authSlice";
import { useGetAttendanceByIdCompanyMutation } from "features/attendance/attendanceSlice";

const Attendances = () => {
  document.title = "Attendances | Company Administation";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const [getAttendanceByIdCompany, { data, error, isLoading }] =
    useGetAttendanceByIdCompanyMutation();

  useEffect(() => {
    getAttendanceByIdCompany({ id_company: user?._id! });
  }, [user, getAttendanceByIdCompany]);

  const columns = useMemo(
    () => [
      {
        Header: "Employee Name",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="flex-shrink-0">
                <img
                  src={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${cellProps.id_employee.photos}`}
                  alt=""
                  className="avatar-xs rounded-circle user-profile-img"
                />
              </div>
              <div className="flex-grow-1 ms-2 user_name">
                {cellProps.id_employee.firstName}{" "}
                {cellProps.id_employee.lastName}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Trip Reference",
        accessor: (cellProps: any) => {
          return <span> {cellProps.id_quote.quote_ref}</span>;
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Pick up",
        accessor: (cellProps: any) => {
          return <span> {cellProps.id_quote.start_point.placeName}</span>;
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Pick up Time",
        accessor: (cellProps: any) => {
          return (
            <span>
              {" "}
              {cellProps.id_quote.date} <span className="fw-bold">at</span>{" "}
              {cellProps.id_quote.pickup_time}
            </span>
          );
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Drop Down",
        accessor: (cellProps: any) => {
          return <span> {cellProps.id_quote.destination_point.placeName}</span>;
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Drop Down Time",
        accessor: (cellProps: any) => {
          return (
            <span>
              {" "}
              {cellProps.id_quote.dropoff_date}{" "}
              <span className="fw-bold">at</span>{" "}
              {cellProps.id_quote.dropoff_time}
            </span>
          );
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Presence",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          switch (cellProps.presence) {
            case "true":
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  Yes
                </span>
              );
            case "false":
              return (
                <span className="badge bg-danger-subtle text-danger"> No</span>
              );
            default:
              return (
                <span className="badge bg-dark-subtle text-dark">
                  {" "}
                  {cellProps.presence}
                </span>
              );
          }
        },
      },
    ],
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredJobs = () => {
    let filteredJobs = data;
    if (searchTerm) {
      filteredJobs = filteredJobs!.filter(
        (job: any) =>
          job?.id_quote.quote_ref
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.id_quote.start_point.placeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.id_quote.destination_point.placeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.id_employee.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.id_employee.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredJobs;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Attendances" pageTitle="Dashboard" />
          <Row id="usersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-lg-2 g-4">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Search ..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  <TableContainer
                    columns={columns || []}
                    data={getFilteredJobs() || []}
                    // isGlobalFilter={true}
                    iscustomPageSize={false}
                    isBordered={false}
                    customPageSize={10}
                    className="custom-header-css table align-middle table-nowrap"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Employee..."
                  />
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center">
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Attendances;
