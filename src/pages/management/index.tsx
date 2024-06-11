import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetAllQuotesByCompanyIDQuery } from "features/quote/quoteSlice";
import { useSelector } from "react-redux";
import { RootState } from "app/store"; // Import your RootState interface
import { selectCurrentUser } from "features/account/authSlice";

const TripsManagement = () => {
  document.title = "Trips| Company Administration";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [showAffiliates, setShowAffiliates] = useState<boolean>(false);

  const { data = [] } = useGetAllQuotesByCompanyIDQuery(user?._id!);
  // From Date
  // Inside your functional component
  const [selectedFromDate, setSelectedFromDate] = useState<string>(() => {
    // Get current date
    const currentDate = new Date();
    // Format it to match your dateFormat option
    const formattedDate = currentDate.toISOString().split("T")[0];
    // Return the formatted date as the default value
    return formattedDate;
  });

  const handleFromDateChange = (selectedDates: Date[]) => {
    const formattedDate = selectedDates[0].toISOString().split("T")[0];
    setSelectedFromDate(formattedDate);
  };

  // To Date
  // const [selectedToDate, setSelectedToDate] = useState<Date | null>(newDate);
  const [selectedToDate, setSelectedToDate] = useState<string>(() => {
    // Get current date
    const currentDate = new Date();
    // Format it to match your dateFormat option
    currentDate.setDate(currentDate.getDate() + 15);
    const formattedDate = currentDate.toISOString().split("T")[0];
    // Return the formatted date as the default value
    return formattedDate;
  });
  const handleToDateChange = (selectedDates: Date[]) => {
    const formattedDate = selectedDates[0].toISOString().split("T")[0];
    setSelectedToDate(formattedDate);
  };

  // Log selectedFromDate whenever it changes
  useEffect(() => {
    console.log(selectedFromDate);
  }, [selectedFromDate]);

  const [modal_QuoteInfo, setmodal_QuoteInfo] = useState<boolean>(false);

  function tog_QuoteInfo() {
    setmodal_QuoteInfo(!modal_QuoteInfo);
  }

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>();

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Quote ID</span>,
      selector: (cell: any) => {
        return (
          <span>
            <Link to={`/new-quote/${cell?._id!}`} state={cell}>
              <span className="text-dark">{cell?.quote_ref!}</span>
            </Link>{" "}
            <i className="ph ph-eye" onClick={() => tog_QuoteInfo()}></i>
          </span>
        );
      },
      sortable: true,
      width: "220px",
    },
    {
      name: (
        <span className="mdi mdi-account-tie-hat font-weight-bold fs-24"></span>
      ),
      selector: (row: any) => "No Driver",
      sortable: true,
      // width: "88px",
    },
    {
      name: <span className="font-weight-bold fs-13">Vehicle Type</span>,
      selector: (row: any) => row.vehicle_type,
      sortable: true,
      // width: "160px",
    },
    {
      name: <span className="mdi mdi-car font-weight-bold fs-24"></span>,
      selector: (row: any) => "No Vehicle",
      sortable: true,
      width: "95px",
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
          case "New":
            return <span className="badge bg-danger"> {cell.progress} </span>;
          case "Accepted":
            return <span className="badge bg-danger"> New </span>;
          case "Cancel":
            return <span className="badge bg-dark"> {cell.progress} </span>;
          case "Created":
            return <span className="badge bg-info"> {cell.progress} </span>;
          default:
            return <span className="badge bg-danger"> {cell.progress} </span>;
        }
      },
      sortable: true,
      width: "88px",
    },
    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      selector: (row: any) => <span className="badge bg-danger"> New </span>,
      sortable: true,
      width: "80px",
    },
    {
      name: <span className="font-weight-bold fs-13">Passenger Name</span>,
      selector: (row: any) => row.id_visitor?.name!,
      sortable: true,
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
      name: <span className="font-weight-bold fs-13">Affiliate</span>,
      selector: (row: any) => (
        <Link
          to="#"
          onClick={() => setShowAffiliates(!showAffiliates)}
          state={row}
        >
          {row?.white_list?.length}
        </Link>
      ),
      sortable: true,
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
      name: <span className="font-weight-bold fs-13">Account Name</span>,
      selector: (row: any) => row.id_visitor?.name!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Notes</span>,
      selector: (row: any) => {
        return row.notes !== "" ? <span>{row.notes}</span> : "No Notes";
      },
      sortable: true,
    },
  ];

  const optionColumnsTable = [
    { value: "Quote ID", label: "Quote ID" },
    { value: "Go Date", label: "Go Date" },
    { value: "Pax", label: "Pax" },
    { value: "Group", label: "Group" },
    { value: "Pick Up", label: "Pick Up" },
    { value: "Destination", label: "Destination" },
    { value: "Progress", label: "Progress" },
    { value: "Status", label: "Status" },
    { value: "Price", label: "Price" },
  ];

  // State to store the selected option values
  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  // Event handler to handle changes in selected options
  const handleSelectValueColumnChange = (selectedOption: any) => {
    // Extract values from selected options and update state
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Assign Done successfully",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const navigate = useNavigate();
  const [modal_SurveyAffiliate, setModalSurveyAffiliate] =
    useState<boolean>(false);
  const tog_ModalSurveyAffiliate = () => {
    setModalSurveyAffiliate(!modal_SurveyAffiliate);
  };

  // State to store the selected option values
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  // Event handler to handle changes in selected options
  const handleSelectValueChange = (selectedOption: any) => {
    let whiteList: any[] = [];

    // Extract values from selected options and update state
    const values = selectedOption.map((option: any) =>
      whiteList.push({
        id: option.value,
        noteAcceptJob: "",
        price: "",
        jobStatus: "",
      })
    );
    setSelectedValues(whiteList);
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
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                    >
                      <option value="all">All</option>
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option defaultValue="This Month">This Month</option>
                      <option value="Last Month">Last Month</option>
                    </select>
                  </Col>
                  <Col lg={2}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder={selectedFromDate}
                      options={{
                        dateFormat: "d M, Y",
                      }}
                      defaultValue={selectedFromDate}
                      onChange={handleFromDateChange}
                    />
                  </Col>
                  <Col lg={2}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder={selectedToDate}
                      options={{
                        dateFormat: "d M, Y",
                      }}
                      defaultValue={selectedToDate}
                      onChange={handleToDateChange}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-2">
                  <Col lg={8} className="d-flex justify-content-center">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for something..."
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm mt-2"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button type="button" className="btn btn-outline-dark">
                        Excel
                      </button>
                      <button type="button" className="btn btn-outline-dark">
                        PDF
                      </button>
                      <button type="button" className="btn btn-outline-dark">
                        Print
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={data} pagination />
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default TripsManagement;
