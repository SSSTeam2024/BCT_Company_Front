import React, { useMemo, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "Common/TableContainer";
import { useLocation } from "react-router-dom";
import { useGetAttendanceByIdEmployeeMutation } from "features/attendance/attendanceSlice";

const Trips = () => {
  const singleAccount = useLocation();
  const [getAttendanceByIdEmployee, { data, error, isLoading }] =
    useGetAttendanceByIdEmployeeMutation();

  React.useEffect(() => {
    getAttendanceByIdEmployee({ id_employee: singleAccount?.state?._id! });
  }, [singleAccount.state, getAttendanceByIdEmployee]);

  const columns = useMemo(
    () => [
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

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  // This function is triggered when the select Period
  const handleSelectPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPeriod(value);
  };

  const [selectedPresence, setSelectedPresence] = useState<string>("");
  // This function is triggered when the select Presence
  const handleSelectPresence = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedPresence(value);
  };

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
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPeriod && selectedPeriod !== "all") {
      const now = new Date();
      const filterByDate = (jobDate: any) => {
        const date = new Date(jobDate);
        switch (selectedPeriod) {
          case "Today":
            return date.toDateString() === now.toDateString();
          case "Yesterday":
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return date.toDateString() === yesterday.toDateString();
          case "Last 7 Days":
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            return date >= lastWeek && now >= date;
          case "Last 30 Days":
            const lastMonth = new Date(now);
            lastMonth.setDate(now.getDate() - 30);
            return date >= lastMonth && now >= date;
          case "This Month":
            return (
              date.getMonth() === now.getMonth() &&
              date.getFullYear() === now.getFullYear()
            );
          case "Last Month":
            const lastMonthStart = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              1
            );
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            return date >= lastMonthStart && date <= lastMonthEnd;
          default:
            return true;
        }
      };
      filteredJobs = filteredJobs!.filter((job: any) =>
        filterByDate(job?.id_quote?.date!)
      );
    }

    if (selectedPresence && selectedPresence !== "all") {
      filteredJobs = filteredJobs!.filter(
        (job: any) => job.presence === selectedPresence
      );
    }

    return filteredJobs;
  };

  return (
    <React.Fragment>
      <Card id="shipmentsList">
        <Row className="p-2 g-1">
          <Col xxl={3} lg={7}>
            <div className="search-box">
              <input
                type="text"
                className="form-control search"
                placeholder="Search for a Trip ..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </Col>
          <Col xxl={2} lg={6}>
            <select
              className="form-select"
              data-choices
              data-choices-search-false
              name="choices-single-default"
              id="idPeriod"
              onChange={handleSelectPeriod}
            >
              <option defaultValue="all">All Days</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </Col>
          <Col xxl={2} lg={6}>
            <select
              className="form-select"
              data-choices
              data-choices-search-false
              name="idStatus"
              id="idStatus"
              onChange={handleSelectPresence}
            >
              <option value="all">All Presences</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </Col>
        </Row>
        <Card.Body className="p-0">
          <TableContainer
            columns={columns || []}
            data={getFilteredJobs() || []}
            iscustomPageSize={false}
            isBordered={false}
            customPageSize={10}
            className="custom-header-css table align-middle table-nowrap"
            tableClass="table-centered align-middle table-nowrap mb-0"
            theadClass="text-muted table-light"
            SearchPlaceholder="Search Trips..."
          />
          <div className="noresult" style={{ display: "none" }}>
            <div className="text-center py-4">
              <div className="avatar-md mx-auto mb-4">
                <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                  <i className="bi bi-search"></i>
                </div>
              </div>
              <h5 className="mt-2">Sorry! No Result Found</h5>
            </div>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Trips;
