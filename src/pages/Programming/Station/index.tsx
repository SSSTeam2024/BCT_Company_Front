import React, { useState, useMemo } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Breadcrumb from 'Common/BreadCrumb';
import TableContainer from "Common/TableContainer";
import { stations } from "Common/data";
import { Link } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import Selection from './select';

const Station = () => {

    document.title = "Group | Bouden Coach Travel";

    const [modal_AddShippingModals, setmodal_AddShippingModals] = useState<boolean>(false);
    function tog_AddShippingModals() {
        setmodal_AddShippingModals(!modal_AddShippingModals);
    }

    const columns = useMemo(
        () => [
            {
                Header: "Station ID",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    return (<Link to="#" className="fw-medium link-primary">{cellProps.id}</Link>)
                },
            },
            // {
            //     Header: "Shipment No",
            //     accessor: "shipment_no",
            //     disableFilters: true,
            //     filterable: true,
            // },
            {
                Header: "Station Name",
                accessor: "station_name",
                disableFilters: true,
                filterable: true,
            },
            // {
            //     Header: "Locality",
            //     accessor: "locality",
            //     disableFilters: true,
            //     filterable: true,
            // },
            {
                Header: "City",
                accessor: "City",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "Region",
                accessor: "Region",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "Map Position",
                accessor: "Map_position",
                disableFilters: true,
                filterable: true,
            },
           
            {
                Header: "Action",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    return (
                        <ul className="hstack gap-2 list-unstyled mb-0">
                            <li>
                                <Link to="#" className="badge bg-primary-subtle text-primary edit-item-btn">Edit</Link>
                            </li>
                            <li>
                                <Link to="#" className="badge bg-danger-subtle text-danger remove-item-btn">Delete</Link>
                            </li>
                        </ul>
                    )
                },
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumb title="Group" pageTitle="Employee" />
                    <Card id="shipmentsList">
                        <Card.Header className="border-bottom-dashed">
                            <Row className="g-3">
                                <Col xxl={3} lg={6}>
                                    <div className="search-box">
                                        <input type="text" className="form-control search" placeholder="Search for station..." />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </Col>
                                <Col className="col-xxl-auto col-sm-auto ms-auto">
                                    <Button variant='success' onClick={() => tog_AddShippingModals()} className="add-btn"><i className="bi bi-plus-circle me-1 align-middle"></i> Add New Staion</Button>
                                </Col>
                           
                            </Row>
                        </Card.Header>
                        <Card.Body className='p-0'>
                            <div className="table-responsive table-card">
                                <TableContainer
                                    columns={(columns || [])}
                                    data={(stations || [])}
                                    // isGlobalFilter={false}
                                    iscustomPageSize={false}
                                    isBordered={false}
                                    customPageSize={10}
                                    className="custom-header-css table align-middle table-nowrap"
                                    tableClass="table-centered align-middle table-nowrap mb-0"
                                    theadClass="text-muted table-light"
                                    SearchPlaceholder='Search Products...'
                                />
                            </div>
                            <div className="noresult" style={{ display: "none" }}>
                                <div className="text-center py-4">
                                    <div className="avatar-md mx-auto mb-4">
                                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                                            <i className="bi bi-search"></i>
                                        </div>
                                    </div>
                                    <h5 className="mt-2">Sorry! No Result Found</h5>
                                    <p className="text-muted mb-0">We've searched more than 150+ shipment orders We did not find any shipment orders for you search.</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>




                    {/* Modal add Group */}
                    <Modal className="fade zoomIn" size="lg" show={modal_AddShippingModals} onHide={() => { tog_AddShippingModals(); }} centered>
                        <Modal.Header className="px-4 pt-4" closeButton>
                            <h5 className="modal-title fs-18" id="exampleModalLabel">Create New Station</h5>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <div id="alert-error-msg" className="d-none alert alert-danger py-2"></div>
                            <Form className="tablelist-form">
                                <input type="hidden" id="id-field" />
                                <Row>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="customerName-field"> Station Name</Form.Label>
                                            <Form.Control type="text" id="customerName-field" placeholder="Enter customer name" required />
                                        </div>
                                    </Col>
                                  
                                 
                                
                                    <div className="col-lg-10">
                                        <div className="mb-3">
                                            <label htmlFor="locationSelect" className="form-label">Locality</label>
                                            <select className="form-select" name="choices-single-default" id="locationSelect" required>
                                                <option value="">Location</option>
                                                <option value="Ascension Island">Ascension Island</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="Afghanistan">Afghanistan</option>
                                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                <option value="Armenia">Armenia</option>
                                                <option value="Antarctica">Antarctica</option>
                                                <option value="Argentina">Argentina</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="Belgium">Belgium</option>
                                                <option value="Benin">Benin</option>
                                                <option value="Bermuda">Bermuda</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="Belarus">Belarus</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Switzerland">Switzerland</option>
                                                <option value="Cook Islands">Cook Islands</option>
                                                <option value="Chile">Chile</option>
                                                <option value="China">China</option>
                                                <option value="Christmas Island">Christmas Island</option>
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Denmark">Denmark</option>
                                                <option value="Egypt">Egypt</option>
                                                <option value="Estonia">Estonia</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Ethiopia">Ethiopia</option>
                                                <option value="Europe">Europe</option>
                                                <option value="Finland">Finland</option>
                                                <option value="Faroe Islands">Faroe Islands</option>
                                                <option value="France">France</option>
                                                <option value="England">England</option>
                                                <option value="Scotland">Scotland</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="UA">UA</option>
                                                <option value="Poland">Poland</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="Serbia">Serbia</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Albania">Albania</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Jersey">Jersey</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-10">
                                        <div className="mb-3">
                                            <label htmlFor="locationSelect" className="form-label">Final Station</label>
                                            <select className="form-select" name="choices-single-default" id="locationSelect" required>
                                                <option value="">Location</option>
                                                <option value="Ascension Island">Ascension Island</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="Afghanistan">Afghanistan</option>
                                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                <option value="Armenia">Armenia</option>
                                                <option value="Antarctica">Antarctica</option>
                                                <option value="Argentina">Argentina</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="Belgium">Belgium</option>
                                                <option value="Benin">Benin</option>
                                                <option value="Bermuda">Bermuda</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="Belarus">Belarus</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Switzerland">Switzerland</option>
                                                <option value="Cook Islands">Cook Islands</option>
                                                <option value="Chile">Chile</option>
                                                <option value="China">China</option>
                                                <option value="Christmas Island">Christmas Island</option>
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Denmark">Denmark</option>
                                                <option value="Egypt">Egypt</option>
                                                <option value="Estonia">Estonia</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Ethiopia">Ethiopia</option>
                                                <option value="Europe">Europe</option>
                                                <option value="Finland">Finland</option>
                                                <option value="Faroe Islands">Faroe Islands</option>
                                                <option value="France">France</option>
                                                <option value="England">England</option>
                                                <option value="Scotland">Scotland</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="UA">UA</option>
                                                <option value="Poland">Poland</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="Serbia">Serbia</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Albania">Albania</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Jersey">Jersey</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Col lg={12}>
                                    {/* <div >
                                      <Selection/>
                                    </div> */}
                                    </Col>
                                    <Col lg={12}>
                                        <div className="hstack gap-2 justify-content-end">
                                            <Button className="btn-ghost-danger" onClick={() => { tog_AddShippingModals(); }} data-bs-dismiss="modal"><i className="ri-close-line align-bottom me-1"></i> Close</Button>
                                            <Button variant='primary' id="add-btn">Add Station</Button>
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

export default Station;