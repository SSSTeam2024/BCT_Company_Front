import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";

// Import Images
import logo from "assets/images/logo-sm.jpg";
import logoLight from "assets/images/logo-light.png";
import { Link, useLocation } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import { Quote, useGetQuoteByIdScheduleQuery } from "features/quote/quoteSlice";
import "./ContractDetails.css";
import ReactToPrint from "react-to-print";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { RootState } from "app/store";
interface JourneyType {
  type: string;
}
interface LuggageType {
  size: string;
  description: string;
}
interface VehicleType {
  base_change: string;
  type: string;
}
const ContractDetails: React.FC = () => {
  document.title = "Contract Details | Company Administration";
  const [journeyType, setJourneyType] = useState<JourneyType | null>(null);
  const [luggage, setLuggage] = useState<LuggageType | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const location = useLocation();
  const contract = location.state;

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data = [] } = useGetQuoteByIdScheduleQuery({
    id_schedule: contract?.idProgram?._id!,
  });
  console.log("qutoe", data);
  const printInvoice = () => {
    window.print();
  };

  const ownerSignatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const clientSignatureCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ownerCanvas = ownerSignatureCanvasRef.current;
    const clientCanvas = clientSignatureCanvasRef.current;
    if (ownerCanvas) {
      const ctx = ownerCanvas.getContext("2d");
      if (ctx) {
        ctx.font = "14px Arial";
        ctx.fillText("Service Provider Signature", 10, 20);
        ctx.fillText("Name: Bouden Coach Travel", 10, 60);
        // ctx.fillText("Legal status: Legal", 10, 80);
      }
    }
    if (clientCanvas && user) {
      const ctx = clientCanvas.getContext("2d");
      if (ctx) {
        ctx.font = "14px Arial";
        ctx.fillText("Client Signature", 10, 20);
        ctx.fillText(`Name: ${user.name}`, 10, 60);
        // ctx.fillText(`Legal Status: ${user.legal_status}`, 10, 80);
      }
    }
  }, [contract]);

  const columns = useMemo(
    () => [
      {
        Header: "No",
        disableFilters: true,
        filterable: true,
        accessor: "id", // Assuming this is the unique identifier for each entry
      },
      {
        Header: "Date",
        accessor: "createdAt", // Assuming this is the date field
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Origin",
        accessor: "start_point.placeName", // Assuming start_point contains placeName for origin
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Pick Up",
        accessor: "estimated_start_time", // Assuming this is the estimated start time
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Destination",
        accessor: "destination_point.placeName", // Assuming destination_point contains placeName for destination
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Drop Off",
        accessor: "estimated_return_start_time", // Assuming this is the estimated return start time
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Stops",
        accessor: "mid_stations.length", // Assuming mid_stations is an array and you want the count of stops
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Price",
        accessor: "automatic_cost", // Assuming this is the automatic cost
        disableFilters: true,
        filterable: true,
      },
    ],
    []
  );

  const Status = ({ status }: any) => {
    switch (status) {
      case "Approved":
        return (
          <span className="badge bg-success-subtle text-success">
            {" "}
            {status}
          </span>
        );
      case "Pending":
        return (
          <span className="badge bg-danger-subtle text-danger"> {status}</span>
        );
      case "Answered By Client":
        return (
          <span className="badge bg-primary-subtle text-primary">
            {" "}
            {status}
          </span>
        );
      default:
        return (
          <span className="badge bg-success-subtle text-success">{status}</span>
        );
    }
  };

  const componentRef = useRef();

  function generateContractNumber(length: any) {
    const characters = "0123456789";
    let contractNumber = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      contractNumber += characters[randomIndex];
    }

    return contractNumber;
  }

  const contractNo = generateContractNumber(6);
  console.log(contractNo);

  async function fetchJourneyTypeById(id: string): Promise<JourneyType> {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/journey/getJourney/${id}`
    );
    const data = await response.json();
    return data;
  }
  async function fetchLuggageById(id: string): Promise<LuggageType> {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/luggage/getLuggage/${id}`
    );
    const data = await response.json();
    return data;
  }
  async function fetchVehicleTypeById(id: string): Promise<VehicleType> {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/vehicleType/getVehiclesType/${id}`
    );
    const data = await response.json();
    return data;
  }
  useEffect(() => {
    if (contract?.idProgram?.journeyType) {
      fetchJourneyTypeById(contract.idProgram.journeyType)
        .then((data) => setJourneyType(data))
        .catch((error) => console.error("Error fetching journey type:", error));
    }
    if (contract?.idProgram?.luggage) {
      fetchLuggageById(contract.idProgram.luggage)
        .then((data) => setLuggage(data))
        .catch((error) => console.error("Error fetching Luggage:", error));
    }
    if (contract?.idProgram?.vehiculeType) {
      fetchVehicleTypeById(contract.idProgram.vehiculeType)
        .then((data) => setVehicleType(data))
        .catch((error) => console.error("Error fetching Luggage:", error));
    }
  }, [contract]);
  let badgeClass = "";
  let textColorClass = "";

  if (contract.contractStatus === "Approved") {
    badgeClass = "bg-success";
    textColorClass = "#FFFFFF";
  } else if (contract.contractStatus === "Pending") {
    badgeClass = "bg-danger";
    textColorClass = "#FFFFFF";
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Contract Details" pageTitle="Contracts" />

          <Row className="justify-content-center">
            <Col xxl={9} ref={componentRef}>
              <Card id="demo">
                <Row>
                  <Col lg={12}>
                    <Card.Header className="border-bottom-dashed p-4 ">
                      <div className="d-flex justify-content-between">
                        <div>
                          <img
                            src={logo}
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height="40"
                          />
                          <img
                            src={logoLight}
                            className="card-logo card-logo-light"
                            alt="logo light"
                            height="90"
                          />
                        </div>
                        <div>
                          <h5 className="d-flex justify-content-center title-center">
                            Transportation Services Agreement
                          </h5>
                        </div>
                        <div className="website">
                          <h6 className="mb-0">
                            <span id="email">Bouden Coach Travel</span>
                          </h6>
                          <h6 className="mb-0">
                            <span className="text-muted fw-normal">
                              <i className="ph ph-phone"></i>
                            </span>
                            <span className="text-muted"> 0800 112 3770</span>
                          </h6>
                          <h6 className="mb-0">
                            <span className="text-muted fw-normal">
                              <i className="ph ph-globe"></i>
                            </span>{" "}
                            <Link
                              to="https://www.boudencoachtravel.co.uk/"
                              className="link-primary"
                              target="_blank"
                              id="website"
                            >
                              www.boudencoachtravel.co.uk
                            </Link>
                          </h6>

                          <h6 className="mb-0">
                            <span className="text-muted fw-normal">
                              <i className="ph ph-envelope-simple"></i>
                            </span>
                            <span className="text-muted">
                              sales@boudencoachtravel.co.uk
                            </span>
                          </h6>
                        </div>
                      </div>
                    </Card.Header>
                  </Col>
                  <Col lg={12}>
                    <Card.Body className="p-4">
                      <h4 className="d-flex justify-content-center title-center">
                        Between Bouden Coach Travel Ltd (Service Provider) and{" "}
                        {user.name}
                      </h4>
                      <div className="mt-3 border-top border-top-dashed"></div>
                    </Card.Body>
                  </Col>
                  <Col lg={12}>
                    <Card.Body className="p-4">
                      <Row className="g-3">
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-14">
                            Contract No
                          </p>
                          <h5 className="fs-15 mb-0">
                            {contract?.contractRef!}
                            <span id="invoice-no"></span>
                          </h5>
                        </Col>
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-14">
                            Start Date
                          </p>
                          <h5 className="fs-15 mb-0">
                            <span id="invoice-date">
                              {contract?.idProgram?.pickUp_date!}
                            </span>{" "}
                          </h5>
                        </Col>

                        <Col lg={2} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-14">
                            Contract Status
                          </p>
                          <span
                            className={`badge ${badgeClass} ${textColorClass}`}
                            id="payment-status"
                          >
                            {contract.contractStatus}
                          </span>
                        </Col>
                        <Col lg={2} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-14">
                            Billing Frequency
                          </p>
                          <span
                            className="badge bg-info-subtle text-info"
                            id="payment-status"
                          >
                            {contract.invoiceFrequency}
                          </span>
                        </Col>
                        <Col lg={2} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-14">
                            Total Amount
                          </p>
                          <h5 className="fs-15 mb-0">
                            £<span id="total-amount">{contract.prices}</span>
                          </h5>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>
                  <Col lg={12}>
                    <Card.Body className="p-4 border-top border-top-dashed">
                      <Row className="g-3">
                        {/* <Col className="col-6">
                          <h6 className="text-muted text-uppercase fw-semibold fs-14 mb-3">
                            CLIENT INFORMATION
                          </h6>
                          <p className="fw-medium mb-2 fs-16" id="billing-name">
                            {user.name}{" "}
                          </p>

                          <p className="text-muted mb-1">
                            <span>Phone:</span>
                            <span id="billing-phone-no">{user.phone}</span>
                          </p>
                          <p className="text-muted mb-0">
                            <span>Email: </span>
                            <span id="billing-tax-no">{user.email}</span>{" "}
                          </p>

                          <p className="text-muted mb-1">
                            <span>Address Location </span>
                            <span id="billing-tax-no">{user.address}</span>
                          </p>
                        </Col>

                        <Col className="col-6">
                          <h6 className="text-muted text-uppercase fw-semibold fs-14 mb-3">
                            SERVICE PROVIDER INFORMATION
                          </h6>
                          <p className="fw-medium mb-2 fs-16" id="billing-name">
                            Bouden Coach Travel
                          </p>
                          <p className="text-muted mb-0">
                            <span>Email: </span>
                            <span id="billing-tax-no">
                              sales@boudencoachtravel.co.uk
                            </span>{" "}
                          </p>
                          <p className="text-muted mb-1">
                            <span>Phone:</span>
                            <span id="billing-phone-no"> +44 800 112 3770</span>
                          </p>

                          <p className="text-muted mb-1">
                            <span>Address Location: </span>
                            <span id="billing-tax-no">
                              Unit 18 Haywards Industrial Park, Orton Way,
                              Birmingham B35 7BT
                            </span>
                          </p>
                        </Col> */}
                        <Col lg={12}>
                          <h5>1. Introduction </h5>
                          <p
                            className=" text-muted fw-medium mb-2 fs-16"
                            id="billing-name"
                          >
                            This Transportation Services Agreement (“Agreement”)
                            is entered into between Bouden Coach Travel Ltd, a
                            company registered at Unit 18 Haywards Industrial
                            Park, Orton Way, Birmingham B35 7BT , here in after
                            referred to as the “Service Provider,” and{" "}
                            {user.name}, a {user.activity} with registered
                            address at {user.address}, here in after referred to
                            as the “Client.”
                          </p>

                          <h5>2. Scope of Services </h5>
                          <p
                            className="text-muted fw-medium mb-2 fs-16"
                            id="billing-name"
                          >
                            The Service Provider agrees to provide ground
                            transportation services to the Client. The scope of
                            services includes but is not limited to:
                            <ul>
                              <li>
                                <strong> Journey Type: </strong>
                                {journeyType ? journeyType.type : "Loading..."}
                              </li>

                              <li>
                                <strong>Luggage Details: </strong>
                                <ul>
                                  Description :
                                  {luggage ? luggage.description : "Loading..."}{" "}
                                </ul>
                                <ul>
                                  Size :{luggage ? luggage.size : "Loading..."}{" "}
                                </ul>
                              </li>

                              <li>
                                <strong>Passengers: </strong>
                                {contract?.idProgram?.recommanded_capacity!}
                              </li>
                              <li>
                                <strong>Vehicle Options:</strong>
                                <ul>
                                  <li>
                                    Vehicle Type:{" "}
                                    {vehicleType
                                      ? vehicleType.type
                                      : "Loading..."}{" "}
                                  </li>
                                  {/* <li>
                                    Coverage Mile:{" "}
                                    {contract.vehicleType &&
                                      contract.vehicleType.coverage_mile}
                                  </li> */}
                                  <li>
                                    Base Charge:{" "}
                                    {vehicleType
                                      ? vehicleType.base_change
                                      : "Loading..."}{" "}
                                  </li>
                                </ul>
                              </li>
                              <li>
                                <strong>Limitations or Exclusions:</strong>
                                <ul>
                                  <li>Extra: {contract.idProgram?.extra!}</li>
                                  <li>
                                    Except Days:{" "}
                                    {contract.idProgram?.exceptDays!}
                                  </li>
                                  <li>
                                    Client Note: {contract.idProgram?.note!}
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </p>
                          <div>
                            <section>
                              <h5>3. Service Standards and Responsibilities</h5>
                              <p className="text-muted fw-medium mb-2 fs-16">
                                <b>3.1 Service Provider's Responsibilities</b>
                                <ul>
                                  <li>
                                    Maintain a fleet of well-maintained
                                    vehicles.
                                  </li>
                                  <li>
                                    Ensure all drivers are licensed, trained,
                                    and professional.
                                  </li>
                                  <li>
                                    Adhere to safety regulations and legal
                                    requirements.
                                  </li>
                                  <li>
                                    Provide reliable and timely transportation.
                                  </li>
                                </ul>
                              </p>
                              <p className="text-muted fw-medium mb-2 fs-16">
                                <b>3.2 Client's Responsibilities</b>
                                <ul>
                                  <li>
                                    Provide accurate information for bookings.
                                  </li>
                                  <li>Adhere to pick-up times.</li>
                                  <li>
                                    Treat drivers and other passengers with
                                    respect.
                                  </li>
                                </ul>
                              </p>
                            </section>

                            <section>
                              <h5>4. Payment Terms</h5>
                              <p className="text-muted fw-medium mb-2 fs-16">
                                <b>4.1 Rates and Payment Structure</b>
                                <p>
                                  The Client agrees to pay the Service Provider
                                  according to the following rates: [Specify
                                  hourly rates, per trip rates, etc.].
                                  Additional charges will be billed separately.
                                </p>
                              </p>
                            </section>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>

                  <Col lg={12}>
                    <Card.Body className="p-4">
                      <div className="table-container">
                        <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                          <thead>
                            <tr className="table-active">
                              <th scope="col" style={{ width: "50px" }}>
                                #
                              </th>
                              {/* <th scope="col">Date</th> */}
                              <th scope="col">Origin</th>
                              <th scope="col">PickUp</th>
                              <th scope="col">Destination</th>
                              <th scope="col">DropOff</th>
                              <th scope="col">Stops</th>
                              <th scope="col">Price</th>
                            </tr>
                          </thead>
                          <tbody id="products-list">
                            {data.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                {/* <td className="text-start">
                                  {new Date(item.createdAt)
                                    .toLocaleString("en-US", {
                                      month: "2-digit",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                    .replace(",", "")}
                                </td> */}

                                <td>{item.start_point.placeName}</td>
                                <td>
                                  {item.date} at {item?.pickup_time}
                                </td>
                                <td>{item.destination_point.placeName}</td>
                                <td className="text-end">
                                  {item?.return_time}
                                </td>
                                <td className="text-end">
                                  {item.mid_stations.length}
                                </td>
                                <td>{item.manual_cost}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <div className="border-top border-top-dashed mt-2">
                        <Table
                          className="table-borderless table-nowrap align-middle mb-0 ms-auto"
                          style={{ width: "250px" }}
                        >
                          <tbody>
                            <tr>
                              <td>Sub Total</td>
                              <td className="text-end">
                                £ {contract?.subTotal!}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                VAT <small className="text-muted"></small>
                              </td>
                              <td className="text-end">£ {contract?.tva!}</td>
                            </tr>
                            <tr className="border-top border-top-dashed fs-15">
                              <th scope="row">Total Amount</th>
                              <th className="text-end">£ {contract.prices}</th>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                      <div className="mt-3">
                        <section>
                          <h3 className="text-muted fw-medium mb-2 fs-16">
                            4.2 Payment Due Dates
                          </h3>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            Payment is due within {contract.within_payment_days}{" "}
                            days from the date of service. Late payments may
                            incur additional fees.
                          </p>
                        </section>

                        <section>
                          <h5>5. Rights and Obligations</h5>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            <b>5.1 Service Provider's Rights</b>
                            <br />
                            The Service Provider reserves the right to:
                            <ul>
                              <li>
                                Refuse service if safety or legal requirements
                                are not met.
                              </li>
                              <li>
                                Terminate this Agreement for non-payment or
                                breach of terms.
                              </li>
                            </ul>
                          </p>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            <b>5.2 Client’s Rights</b>
                            <br />
                            The Client has the right to:
                            <ul>
                              <li>Expect timely and professional service.</li>
                              <li>
                                Dispute charges or report issues promptly.
                              </li>
                            </ul>
                          </p>
                        </section>

                        <section>
                          <h5>6. Termination and Cancellation</h5>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            Either party may terminate this Agreement with 30
                            days' written notice.
                          </p>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            Cancellation within 48 hours of the scheduled
                            service may incur a fee.
                          </p>
                        </section>

                        <section>
                          <h5>7. Confidentiality and Data Protection</h5>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            Either party may terminate this Agreement with 30
                            days' written notice.
                          </p>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            Cancellation within 48 hours of the scheduled
                            service may incur a fee.
                          </p>
                        </section>

                        <section>
                          <h5>8. Insurance and Liability</h5>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            The Service Provider shall maintain insurance
                            coverage for vehicles, passengers, and third
                            parties.
                          </p>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            Liability limits and responsibilities in case of
                            accidents or damages are as follows: [Specify
                            details]
                          </p>
                        </section>

                        <section>
                          <h5>9. Dispute Resolution</h5>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            Any disputes arising from this Agreement shall be
                            resolved through negotiation, mediation, or
                            arbitration.
                          </p>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            The governing law shall be [Applicable Law], and the
                            jurisdiction shall be [Jurisdiction].
                          </p>
                        </section>

                        <section>
                          <h5>Signatures and Effective Date</h5>
                          <p className="text-muted fw-medium mb-2 fs-16">
                            This Agreement shall be effective as of{" "}
                            {contract.effectiveDate}.
                          </p>
                        </section>
                      </div>

                      {/* <div className="mt-3">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          Payment Details:
                        </h6>
                        <p className="text-muted mb-1">
                          Payment Method:{" "}
                          <span className="fw-medium" id="payment-method">
                            Mastercard
                          </span>
                        </p>
                        <p className="text-muted mb-1">
                          Card Holder:{" "}
                          <span className="fw-medium" id="card-holder-name">
                            David Nichols
                          </span>
                        </p>
                        <p className="text-muted mb-1">
                          Card Number:{" "}
                          <span className="fw-medium" id="card-number">
                            xxx xxxx xxxx 1234
                          </span>
                        </p>
                        <p className="text-muted">
                          Total Amount: <span className="fw-medium">$ </span>
                          <span id="card-total-amount">1406.92</span>
                        </p>
                      </div> */}
                      {/* <div className="mt-4">
                                                <div className="alert alert-info">
                                                    <p className="mb-0"><span className="fw-semibold">NOTES:</span>
                                                        <span id="note"> All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or
                                                            credit card or direct payment online. If account is not paid within 7
                                                            days the credits details supplied as confirmation of work undertaken
                                                            will be charged the agreed quoted fee noted above.
                                                        </span>
                                                    </p>
                                                </div>
                                            </div> */}

                      <div className="print-container d-flex justify-content-between mt-4">
                        <div className="canvas-container">
                          <canvas
                            ref={ownerSignatureCanvasRef}
                            width={300}
                            height={200}
                          ></canvas>
                        </div>
                        <div className="canvas-container">
                          <canvas
                            ref={clientSignatureCanvasRef}
                            width={300}
                            height={200}
                          ></canvas>
                        </div>
                      </div>

                      <div className="hstack gap-2 justify-content-end d-print-none mt-4 print-button">
                        <ReactToPrint
                          trigger={() => (
                            <button className="btn btn-success">
                              <i className="ri-printer-line align-bottom me-1"></i>{" "}
                              Print
                            </button>
                          )}
                          content={() => componentRef.current ?? null} // Ensure componentRef.current is not undefined
                        />
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ContractDetails;
