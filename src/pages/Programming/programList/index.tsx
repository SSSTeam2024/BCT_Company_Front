import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Button,
  Form,
  Dropdown,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useConvertToContractMutation,
  useConvertToQuoteMutation,
  useFetchProgrammsQuery,
  useSendResponseMutation,
  useDeleteProgramMutation,
  useUpdateStatusMutation,
} from "features/program/programSlice";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../../features/account/authSlice";

interface ResponseMsg {
  msg: string;
  date: string;
  sender: string;
}

interface ResponseStatus {
  status: string;
  date_status: string;
}

const ProgramList = () => {
  document.title = "Suggested Routes | Company Administration";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [modal_Pickup, setmodal_Pickup] = useState<boolean>(false);
  const [modal_Destination, setmodal_Destination] = useState<boolean>(false);
  const [modal_Action, setmodal_Action] = useState<boolean>(false);
  const { data = [] } = useFetchProgrammsQuery();
  const companyPrograms = data.filter(
    (programForCompany: any) =>
      programForCompany?.company_id?._id! === user?._id!
  );
  function tog_Pickup() {
    setmodal_Pickup(!modal_Pickup);
  }
  const [deleteProgram] = useDeleteProgramMutation();
  const AlertDelete = async (_id: string) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you Sure?",
        text: "You won't be able to go back!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteProgram(_id);
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "The Program has been deleted.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Canceled",
            "The Program is safe :)",
            "error"
          );
        }
      });
  };

  const navigate = useNavigate();
  function tog_Destination() {
    setmodal_Destination(!modal_Destination);
  }
  function tog_AddShippingModals() {
    navigate("/programming/addProgram");
  }

  const programLocation = useLocation();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const [updateToContract] = useConvertToContractMutation();
  const handleUpdate = async (id: any) => {
    updateToContract({
      idProgram: id,
    });
  };

  const [updateStatus] = useUpdateStatusMutation();
  const handleUpdateStatus = async (id: any) => {
    updateStatus({
      id: id,
      status: "Converted",
    });
  };

  const [updateToQuote] = useConvertToQuoteMutation();
  const handleConvertToQuote = async (id: any) => {
    updateToQuote({
      id_schedule: id,
    });
  };

  const AlertConfirm = async (id: any) => {
    try {
      await handleConvertToQuote(id);
      await handleUpdate(id);
      await handleUpdateStatus(id);
      swalWithBootstrapButtons.fire(
        "Changed !",
        "The Program has been converted.",
        "success"
      );
    } catch (error) {
      console.error("Error:", error);
      swalWithBootstrapButtons.fire(
        "Error",
        "An error occurred while converting the program.",
        "error"
      );
    }
  };

  const [openChatModal, setOpenChatModal] = useState<boolean>(false);
  const tog_OpenChatModal = () => {
    setOpenChatModal(!openChatModal);
  };
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row: any) => row.programName,
      sortable: true,
      width: "180px",
    },
    {
      name: <span className="font-weight-bold fs-13">Pickup</span>,
      selector: (cell: any) => {
        return (
          <span className="text-secondary" onClick={() => tog_Pickup()}>
            {cell.origin_point.placeName}
          </span>
        );
      },
      sortable: true,
      width: "200px",
    },
    {
      name: <span className="font-weight-bold fs-13">Destination</span>,
      selector: (cell: any) => {
        return (
          <span className="text-secondary" onClick={() => tog_Destination()}>
            {cell.destination_point.placeName}
          </span>
        );
      },
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      selector: (row: any) => row.program_status,
      sortable: true,
      cell: (row: any) => {
        const latestStatus =
          row.program_status[row.program_status.length - 1]?.status;
        const penultimateStatus =
          row.program_status[row.program_status.length - 2]?.status;

        return (
          <span>
            {(latestStatus === "Approved By Client" &&
              row.status === "Converted") ||
            (latestStatus === "Approved By Admin" &&
              row.status === "Converted") ? (
              <span className="badge bg-info-subtle text-info">
                {row.status}
              </span>
            ) : (latestStatus === "Approved By Client" &&
                penultimateStatus === "Approved By Admin") ||
              (penultimateStatus === "Approved By Client" &&
                latestStatus === "Approved By Admin") ? (
              <span className="badge bg-secondary-subtle text-dark">
                Contract Pending
              </span>
            ) : latestStatus === "Pending" ? (
              <span className="badge bg-warning-subtle text-warning">
                Answer Pending
              </span>
            ) : latestStatus === "Answered By Client" ? (
              <span className="badge bg-secondary-subtle text-dark">
                Answered By Client
              </span>
            ) : latestStatus === "Answered By Admin" ? (
              <span className="badge bg-info-subtle text-dark">
                Answered By Admin
              </span>
            ) : latestStatus === "Approved By Admin" ? (
              <span className="badge bg-dark-subtle text-dark">
                Approved By Admin
              </span>
            ) : latestStatus === "Approved By Client" ? (
              <span className="badge bg-success-subtle text-dark">
                Approved By Client
              </span>
            ) : null}
          </span>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">From</span>,
      selector: (row: any) => row.pickUp_date,
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">To</span>,
      selector: (row: any) => row.droppOff_date,
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">Price</span>,
      selector: (row: any) => {
        return row.total_price === "" ? (
          <span>No Price</span>
        ) : (
          <span>£ {row.total_price}</span>
        );
      },
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice Frequency</span>,
      selector: (cell: any) => {
        switch (cell.invoiceFrequency) {
          case "Weekly":
            return (
              <span className="badge bg-primary">{cell.invoiceFrequency}</span>
            );
          case "Bi Weekly":
            return (
              <span className="badge bg-info"> {cell.invoiceFrequency} </span>
            );
          case "Daily":
            return (
              <span className="badge bg-success">
                {" "}
                {cell.invoiceFrequency}{" "}
              </span>
            );
          case "Third Weekly":
            return (
              <span className="badge bg-secondary">
                {" "}
                {cell.invoiceFrequency}{" "}
              </span>
            );
          case "Monthly":
            return (
              <span className="badge bg-dark"> {cell.invoiceFrequency} </span>
            );
          default:
            return <span>--</span>;
        }
      },
      sortable: true,
      width: "160px",
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      selector: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to={`/programming/list-of-programs/programDetail`}
                className="badge badge-soft-primary edit-item-btn"
                state={row}
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
            {row.status !== undefined ? (
              <li>
                <Link
                  to={"/programgroups"}
                  className="badge badge-soft-success edit-item-btn"
                  state={row}
                  onClick={() =>
                    localStorage.setItem("id_current_prog", row._id)
                  }
                >
                  <i
                    className="ph ph-users-three"
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
            ) : (
              ""
            )}
            {row.status !== "Converted" &&
            row.program_status[row.program_status.length - 1].status !==
              "Pending" ? (
              <li>
                <Link
                  to="#"
                  className="badge badge-soft-dark edit-item-btn"
                  state={row}
                  onClick={() => tog_Action()}
                >
                  <i
                    className="ph ph-paper-plane-tilt"
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
            ) : (
              ""
            )}

            <li>
              <Dropdown
                className="topbar-head-dropdown ms-1 header-item"
                id="notificationDropdown"
              >
                <Link
                  to="#"
                  state={row}
                  id="notification"
                  type="button"
                  className="badge badge-soft-info edit-item-btn"
                  onClick={() => tog_OpenChatModal()}
                >
                  <i
                    className="ph ph-chats"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.9em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                  <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                    <span className="notification-badge">
                      {row?.notes_for_client.length}
                    </span>
                  </span>
                </Link>
              </Dropdown>
            </li>
            {/* <li>
              <Link
                to={`/edit-program/${row.Name}`}
                className="badge badge-soft-success edit-item-btn"
                state={row}
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
            </li> */}
            {row.status === "Converted" ? (
              ""
            ) : (
              <li>
                <Link
                  to="#"
                  className="badge badge-soft-danger remove-item-btn"
                  onClick={() => AlertDelete(row._id)}
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
            )}
          </ul>
        );
      },
    },
  ];

  const proramLocation = useLocation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Response send successfully",
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

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const [responseMsg, setResponseMsg] = useState<ResponseMsg[]>([]);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus[]>([]);
  const [currentMsg, setCurrentMsg] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const handleResponseMsgChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentMsg(event.target.value);
  };

  const handleResponseMsgSubmit = () => {
    if (currentMsg.trim() !== "") {
      let date = new Date().toDateString();
      let time = new Date().toLocaleTimeString();
      let upadteDate = date + " " + time;
      let prev_notes = programLocation?.state?.notes_for_client!;
      let newResponseMsg: ResponseMsg = {
        msg: currentMsg,
        date: upadteDate,
        sender: user.name,
      };
      setResponseMsg(() => [...prev_notes, newResponseMsg]);
      setCurrentMsg("");
    }
  };

  const [quoteUnitPrice, setQuoteUnitPrice] = useState<number>();
  const [contractTotalPrice, setContractTotalPrice] = useState<number>();

  const onChangeUnitPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteUnitPrice(parseInt(event.target.value));
    setContractTotalPrice(
      parseInt(event.target.value) * programLocation?.state?.workDates.length
    );
  };
  const [selectedInvoiceFrequency, setSelectedInvoiceFrequency] =
    useState<string>("");
  // This function is triggered when the select Invoice Frequency
  const handleSelectInvoiceFrequency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedInvoiceFrequency(value);
  };

  const [sendResponseMutation] = useSendResponseMutation();

  const initialSendResponse = {
    id: "",
    notes_for_client: [
      {
        msg: "",
        date: "",
        sender: "",
      },
    ],
    program_status: [
      {
        status: "",
        date_status: "",
      },
    ],
    unit_price: "",
    total_price: "",
    invoiceFrequency: "",
    within_payment_days: "",
  };

  const [sendResponse, setSendResponse] = useState(initialSendResponse);

  const handleResponseStatusSubmit = () => {
    let date = new Date().toDateString();
    let time = new Date().toLocaleTimeString();
    let upadteDate = date + " " + time;
    let prev_status: any = [];
    programLocation?.state?.program_status!.forEach((element: any) => {
      prev_status.push(element);
    });
    if (isChecked === true) {
      setCurrentStatus("Approved");
    } else {
      setCurrentStatus("Revised By Client");
    }
    let newResponseStatus: ResponseStatus = {
      status: currentStatus,
      date_status: upadteDate,
    };
    setResponseStatus(() => [...prev_status, newResponseStatus]);
    // console.log(newResponseStatus);
  };

  const {
    id,
    notes_for_client,
    unit_price,
    total_price,
    program_status,
    invoiceFrequency,
    within_payment_days,
  } = sendResponse;

  const onChangeSendResponse = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSendResponse((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitSendResponse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      sendResponse["id"] = programLocation.state?._id!;
      sendResponse["notes_for_client"] = responseMsg;
      sendResponse["unit_price"] = programLocation.state?.unit_price!;
      sendResponse["total_price"] = programLocation.state?.total_price!;
      sendResponse["invoiceFrequency"] =
        programLocation.state?.invoiceFrequency!;
      sendResponse["within_payment_days"] =
        programLocation.state?.within_payment_days!;
      let newResponseStatus: ResponseStatus = { status: "", date_status: "" };
      let prev_status: any = [];
      programLocation?.state?.program_status!.forEach((element: any) => {
        prev_status.push(element);
      });
      if (isChecked === true) {
        let date = new Date().toDateString();
        let time = new Date().toLocaleTimeString();
        let upadteDate = date + " " + time;
        newResponseStatus = {
          status: "Approved By Client",
          date_status: upadteDate,
        };
        prev_status.push(newResponseStatus);
      }
      if (isChecked === false) {
        let date = new Date().toDateString();
        let time = new Date().toLocaleTimeString();
        let upadteDate = date + " " + time;
        newResponseStatus = {
          status: "Answered By Client",
          date_status: upadteDate,
        };
        prev_status.push(newResponseStatus);
      }
      sendResponse["program_status"] = prev_status;
      handleResponseMsgSubmit();
      sendResponseMutation(sendResponse)
        .then(() => notifySuccess())
        .then(() => navigate("/programming/list-of-programs"));
    } catch (error) {
      notifyError(error);
    }
  };

  function tog_Action() {
    setmodal_Action(!modal_Action);
    handleResponseMsgSubmit();
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="List of Suggested Routes"
            pageTitle="Suggested Routes"
          />
          <Col lg={12}>
            <Card>
              <Card.Body>
                <Row className="g-3">
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
                  <Col xxl={2} lg={6}>
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                    >
                      <option value="">Status</option>
                      <option value="Pickups">Pickups</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Out Of Delivery">Out Of Delivery</option>
                    </select>
                  </Col>

                  <Col lg={5} className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      onClick={() => tog_AddShippingModals()}
                      className="add-btn"
                    >
                      <i className="bi bi-plus-circle me-1 align-middle "></i>{" "}
                      New Suggested Route
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col xxl={3} lg={6}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for something..."
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={companyPrograms}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        {/* Modal Action */}
        <Modal
          className="fade zoomIn"
          size="lg"
          show={modal_Action}
          onHide={() => {
            tog_Action();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Send Notes
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={onSubmitSendResponse}>
              {programLocation?.state?.invoiceFrequency! === "" ? (
                <Row>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="notes_for_client">Notes</Form.Label>
                    <textarea
                      className="form-control"
                      id="notes_for_client"
                      name="notes_for_client"
                      // placeholder="Customer see these!"
                      rows={3}
                      // value={sendResponse.notes_for_client}
                      value={currentMsg}
                      onChange={handleResponseMsgChange}
                    ></textarea>
                  </Col>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="unit_price">Unit Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="unit_price"
                      id="unit_price"
                      placeholder="£ 00.00"
                      onChange={onChangeUnitPrice}
                      value={quoteUnitPrice}
                    />
                  </Col>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="total_price">Total Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="total_price"
                      id="total_price"
                      placeholder="£ 00.00"
                      // onChange={onChangeUnitPrice}
                      defaultValue={contractTotalPrice}
                      readOnly
                    />
                  </Col>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="within_payment_days">
                      With Payment Days
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="within_payment_days"
                      id="within_payment_days"
                      placeholder="2"
                      onChange={onChangeSendResponse}
                      value={sendResponse.within_payment_days}
                    />
                  </Col>
                  <Col lg={12}>
                    <div className="mb-2">
                      <Form.Label htmlFor="invoiceFrequency">
                        Invoice Frequency
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="invoiceFrequency"
                        id="invoiceFrequency"
                        onChange={handleSelectInvoiceFrequency}
                      >
                        <option value="">Select</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi Weekly">Bi Weekly</option>
                        <option value="Third Weekly">Third Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={4} className="d-flex align-items-center">
                    <div className="form-check m-2">
                      <Form.Control
                        className="form-check-input"
                        type="checkbox"
                        id="formCheck1"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                    <Form.Label className="m-2" htmlFor="customerName-field">
                      Approved
                    </Form.Label>
                  </Col>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_Action();
                          setSendResponse(initialSendResponse);
                        }}
                        data-bs-dismiss="modal"
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        id="add-btn"
                        type="submit"
                        onClick={() => {
                          tog_Action();
                        }}
                      >
                        Send
                      </Button>
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="unit_price">Unit Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="unit_price"
                      id="unit_price"
                      placeholder="£ 00.00"
                      defaultValue={programLocation?.state?.unit_price!}
                      readOnly
                    />
                  </Col>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="total_price">Total Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="total_price"
                      id="total_price"
                      placeholder="£ 00.00"
                      // onChange={onChangeUnitPrice}
                      defaultValue={programLocation?.state?.total_price!}
                      readOnly
                    />
                  </Col>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="within_payment_days">
                      With Payment Days
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="within_payment_days"
                      id="within_payment_days"
                      placeholder="2"
                      // onChange={onChangeSendResponse}
                      defaultValue={
                        programLocation?.state?.within_payment_days!
                      }
                      readOnly
                    />
                  </Col>
                  <Col lg={12}>
                    <div className="mb-2">
                      <Form.Label htmlFor="invoiceFrequency">
                        Invoice Frequency
                      </Form.Label>
                      <select
                        className="form-select text-muted"
                        name="invoiceFrequency"
                        id="invoiceFrequency"
                        defaultValue={programLocation?.state?.invoiceFrequency!}
                        onChange={handleSelectInvoiceFrequency}
                      >
                        <option
                          value={`${programLocation?.state?.invoiceFrequency!}`}
                          selected
                        >
                          {programLocation?.state?.invoiceFrequency!}
                        </option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="notes_for_client">Notes</Form.Label>
                    <textarea
                      className="form-control"
                      id="notes_for_client"
                      name="notes_for_client"
                      // placeholder="Customer see these!"
                      rows={3}
                      // value={sendResponse.notes_for_client}
                      value={currentMsg}
                      onChange={handleResponseMsgChange}
                    ></textarea>
                  </Col>
                  <Col lg={4} className="d-flex align-items-center">
                    <div className="form-check m-2">
                      <Form.Control
                        className="form-check-input"
                        type="checkbox"
                        id="formCheck1"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                    <Form.Label className="m-2" htmlFor="customerName-field">
                      Approved
                    </Form.Label>
                  </Col>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_Action();
                          setSendResponse(initialSendResponse);
                        }}
                        data-bs-dismiss="modal"
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        id="add-btn"
                        type="submit"
                        onClick={() => {
                          tog_Action();
                        }}
                      >
                        Send
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Modal.Body>
        </Modal>
        {/* Modal Display Notes  */}
        <Modal
          className="fade zoomIn"
          size="lg"
          show={openChatModal}
          onHide={() => {
            tog_OpenChatModal();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Chat
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            {/* <Form onSubmit={onSubmitSendResponse}>
              <Col lg={12} className="mb-2">
                <Form.Label htmlFor="notes_for_client">Notes</Form.Label>
                <textarea
                  className="form-control"
                  id="notes_for_client"
                  name="notes_for_client"
                  // placeholder="Customer see these!"
                  rows={3}
                  // value={sendResponse.notes_for_client}
                  value={currentMsg}
                  onChange={handleResponseMsgChange}
                ></textarea>
              </Col>
              <Col lg={12} className="mb-2">
                <Form.Label htmlFor="unit_price">Unit Price</Form.Label>
                <Form.Control
                  type="text"
                  name="unit_price"
                  id="unit_price"
                  placeholder="£ 00.00"
                  onChange={onChangeUnitPrice}
                  value={quoteUnitPrice}
                />
              </Col>
              <Col lg={12} className="mb-2">
                <Form.Label htmlFor="total_price">Total Price</Form.Label>
                <Form.Control
                  type="text"
                  name="total_price"
                  id="total_price"
                  placeholder="£ 00.00"
                  // onChange={onChangeUnitPrice}
                  defaultValue={contractTotalPrice}
                  readOnly
                />
              </Col>
              <Col lg={12} className="mb-2">
                <Form.Label htmlFor="within_payment_days">With Payment Days</Form.Label>
                <Form.Control
                  type="text"
                  name="within_payment_days"
                  id="within_payment_days"
                  placeholder="2"
                  onChange={onChangeSendResponse}
                  value={sendResponse.within_payment_days}
                />
              </Col>
              <Col lg={12}>
                <div className="mb-2">
                  <Form.Label htmlFor="invoiceFrequency">
                    Invoice Frequency
                  </Form.Label>
                  <select
                    className="form-select text-muted"
                    name="invoiceFrequency"
                    id="invoiceFrequency"
                    onChange={handleSelectInvoiceFrequency}
                  >
                    <option value="">Select</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi Weekly">Bi Weekly</option>
                    <option value="Third Weekly">Third Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <p>{selectedInvoiceFrequency}</p>
              </Col>
              <Col lg={4} className="d-flex align-items-center">
                <div className="form-check m-2">
                  <Form.Control
                    className="form-check-input"
                    type="checkbox"
                    id="formCheck1"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <Form.Label className="m-2" htmlFor="customerName-field">
                  Approved
                </Form.Label>
              </Col>
              <Col lg={12}>
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    className="btn-ghost-danger"
                    onClick={() => {
                      tog_Action();
                      setSendResponse(initialSendResponse);
                    }}
                    data-bs-dismiss="modal"
                  >
                    <i className="ri-close-line align-bottom me-1"></i> Close
                  </Button>
                  <Button
                    variant="primary"
                    id="add-btn"
                    type="submit"
                    onClick={() => {
                      tog_Action();
                    }}
                  >
                    Send
                  </Button>
                </div>
              </Col>
            </Form> */}
            {programLocation?.state?.notes_for_client!.map((notes: any) => (
              <Row>
                <Col
                  className={
                    "d-flex" +
                    (notes.sender === "Bouden Coach Travel"
                      ? " justify-content-end mb-2"
                      : " justify-content-start")
                  }
                >
                  <Card>
                    <Card.Header>
                      <h6>{notes.sender}</h6>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        className="mb-2"
                        type="text"
                        defaultValue={notes.msg}
                      />
                      <Form.Control type="text" defaultValue={notes.date} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ))}
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default ProgramList;
