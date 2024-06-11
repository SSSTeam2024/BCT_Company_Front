import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Collapse,
  Form,
  Modal,
  Row,
  Image,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { sellerGrid } from "Common/data";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import avatar1 from "assets/images/users/avatar-8.jpg";
import avatar2 from "assets/images/users/avatar-5.jpg";
import avatar3 from "assets/images/users/avatar-3.jpg";

import spinner1 from "assets/images/logo-sm.png";
import spinner2 from "assets/images/logo-sm.png";
import spinner3 from "assets/images/logo-sm.png";
import spinner4 from "assets/images/logo-sm.png";
import spinner5 from "assets/images/logo-sm.png";
import spinner6 from "assets/images/logo-sm.png";
import Success from "assets/images/success-img.png";

const Offers = () => {
  document.title = "Offers | Bouden Coach travel";

  // Pagination
  const [pagination, setPagination] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [currentpages, setCurrentpages] = useState<any>([]);
  const [col1, setCol1] = useState<boolean>(true);
  const [col2, setCol2] = useState<boolean>(true);
  const [col3, setCol3] = useState<boolean>(true);
  const [col4, setCol4] = useState<boolean>(true);
  const [col5, setCol5] = useState<boolean>(true);
  const [col6, setCol6] = useState<boolean>(true);
  const perPageData = 8;

  const handleClick = (e: any) => {
    setCurrentPage(Number(e.target.id));
  };

  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;

  const currentdata = useMemo(
    () => sellerGrid.slice(indexOfFirst, indexOfLast),
    [indexOfFirst, indexOfLast]
  );

  useEffect(() => {
    setCurrentpages(currentdata);
  }, [currentPage, currentdata]);

  const searchTeamMember = (ele: any) => {
    let search = ele.target.value;
    if (search) {
      search = search.toLowerCase();
      setCurrentpages(
        sellerGrid.filter((data: any) =>
          data.sellerName.toLowerCase().includes(search)
        )
      );
      setPagination(false);
    } else {
      setCurrentpages(currentdata);
      setPagination(true);
    }
  };

  const pageNumbers: any = [];
  for (let i = 1; i <= Math.ceil(sellerGrid.length / perPageData); i++) {
    pageNumbers.push(i);
  }

  const handleprevPage = () => {
    let prevPage = currentPage - 1;
    setCurrentPage(prevPage);
  };

  const handlenextPage = () => {
    let nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    if (pageNumbers.length && pageNumbers.length < currentPage) {
      setCurrentPage(pageNumbers.length);
    }
  }, [currentPage, pageNumbers.length]);

  const [modal_AddSellerModals, setmodal_AddSellerModals] =
    useState<boolean>(false);

  function tog_AddSellerModals() {
    setmodal_AddSellerModals(!modal_AddSellerModals);
  }
  const [modal_AddShippingModals, setmodal_AddShippingModals] =
    useState<boolean>(false);

  function tog_AddShippingModals() {
    setmodal_AddShippingModals(!modal_AddShippingModals);
  }

  const [modal_successMessage, setmodal_successMessage] =
    useState<boolean>(false);
  function tog_successMessage() {
    setmodal_successMessage(!modal_successMessage);
  }

  const delthis = (id: any) => {
    document.getElementById(id)?.remove();
  };

  // Card Spinner
  const spinner = (id: any) => {
    document.getElementById(id)?.classList.remove("d-none");
    document.getElementById(id)?.classList.add("d-block");
    setTimeout(function () {
      document.getElementById(id)?.classList.remove("d-block");
      document.getElementById(id)?.classList.add("d-none");
    }, 3000);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Offers" pageTitle="Programming" />
          <Row className="mb-4">
            <Col xxl={12}>
              <Card className="text-center bg-primary border-0 mb-0">
                <Card.Body className="p-5">
                  <h4 className="text-white">Search for Best Offers</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={6} md={10} className="mx-auto">
              <form action="#!" className="mt-n4">
                <div className="seller-search-box position-relative">
                  <i className="ri-search-2-line position-absolute my-auto d-flex align-items-center"></i>
                  <input
                    type="text"
                    className="form-control rounded-pill border-0 shadow"
                    id="searchInputList"
                    autoComplete="off"
                    placeholder="Search for offers name..."
                    onChange={(e) => searchTeamMember(e)}
                  />
                  {/* <Button variant='soft-danger' className="fw-normal position-absolute rounded-pill"><i className="ri-map-pin-2-line align-bottom me-1"></i> Germany</Button> */}
                </div>
              </form>
            </Col>
          </Row>

          <Row className="mb-4 justify-content-between">
            {/* <Col xxl={2} sm={6}>
                            <Button onClick={() => tog_AddSellerModals()} variant='success' data-bs-toggle="modal" data-bs-target="#createModal">Add Seller</Button>
                        </Col> */}
            <Col xxl={2} sm={6}>
              <select
                className="form-select mt-3 mt-sm-0"
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
          </Row>

          <Row>
            <Col xl={4} id="card-none5">
              <Card>
                <Card.Header>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="card-title mb-0">
                        <i className="ri-gift-line align-middle me-1 lh-1"></i>{" "}
                        Bus Services for Company Event
                      </h6>
                    </div>
                    <div className="flex-shrink-0">
                      <ul className="list-inline card-toolbar-menu d-flex align-items-center mb-0">
                        <li className="list-inline-item">
                          <Link
                            className="align-middle minimize-card"
                            to="#"
                            onClick={() => setCol5(!col5)}
                          >
                            <i className="mdi mdi-minus align-middle minus"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card.Header>
                <Collapse in={col5} className="card-body">
                  <div id="example-collapse-text">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        Duration: Full Day (up to 8 hours)
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        Price: £200
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        Prices include fuel, driver's fee, and VAT.
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        All buses are equipped with air conditioning,
                        comfortable seating, and modern amenities.
                      </div>
                    </div>
                  </div>
                </Collapse>
                <div className="card-footer">
                  <Link
                    to="#"
                    className="link-success float-end"
                    style={{ paddingTop: "10px" }}
                    onClick={() => tog_AddShippingModals()}
                  >
                    Book{" "}
                    <i className="ri-arrow-right-s-line align-middle ms-1 lh-1  "></i>
                  </Link>
                  {/* <button type="button" className="btn btn-secondary fs-12">
                    Add Comment
                  </button> */}
                </div>
              </Card>
            </Col>

            <Col xl={4} id="card-none6">
              <Card>
                <Card.Header>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="card-title mb-0">
                        <i className="ri-gift-line align-middle me-1 lh-1"></i>{" "}
                        Holidays Activities
                      </h6>
                    </div>
                    <div className="flex-shrink-0">
                      <ul className="list-inline card-toolbar-menu d-flex align-items-center mb-0">
                        <li className="list-inline-item">
                          <Link
                            className="align-middle minimize-card"
                            to="#"
                            onClick={() => setCol6(!col6)}
                          >
                            <i className="mdi mdi-minus align-middle minus"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="card-preloader d-none" id="spinner6">
                      <div className="card-status">
                        <img
                          src={spinner6}
                          alt=""
                          className="img-fluid custom-loader"
                        />
                      </div>
                    </div>
                  </div>
                </Card.Header>
                <Collapse in={col6} className="card-body">
                  <div id="example-collapse-text">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        Duration: Up to 6 hours
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        Price: £250
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        Prices cover fuel, a professional driver, and onboard
                        amenities.
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        Advanced booking requires a 25% deposit.
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <div className="flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-success"></i>
                      </div>
                      <div className="flex-grow-1 ms-2 text-muted">
                        All buses are equipped with Wi-Fi, comfortable seating,
                        and climate control.
                      </div>
                    </div>
                  </div>
                </Collapse>
                <div className="card-footer">
                  <Link
                    to="#"
                    className="link-success float-end"
                    style={{ paddingTop: "10px" }}
                    onClick={() => tog_AddShippingModals()}
                  >
                    Book{" "}
                    <i className="ri-arrow-right-s-line align-middle ms-1 lh-1  "></i>
                  </Link>
                  {/* <button
                    type="button"
                   
                    className="btn btn-secondary fs-12"
                  >
                    Add Comment
                  </button> */}
                </div>
              </Card>
            </Col>
          </Row>

          {/*Comment Modal*/}
          <Modal
            className="fade zoomIn"
            size="lg"
            show={modal_AddShippingModals}
            onHide={() => {
              tog_AddShippingModals();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                GET YOUR OFFER
              </h5>
            </Modal.Header>

            <Modal.Body className="p-4">
              <div
                id="alert-error-msg"
                className="d-none alert alert-danger py-2"
              ></div>
              <Form className="tablelist-form">
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={6}>
                    <div>
                      <Form.Label className="form-label mb-0">
                        Select Date
                      </Form.Label>
                      <Flatpickr
                        className="form-control"
                        options={{
                          dateFormat: "d M, Y",
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div >
                      <Form.Label className="form-label mb-0">
                        Select Time
                      </Form.Label>
                      <Flatpickr
                        className="form-control"
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          // inline: true,
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Label htmlFor="comment-field">
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        id="comment-field"
                        placeholder="Add Comment..."
                        required
                      />
                    </div>
                  </Col>

                  <Col lg={12}>
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
                      <Button
                        variant="primary"
                        id="add-btn"
                        onClick={() => tog_successMessage()}
                      >
                       + Add
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
          {/* Success Message */}

          <Modal
            id="success-Payment"
            tabIndex="-1"
            show={modal_successMessage}
            onHide={() => {
              tog_successMessage();
            }}
            centered
          >
            <Modal.Body className="text-center p-5">
              <div className="text-end">
                <button
                  type="button"
                  onClick={() => {
                    tog_successMessage();
                  }}
                  className="btn-close text-end"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="mt-2">
                <img
                  src={Success}
                  style={{ width: "150px", height: "150px" }}
                  alt=""
                ></img>
                {/* trigger="hover" */}
                <h4 className="mb-3 mt-4">
                  Your Comment is Successfully Added !
                </h4>
                <p className="text-muted fs-15 mb-4">
                  Successful transaction is the status of operation whose result
                  is the payment of the amount paid by the customer in favor of
                  the merchant.
                </p>
              </div>
            </Modal.Body>
          </Modal>

          {pagination && (
            <Row className="mb-4" id="pagination-element">
              <Col lg={12}>
                <div className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                  <div
                    className={
                      currentPage <= 1 ? "page-item disabled" : "page-item"
                    }
                  >
                    <Button
                      variant="link"
                      href="#"
                      className="page-link"
                      id="page-prev"
                      onClick={() => handleprevPage()}
                    >
                      <i className="mdi mdi-chevron-left" />
                    </Button>
                  </div>
                  <span id="page-num" className="pagination">
                    {pageNumbers.map((item: any, key: any) => (
                      <React.Fragment key={key}>
                        <div
                          className={
                            currentPage === item
                              ? "page-item active"
                              : "page-item"
                          }
                        >
                          <Link
                            className="page-link clickPageNumber"
                            to="#"
                            key={key}
                            id={item}
                            onClick={(e) => handleClick(e)}
                          >
                            {item}
                          </Link>
                        </div>
                      </React.Fragment>
                    ))}
                  </span>
                  <div
                    className={
                      currentPage >= pageNumbers.length
                        ? "page-item disabled"
                        : "page-item"
                    }
                  >
                    <Button
                      variant="link"
                      href="#"
                      className="page-link"
                      id="page-next"
                      onClick={() => handlenextPage()}
                    >
                      <i className="mdi mdi-chevron-right" />
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Offers;