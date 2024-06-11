import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Breadcrumb from 'Common/BreadCrumb';
import TableContainer from "Common/TableContainer";
import { transaction } from "Common/data";
import { Link } from 'react-router-dom';
import Flatpickr from "react-flatpickr";

import americanExpress from "../../..//assets/images/ecommerce/payment/american-express.png";
import discover from "../../../assets/images/ecommerce/payment/discover.png";
import paypal from "../../../assets/images/ecommerce/payment/paypal.png";
import visa from "../../../assets/images/ecommerce/payment/visa.png";

// const CardType = ({ paymentMethod }: any) => {
//     switch (paymentMethod) {
//         case "American Express":
//             return (<img src={americanExpress} alt="" className="avatar-xs object-fit-cover paycard-image" />)
//         case "Discover":
//             return (<img src={discover} alt="" className="avatar-xs object-fit-cover paycard-image" />)
//         case "PayPal":
//             return (<img src={paypal} alt="" className="avatar-xs object-fit-cover paycard-image" />)
//         case "Visa Credit/Debit":
//             return (<img src={visa} alt="" className="avatar-xs object-fit-cover paycard-image" />)
//         default:
//             return (<img src={americanExpress} alt="" className="avatar-xs object-fit-cover paycard-image" />)
//     }
// }

const Status = ({ status }: any) => {
    switch (status) {
        case "Successful":
            return (<span className="badge bg-success-subtle text-success"> {status}</span>)
        case "Denied":
            return (<span className="badge bg-danger-subtle text-danger"> {status}</span>)
        case "Pending":
            return (<span className="badge bg-warning-subtle text-warning"> {status}</span>)
        default:
            return (<span className="badge bg-success-subtle text-success"> Successful </span>)
    }
}

const Transactions = () => {

    document.title = "Claim Management | Bouden Coach Travel";

    const [paymentDetails, setPaymentDetails] = useState<any>({})

    const columns = useMemo(
        () => [
            {
                Header: "Type",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    switch (cellProps.type) {
                        case "up":
                            return (<i className="bx bx-trending-up align-middle text-success" />)
                        case "down":
                            return (<i className="bx bx-trending-down align-middle text-danger" />)
                        default:
                            return (<i className="bx bx-trending-up align-middle text-success" />)
                    }
                },
            },
            {
                Header: "Claim ID",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    return (
                        <Link to="#" className="fw-medium">{cellProps.transactionID}</Link>
                    )
                }
            },
            {
                Header: "Claim Title",
                accessor: "amount",
                disableFilters: true,
                filterable: true,
            },
            // {
            //     Header: "Payment Method",
            //     disableFilters: true,
            //     filterable: true,
            //     accessor: (cellProps: any) => {
            //         switch (cellProps.paymentMethod) {
            //             case "American Express":
            //                 return (<div className="d-flex align-items-center gap-2">
            //                     <div className="flex-shrink-0">
            //                         <img src={americanExpress} alt="" className="avatar-xs object-fit-cover paycard-image" />
            //                     </div>
            //                     <div className="flex-grow-1">
            //                         <h6 className="mb-0 paycard">{cellProps.paymentMethod}</h6>
            //                     </div>
            //                 </div>)
            //             case "Discover":
            //                 return (<div className="d-flex align-items-center gap-2">
            //                     <div className="flex-shrink-0">
            //                         <img src={discover} alt="" className="avatar-xs object-fit-cover paycard-image" />
            //                     </div>
            //                     <div className="flex-grow-1">
            //                         <h6 className="mb-0 paycard">{cellProps.paymentMethod}</h6>
            //                     </div>
            //                 </div>)
            //             case "PayPal":
            //                 return (<div className="d-flex align-items-center gap-2">
            //                     <div className="flex-shrink-0">
            //                         <img src={paypal} alt="" className="avatar-xs object-fit-cover paycard-image" />
            //                     </div>
            //                     <div className="flex-grow-1">
            //                         <h6 className="mb-0 paycard">{cellProps.paymentMethod}</h6>
            //                     </div>
            //                 </div>)
            //             case "Visa Credit/Debit":
            //                 return (<div className="d-flex align-items-center gap-2">
            //                     <div className="flex-shrink-0">
            //                         <img src={visa} alt="" className="avatar-xs object-fit-cover paycard-image" />
            //                     </div>
            //                     <div className="flex-grow-1">
            //                         <h6 className="mb-0 paycard">{cellProps.paymentMethod}</h6>
            //                     </div>
            //                 </div>)
            //             default:
            //                 return (<div className="d-flex align-items-center gap-2">
            //                     <div className="flex-shrink-0">
            //                         <img src={americanExpress} alt="" className="avatar-xs object-fit-cover paycard-image" />
            //                     </div>
            //                     <div className="flex-grow-1">
            //                         <h6 className="mb-0 paycard">{cellProps.paymentMethod}</h6>
            //                     </div>
            //                 </div>)
            //         }
            //     },
            // },
            {
                Header: "Date",
                accessor: "transactionDate",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "Status",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    switch (cellProps.status) {
                        case "Successful":
                            return (<span className="badge bg-success-subtle text-success"> {cellProps.status}</span>)
                        case "Denied":
                            return (<span className="badge bg-danger-subtle text-danger"> {cellProps.status}</span>)
                        case "Pending":
                            return (<span className="badge bg-warning-subtle text-warning"> {cellProps.status}</span>)
                        default:
                            return (<span className="badge bg-success-subtle text-success"> {cellProps.status}</span>)
                    }
                },
            },
            {
                Header: "Action",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    return (
                        <Link to="#" className="link-dark text-decoration-underline view-item-btn" onClick={() => setPaymentDetails(cellProps)}>View Details</Link>
                    )
                },
            },
        ],
        []
    );

    const [modal_AddTransactionsModals, setmodal_AddTransactionsModals] = useState<boolean>(false);
    function tog_AddTransactionsModals() {
        setmodal_AddTransactionsModals(!modal_AddTransactionsModals);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumb title="Claim" pageTitle="Claim Management" />

                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <Card.Body>
                                    <Row className="gy-3">
                                        <Col xxl={4} md={6}>
                                            <div className="search-box">
                                                <Form.Control type="text" className="search" placeholder="Search..." />
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                        </Col>
                                        <Col xxl={3} md={6}>
                                            <Flatpickr
                                                className="form-control flatpickr-input"
                                                placeholder='Select Date'
                                                options={{
                                                    mode: "range",
                                                    dateFormat: "d M, Y",
                                                }}
                                            />
                                        </Col>
                                        <Col xxl={2} lg={12}>
                                            <select className="form-select" data-choices data-choices-search-false name="choices-single-default" id="idStatus">
                                                <option value="all">All</option>
                                                <option value="Successful">Successful</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Denied">Denied</option>
                                            </select>
                                        </Col>
                                        <Col xxl={3}>
                                            <div className="hstack gap-2">
                                                <Button variant='soft-success' type="button" className="w-100">Filters</Button>
                                                <Button variant='primary' onClick={() => tog_AddTransactionsModals()} className="w-100"><i className="bi bi-plus-circle me-1 align-middle"></i> Send Claim</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={9}>
                            <Card>
                                <Card.Body className='p-0'>
                                    {/* <div className="table-responsive table-card"> */}
                                        <TableContainer
                                            columns={(columns || [])}
                                            data={(transaction || [])}
                                            // isGlobalFilter={false}
                                            iscustomPageSize={false}
                                            isBordered={false}
                                            customPageSize={10}
                                            className="custom-header-css table align-middle table-nowrap"
                                            tableClass="table-centered align-middle table-nowrap mb-0"
                                            // theadClass="text-muted table-light"
                                            SearchPlaceholder='Search Products...'
                                        />
                                        <div className="noresult" style={{ display: "none" }}>
                                            <div className="text-center py-4">
                                                <div className="avatar-md mx-auto mb-4">
                                                    <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                                                        <i className="bi bi-search"></i>
                                                    </div>
                                                </div>
                                                <h5 className="mt-2">Sorry! No Result Found</h5>
                                                <p className="text-muted mb-0">We've searched more than 150+ transactions We did not find any transactions for you search.</p>
                                            </div>
                                        </div>
                                    {/* </div> */}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card>
                                <Card.Header className="d-flex">
                                    <h5 className="card-title flex-grow-1 mb-0">Claim Details.</h5>
                                    <div className="flex-shrink-0">
                                        <button type="button" className="btn-close" aria-label="Close"></button>
                                    </div>
                                </Card.Header>
                                <Card.Body id="transactionDetails">
                                    <div className="table-responsive table-card">
                                        <table className="table table-borderless align-middle">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Claim ID</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold">{paymentDetails.transactionID || "#TBSC320002830"}</span>
                                                    </td>
                                                </tr>
                                                
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Title</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold">{paymentDetails.vatId || "TB211145424"}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Date</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold">{paymentDetails.transactionDate || "15 Jan, 2023"}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Client Name</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold">{paymentDetails.clientName || "Diana Nichols"}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Description</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold">{paymentDetails.cleintEmail || "diana@toner.com"}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Response</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold">{paymentDetails.cleintEmail || "this is a Claim response"}</span>
                                                    </td>
                                                </tr>
                                                {/* <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Amount</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold">{paymentDetails.amount || "$253.32"}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Payment Method</span>
                                                    </td>
                                                    {/* <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="flex-shrink-0">
                                                                <CardType paymentMethod={paymentDetails.paymentMethod} />
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0">{paymentDetails.paymentMethod || "American Express"}</h6>
                                                            </div>
                                                        </div>
                                                    </td> */}
                                                {/* </tr> */} 
                                                <tr>
                                                    <td>
                                                        <span className="text-muted text-uppercase">Status</span>
                                                    </td>
                                                    <td>
                                                        <Status status={paymentDetails.status} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* <div className="mt-3 hstack gap-2">
                                        <Button variant="soft-danger" type="button" className="w-100">Download Receipt</Button>
                                        <Button variant="soft-secondary" type="button" className="w-100">All Statement</Button>
                                    </div> */}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Modal show={modal_AddTransactionsModals} size="lg" onHide={() => { tog_AddTransactionsModals(); }} className="zoomIn" centered>
                        <Modal.Header className="px-4 pt-4" closeButton>
                            <h5 className="modal-title fs-18">Send a Claim</h5>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <Form className="tablelist-form">
                                <Row>
                                    <div id="alert-error-msg" className="d-none alert alert-danger py-2"></div>
                                    <input type="hidden" id="id-field" />
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="clientName-field">Title</Form.Label>
                                            <Form.Control type="text" id="clientName-field" placeholder="" required />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="customerName-field"> Description</Form.Label>
                                            <textarea className="form-control" id="exampleFormControlTextarea5" rows={3}></textarea>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="typeSelect">Subject</Form.Label>
                                            <select className="form-select" name="choices-single-default" id="type-field">
                                                <option value="">Driver</option>
                                                <option value="up">Vehicle</option>
                                                <option value="down">Cleanliness</option>
                                                <option value="down">Other</option>
                                            </select>
                                        </div>
                                    </Col>
                                    {/* <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="transactionID-field">Transaction ID</Form.Label>
                                            <Form.Control type="text" id="transactionID-field" placeholder="#TBSC320003205" required />
                                        </div>
                                    </Col> */}
                                    {/* <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="vatID-field">Vat ID</Form.Label>
                                            <Form.Control type="text" id="vatID-field" placeholder="#TBSC320003205" required />
                                        </div>
                                    </Col> */}
                                    {/* <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="amount-field">Description</Form.Label>
                                            <Form.Control type="text" id="amount-field" placeholder="$4564" required />
                                        </div>
                                    </Col> */}
                                  
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="transactionDate-field">Date</Form.Label>
                                            <Flatpickr
                                                className="form-control flatpickr-input"
                                                placeholder='Select date'
                                                options={{
                                                    dateFormat: "d M, Y",
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    {/* <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="statusSelect">Status</Form.Label>
                                            <select className="form-select" name="choices-single-default" id="statusSelect">
                                                <option value="">Status</option>
                                                <option value="Successful">Successful</option>
                                                <option value="Denied">Denied</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                    </Col> */}
                                    <Col lg={12}>
                                        <div className="hstack gap-2 justify-content-end">
                                            <Button className="btn-ghost-danger" onClick={() => { tog_AddTransactionsModals(); }}><i className="ri-close-line align-bottom me-1"></i> Close</Button>
                                            <Button variant='primary'>Send new claim</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal.Body>
                    </Modal>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default Transactions;