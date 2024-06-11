import React, { useState } from "react";
import { Container, Row, Card, Col, Button, Offcanvas } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import offerbanner from "../../assets/images/ecommerce/offer-banner.jpg";

const Payement = () => {
  document.title = "Payement | School Administration";
  const [showCoupons, setShowCoupons] = useState<boolean>(false);
  const [showCouponDetails, setShowCouponsDetails] = useState<any>({});

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Invoice Number</span>,
      selector: (row: any) => row.invoiceId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">ID Contract</span>,
      selector: (row: any) => row.contractId,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">ID Offer</span>,
      selector: (row: any) => row.offerId,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">ID ExtraTrip</span>,
      selector: (row: any) => row.extratripId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Edition Date</span>,
      selector: (row: any) => row.editionDate,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Due Date</span>,
      selector: (row: any) => row.dueDate,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.status) {
          case "UnPaid":
            return (
              <span className="badge badge-soft-danger"> {cell.status} </span>
            );
          case "Paid":
            return (
              <span className="badge badge-soft-success"> {cell.status} </span>
            );
        }
      },
    },

    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,

      cell: (cellProps: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#couponDetails"
                data-bs-toggle="offcanvas"
                className="badge bg-dark-subtle text-body view-item-btn"
                onClick={() => {
                  setShowCouponsDetails(cellProps);
                  setShowCoupons(!showCoupons);
                }}
              >
                <i className="ph ph-eye" style={{ fontSize: "14px" }}></i>
              </Link>
            </li>
            <li>
              <Link
                to="#showModal"
                className="badge bg-primary-subtle text-primary edit-item-btn"
                data-bs-toggle="modal"
              >
                <i className="ph ph-file-pdf" style={{ fontSize: "14px" }}></i>
              </Link>
            </li>
            <li>
              <Link
                to="#deleteModal"
                data-bs-toggle="modal"
                className="badge bg-secondary-subtle text-secondary remove-item-btn"
              >
                <i
                  className="ph ph-credit-card"
                  style={{ fontSize: "14px" }}
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const data1 = [
    {
      invoiceId: "01",
      contractId: "VLZ-452",
      offerId: "VLZ1400087402",
      extratripId: "VLZ140757575",
      editionDate: "Dec 28 2023",
      dueDate: "Jan 28 2024",
      status: "Paid",
    },
    {
    invoiceId: "02",
    contractId: "VLZ-453",
    offerId: "VLZ1400087425",
    extratripId: "VLZ140757577",
    editionDate: "Jan 24 2023",
    dueDate: " Jan 30   2023 ",
      status: "Paid",
    },
    {
        invoiceId: "03",
        contractId: "VLZ-454",
        offerId: "VLZ140006544",
        extratripId: "VLZ140757578",
        editionDate: "Feb 01 2023",
        dueDate: "Feb 28 2023",
      status: "UnPaid",
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Operations Management" pageTitle="Programming " />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col xxl={3} lg={6}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for a job ..."
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
                  <Col xxl={2} lg={6}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                    >
                      <option value="">Pay Status</option>
                      <option value="Paused">Paid</option>
                      <option value="Pending">Unpaid</option>
                    </select>
                  </Col>
                  <Col xxl={2} lg={6}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                    >
                      <option value="">Status</option>
                      <option defaultValue="all">All</option>
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="This Month">This Month</option>
                      <option value="Last Month">Last Month</option>
                    </select>
                  </Col>
                  <Col xxl={2} lg={6}>
                    <Button variant="primary" type="button" className="w-100">
                      Filters
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={data1} pagination />
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>

      <Offcanvas
        show={showCoupons}
        onHide={() => setShowCoupons(!showCoupons)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Payment details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* <div>
                        <img src={offerbanner} alt="" className="img-thumbnail" />
                    </div> */}
          <div className="mt-3">
            <div className="table-responsive">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>
                      <span className="text-muted">Invoice Number</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showCouponDetails.invoiceId}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">ID Contract</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.contractId}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">ID Offer</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.offerId}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="text-muted">Edition Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.editionDate}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Due Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.dueDate}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="text-muted">Status</span>
                    </td>
                    <td>
                      <span
                        className={
                          showCouponDetails.status === "Unpaid"
                            ? "badge bg-danger-subtle text-danger text-uppercase"
                            : "badge bg-success-subtle text-success text-uppercase"
                        }
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
export default Payement;