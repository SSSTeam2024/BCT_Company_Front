import React, { useState } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { useGetAllQuotesByCompanyIDQuery } from "features/quote/quoteSlice";
import { useSelector } from "react-redux";
import { RootState } from "app/store";
import { selectCurrentUser } from "features/account/authSlice";

const TripsManagement = () => {
  document.title = "Trips | Company Administration";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: quotes = [] } = useGetAllQuotesByCompanyIDQuery(user?._id!);
  const result = quotes.filter((quote) => quote.progress !== "Refused");
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Quote ID</span>,
      selector: (cell: any) => {
        return (
          <span>
            <span className="text-dark">{cell?.quote_ref!}</span>
          </span>
        );
      },
      sortable: true,
      width: "160px",
    },
    {
      name: (
        <span className="mdi mdi-account-tie-hat font-weight-bold fs-24"></span>
      ),
      selector: (row: any) =>
        row?.id_driver?.firstname! === undefined ? (
          <span>No Driver</span>
        ) : (
          <span>
            {row?.id_driver?.firstname!} {row?.id_driver?.surname!}
          </span>
        ),
      sortable: true,
      // width: "88px",
    },
    {
      name: <span className="font-weight-bold fs-13">Vehicle Type</span>,
      selector: (row: any) => row.vehicle_type,
      sortable: true,
      width: "220px",
    },
    {
      name: <span className="mdi mdi-car font-weight-bold fs-24"></span>,
      selector: (row: any) =>
        row.id_vehicle?.registration_number! === undefined ? (
          <span>No Vehicle</span>
        ) : (
          <span>{row.id_vehicle?.registration_number!}</span>
        ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => (
        <span>
          <b>{row.date}</b> at <b>{row.pickup_time}</b>
        </span>
      ),
      sortable: true,
      width: "157px",
    },
    {
      name: <span className="font-weight-bold fs-13">Pax</span>,
      selector: (row: any) => row.passengers_number,
      sortable: true,
      width: "60px",
    },
    {
      name: <span className="font-weight-bold fs-13">Pick Up</span>,
      selector: (row: any) => row.start_point?.placeName!,
      sortable: true,
      width: "270px",
    },
    {
      name: <span className="font-weight-bold fs-13">Destination</span>,
      selector: (row: any) => row.destination_point?.placeName!,
      sortable: true,
      width: "270px",
    },
    {
      name: <span className="font-weight-bold fs-13">Progress</span>,
      selector: (cell: any) => {
        switch (cell.progress) {
          case "Booked":
            return <span className="badge bg-primary"> {cell.progress} </span>;
          case "Accepted":
            return <span className="badge bg-warning"> {cell.progress} </span>;
          case "On Route":
            return <span className="badge bg-info"> {cell.progress} </span>;
          case "Picked Up":
            return (
              <span className="badge bg-secondary"> {cell.progress} </span>
            );
          default:
            return <span className="badge bg-danger"> {cell.progress} </span>;
        }
      },
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      selector: (cell: any) => {
        switch (cell.status) {
          case "Booked":
            return <span className="badge bg-primary"> {cell.status} </span>;
          case "Allocated":
            return (
              <span className="badge bg-warning-subtle text-warning">
                {" "}
                {cell.status}{" "}
              </span>
            );
          case "Driver Allocated":
            return (
              <span className="badge bg-info-subtle text-info">
                {" "}
                {cell.status}{" "}
              </span>
            );
          case "Vehicle Allocated":
            return (
              <span className="badge bg-secondary-subtle text-secondary">
                {" "}
                {cell.status}{" "}
              </span>
            );
          default:
            return (
              <span className="badge bg-dark-subtle text-dark">
                {" "}
                {cell.status}{" "}
              </span>
            );
        }
      },
      sortable: true,
      width: "130px",
    },
    {
      name: <span className="font-weight-bold fs-13">Mobile</span>,
      sortable: true,
      selector: (cell: any) => {
        return (
          <span
            className="mdi mdi-phone-in-talk-outline d-flex align-items-center"
            title={cell.id_visitor?.phone!}
          ></span>
        );
      },
      width: "72px",
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      sortable: true,
      selector: (cell: any) => {
        return (
          <span
            className="mdi mdi-email-outline d-flex align-items-center"
            title={cell.id_visitor?.email!}
          ></span>
        );
      },
      width: "70px",
    },
    {
      name: <span className="font-weight-bold fs-13">Arrival Date</span>,
      selector: (row: any) => (
        <span>
          <b>{row.dropoff_date}</b> at <b>{row.dropoff_time}</b>
        </span>
      ),
      sortable: true,
      width: "157px",
    },
    {
      name: <span className="font-weight-bold fs-13">Price</span>,
      selector: (row: any) =>
        row?.manual_cost! === undefined ? (
          <span>No Price</span>
        ) : (
          <span>
            £ <b>{row?.manual_cost!}</b>
          </span>
        ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Balance</span>,
      selector: (row: any) => "No Balance",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Contract</span>,
      selector: (row: any) => "No Contract",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enquiry Date</span>,
      selector: (row: any) => {
        const date = new Date(row.createdAt);
        return <span>{date.toDateString()}</span>;
      },
      sortable: true,
      width: "157px",
    },
    {
      name: <span className="font-weight-bold fs-13">Callback</span>,
      selector: (row: any) => "No Callback",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Payment Status</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.PaymentStatus) {
          case "Not Paid":
            return (
              <span className="badge bg-danger"> {cell.PaymentStatus} </span>
            );
          case "Medium":
            return (
              <span className="badge bg-info"> {cell.PaymentStatus} </span>
            );
          case "Low":
            return (
              <span className="badge bg-success"> {cell.PaymentStatus} </span>
            );
          default:
            return <span className="badge bg-warning"> Not Paid </span>;
        }
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Notes</span>,
      selector: (row: any) => {
        return row.notes !== "" ? <span>{row.notes}</span> : "No Notes";
      },
      sortable: true,
    },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  // This function is triggered when the select Period
  const handleSelectPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPeriod(value);
  };

  const [selectedProgress, setSelectedProgress] = useState<string>("");
  // This function is triggered when the select Progress
  const handleSelectProgress = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedProgress(value);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredJobs = () => {
    let filteredJobs = result;
    if (searchTerm) {
      filteredJobs = filteredJobs.filter(
        (job: any) =>
          job?.quote_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.start_point.placeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.destination_point.placeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job?.id_visitor?.name
            ?.toLowerCase()
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
      filteredJobs = filteredJobs.filter((job: any) => filterByDate(job.date));
    }

    // if (selectedPayment && selectedPayment !== "all") {
    //   filteredJobs = filteredJobs.filter(
    //     (job) => job.payment_status === selectedPayment
    //   );
    // }

    if (selectedProgress && selectedProgress !== "all") {
      filteredJobs = filteredJobs.filter(
        (job: any) => job.progress === selectedProgress
      );
    }

    return filteredJobs;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Trips" pageTitle="Dashboard" />
          <Col lg={12}>
            <Card>
              <Card.Body>
                <Row className="g-lg-2 g-4">
                  <Col sm={9} className="col-lg-auto">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for something..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col sm={9} className="col-lg-auto">
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                      onChange={handleSelectPeriod}
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
                  <Col sm={9} className="col-lg-auto">
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="Progress"
                      id="idProgress"
                      onChange={handleSelectProgress}
                    >
                      <option value="all">All Progress</option>
                      <option value="Accepted">Accepted</option>
                      <option value="On Route">On route</option>
                      <option value="On site">On site</option>
                      <option value="Picked Up">Picked Up</option>
                    </select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card id="shipmentsList">
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredJobs()}
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
export default TripsManagement;
